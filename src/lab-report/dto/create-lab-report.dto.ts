import { IsInt, IsOptional, IsString, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLabReportDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  patientId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  labId?: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  reportLink?: string;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsOptional()
  @IsString()
  pdfPath?: string;
}
