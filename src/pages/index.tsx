import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io';
import SocketIOClient from 'socket.io-client';

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = router.query;
  const [connected, setConnected] = useState(false);
  let refSocket = useRef<any>();

  useEffect(() => {
    refSocket.current = SocketIOClient({
      path: '/api/socketio',
    });
    refSocket.current.on('connect', () => {
      console.log('SOCKET CONNECTED!', refSocket.current.id);
      setConnected(true);
    });
  }, []);

  useEffect((): any => {
    refSocket.current.emit('active', user);
  }, [user]);

  return <div>Con gà con: {connected ? 'Đã kết nối' : 'Chưa kết nối'}</div>;
};

export default Home;
