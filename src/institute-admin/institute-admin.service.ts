import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DeleteDoctorDto } from './dto/delete-doctor.dto';
import { UserRole } from 'generated/prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InstituteAdminService {
  private logger: Logger = new Logger(InstituteAdminService.name);
  constructor(private prisma: PrismaService) {}

  // add doctor function
  async addDoctors(data: AddDoctorDto) {
    try {
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

      // check if doctor already exists
      const isExist = await this.prisma.user.findUnique({
        where: { email },
      });

      if (isExist) {
        throw new HttpException(
          'Doctor with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      // hash password
      const hash = await bcrypt.hash(password, 12);

      // create user with doctor
      const createdDoctor = await this.prisma.user.create({
        data: {
          email,
          name,
          contactNo: phoneNumber,
          gender,
          dob,                  
          roles: UserRole.DOCTOR,
          username: email,
          password: hash,
          doctor: {
            create: {
              experience,
              licenseNumber,
            },
          },
        },
        include: {
          doctor: true,
        },
      });

      return { message: 'Doctor created successfully' };
    } catch (err) {
      console.log(err);
      this.handleErrors(err, 'Error creating doctor');
    }
  }

  // delete doctor function
  async deleteDoctor(deleteDoctorDto: DeleteDoctorDto) {
    try {
      const { email } = deleteDoctorDto;
      const doctor = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!doctor) {
        throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.user.delete({
        where: { email },
      });

      return { message: 'Doctor deleted successfully' };
    } catch (err) {
      console.log(err);
      this.handleErrors(err, 'Error deleting doctor');
    }
  }

  handleErrors(error: unknown, message?: string) {
    let errorMessage = 'Unknown error';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    this.logger.error(`${message ?? 'Error'} : ${errorMessage}`);
    throw new HttpException(errorMessage, 500);
  }
}
