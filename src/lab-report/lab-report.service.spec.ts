import { Test, TestingModule } from '@nestjs/testing';
import { LabReportService } from './lab-report.service';

describe('LabReportService', () => {
  let service: LabReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabReportService],
    }).compile();

    service = module.get<LabReportService>(LabReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
