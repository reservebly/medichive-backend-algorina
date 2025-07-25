import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  email: string; // Can be email or username

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}