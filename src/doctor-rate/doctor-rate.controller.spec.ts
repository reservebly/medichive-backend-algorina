import { Test, TestingModule } from '@nestjs/testing';
import { DoctorRateController } from './doctor-rate.controller';

describe('DoctorRateController', () => {
  let controller: DoctorRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorRateController],
    }).compile();

    controller = module.get<DoctorRateController>(DoctorRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
