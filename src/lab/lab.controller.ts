import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  UseInterceptors, 
  UploadedFiles,
  Delete,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { LabService } from './lab.service';
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Configure multer for file storage
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(process.cwd(), 'uploads', 'lab-reports');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) {}

  @Post('complaints')
  @UseGuards(JwtAuthGuard)
  async createComplaint(
    @Body() createComplaintDto: CreateComplaintDto,
    @Body('userId') userId: string,
  ) {
    return this.labService.createComplaint(createComplaintDto, userId);
  }

  @Get('profile/:userId')
  async getUserProfile(@Param('userId') userId: string) {
    try {
      return await this.labService.getLabUserProfile(userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get user profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('lab-profile/:userId')
  async getLabProfile(@Param('userId') userId: string) {
    try {
      return await this.labService.getLabProfileByUserId(userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get lab profile',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('lab-reports')
  async getAllLabReports() {
    return this.labService.getAllLabReports();
  }

  @Post('lab-reports')
  async createLabReport(@Body() data: { 
    patientId: number; 
    description: string; 
    reportLink?: string; 
    imagePath?: string; 
    pdfPath?: string 
  }) {
    return this.labService.createLabReport(data);
  }

  @Post('lab-reports/upload')
  @UseInterceptors(FilesInterceptor('files', 2, { 
    storage,
    fileFilter: (req, file, cb) => {
      // Allow images and PDFs
      if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only image and PDF files are allowed'), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  }))
  async uploadLabReportWithFiles(
    @Body() body: { patientId: string; description: string; reportLink?: string },
    @UploadedFiles() files: any[],
  ) {
    try {
      const patientId = parseInt(body.patientId);
      if (isNaN(patientId)) {
        throw new HttpException('Invalid patient ID', HttpStatus.BAD_REQUEST);
      }

      let imagePath: string | undefined;
      let pdfPath: string | undefined;

      // Process uploaded files
      files?.forEach(file => {
        if (file.mimetype.startsWith('image/')) {
          imagePath = file.path;
        } else if (file.mimetype === 'application/pdf') {
          pdfPath = file.path;
        }
      });

      const reportData = {
        patientId,
        description: body.description,
        reportLink: body.reportLink,
        imagePath,
        pdfPath,
      };

      return this.labService.createLabReport(reportData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to upload lab report',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('lab-reports/:reportId')
  async deleteLabReport(@Param('reportId') reportId: string) {
    return this.labService.deleteLabReport(reportId);
  }
}
