import { Module } from '@nestjs/common';
import { InstituteAdminService } from './institute-admin.service';
import { InstituteAdminController } from './institute-admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [InstituteAdminService, PrismaService],
  controllers: [InstituteAdminController]
})
export class InstituteAdminModule {}
