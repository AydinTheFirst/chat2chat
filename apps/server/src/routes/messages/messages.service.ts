import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService, User } from "@/prisma";
import { WebsocketGateway } from "@/websocket";

import { CreateMessageDto, UpdateMessageDto } from "./messages.dto";

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private ws: WebsocketGateway
  ) {}

  async create(user: User, createMessageDto: CreateMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        ...createMessageDto,
        userId: user.id,
      },
    });

    this.ws.io.to(createMessageDto.channelId).emit("messageCreate", message);

    return message;
  }

  async findAll(user: User) {
    const where = user.roles.includes("ADMIN") ? {} : { userId: user.id };
    const messages = await this.prisma.message.findMany({ where });

    return messages;
  }

  async findOne(user: User, id: string) {
    const where = user.roles.includes("ADMIN")
      ? { id }
      : { id, userId: user.id };

    const message = await this.prisma.message.findFirst({
      where,
    });

    if (!message) {
      throw new BadRequestException(`Message with id ${id} not found`);
    }

    return message;
  }

  async remove(user: User, id: string) {
    const message = await this.findOne(user, id);

    await this.prisma.message.delete({
      where: { id },
    });

    this.ws.io.to(message.channelId).emit("messageDelete", { id });

    return { success: true };
  }

  async update(user: User, id: string, updateMessageDto: UpdateMessageDto) {
    await this.findOne(user, id);

    const message = await this.prisma.message.update({
      data: updateMessageDto,
      where: { id },
    });

    this.ws.io.to(message.channelId).emit("messageUpdate", message);

    return message;
  }
}
