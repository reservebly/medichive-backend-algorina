import { Test, TestingModule } from '@nestjs/testing';
import { LabAdminService } from './lab-admin.service';

describe('LabAdminService', () => {
  let service: LabAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabAdminService],
    }).compile();

    service = module.get<LabAdminService>(LabAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
