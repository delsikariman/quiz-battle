import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

let socketInstance = null;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(SERVER_URL, { autoConnect: false });
  }
  return socketInstance;
}

export function useSocketEvent(event, handler) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();
    const cb = (...args) => handlerRef.current(...args);
    socket.on(event, cb);
    return () => socket.off(event, cb);
  }, [event]);
}
