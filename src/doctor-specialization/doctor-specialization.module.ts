import { Module } from '@nestjs/common';
import { DoctorSpecializationService } from './doctor-specialization.service';
import { DoctorSpecializationController } from './doctor-specialization.controller';

@Module({
  providers: [DoctorSpecializationService],
  controllers: [DoctorSpecializationController]
})
export class DoctorSpecializationModule {}
