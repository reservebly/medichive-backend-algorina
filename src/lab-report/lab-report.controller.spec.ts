import { Test, TestingModule } from '@nestjs/testing';
import { LabReportController } from './lab-report.controller';

describe('LabReportController', () => {
  let controller: LabReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabReportController],
    }).compile();

    controller = module.get<LabReportController>(LabReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
