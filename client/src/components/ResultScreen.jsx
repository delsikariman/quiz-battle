import { getSocket } from '../hooks/useSocket';

export default function ResultScreen({ players, winners, draw, playerId, hostId }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const isWinner = winners.includes(playerId);
  const isHost = playerId === hostId;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-slide-up">
        {/* Result header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-3">
            {draw ? '🤝' : isWinner ? '🏆' : '😅'}
          </div>
          <h1 className="text-3xl font-black">
            {draw ? 'Seri!' : isWinner ? 'Kamu Menang!' : 'Game Selesai!'}
          </h1>
          {!draw && !isWinner && (
            <p className="text-gray-400 mt-1">
              {sorted[0]?.name} menang dengan {sorted[0]?.score} poin
            </p>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-gray-800">
            <h2 className="font-bold text-gray-400 text-sm uppercase tracking-wider">Hasil Akhir</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {sorted.map((p, rank) => (
              <div
                key={p.id}
                className={`flex items-center gap-4 px-5 py-4 ${
                  winners.includes(p.id) ? 'bg-yellow-500/5' : ''
                }`}
              >
                <span className="text-2xl w-8 text-center">
                  {medals[rank] || `${rank + 1}.`}
                </span>
                <div className="flex-1">
                  <p className={`font-semibold ${p.id === playerId ? 'text-indigo-400' : 'text-white'}`}>
                    {p.name}
                    {p.id === playerId && <span className="text-xs text-gray-500 ml-2">(kamu)</span>}
                  </p>
                </div>
                <span className="font-black text-xl text-white">{p.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {isHost ? (
          <button
            onClick={() => getSocket().emit('play_again')}
            className="w-full py-4 rounded-xl font-bold text-xl bg-indigo-600 hover:bg-indigo-500
                       active:scale-95 transition-all"
          >
            🔄 Main Lagi
          </button>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Menunggu host untuk memulai ulang...
          </p>
        )}
      </div>
    </div>
  );
}
