import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';

@Controller('api/complaints')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  async createComplaint(@Body() createComplaintDto: CreateComplaintDto) {
    // Extract userId from body if present, otherwise use userEmail
    const userId = createComplaintDto['user_id'] || null;
    const userEmail = createComplaintDto['user_email'] || null;
    
    return this.complaintService.create(createComplaintDto, userId, userEmail);
  }

  @Get('user/:userEmail')
  async getUserComplaintsByEmail(@Param('userEmail') userEmail: string) {
    return this.complaintService.findByUserEmail(userEmail);
  }

  @Get('user-id/:userId')
  async getUserComplaintsByUserId(@Param('userId') userId: string) {
    return this.complaintService.findByUserId(userId);
  }

  @Get('categories')
  async getCategories() {
    return [
      'GENERAL',
      'TECHNICAL_ISSUE', 
      'BILLING',
      'SERVICE_QUALITY',
      'DATA_PRIVACY',
      'LAB',
      'OTHER'
    ];
  }
}
