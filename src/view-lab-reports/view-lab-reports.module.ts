import { Module } from '@nestjs/common';
import { ViewLabReportsController } from './view-lab-reports.controller';
import { ViewLabReportsService } from './view-lab-reports.service';

@Module({
  controllers: [ViewLabReportsController],
  providers: [ViewLabReportsService]
})
export class ViewLabReportsModule {}
