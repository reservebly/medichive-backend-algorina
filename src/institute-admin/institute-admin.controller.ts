import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { InstituteAdminService } from './institute-admin.service';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DeleteDoctorDto } from './dto/delete-doctor.dto';
import { AddInstituteAdminDto } from './dto/add-institute-admin.dto';
import { AuthRoleGuard } from 'src/auth/guards/auth-role.guard';
import { Roles } from 'src/auth/decorators/roles.decarator';

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

  @Post('delete-doctor')
  @Roles('INSTITUTE_ADMIN')
  @HttpCode(200)
  async deleteDoctor(@Body() data: DeleteDoctorDto) {
    return await this.instituteAdminService.deleteDoctor(data);
  }

  @Post('add-institute-admin')
  @Roles()
  @HttpCode(200)
  async addInstituteAdmin(@Body() data: AddInstituteAdminDto) {
    return await this.instituteAdminService.addInstituteAdmin(data);
  }
}
