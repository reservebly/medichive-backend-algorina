import { Module } from '@nestjs/common';
import { InstituteAdminController } from './institute-admin.controller';
import { InstituteAdminService } from './institute-admin.service';

@Module({
  controllers: [InstituteAdminController],
  providers: [InstituteAdminService]
})
export class InstituteAdminModule {}
