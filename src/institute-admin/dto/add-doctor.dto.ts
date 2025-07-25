import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';  

export class AddDoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)  
  dob?: Date;

  @IsNumber()
  @IsNotEmpty()
  experience: number;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits' })
  phoneNumber: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(16, { message: 'Password must not exceed 16 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, {
    message:
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @MaxLength(16, { message: 'Password must not exceed 16 characters' })
  password: string;
  
}
