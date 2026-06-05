export default function Scoreboard({ players, playerId }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const maxScore = sorted[0]?.score || 1;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Skor</h3>
      <div className="space-y-2">
        {sorted.map((p, rank) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500 w-4">
              {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : rank + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-sm mb-1">
                <span className={`font-medium truncate ${p.id === playerId ? 'text-indigo-400' : 'text-gray-300'}`}>
                  {p.name} {p.id === playerId && '(kamu)'}
                </span>
                <span className="font-bold text-white ml-2 shrink-0">{p.score}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    p.id === playerId ? 'bg-indigo-500' : 'bg-gray-600'
                  }`}
                  style={{ width: `${(p.score / maxScore) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
