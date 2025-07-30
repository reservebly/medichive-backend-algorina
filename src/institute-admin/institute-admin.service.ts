import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DeleteDoctorDto } from './dto/delete-doctor.dto';
import { UserRole } from '@prisma/client';
import { AddInstituteAdminDto } from './dto/add-institute-admin.dto';

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

      // Store password directly (no hashing)
      const hash = password;

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
          password: hash, // Store password directly
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

      const hash = password; // Store password directly (no hashing)

      const institute = await this.prisma.institute.create({
        data: {
          name: `${email.split('@')[0]} Institute`,
          registrationNumber: `REG-${Date.now().toString().slice(-6)}`,
          contactNumber: '0000000000',
          website: '',
          address: '',
          description: '',
          certificate: '',
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
          password: hash, // Store password directly
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
