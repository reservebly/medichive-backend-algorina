import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { InstituteAdminService } from './institute-admin.service';
import { AddDoctorDto } from './dto/add-doctor.dto';

@Controller('institute-admin')
export class InstituteAdminController {
  constructor(private readonly instituteAdminService: InstituteAdminService) {}

  @Post('add-doctor')
  @HttpCode(200)
  async addDoctor(
    @Body() data:AddDoctorDto 
  ){
    return await this.instituteAdminService.addDoctors(data);
  }

}
