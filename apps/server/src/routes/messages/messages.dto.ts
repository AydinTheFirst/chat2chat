import { PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  channelId: string;

  @IsString()
  content: string;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
