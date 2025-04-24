import { Test, TestingModule } from '@nestjs/testing';
import { MedichiveAdminService } from './medichive-admin.service';

describe('MedichiveAdminService', () => {
  let service: MedichiveAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedichiveAdminService],
    }).compile();

    service = module.get<MedichiveAdminService>(MedichiveAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
