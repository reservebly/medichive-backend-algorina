import { Test, TestingModule } from '@nestjs/testing';
import { DoctorRateService } from './doctor-rate.service';

describe('DoctorRateService', () => {
  let service: DoctorRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorRateService],
    }).compile();

    service = module.get<DoctorRateService>(DoctorRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
