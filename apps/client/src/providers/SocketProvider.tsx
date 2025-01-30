import React from "react";
import { io, Socket } from "socket.io-client";

/* eslint-disable react-refresh/only-export-components */
import { API_URL } from "@/config";

const SocketContext = React.createContext<null | Socket>(null);

export const useSocket = () => {
  const context = React.useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};

export default function SocketProvider({ children }: React.PropsWithChildren) {
  const [socket, setSocket] = React.useState<null | Socket>(null);

  React.useEffect(() => {
    const socket = io(API_URL.replace("/api", ""), {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!socket) return null;

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
