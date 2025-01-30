import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
  @IsString()
  password: string;

  @IsString()
  username: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
