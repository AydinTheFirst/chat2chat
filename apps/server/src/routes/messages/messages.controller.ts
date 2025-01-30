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

import { CreateMessageDto, UpdateMessageDto } from "./messages.dto";
import { MessagesService } from "./messages.service";

@Controller("messages")
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@GetUser() user: User, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(user, createMessageDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.messagesService.findAll(user);
  }

  @Get(":id")
  findOne(@GetUser() user: User, @Param("id") id: string) {
    return this.messagesService.findOne(user, id);
  }

  @Delete(":id")
  remove(@GetUser() user: User, @Param("id") id: string) {
    return this.messagesService.remove(user, id);
  }

  @Patch(":id")
  update(
    @GetUser() user: User,
    @Param("id") id: string,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    return this.messagesService.update(user, id, updateMessageDto);
  }
}
