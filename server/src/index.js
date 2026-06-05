import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { EVENTS } from './events.js';
import { createRoom, joinRoom, startGame, submitAnswer, playAgain, removePlayer } from './gameManager.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Track which room each socket is in
const socketToRoom = new Map();

io.on('connection', (socket) => {
  console.log(`[+] Connected: ${socket.id}`);

  socket.on(EVENTS.CREATE_ROOM, ({ name }) => {
    if (!name?.trim()) return socket.emit(EVENTS.ROOM_ERROR, 'Nama tidak boleh kosong');

    const code = createRoom(socket.id, name.trim());
    socket.join(code);
    socketToRoom.set(socket.id, code);

    socket.emit(EVENTS.ROOM_CREATED, { code, playerId: socket.id, name: name.trim() });
    console.log(`[Room] Created: ${code} by ${name}`);
  });

  socket.on(EVENTS.JOIN_ROOM, ({ code, name }) => {
    if (!name?.trim()) return socket.emit(EVENTS.ROOM_ERROR, 'Nama tidak boleh kosong');
    if (!code?.trim()) return socket.emit(EVENTS.ROOM_ERROR, 'Kode room tidak valid');

    const result = joinRoom(code.trim(), socket.id, name.trim());
    if (result.error) return socket.emit(EVENTS.ROOM_ERROR, result.error);

    socket.join(code.trim());
    socketToRoom.set(socket.id, code.trim());

    const players = Array.from(result.room.players.values());

    socket.emit(EVENTS.ROOM_JOINED, {
      code: code.trim(),
      playerId: socket.id,
      name: name.trim(),
      hostId: result.room.hostId,
      players,
    });

    socket.to(code.trim()).emit(EVENTS.PLAYER_JOINED, {
      player: { id: socket.id, name: name.trim(), score: 0 },
      players,
    });

    console.log(`[Room] ${name} joined ${code}`);
  });

  socket.on(EVENTS.START_GAME, () => {
    const code = socketToRoom.get(socket.id);
    if (!code) return;
    startGame(io, code);
  });

  socket.on(EVENTS.SUBMIT_ANSWER, ({ answerIndex, timeLeft }) => {
    const code = socketToRoom.get(socket.id);
    if (!code) return;
    submitAnswer(io, code, socket.id, answerIndex, timeLeft);
  });

  socket.on(EVENTS.PLAY_AGAIN, () => {
    const code = socketToRoom.get(socket.id);
    if (!code) return;
    playAgain(io, code, socket.id);
  });

  socket.on('disconnect', () => {
    console.log(`[-] Disconnected: ${socket.id}`);
    socketToRoom.delete(socket.id);
    removePlayer(io, socket.id);
  });
});

app.get('/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
