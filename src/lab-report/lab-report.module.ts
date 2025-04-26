import { Module } from '@nestjs/common';
import { LabReportController } from './lab-report.controller';
import { LabReportService } from './lab-report.service';

@Module({
  controllers: [LabReportController],
  providers: [LabReportService]
})
export class LabReportModule {}
