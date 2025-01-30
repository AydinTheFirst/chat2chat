import { PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateChannelDto {
  @IsString()
  name: string;
}

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
