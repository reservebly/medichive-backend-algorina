import { Test, TestingModule } from '@nestjs/testing';
import { LabAdminController } from './lab-admin.controller';

describe('LabAdminController', () => {
  let controller: LabAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabAdminController],
    }).compile();

    controller = module.get<LabAdminController>(LabAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
