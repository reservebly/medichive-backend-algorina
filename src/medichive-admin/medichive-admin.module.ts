import { Module } from '@nestjs/common';
import { MedichiveAdminController } from './medichive-admin.controller';
import { MedichiveAdminService } from './medichive-admin.service';

@Module({
  controllers: [MedichiveAdminController],
  providers: [MedichiveAdminService]
})
export class MedichiveAdminModule {}
