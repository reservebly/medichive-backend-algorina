import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { UserRole, Gender } from '@prisma/client';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  contactNo: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(UserRole)
  roles: UserRole;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  nic?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;
}
