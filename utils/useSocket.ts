import { useEffect, useState } from 'react';
import io, { Socket } from "socket.io-client";

const BACKEND_URL = 'http://64.226.94.169:8000';

const useSocket = () => {
 const [socket, setSocket] = useState<Socket | null>(null);

 useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    return () => {
      // Cleanup function to close the socket connection
      newSocket.disconnect();
    };
 }, []);

 return socket;
};

export default useSocket;