import { Test, TestingModule } from '@nestjs/testing';
import { DoctorSpecializationService } from './doctor-specialization.service';

describe('DoctorSpecializationService', () => {
  let service: DoctorSpecializationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorSpecializationService],
    }).compile();

    service = module.get<DoctorSpecializationService>(DoctorSpecializationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
