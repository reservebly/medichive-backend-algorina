import { Module } from '@nestjs/common';
import { SymptomService } from './symptom.service';
import { SymptomController } from './symptom.controller';

@Module({
  providers: [SymptomService],
  controllers: [SymptomController]
})
export class SymptomModule {}
