import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiResponseServerIO } from 'types/next';
import firebaseService from 'utils/firebase';
import useUserSession from 'utils/session';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;

    const io = require('socket.io')(httpServer, {
      path: '/api/socketio',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        transports: ['websocket', 'polling'],
        credentials: true,
      },
      allowEIO3: true,
    });

    io.on('connection', (socket: any) => {
      socket.on('active', async function (userId: string) {
        const data: any = await firebaseService.get(userId);
        if (data && data?.uid == userId) {
          useUserSession.addUser(userId, socket.id);

          await firebaseService.setWorking(userId, true);
        }
      });

      socket.on('disconnect', async () => {
        const userKey = useUserSession.removeSocketId(socket.id);

        if (userKey && useUserSession.getUserByUid(userKey)?.length == 0) {
          console.log(userKey);
          await firebaseService.setWorking(userKey, false);
        }
      });
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
}
