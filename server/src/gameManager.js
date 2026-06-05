import { getRandomQuestions } from './questions.js';
import { EVENTS } from './events.js';

const QUESTION_TIME = 15; // seconds per question
const MAX_POINTS = 1000;
const QUESTIONS_PER_GAME = 10;

const rooms = new Map(); // roomCode → roomState

function generateRoomCode() {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (rooms.has(code));
  return code;
}

function createRoom(hostId, hostName) {
  const code = generateRoomCode();
  rooms.set(code, {
    code,
    hostId,
    players: new Map([[hostId, { id: hostId, name: hostName, score: 0, answered: false }]]),
    status: 'waiting', // waiting | playing | finished
    questions: [],
    currentQuestion: 0,
    timer: null,
    roundAnswers: new Map(),
  });
  return code;
}

function joinRoom(code, playerId, playerName) {
  const room = rooms.get(code);
  if (!room) return { error: 'Room tidak ditemukan' };
  if (room.status !== 'waiting') return { error: 'Game sudah dimulai' };
  if (room.players.has(playerId)) return { error: 'Sudah bergabung' };
  if (room.players.size >= 8) return { error: 'Room penuh (max 8 pemain)' };

  room.players.set(playerId, { id: playerId, name: playerName, score: 0, answered: false });
  return { room };
}

function getPlayers(room) {
  return Array.from(room.players.values());
}

function startGame(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room || room.status !== 'waiting') return;

  room.status = 'playing';
  room.questions = getRandomQuestions(QUESTIONS_PER_GAME);
  room.currentQuestion = 0;

  // Reset scores
  for (const player of room.players.values()) {
    player.score = 0;
    player.answered = false;
  }

  io.to(roomCode).emit(EVENTS.GAME_STARTED, {
    totalQuestions: room.questions.length,
    players: getPlayers(room),
  });

  sendQuestion(io, roomCode);
}

function sendQuestion(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const q = room.questions[room.currentQuestion];
  if (!q) return endGame(io, roomCode);

  // Reset answered flags
  for (const player of room.players.values()) {
    player.answered = false;
  }
  room.roundAnswers.clear();

  let timeLeft = QUESTION_TIME;

  io.to(roomCode).emit(EVENTS.QUESTION, {
    index: room.currentQuestion,
    total: room.questions.length,
    question: q.question,
    options: q.options,
    timeLeft,
  });

  room.timer = setInterval(() => {
    timeLeft -= 1;

    if (timeLeft <= 0) {
      clearInterval(room.timer);
      resolveRound(io, roomCode);
    }
  }, 1000);
}

function submitAnswer(io, roomCode, playerId, answerIndex, timeLeft) {
  const room = rooms.get(roomCode);
  if (!room || room.status !== 'playing') return;

  const player = room.players.get(playerId);
  if (!player || player.answered) return;

  player.answered = true;

  const q = room.questions[room.currentQuestion];
  const correct = answerIndex === q.answer;

  // Points based on speed: max 1000, min 100, proportional to time left
  const points = correct ? Math.max(100, Math.round((timeLeft / QUESTION_TIME) * MAX_POINTS)) : 0;
  player.score += points;

  room.roundAnswers.set(playerId, { answerIndex, correct, points });

  // Tell this player their result immediately
  io.to(playerId).emit(EVENTS.ANSWER_RESULT, {
    correct,
    points,
    correctAnswer: q.answer,
    score: player.score,
  });

  // If everyone answered, resolve early
  const allAnswered = Array.from(room.players.values()).every((p) => p.answered);
  if (allAnswered) {
    clearInterval(room.timer);
    resolveRound(io, roomCode);
  }
}

function resolveRound(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const q = room.questions[room.currentQuestion];

  // Mark unanswered players (they got 0)
  for (const player of room.players.values()) {
    if (!player.answered) {
      room.roundAnswers.set(player.id, { answerIndex: -1, correct: false, points: 0 });
      io.to(player.id).emit(EVENTS.ANSWER_RESULT, {
        correct: false,
        points: 0,
        correctAnswer: q.answer,
        score: player.score,
      });
    }
  }

  io.to(roomCode).emit(EVENTS.ROUND_END, {
    correctAnswer: q.answer,
    players: getPlayers(room),
  });

  room.currentQuestion += 1;

  // 3 second pause before next question
  setTimeout(() => {
    if (room.currentQuestion >= room.questions.length) {
      endGame(io, roomCode);
    } else {
      sendQuestion(io, roomCode);
    }
  }, 3000);
}

function endGame(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;

  room.status = 'finished';

  const sorted = getPlayers(room).sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;
  const winners = sorted.filter((p) => p.score === topScore);

  io.to(roomCode).emit(EVENTS.GAME_OVER, {
    players: sorted,
    winners: winners.map((p) => p.id),
    draw: winners.length > 1,
  });
}

function playAgain(io, roomCode, requesterId) {
  const room = rooms.get(roomCode);
  if (!room || room.hostId !== requesterId) return;

  room.status = 'waiting';
  room.questions = [];
  room.currentQuestion = 0;
  clearInterval(room.timer);
  room.roundAnswers.clear();

  for (const player of room.players.values()) {
    player.score = 0;
    player.answered = false;
  }

  io.to(roomCode).emit(EVENTS.PLAYERS_UPDATE, { players: getPlayers(room), status: 'waiting' });
}

function removePlayer(io, playerId) {
  for (const [code, room] of rooms.entries()) {
    if (!room.players.has(playerId)) continue;

    room.players.delete(playerId);

    if (room.players.size === 0) {
      clearInterval(room.timer);
      rooms.delete(code);
      return;
    }

    // Transfer host if needed
    if (room.hostId === playerId) {
      room.hostId = room.players.keys().next().value;
    }

    io.to(code).emit(EVENTS.PLAYER_LEFT, {
      playerId,
      players: getPlayers(room),
      newHostId: room.hostId,
    });

    // If game was playing and only 1 player left, end it
    if (room.status === 'playing' && room.players.size < 2) {
      clearInterval(room.timer);
      endGame(io, code);
    }

    break;
  }
}

export { createRoom, joinRoom, startGame, submitAnswer, playAgain, removePlayer, rooms };
