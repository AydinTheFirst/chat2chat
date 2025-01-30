import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { GetUser } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { CreateChannelDto, UpdateChannelDto } from "./channels.dto";
import { ChannelsService } from "./channels.service";

@Controller("channels")
@UseGuards(AuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@GetUser() user: User, @Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(user, createChannelDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.channelsService.findAll(user);
  }

  @Get(":id")
  findOne(@GetUser() user: User, @Param("id") id: string) {
    return this.channelsService.findOne(user, id);
  }

  @Post(":id/join")
  join(@GetUser() user: User, @Param("id") id: string) {
    return this.channelsService.join(user, id);
  }

  @Post(":id/leave")
  leave(@GetUser() user: User, @Param("id") id: string) {
    return this.channelsService.leave(user, id);
  }

  @Delete(":id")
  remove(@GetUser() user: User, @Param("id") id: string) {
    return this.channelsService.remove(user, id);
  }

  @Patch(":id")
  update(
    @GetUser() user: User,
    @Param("id") id: string,
    @Body() updateChannelDto: UpdateChannelDto
  ) {
    return this.channelsService.update(user, id, updateChannelDto);
  }
}
