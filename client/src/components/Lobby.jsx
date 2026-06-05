import { useState } from 'react';
import { getSocket } from '../hooks/useSocket';

const EVENTS = {
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
};

export default function Lobby({ onError }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [tab, setTab] = useState('create'); // 'create' | 'join'

  function connect(action) {
    const trimName = name.trim();
    if (!trimName) return onError('Masukkan nama kamu dulu!');

    const socket = getSocket();
    if (!socket.connected) socket.connect();

    if (action === 'create') {
      socket.emit(EVENTS.CREATE_ROOM, { name: trimName });
    } else {
      const trimCode = code.trim().toUpperCase();
      if (trimCode.length !== 4) return onError('Kode room harus 4 digit');
      socket.emit(EVENTS.JOIN_ROOM, { code: trimCode, name: trimName });
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="mb-10 text-center animate-pop-in">
        <div className="text-7xl mb-3">⚡</div>
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Quiz Battle
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Adu kecepatan menjawab soal trivia!</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl animate-slide-up">
        {/* Name input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            Nama Kamu
          </label>
          <input
            type="text"
            maxLength={16}
            placeholder="Masukkan nama..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && connect(tab)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white
                       placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-gray-700 mb-6">
          {['create', 'join'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold transition ${
                tab === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {t === 'create' ? '🏠 Buat Room' : '🚪 Join Room'}
            </button>
          ))}
        </div>

        {tab === 'join' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Kode Room
            </label>
            <input
              type="text"
              maxLength={4}
              placeholder="Contoh: 4829"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && connect('join')}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white
                         placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition
                         text-center text-2xl font-mono tracking-widest"
            />
          </div>
        )}

        <button
          onClick={() => connect(tab)}
          className="w-full py-3.5 rounded-xl font-bold text-lg bg-indigo-600 hover:bg-indigo-500
                     active:scale-95 transition-all duration-150"
        >
          {tab === 'create' ? '🚀 Buat Room Baru' : '➡️ Masuk ke Room'}
        </button>
      </div>

      <p className="mt-6 text-gray-600 text-sm">
        Ajak teman dengan kode room setelah membuat room
      </p>
    </div>
  );
}
