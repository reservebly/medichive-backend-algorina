import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddSymptomDto {
  @IsString()
  @IsNotEmpty()
  symptoms: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  doctorId: string;
}
