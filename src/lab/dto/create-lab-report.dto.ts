import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateLabReportDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}