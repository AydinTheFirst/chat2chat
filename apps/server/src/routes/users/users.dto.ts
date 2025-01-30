import { UserRole } from "@prisma/client";
import { IsEmail, IsEnum, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  roles: UserRole[];

  @IsString()
  username: string;
}

export class UpdateUserDto extends CreateUserDto {}
