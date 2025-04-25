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
        throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
      }
      await this.prisma.doctor.create({
        data: doctorData,
      });
    } catch (err) {
      console.log(err);
      this.handleErrors(err, 'Error creating doctors');
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
