import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class AddInstituteAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'Contact number must be exactly 10 digits' })
  contactNo: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(16, { message: 'Password must not exceed 16 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;


}
