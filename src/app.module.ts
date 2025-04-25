import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { MedichiveAdminModule } from './medichive-admin/medichive-admin.module';
import { InstituteModule } from './institute/institute.module';
import { ViewLabReportsModule } from './view-lab-reports/view-lab-reports.module';
import { PatientModule } from './patient/patient.module';
import { InstituteAdminModule } from './institute-admin/institute-admin.module';

@Module({
  imports: [AppointmentModule, DoctorModule, MedichiveAdminModule, InstituteModule, ViewLabReportsModule, PatientModule,InstituteAdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
