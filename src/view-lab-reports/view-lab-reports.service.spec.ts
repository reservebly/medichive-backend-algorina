import { Test, TestingModule } from '@nestjs/testing';
import { ViewLabReportsService } from './view-lab-reports.service';

describe('ViewLabReportsService', () => {
  let service: ViewLabReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewLabReportsService],
    }).compile();

    service = module.get<ViewLabReportsService>(ViewLabReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
