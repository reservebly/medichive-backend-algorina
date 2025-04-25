import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { InstituteAdminService } from './institute-admin.service';
import { AddDoctorDto } from './dto/add-doctor.dto';
import { DeleteDoctorDto } from './dto/delete-doctor.dto';

@Controller('institute-admin')
export class InstituteAdminController {
  constructor(private readonly instituteAdminService: InstituteAdminService) {}

  @Post('add-doctor')
  @HttpCode(200)
  async addDoctor(
    @Body() data: AddDoctorDto
  ) {
    return await this.instituteAdminService.addDoctors(data);
  }

  @Post('delete-doctor')
  @HttpCode(200)
  async deleteDoctor(
    @Body() data: DeleteDoctorDto
  ) {
    return await this.instituteAdminService.deleteDoctor(data);
  }
}
