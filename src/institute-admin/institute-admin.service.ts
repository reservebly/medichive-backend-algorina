import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DeleteDoctorDto } from './dto/delete-doctor.dto';
import { Gender, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AddInstituteAdminDto } from './dto/add-institute-admin.dto';
import { AddPatientDto } from './dto/add-patient.dto';
import { AddSymptomDto } from './dto/add-symptom.dto';
import { AddDiagnosisDto } from './dto/add-diagnosis.dto';

@Injectable()
export class InstituteAdminService {
  // Initialize a logger specific to this service
  private logger: Logger = new Logger(InstituteAdminService.name);

  // Inject Prisma service for database operations
  constructor(private prisma: PrismaService) {}

  /**
   * //Add a new doctor to the system
   * @param data - //Doctor details sent from the client
   * @returns //Success message upon creation
   */

  async addDoctors(data: AddDoctorDto) {
    try {
      // Destructure required fields from the received data
      const {
        email,
        name,
        phoneNumber,
        gender,
        password,
        dob,
        experience,
        licenseNumber,
      } = data;

      // Check if a doctor with the same email already exists
      const isExist = await this.prisma.user.findUnique({
        where: { email },
      });

      // If doctor exists, throw a 400 error
      if (isExist) {
        throw new HttpException(
          'Doctor with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash the received password securely using bcrypt
      const hash = await bcrypt.hash(password, 12);

      // Create a new doctor user with associated doctor details
      await this.prisma.user.create({
        data: {
          email,
          name,
          contactNo: phoneNumber,
          gender,
          dob,
          roles: UserRole.DOCTOR, // Assign role as DOCTOR
          username: email,
          password: hash, // Store hashed password
          doctor: {
            create: {
              experience,
              licenseNumber,
            },
          },
        },
        // Include doctor details in the response (optional use)
        include: {
          doctor: true,
        },
      });

      // Return a success message if creation is successful
      return { message: 'Doctor created successfully' };
    } catch (err) {
      // Log error and handle gracefully
      console.log(err);
      this.handleErrors(err, 'Error creating doctor');
    }
  }

  /**
   * Delete a doctor from the system by their email
   * @param deleteDoctorDto - Contains the email of the doctor to delete
   * @returns Success message upon deletion
   */
  async deleteDoctor(deleteDoctorDto: DeleteDoctorDto) {
    try {
      const { email } = deleteDoctorDto;

      // Check if a doctor with the given email exists
      const doctor = await this.prisma.user.findUnique({
        where: { email },
      });

      // If no doctor found, throw a 404 error
      if (!doctor) {
        throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
      }

      // Delete the doctor record from the database
      await this.prisma.user.delete({
        where: { email },
      });

      // Return a success message if deletion is successful
      return { message: 'Doctor deleted successfully' };
    } catch (err) {
      // Log error and handle gracefully
      console.log(err);
      this.handleErrors(err, 'Error deleting doctor');
    }
  }

  async getDoctors() {
    try {
      // Fetch all users with role DOCTOR and include their doctor-specific details
      const doctors = await this.prisma.user.findMany({
        where: {
          roles: UserRole.DOCTOR,
        },
        include: {
          doctor: true, // Include associated doctor details
        },
      });

      // Return the list of doctors
      return doctors;
    } catch (err) {
      console.log(err);
      this.handleErrors(err, 'Error fetching doctors');
    }
  }

  async addInstituteAdmin(data: AddInstituteAdminDto) {
    try {
      // Destructure required fields from the received data
      const { email, name, contactNo, password, gender } = data;

      const isExist = await this.prisma.user.findUnique({
        where: { email },
      });

      if (isExist) {
        throw new HttpException(
          'Institute admin with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hash = await bcrypt.hash(password, 12);

      const institute = await this.prisma.institute.create({
        data: {
          name: 'ABC Institute',
          registrationNumber: 'REG123',
          contactNumber: '0112345678',
          website: 'https://abc.com',
          address: 'Colombo',
          description: 'Best institute',
          certificate: 'cert.pdf',
        },
      });

      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          contactNo,
          gender,
          roles: UserRole.INSTITUTE_ADMIN,
          username: email,
          password: hash,
          instituteAdmin: {
            create: {
              instituteId: institute.id,
            },
          },
        },
      });

      // Return a success message if creation is successful
      return { message: 'Doctor created successfully' };
    } catch (err) {
      // Log error and handle gracefully
      console.log(err);
      this.handleErrors(err, 'Error creating doctor');
    }
  }

  async addPatient(data: AddPatientDto) {
    try {
      const { email, name, contactNo, password, gender, address } = data;

      const isExist = await this.prisma.user.findUnique({
        where: { email },
      });

      if (isExist) {
        throw new HttpException(
          'Patient with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hash = await bcrypt.hash(password, 12);

      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          contactNo,
          address,
          gender,
          roles: UserRole.PATIENT,
          username: email,
          password: hash,
          patient: {
            create: {},
          },
        },
      });

      return { message: 'Patient created successfully' };
    } catch (err) {
      console.log(err);
      this.handleErrors(err, 'Error creating patient');
    }
  }

  async addSymptom(data: AddSymptomDto) {
    try {
      const { symptoms, description, patientId, doctorId } = data;

      // Check if the patient exists
      const patient = await this.prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!patient) {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }

      // Check if the doctor exists
      const doctor = await this.prisma.doctor.findUnique({
        where: { userId: doctorId },
      });

      if (!doctor) {
        throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
      }

      // Create the symptom entry
      const symptom = await this.prisma.symptom.create({
        data: {
          symptoms,
          description,
          patientId,
          doctorId: doctor.id,
        },
      });

      return { message: 'Symptoms recorded successfully', data: symptom };
    } catch (err) {
      console.error(err);
      this.handleErrors(err, 'Error adding symptom');
    }
  }

  async addDiagnosis(data: AddDiagnosisDto) {
  try {
    const { diagnosis, description, patientId, doctorId } = data;

    // Check if patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    // Check if doctor exists
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: doctorId },
    });

    if (!doctor) {
      throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
    }

    // Create diagnosis entry
    const createdDiagnosis = await this.prisma.diagnosis.create({
      data: {
        name:diagnosis,
        description,
        patientId,
        doctorId: doctor.id,
      },
    });

    return {
      message: 'Diagnosis added successfully',
      data: createdDiagnosis,
    };
  } catch (err) {
    console.error(err);
    this.handleErrors(err, 'Error adding diagnosis');
  }
}

  async getPatients() {
    try {
      const patients = await this.prisma.patient.findMany({
        select: {
          id: true, // patientId
          user: {
            select: {
              name: true, // patient's name from User model
            },
          },
        },
      });

      // Format the result to flatten the structure
      const formattedPatients = patients.map((patient) => ({
        patientId: patient.id,
        name: patient.user.name,
      }));

      return formattedPatients;
    } catch (err) {
      console.error(err);
      this.handleErrors(err, 'Error fetching patients');
    }
  }

  /**
   * //Handle and log service-level errors
   * @param error - The caught error (any type)
   * @param message - Optional custom message for context
   * @throws HttpException with error message and 500 status code
   */
  handleErrors(error: unknown, message?: string) {
    let errorMessage = 'Unknown error';

    // Determine error type and extract message
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Log error to the system logger
    this.logger.error(`${message ?? 'Error'} : ${errorMessage}`);

    // Throw an HTTP exception with status code 500
    throw new HttpException(errorMessage, 500);
  }
}
