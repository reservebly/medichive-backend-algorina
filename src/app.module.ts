import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { MedichiveAdminModule } from './medichive-admin/medichive-admin.module';
import { InstituteModule } from './institute/institute.module';
import { ViewLabReportsModule } from './view-lab-reports/view-lab-reports.module';

@Module({
  imports: [AppointmentModule, DoctorModule, MedichiveAdminModule, InstituteModule, ViewLabReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
