import { Test, TestingModule } from '@nestjs/testing';
import { InstituteAdminService } from './institute-admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlackblazeService } from 'src/blackbaze/blackbaze.service';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Gender, UserRole } from '@prisma/client';

describe('InstituteAdminService - addDoctors', () => {
  let service: InstituteAdminService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstituteAdminService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
            symptom: {
              create: jest.fn(),
            },
            patient: {
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
            doctor: {
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              findMany: jest.fn(),
            },
            diagnosis: {
              create: jest.fn(),
            },
            labReport: {
              create: jest.fn(),
            },
            prescription: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: BlackblazeService,
          useValue: {
            uploadImage: jest.fn(),
          }, // You can mock methods later if needed
        },
      ],
    }).compile();

    service = module.get<InstituteAdminService>(InstituteAdminService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a new doctor successfully', async () => {
    const mockDoctorDto = {
      email: 'doc@example.com',
      name: 'Dr. John',
      phoneNumber: '1234567890',
      gender: Gender.MALE,
      password: 'password123',
      dob: new Date(),
      experience: 5,
      licenseNumber: 'LIC1234',
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const result = await service.addDoctors(mockDoctorDto);

    expect(result).toEqual({ message: 'Doctor created successfully' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockDoctorDto.email },
    });
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('should throw an error if doctor already exists', async () => {
    const mockDoctorDto = {
      email: 'existingdoc@example.com',
      name: 'Dr. Jane',
      phoneNumber: '1234567890',
      gender: Gender.FEMALE,
      password: 'securepassword',
      dob: new Date(),
      experience: 8,
      licenseNumber: 'LIC5678',
    };

    // Simulate an existing doctor
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({ id: 1 } as any);

    await expect(service.addDoctors(mockDoctorDto)).rejects.toThrow(
      HttpException,
    );
    await expect(service.addDoctors(mockDoctorDto)).rejects.toThrow(
      'Doctor with this email already exists',
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockDoctorDto.email },
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should delete a doctor successfully if they exist', async () => {
    const mockDeleteDoctorDto = {
      email: 'doctor@example.com',
    };

    // Simulate doctor found
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue({ id: 'user-id' } as any);

    // Simulate deletion success
    jest.spyOn(prisma.user, 'delete').mockResolvedValue({} as any);

    const result = await service.deleteDoctor(mockDeleteDoctorDto);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockDeleteDoctorDto.email },
    });

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { email: mockDeleteDoctorDto.email },
    });

    expect(result).toEqual({ message: 'Doctor deleted successfully' });
  });

  it('should throw an error if the doctor to delete is not found', async () => {
    const mockDeleteDoctorDto = {
      email: 'missingdoctor@example.com',
    };

    // Simulate no doctor found
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(service.deleteDoctor(mockDeleteDoctorDto)).rejects.toThrow(
      HttpException,
    );
    await expect(service.deleteDoctor(mockDeleteDoctorDto)).rejects.toThrow(
      'Doctor not found',
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockDeleteDoctorDto.email },
    });

    expect(prisma.user.delete).not.toHaveBeenCalled(); // deletion shouldn't happen
  });

  it('should return all doctors successfully', async () => {
    const mockDoctors = [
      {
        id: 'doc1',
        name: 'Dr. Alice',
        email: 'alice@example.com',
        roles: UserRole.DOCTOR,
        doctor: {
          experience: 5,
          licenseNumber: 'LIC1001',
        },
      },
      {
        id: 'doc2',
        name: 'Dr. Bob',
        email: 'bob@example.com',
        roles: UserRole.DOCTOR,
        doctor: {
          experience: 3,
          licenseNumber: 'LIC1002',
        },
      },
    ];

    jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockDoctors as any);

    const result = await service.getDoctors();

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: {
        roles: UserRole.DOCTOR,
      },
      include: {
        doctor: true,
      },
    });

    expect(result).toEqual(mockDoctors);
  });

  it('should add a symptom successfully', async () => {
    const mockDto = {
      symptoms: 'Fever',
      description: 'High temperature for two days',
      patientId: 'patient-uuid-1234',
      doctorId: 'doctor-userid-5678',
    };

    const mockDoctor = { id: 'doctor-id-123', userId: mockDto.doctorId };
    const mockPatient = { id: mockDto.patientId };
    const mockSymptom = {
      id: 'symptom-id-999',
      symptoms: mockDto.symptoms,
      description: mockDto.description,
      patientId: mockDto.patientId,
      doctorId: mockDoctor.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(prisma.patient, 'findUnique')
      .mockResolvedValue(mockPatient as any);
    jest
      .spyOn(prisma.doctor, 'findUnique')
      .mockResolvedValue(mockDoctor as any);
    jest.spyOn(prisma.symptom, 'create').mockResolvedValue(mockSymptom as any);

    const result = await service.addSymptom(mockDto);

    expect(prisma.patient.findUnique).toHaveBeenCalledWith({
      where: { id: mockDto.patientId },
    });

    expect(prisma.doctor.findUnique).toHaveBeenCalledWith({
      where: { userId: mockDto.doctorId },
    });

    expect(prisma.symptom.create).toHaveBeenCalledWith({
      data: {
        symptoms: mockDto.symptoms,
        description: mockDto.description,
        patientId: mockDto.patientId,
        doctorId: mockDoctor.id,
      },
    });

    expect(result).toEqual({
      message: 'Symptoms recorded successfully',
      data: mockSymptom,
    });
  });

  it('should throw NotFoundException if patient is not found', async () => {
    const mockDto = {
      symptoms: 'Cough',
      description: 'Dry cough for 3 days',
      patientId: 'nonexistent-patient-id',
      doctorId: 'doctor-userid-1234',
    };

    jest.spyOn(prisma.patient, 'findUnique').mockResolvedValue(null);

    await expect(service.addSymptom(mockDto)).rejects.toThrowError(
      new NotFoundException('Patient not found'),
    );

    expect(prisma.patient.findUnique).toHaveBeenCalledWith({
      where: { id: mockDto.patientId },
    });
  });

  it('should throw NotFoundException if doctor is not found', async () => {
    const mockDto = {
      symptoms: 'Headache',
      description: 'Severe pain in the head',
      patientId: 'patient-id-1111',
      doctorId: 'nonexistent-doctor-userid',
    };

    const mockPatient = { id: mockDto.patientId };
    jest
      .spyOn(prisma.patient, 'findUnique')
      .mockResolvedValue(mockPatient as any);
    jest.spyOn(prisma.doctor, 'findUnique').mockResolvedValue(null);

    await expect(service.addSymptom(mockDto)).rejects.toThrowError(
      new NotFoundException('Doctor not found'),
    );

    expect(prisma.patient.findUnique).toHaveBeenCalledWith({
      where: { id: mockDto.patientId },
    });

    expect(prisma.doctor.findUnique).toHaveBeenCalledWith({
      where: { userId: mockDto.doctorId },
    });
  });

  it('should successfully add a diagnosis and return the created diagnosis record', async () => {
    const mockDto = {
      diagnosis: 'Flu',
      description: 'Viral infection causing fever and fatigue',
      patientId: 'patient-id-1234',
      doctorId: 'doctor-userid-5678',
    };

    const mockPatient = { id: mockDto.patientId };
    const mockDoctor = { id: 'doctor-id-9999', userId: mockDto.doctorId };
    const createdDiagnosis = {
      id: 'diagnosis-id-123',
      diagnosis: mockDto.diagnosis,
      description: mockDto.description,
      patientId: mockDto.patientId,
      doctorId: mockDoctor.id,
      createdAt: new Date(),
    };

    // Mock DB responses
    jest
      .spyOn(prisma.patient, 'findUnique')
      .mockResolvedValue(mockPatient as any);
    jest
      .spyOn(prisma.doctor, 'findUnique')
      .mockResolvedValue(mockDoctor as any);
    jest
      .spyOn(prisma.diagnosis, 'create')
      .mockResolvedValue(createdDiagnosis as any);

    const result = await service.addDiagnosis(mockDto);

    expect(prisma.patient.findUnique).toHaveBeenCalledWith({
      where: { id: mockDto.patientId },
    });

    expect(prisma.doctor.findUnique).toHaveBeenCalledWith({
      where: { userId: mockDto.doctorId },
    });

    expect(prisma.diagnosis.create).toHaveBeenCalledWith({
      data: {
        name: mockDto.diagnosis,
        description: mockDto.description,
        patientId: mockDto.patientId,
        doctorId: mockDoctor.id,
      },
    });
  });

  it('should throw NotFoundException if patient is not found', async () => {
    const mockDto = {
      diagnosis: 'Flu',
      description: 'Viral infection',
      patientId: 'non-existent-patient-id',
      doctorId: 'doctor-user-id',
    };

    jest.spyOn(prisma.patient, 'findUnique').mockResolvedValue(null);

    await expect(service.addDiagnosis(mockDto)).rejects.toThrowError(
      'Patient not found',
    );

    expect(prisma.patient.findUnique).toHaveBeenCalledWith({
      where: { id: mockDto.patientId },
    });
  });

  it('should throw NotFoundException if doctor is not found', async () => {
    const mockDto = {
      diagnosis: 'Flu',
      description: 'Viral infection',
      patientId: 'valid-patient-id',
      doctorId: 'non-existent-doctor-user-id',
    };

    const mockPatient = { id: mockDto.patientId };
    jest
      .spyOn(prisma.patient, 'findUnique')
      .mockResolvedValue(mockPatient as any);
    jest.spyOn(prisma.doctor, 'findUnique').mockResolvedValue(null);

    await expect(service.addDiagnosis(mockDto)).rejects.toThrowError(
      'Doctor not found',
    );

    expect(prisma.doctor.findUnique).toHaveBeenCalledWith({
      where: { userId: mockDto.doctorId },
    });
  });

  const mockFile = {
    originalname: 'test-image.jpg',
    buffer: Buffer.from('fake file content'), // simulate file content as a Buffer
    mimetype: 'image/jpeg',
    size: 1024,
  };

  it('should successfully add a lab report', async () => {
    const mockDto = {
      patientId: 'patient-uuid-1234',
      description: 'Blood test report',
      category: 'Blood Test',
    };

    const mockPatient = { id: mockDto.patientId };
    const mockImageUrl = 'https://some-storage.com/image.jpg';
    const mockCreatedReport = {
      id: 'lab-report-id-123',
      patientId: mockDto.patientId,
      description: mockDto.description,
      category: mockDto.category,
      imageUrl: mockImageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock prisma patient findUnique to find patient
    jest
      .spyOn(prisma.patient, 'findUnique')
      .mockResolvedValue(mockPatient as any);

    // Mock blackbazeService.uploadImage to return the URL
    jest
      .spyOn(service['blackbazeService'], 'uploadImage')
      .mockResolvedValue(mockImageUrl);

    // Mock prisma labReport.create to return the created report
    jest
      .spyOn(prisma.labReport, 'create')
      .mockResolvedValue(mockCreatedReport as any);

    const result = await service.addLabReport(mockDto, mockFile);

    expect(prisma.patient.findUnique).toHaveBeenCalledWith({
      where: { id: mockDto.patientId },
    });

    expect(service['blackbazeService'].uploadImage).toHaveBeenCalledWith(
      mockFile,
    );

    expect(prisma.labReport.create).toHaveBeenCalledWith({
      data: {
        patientId: mockDto.patientId,
        description: mockDto.description,
        category: mockDto.category,
        imageUrl: mockImageUrl,
      },
    });

    expect(result).toEqual({
      message: 'Lab report added successfully',
      data: mockCreatedReport,
    });
  });

  it('should throw HttpException if patient not found', async () => {
    const mockDto = {
      patientId: 'non-existent-patient-id',
      description: 'MRI report',
      category: 'MRI',
    };

    jest.spyOn(prisma.patient, 'findUnique').mockResolvedValue(null);

    await expect(service.addLabReport(mockDto, mockFile)).rejects.toThrow(
      new HttpException('Patient not found', HttpStatus.NOT_FOUND),
    );

    expect(prisma.patient.findUnique).toHaveBeenCalledWith({
      where: { id: mockDto.patientId },
    });

    // Should not call uploadImage or create if patient is missing
    expect(service['blackbazeService'].uploadImage).not.toHaveBeenCalled();
    expect(prisma.labReport.create).not.toHaveBeenCalled();
  });

  it('should successfully add a prescription', async () => {
  const mockDto = {
    patientId: 'patient-uuid-1234',
    doctorId: 'doctor-userid-1234',
    note: 'Take one tablet daily',
  };

  const mockPatient = { id: mockDto.patientId };
  const mockDoctor = { id: 'doctor-uuid-5678', userId: mockDto.doctorId };
  const mockImageUrl = 'https://some-storage.com/prescription.jpg';

  const mockCreatedPrescription = {
    id: 'prescription-id-001',
    patientId: mockDto.patientId,
    doctorId: mockDoctor.id,
    notes: mockDto.note,
    imageUrl: mockImageUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  jest.spyOn(prisma.patient, 'findUnique').mockResolvedValue(mockPatient as any);
  jest.spyOn(prisma.doctor, 'findUnique').mockResolvedValue(mockDoctor as any);
  jest.spyOn(service['blackbazeService'], 'uploadImage').mockResolvedValue(mockImageUrl);
  jest.spyOn(prisma.prescription, 'create').mockResolvedValue(mockCreatedPrescription as any);

  const result = await service.addPrescription(mockDto, mockFile);

  expect(prisma.patient.findUnique).toHaveBeenCalledWith({
    where: { id: mockDto.patientId },
  });

  expect(prisma.doctor.findUnique).toHaveBeenCalledWith({
    where: { userId: mockDto.doctorId },
  });

  expect(service['blackbazeService'].uploadImage).toHaveBeenCalledWith(mockFile);

  expect(prisma.prescription.create).toHaveBeenCalledWith({
    data: {
      patientId: mockDto.patientId,
      doctorId: mockDoctor.id,
      notes: mockDto.note,
      imageUrl: mockImageUrl,
    },
  });

  expect(result).toEqual({
    message: 'Prescription added successfully',
    data: mockCreatedPrescription,
  });
});

it('should throw HttpException if patient not found', async () => {
  const mockDto = {
    patientId: 'non-existent-patient-id',
    doctorId: 'doctor-userid-1234',
    note: 'Check BP regularly',
  };

  jest.spyOn(prisma.patient, 'findUnique').mockResolvedValue(null);

  await expect(service.addPrescription(mockDto, mockFile)).rejects.toThrow(
    new HttpException('Patient not found', HttpStatus.NOT_FOUND),
  );

  expect(prisma.patient.findUnique).toHaveBeenCalledWith({
    where: { id: mockDto.patientId },
  });

  expect(prisma.doctor.findUnique).not.toHaveBeenCalled();
  expect(service['blackbazeService'].uploadImage).not.toHaveBeenCalled();
  expect(prisma.prescription.create).not.toHaveBeenCalled();
});

it('should throw HttpException if doctor not found', async () => {
  const mockDto = {
    patientId: 'patient-uuid-1234',
    doctorId: 'non-existent-doctor-id',
    note: 'Follow diet plan',
  };

  const mockPatient = { id: mockDto.patientId };

  jest.spyOn(prisma.patient, 'findUnique').mockResolvedValue(mockPatient as any);
  jest.spyOn(prisma.doctor, 'findUnique').mockResolvedValue(null);

  await expect(service.addPrescription(mockDto, mockFile)).rejects.toThrow(
    new HttpException('Doctor not found', HttpStatus.NOT_FOUND),
  );

  expect(prisma.patient.findUnique).toHaveBeenCalledWith({
    where: { id: mockDto.patientId },
  });

  expect(prisma.doctor.findUnique).toHaveBeenCalledWith({
    where: { userId: mockDto.doctorId },
  });

  expect(service['blackbazeService'].uploadImage).not.toHaveBeenCalled();
  expect(prisma.prescription.create).not.toHaveBeenCalled();
});

});
