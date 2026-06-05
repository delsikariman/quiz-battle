import { useState } from 'react';
import { getSocket } from '../hooks/useSocket';

export default function WaitingRoom({ roomCode, players, playerId, hostId }) {
  const [copied, setCopied] = useState(false);
  const isHost = playerId === hostId;

  function copyCode() {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function startGame() {
    getSocket().emit('start_game');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Room code */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Kode Room
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-6xl font-black font-mono tracking-widest text-indigo-400">
              {roomCode}
            </span>
            <button
              onClick={copyCode}
              title="Salin kode"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-xl"
            >
              {copied ? '✅' : '📋'}
            </button>
          </div>
          <p className="text-gray-500 mt-2 text-sm">Bagikan kode ini ke teman-teman</p>
        </div>

        {/* Player list */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-300">Pemain ({players.length}/8)</h2>
            <span className="flex items-center gap-1.5 text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Menunggu...
            </span>
          </div>

          <div className="space-y-2">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center
                               font-bold text-sm shrink-0">
                  {p.name[0].toUpperCase()}
                </div>
                <span className="font-medium">{p.name}</span>
                {p.id === hostId && (
                  <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold">
                    Host
                  </span>
                )}
                {p.id === playerId && p.id !== hostId && (
                  <span className="ml-auto text-xs text-gray-500">(kamu)</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        {isHost ? (
          <div>
            {players.length < 2 && (
              <p className="text-center text-amber-400 text-sm mb-3">
                ⚠️ Butuh minimal 2 pemain untuk mulai
              </p>
            )}
            <button
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full py-4 rounded-xl font-bold text-xl bg-green-600 hover:bg-green-500
                         disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              🎮 Mulai Game!
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Menunggu host memulai game...
          </p>
        )}
      </div>
    </div>
  );
}
