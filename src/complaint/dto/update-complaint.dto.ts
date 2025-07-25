import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateComplaintDto {
  @IsOptional()
  @IsString()
  complain?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  priority?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['TECHNICAL', 'BILLING', 'GENERAL'])
  category?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
  status?: string;

  @IsOptional()
  @IsString()
  resolvedBy?: string;
}