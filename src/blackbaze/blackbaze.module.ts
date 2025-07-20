// src/blackblaze/blackblaze.module.ts
import { Module } from '@nestjs/common';
import { BlackblazeService } from './blackbaze.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [BlackblazeService, ConfigService],
})
export class BlackblazeModule {}
