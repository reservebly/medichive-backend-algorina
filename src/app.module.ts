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
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DoctorAvailabilityModule } from './doctor-availability/doctor-availability.module';
import { DoctorRateModule } from './doctor-rate/doctor-rate.module';
import { UserModule } from './user/user.module';
import { DoctorSpecializationModule } from './doctor-specialization/doctor-specialization.module';
import { LabAdminModule } from './lab-admin/lab-admin.module';
import { LabModule } from './lab/lab.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { DrugModule } from './drug/drug.module';
import { LabReportModule } from './lab-report/lab-report.module';
import { SymptomModule } from './symptom/symptom.module';
import { RateModule } from './rate/rate.module';
import { ComplaintModule } from './complaint/complaint.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AppointmentModule,
    DoctorModule,
    MedichiveAdminModule,
    InstituteModule,
    ViewLabReportsModule,
    InstituteAdminModule,
    PrismaModule,
    DoctorAvailabilityModule,
    DoctorRateModule,
    UserModule,
    DoctorSpecializationModule,
    LabAdminModule,
    LabModule,
    DiagnosisModule,
    DrugModule,
    LabReportModule,
    SymptomModule,
    RateModule,
    ComplaintModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
