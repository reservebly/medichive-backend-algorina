import { Module } from '@nestjs/common';
import { DoctorRateController } from './doctor-rate.controller';
import { DoctorRateService } from './doctor-rate.service';

@Module({
  controllers: [DoctorRateController],
  providers: [DoctorRateService]
})
export class DoctorRateModule {}
