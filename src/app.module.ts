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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
