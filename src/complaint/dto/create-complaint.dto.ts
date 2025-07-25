import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  complaint_text: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    message: 'Priority must be one of: LOW, MEDIUM, HIGH, URGENT'
  })
  priority?: string;

  @IsOptional()
  @IsEnum(['GENERAL', 'TECHNICAL_ISSUE', 'BILLING', 'SERVICE_QUALITY', 'DATA_PRIVACY', 'LAB', 'OTHER'], {
    message: 'Category must be one of: GENERAL, TECHNICAL_ISSUE, BILLING, SERVICE_QUALITY, DATA_PRIVACY, LAB, OTHER'
  })
  category?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  user_email?: string;

  @IsOptional()
  @IsEnum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], {
    message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED'
  })
  status?: string;
}