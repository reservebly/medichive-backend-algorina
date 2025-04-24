import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstituteAdminModule } from './institute-admin/institute-admin.module';

@Module({
  imports: [InstituteAdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
