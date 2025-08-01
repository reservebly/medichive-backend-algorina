// src/lab-report/dto/create-lab-report.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class AddPrescriptionDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsOptional()
  @IsString()
  note?: string;
}
