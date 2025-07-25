import { Test, TestingModule } from '@nestjs/testing';
import { LabService } from './lab.service';
import { PrismaService } from '../prisma/prisma.service';
import { Complaint, ComplaintStatus } from '@prisma/client';
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';

describe('LabService', () => {
  let service: LabService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabService,
        {
          provide: PrismaService,
          useValue: {
            complaint: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LabService>(LabService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComplaint', () => {
    it('should create a complaint', async () => {
      const dto: CreateComplaintDto = {
        complain: 'Sample complaint',
        title: 'Test Title',
        description: 'Test Description',
        priority: 'MEDIUM' as any,
        category: 'TECHNICAL' as any,
        userId: 'test-user-id',
      };

      const mockResult: Partial<Complaint> = {
        id: 'complaint-id',
        complain: dto.complain,
        title: dto.title,
        description: dto.description,
        status: ComplaintStatus.PENDING,
      };

      jest.spyOn(prismaService.complaint, 'create').mockResolvedValueOnce(mockResult as Complaint);

      const response = await service.createComplaint(dto, 'test-user-id');
      expect(response).toEqual(mockResult);
      expect(prismaService.complaint.create).toHaveBeenCalled();
    });
  });
});