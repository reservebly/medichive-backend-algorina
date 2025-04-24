import { Test, TestingModule } from '@nestjs/testing';
import { InstituteAdminService } from './institute-admin.service';

describe('InstituteAdminService', () => {
  let service: InstituteAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstituteAdminService],
    }).compile();

    service = module.get<InstituteAdminService>(InstituteAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
