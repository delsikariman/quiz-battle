import { useEffect, useState } from 'react';
import { useSocketEvent } from '../hooks/useSocket';
import Question from './Question';
import Scoreboard from './Scoreboard';
import ResultScreen from './ResultScreen';

export default function GameRoom({ roomCode, players: initPlayers, playerId, hostId: initHostId, totalQuestions }) {
  const [phase, setPhase] = useState('playing');  // 'playing' | 'round_end' | 'finished'
  const [players, setPlayers] = useState(initPlayers);
  const [hostId, setHostId] = useState(initHostId);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [gameOverData, setGameOverData] = useState(null);

  useSocketEvent('question', (data) => {
    setPhase('playing');
    setCurrentQuestion(data);
  });

  useSocketEvent('round_end', (data) => {
    setPhase('round_end');
    setPlayers(data.players);
  });

  useSocketEvent('game_over', (data) => {
    setPhase('finished');
    setPlayers(data.players);
    setGameOverData(data);
  });

  useSocketEvent('player_left', (data) => {
    setPlayers(data.players);
    setHostId(data.newHostId);
  });

  useSocketEvent('players_update', (data) => {
    if (data.status === 'waiting') {
      // Host triggered play again — parent will handle transition
      window.location.reload(); // simplest reset back to waiting room
    }
  });

  if (phase === 'finished' && gameOverData) {
    return (
      <ResultScreen
        players={gameOverData.players}
        winners={gameOverData.winners}
        draw={gameOverData.draw}
        playerId={playerId}
        hostId={hostId}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row max-w-5xl mx-auto">
      {/* Main question area */}
      <div className="flex-1">
        {currentQuestion ? (
          <Question questionData={currentQuestion} totalQuestions={totalQuestions} />
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 animate-pulse text-lg">Memuat soal...</div>
          </div>
        )}
      </div>

      {/* Sidebar scoreboard */}
      <div className="lg:w-72 px-4 pb-6 lg:py-6 lg:pl-0 lg:pr-4">
        <Scoreboard players={players} playerId={playerId} />

        {/* Player online indicators */}
        <div className="mt-4 bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Pemain Online</h3>
          <div className="flex flex-wrap gap-2">
            {players.map((p) => (
              <div key={p.id} className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className={p.id === playerId ? 'text-indigo-400 font-medium' : 'text-gray-400'}>
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
