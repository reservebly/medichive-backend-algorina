import { Test, TestingModule } from '@nestjs/testing';
import { ViewLabReportsController } from './view-lab-reports.controller';

describe('ViewLabReportsController', () => {
  let controller: ViewLabReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewLabReportsController],
    }).compile();

    controller = module.get<ViewLabReportsController>(ViewLabReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
