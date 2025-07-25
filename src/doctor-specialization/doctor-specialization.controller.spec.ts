import { Test, TestingModule } from '@nestjs/testing';
import { DoctorSpecializationController } from './doctor-specialization.controller';

describe('DoctorSpecializationController', () => {
  let controller: DoctorSpecializationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorSpecializationController],
    }).compile();

    controller = module.get<DoctorSpecializationController>(DoctorSpecializationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
