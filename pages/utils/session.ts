import { resolve } from 'path';

const useUserSession = (() => {
  let userSessions: Record<string, string[]> = {};

  const getAllUserSessions = () => {
    return userSessions;
  };

  const getUserBySocketId = (socketId: string): null | string => {
    const key = Object.keys(userSessions).find((value) => {
      if (userSessions[value].find((socketIdVal) => socketIdVal === socketId)) {
        return value;
      }
    });
    if (!key) return null;
    return key;
  };

  const getUserByUid = (uid: string): string[] | null => {
    if (!userSessions?.[uid]) {
      return null;
    }

    return userSessions[uid];
  };

  const addUser = (uid: string, socketId: string) => {
    const userSession = userSessions?.[uid];
    if (userSession) {
      userSession.push(socketId);
      return;
    }

    userSessions = { ...userSessions, [uid]: [socketId] };
  };

  const removeSocketId = (socketId: string) => {
    const userKey = getUserBySocketId(socketId);
    if (!userKey) return;

    userSessions[userKey] = userSessions[userKey].filter(
      (value) => value != socketId
    );

    return userKey;
  };

  return {
    getAllUserSessions,
    getUserByUid,
    getUserBySocketId,
    addUser,
    removeSocketId,
  };
})();

export default useUserSession;
