import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService, User } from "@/prisma";

import { CreateChannelDto, UpdateChannelDto } from "./channels.dto";

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createChannelDto: CreateChannelDto) {
    const channel = await this.prisma.channel.create({
      data: {
        ...createChannelDto,
        ownerId: user.id,
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return channel;
  }

  async findAll(user: User) {
    const where = user.roles.includes("ADMIN")
      ? {}
      : { users: { some: { id: user.id } } };

    const channels = await this.prisma.channel.findMany({ where });
    return channels;
  }

  async findOne(user: User, id: string) {
    const where = user.roles.includes("ADMIN")
      ? { id }
      : { id, users: { some: { id: user.id } } };

    const channel = await this.prisma.channel.findUnique({
      include: {
        messages: {
          include: {
            user: {
              select: {
                displayName: true,
                username: true,
              },
            },
          },
        },
      },
      where,
    });

    if (!channel) {
      throw new NotFoundException(`Channel with id ${id} not found`);
    }

    return channel;
  }

  async join(user: User, id: string) {
    const channel = await this.prisma.channel.findUnique({
      include: {
        users: true,
      },
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with id ${id} not found`);
    }

    const isUserInChannel = channel.users.some((u) => u.id === user.id);

    if (isUserInChannel) {
      throw new BadRequestException("User is already in channel");
    }

    await this.prisma.channel.update({
      data: {
        users: {
          connect: {
            id: user.id,
          },
        },
      },
      where: { id },
    });

    return { success: true };
  }

  async leave(user: User, id: string) {
    const channel = await this.prisma.channel.findUnique({
      include: {
        users: true,
      },
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with id ${id} not found`);
    }

    const isUserInChannel = channel.users.some((u) => u.id === user.id);

    if (!isUserInChannel) {
      throw new BadRequestException("User is not in channel");
    }

    await this.prisma.channel.update({
      data: {
        users: {
          disconnect: {
            id: user.id,
          },
        },
      },
      where: { id },
    });

    return { success: true };
  }

  async remove(user: User, id: string) {
    await this.findOne(user, id);

    await this.prisma.channel.delete({
      where: { id },
    });

    return { success: true };
  }

  async update(user: User, id: string, updateChannelDto: UpdateChannelDto) {
    await this.findOne(user, id);

    const channel = await this.prisma.channel.update({
      data: updateChannelDto,
      where: { id },
    });

    return channel;
  }
}
