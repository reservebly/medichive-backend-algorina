import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ComplaintService, PrismaService],
  controllers: [ComplaintController]
})
export class ComplaintModule {}
