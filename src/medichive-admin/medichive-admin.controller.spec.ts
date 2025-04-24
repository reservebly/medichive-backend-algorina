import { Test, TestingModule } from '@nestjs/testing';
import { MedichiveAdminController } from './medichive-admin.controller';

describe('MedichiveAdminController', () => {
  let controller: MedichiveAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedichiveAdminController],
    }).compile();

    controller = module.get<MedichiveAdminController>(MedichiveAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
