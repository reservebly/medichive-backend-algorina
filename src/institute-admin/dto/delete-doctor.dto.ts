import { IsEmail } from 'class-validator';

export class DeleteDoctorDto {
  @IsEmail()
  email: string;
}
