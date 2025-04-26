import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDoctorDto } from './dto/add-doctor.dto';

@Injectable()
export class InstituteAdminService {
  private logger: Logger = new Logger(InstituteAdminService.name);
  constructor(private prisma: PrismaService) {}

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
  handleErrors(err: any, arg1: string) {
    throw new Error('Method not implemented.');
  }
}