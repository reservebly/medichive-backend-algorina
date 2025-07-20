// src/lab-report/dto/create-lab-report.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateLabReportDto {
  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;
}
