import { Module } from '@nestjs/common';
import { InstituteAdminService } from './institute-admin.service';
import { InstituteAdminController } from './institute-admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  providers: [InstituteAdminService, ConfigService, JwtService],
  controllers: [InstituteAdminController]
})
export class InstituteAdminModule {}
