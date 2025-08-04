import { Test, TestingModule } from '@nestjs/testing';
import { InstituteAdminController } from './institute-admin.controller';
import { InstituteAdminService } from './institute-admin.service';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { Gender } from '@prisma/client';
import { AuthRoleGuard } from 'src/auth/guards/auth-role.guard';
import { ExecutionContext } from '@nestjs/common';

describe('InstituteAdminController', () => {
  let controller: InstituteAdminController;
  let service: InstituteAdminService;

  const mockInstituteAdminService = {
    addDoctors: jest.fn(),
    deleteDoctor: jest.fn(),
    getDoctors: jest.fn(),
    addSymptom: jest.fn(),
    addDiagnosis: jest.fn(),
    getPatients: jest.fn(),
    addLabReport: jest.fn(),
    addPrescription: jest.fn(),
  };

  const mockAuthRoleGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstituteAdminController],
      providers: [
        {
          provide: InstituteAdminService,
          useValue: mockInstituteAdminService,
        },
      ],
    })
      .overrideGuard(AuthRoleGuard)
      .useValue(mockAuthRoleGuard)
      .compile();

    controller = module.get<InstituteAdminController>(InstituteAdminController);
    service = module.get<InstituteAdminService>(InstituteAdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addDoctor', () => {
    it('should call service.addDoctors and return its result', async () => {
      const dto: AddDoctorDto = {
        name: 'Dr. Strange',
        email: 'strange@example.com',
        experience: 5,
        licenseNumber: 'li-2314124',
        phoneNumber: '0714234563',
        gender: Gender.MALE,
        password: 'test password',
      };

      const expectedResult = { success: true };

      mockInstituteAdminService.addDoctors.mockResolvedValue(expectedResult);

      const result = await controller.addDoctor(dto);

      expect(service.addDoctors).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteDoctor', () => {
    it('should call service.deleteDoctor and return its result', async () => {
      const dto = {
        email: 'test@GMAIL.Ccom',
      };

      const expectedResult = { success: true };

      mockInstituteAdminService.deleteDoctor.mockResolvedValue(expectedResult);

      const result = await controller.deleteDoctor(dto);

      expect(service.deleteDoctor).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDoctors', () => {
    it('should call service.getDoctors and return its result', async () => {
      const expectedResult = [
        {
          id: 'doc-1',
          name: 'Dr. Alice',
          email: 'alice@example.com',
          specialization: 'Cardiology',
        },
        {
          id: 'doc-2',
          name: 'Dr. Bob',
          email: 'bob@example.com',
          specialization: 'Neurology',
        },
      ];

      mockInstituteAdminService.getDoctors.mockResolvedValue(expectedResult);

      const result = await controller.getDoctors();

      expect(service.getDoctors).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('addSymptoms', () => {
    it('should call service.addSymptom and return its result', async () => {
      const dto = {
        symptoms: 'Cough, Fever',
        description: 'Patient reports dry cough and mild fever for 3 days',
        patientId: 'fda283e9-2f91-41ef-b0aa-03db07a8b70c',
        doctorId: '3b0f47be-79de-45e4-bc04-04698b8cc617',
      };

      const expectedResult = { success: true, message: 'Symptom added' };

      mockInstituteAdminService.addSymptom.mockResolvedValue(expectedResult);

      const result = await controller.addSymptoms(dto);

      expect(service.addSymptom).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('addDiagnosis', () => {
    it('should call service.addDiagnosis and return its result', async () => {
      const dto = {
        diagnosis: 'Flu',
        description: 'Influenza virus detected in symptoms',
        patientId: '98c9aa3e-508d-44aa-96f1-fcf470c9cabc',
        doctorId: '7f0a1fbd-f370-4b83-bc6e-7b4cdb784cd1',
      };

      const expectedResult = { success: true, message: 'Diagnosis added' };

      mockInstituteAdminService.addDiagnosis.mockResolvedValue(expectedResult);

      const result = await controller.addDiagnosis(dto);

      expect(service.addDiagnosis).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
  describe('getPatients', () => {
    it('should call service.getPatients and return its result', async () => {
      const expectedResult = [
        {
          id: 'pat-001',
          name: 'John Doe',
          age: 32,
          gender: 'MALE',
        },
        {
          id: 'pat-002',
          name: 'Jane Smith',
          age: 28,
          gender: 'FEMALE',
        },
      ];

      mockInstituteAdminService.getPatients.mockResolvedValue(expectedResult);

      const result = await controller.getPatients();

      expect(service.getPatients).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
  describe('uploadLabReports', () => {
    it('should call service.addLabReport with data and file and return the result', async () => {
      const dto = {
        patientId: '2df6a507-f3f6-4c1b-bc91-8dcd7adad5a3',
        category: 'Blood Test',
        description: 'Routine test',
      };

      const mockFile = {
        originalname: 'report.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('fake-file-content'),
      };

      const expectedResult = { success: true, message: 'Report uploaded' };

      mockInstituteAdminService.addLabReport.mockResolvedValue(expectedResult);

      const result = await controller.uploadLabReports(dto, mockFile);

      expect(service.addLabReport).toHaveBeenCalledWith(dto, mockFile);
      expect(result).toEqual(expectedResult);
    });
  });
  describe('uploadPrescriptions', () => {
    it('should call service.addPrescription with data and file and return the result', async () => {
      const dto = {
        patientId: '25a4de03-8c3e-4d2e-a28a-650149d95cb2',
        doctorId: '2a46e6a6-676b-4d18-94d6-d69a4b51123b',
        note: 'Take 1 tablet after meals',
      };

      const mockFile = {
        originalname: 'prescription.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('fake-prescription-content'),
      };

      const expectedResult = {
        success: true,
        message: 'Prescription uploaded',
      };

      mockInstituteAdminService.addPrescription.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.uploadPrescriptions(dto, mockFile);

      expect(service.addPrescription).toHaveBeenCalledWith(dto, mockFile);
      expect(result).toEqual(expectedResult);
    });
  });
});