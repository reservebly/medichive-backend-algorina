import { Test, TestingModule } from '@nestjs/testing';
import { InstituteAdminService } from './institute-admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DeleteDoctorDto } from './dto/delete-doctor.dto';
import { UserRole, Gender } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('InstituteAdminService', () => {
  let service: InstituteAdminService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstituteAdminService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<InstituteAdminService>(InstituteAdminService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('addDoctors', () => {
    const dto: AddDoctorDto = {
      name: 'Dr. Test',
      dob: new Date('1985-01-01'),
      experience: 10,
      licenseNumber: 'DOC00000',
      email: 'test@example.com',
      phoneNumber: '0000000000',
      gender: Gender.MALE,
      password: 'testpassword',
    };

    it('should create a doctor successfully if not existing', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-id-1',
        ...dto,
        doctor: {
          experience: dto.experience,
          licenseNumber: dto.licenseNumber,
        },
      });

      const result = await service.addDoctors(dto);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Doctor created successfully' });
    });

    it('should throw error if doctor with email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-user-id' });

      await expect(service.addDoctors(dto)).rejects.toThrow(HttpException);
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('deleteDoctor', () => {
    const dto: DeleteDoctorDto = {
      email: 'test@example.com',
    };

    it('should delete the doctor if found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-id-1' });
      mockPrisma.user.delete.mockResolvedValue({ id: 'user-id-1' });

      const result = await service.deleteDoctor(dto);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(result).toEqual({ message: 'Doctor deleted successfully' });
    });

    it('should throw error if doctor is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteDoctor(dto)).rejects.toThrow(HttpException);
      expect(mockPrisma.user.delete).not.toHaveBeenCalled();
    });
  });
});