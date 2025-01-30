import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { PrismaService, User } from "@/prisma";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports: ["websocket"],
})
export class WebsocketGateway implements OnModuleInit {
  private connectedSockets = new Map<string, { socket: Socket; user: User }>();
  @WebSocketServer()
  io: Server;

  constructor(private prisma: PrismaService) {}

  async authenticate(socket: Socket) {
    const token = socket.handshake.auth.token;

    if (!token) {
      return this.kickSocket(socket.id, "Unauthorized");
    }

    const tokenDoc = await this.prisma.token.findUnique({
      include: {
        user: true,
      },
      where: {
        token,
      },
    });

    if (!tokenDoc) {
      return this.kickSocket(socket.id, "Unauthorized");
    }

    if (tokenDoc.expiresAt < new Date()) {
      return this.kickSocket(socket.id, "Token expired");
    }

    this.connectedSockets.set(socket.id, { socket, user: tokenDoc.user });
  }

  async kickSocket(socketId: string, reason: string) {
    if (!this.connectedSockets.has(socketId)) {
      return;
    }

    const { socket } = this.connectedSockets.get(socketId);

    socket.emit("error", reason);
    socket.disconnect();
  }

  onModuleInit() {
    this.io.on("connection", async (socket) => {
      await this.authenticate(socket);
      Logger.debug(`Client connected: ${socket.id}`, "WebsocketGateway");

      socket.on("join", async (channelId: string) => {
        socket.join(channelId);
      });

      socket.on("disconnect", () => {
        this.connectedSockets.delete(socket.id);
        Logger.debug(`Client disconnected: ${socket.id}`, "WebsocketGateway");
      });
    });
  }
}
