import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InstituteAdminService } from './institute-admin.service';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DeleteDoctorDto } from './dto/delete-doctor.dto';
import { AddInstituteAdminDto } from './dto/add-institute-admin.dto';
import { AuthRoleGuard } from 'src/auth/guards/auth-role.guard';
import { Roles } from 'src/auth/decorators/roles.decarator';
import { AddPatientDto } from './dto/add-patient.dto';

@Controller('institute-admin')
@UseGuards(AuthRoleGuard)
export class InstituteAdminController {
  constructor(private readonly instituteAdminService: InstituteAdminService) {}

  @Post('add-doctor')
  @Roles('INSTITUTE_ADMIN')
  @HttpCode(200)
  async addDoctor(@Body() data: AddDoctorDto) {
    return await this.instituteAdminService.addDoctors(data);
  }

  @Delete('delete-doctor')
  @Roles('INSTITUTE_ADMIN')
  @HttpCode(200)
  async deleteDoctor(@Body() data: DeleteDoctorDto) {
    return await this.instituteAdminService.deleteDoctor(data);
  }

  @Get('get-doctors')
  @Roles('INSTITUTE_ADMIN')
  @HttpCode(200)
  async getDoctors() {
    return await this.instituteAdminService.getDoctors();
  }

  @Post('add-institute-admin')
  @Roles()
  @HttpCode(200)
  async addInstituteAdmin(@Body() data: AddInstituteAdminDto) {
    return await this.instituteAdminService.addInstituteAdmin(data);
  }

  @Post('add-patient')
  @Roles()
  @HttpCode(200)
  async addPatient(@Body() data: AddPatientDto) {
    return await this.instituteAdminService.addPatient(data);
  }
}
