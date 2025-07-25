import { Test, TestingModule } from '@nestjs/testing';
import { InstituteAdminController } from './institute-admin.controller';

describe('InstituteAdminController', () => {
  let controller: InstituteAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstituteAdminController],
    }).compile();

    controller = module.get<InstituteAdminController>(InstituteAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
