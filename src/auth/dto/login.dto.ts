import { IsEmail, IsNotEmpty, MaxLength, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}
