import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import SocketIOClient from 'socket.io-client';

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = router.query;
  const [connected, setConnected] = useState(false);
  let refSocket = useRef<any>();

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      refSocket.current = SocketIOClient(window.location.href, {
        path: '/api/socketio',
      });

      refSocket.current.on('connect', () => {
        console.log('SOCKET CONNECTED!', refSocket.current.id);
        setConnected(true);
      });
    });
  }, []);

  useEffect((): any => {
    if (user) {
      refSocket.current.emit('active', user);
    }
  }, [user]);

  return (
    <div>
      Con gà con: {connected ? 'Đã kết nối' : 'Chưa kết nối'}
      <br />
      {window.location.href}
    </div>
  );
};

export default Home;
