import { Module } from '@nestjs/common';
import { InstituteAdminService } from './institute-admin.service';
import { InstituteAdminController } from './institute-admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [InstituteAdminService, PrismaService, ConfigService, JwtService],
  controllers: [InstituteAdminController]
})
export class InstituteAdminModule {}
