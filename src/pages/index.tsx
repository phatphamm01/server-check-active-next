import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SocketIOClient from 'socket.io-client';

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = router.query;
  const [connected, setConnected] = useState(false);

  useEffect((): any => {
    if (user) {
      const socket = SocketIOClient({
        path: '/api/socketio',
      });

      if (socket.connected) setConnected(true);

      socket.emit('active', user);
      if (socket) return () => socket.disconnect();
    }
  }, [user]);

  return <div>Con gà con: {connected ? 'Đã kết nối' : 'Chưa kết nối'}</div>;
};

export default Home;
