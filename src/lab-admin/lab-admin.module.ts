import { Module } from '@nestjs/common';
import { LabAdminController } from './lab-admin.controller';
import { LabAdminService } from './lab-admin.service';

@Module({
  controllers: [LabAdminController],
  providers: [LabAdminService]
})
export class LabAdminModule {}
