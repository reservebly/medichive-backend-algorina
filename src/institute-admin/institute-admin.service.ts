import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DeleteDoctorDto } from './dto/delete-doctor.dto';

@Injectable()
export class InstituteAdminService {
  private logger: Logger = new Logger(InstituteAdminService.name);
  constructor(private prisma: PrismaService) {}


  // add doctor function
  async addDoctors(doctorData: AddDoctorDto) {
    try {
      const { email } = doctorData;
      const isExist = await this.prisma.doctor.findUnique({
        where: { email: email },
      });
  
      if (isExist) {
        throw new HttpException('Doctor with this email already exists', HttpStatus.BAD_REQUEST);
      }
  
      const createdDoctor = await this.prisma.doctor.create({
        data: doctorData,
      });
  
      return { message: 'Doctor created successfully', doctor: createdDoctor };
  
    } catch (err) {
      console.log(err);
      this.handleErrors(err, 'Error creating doctor');
    }
  }


  // delete doctor function
  async deleteDoctor(deleteDoctorDto: DeleteDoctorDto) {
    try {
      const { email } = deleteDoctorDto;
      const doctor = await this.prisma.doctor.findUnique({
        where: { email },
      });

      if (!doctor) {
        throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.doctor.delete({
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
