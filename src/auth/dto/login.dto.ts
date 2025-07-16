import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  username: string;

  @MaxLength(16, { message: 'Password must not exceed 16 characters' })
  password: string;
}
