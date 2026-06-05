import { useState, useEffect } from 'react';
import { getSocket, useSocketEvent } from './hooks/useSocket';
import Lobby from './components/Lobby';
import WaitingRoom from './components/WaitingRoom';
import GameRoom from './components/GameRoom';

const SCREENS = {
  LOBBY: 'lobby',
  WAITING: 'waiting',
  GAME: 'game',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOBBY);
  const [error, setError] = useState('');
  const [roomInfo, setRoomInfo] = useState(null); // { code, playerId, name, hostId, players }
  const [gameInfo, setGameInfo] = useState(null); // { totalQuestions, players }

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    return () => {}; // keep alive
  }, []);

  useSocketEvent('room_created', (data) => {
    setRoomInfo({ code: data.code, playerId: data.playerId, name: data.name, hostId: data.playerId, players: [{ id: data.playerId, name: data.name, score: 0 }] });
    setScreen(SCREENS.WAITING);
    setError('');
  });

  useSocketEvent('room_joined', (data) => {
    setRoomInfo({ code: data.code, playerId: data.playerId, name: data.name, hostId: data.hostId, players: data.players });
    setScreen(SCREENS.WAITING);
    setError('');
  });

  useSocketEvent('room_error', (msg) => {
    setError(msg);
  });

  useSocketEvent('player_joined', (data) => {
    setRoomInfo((prev) => prev ? { ...prev, players: data.players } : prev);
  });

  useSocketEvent('player_left', (data) => {
    setRoomInfo((prev) => prev ? { ...prev, players: data.players, hostId: data.newHostId } : prev);
  });

  useSocketEvent('game_started', (data) => {
    setGameInfo({ totalQuestions: data.totalQuestions, players: data.players });
    setScreen(SCREENS.GAME);
  });

  function handleError(msg) {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Error toast */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-pop-in">
          <div className="bg-red-900 border border-red-700 text-red-200 px-5 py-3 rounded-xl
                         shadow-xl font-medium flex items-center gap-2">
            ⚠️ {error}
          </div>
        </div>
      )}

      {screen === SCREENS.LOBBY && (
        <Lobby onError={handleError} />
      )}

      {screen === SCREENS.WAITING && roomInfo && (
        <WaitingRoom
          roomCode={roomInfo.code}
          players={roomInfo.players}
          playerId={roomInfo.playerId}
          hostId={roomInfo.hostId}
        />
      )}

      {screen === SCREENS.GAME && roomInfo && gameInfo && (
        <GameRoom
          roomCode={roomInfo.code}
          players={gameInfo.players}
          playerId={roomInfo.playerId}
          hostId={roomInfo.hostId}
          totalQuestions={gameInfo.totalQuestions}
        />
      )}
    </div>
  );
}
