import { Module } from '@nestjs/common';
import { LabReportController } from './lab-report.controller';
import { LabReportService } from './lab-report.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LabReportController],
  providers: [LabReportService, PrismaService]
})
export class LabReportModule {}
