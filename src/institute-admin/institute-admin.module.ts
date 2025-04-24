import { Module } from '@nestjs/common';
import { InstituteAdminService } from './institute-admin.service';
import { InstituteAdminController } from './institute-admin.controller';

@Module({
  providers: [InstituteAdminService],
  controllers: [InstituteAdminController]
})
export class InstituteAdminModule {}
