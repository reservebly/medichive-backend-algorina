import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors, 
  UploadedFile, 
  UploadedFiles, 
  ParseIntPipe, 
  Query,
  BadRequestException,
  Res
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { LabReportService } from './lab-report.service';
import { CreateLabReportDto } from './dto/create-lab-report.dto';
import { UpdateLabReportDto } from './dto/update-lab-report.dto';
import * as path from 'path';
import * as fs from 'fs';

@Controller('lab-report')
export class LabReportController {
  constructor(private readonly labReportService: LabReportService) {}

  // Upload report with only link
  @Post('upload-link')
  async uploadWithLink(@Body() createLabReportDto: CreateLabReportDto) {
    if (!createLabReportDto.reportLink) {
      throw new BadRequestException('Report link is required for this upload method');
    }
    return this.labReportService.create(createLabReportDto);
  }

  // Upload report with image only
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  }))
  async uploadWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('patientId') patientId: string,
    @Body('description') description: string,
    @Body('reportLink') reportLink?: string,
    @Body('labId') labId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const patientIdNum = parseInt(patientId);
    const labIdNum = labId ? parseInt(labId) : undefined;

    if (isNaN(patientIdNum)) {
      throw new BadRequestException('Invalid patient ID');
    }

    return this.labReportService.createWithImage(
      patientIdNum,
      description,
      file,
      reportLink,
      labIdNum
    );
  }

  // Upload report with PDF only
  @Post('upload-pdf')
  @UseInterceptors(FileInterceptor('pdf', {
    fileFilter: (req, file, callback) => {
      if (file.mimetype !== 'application/pdf') {
        return callback(new BadRequestException('Only PDF files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB limit
    },
  }))
  async uploadWithPDF(
    @UploadedFile() file: Express.Multer.File,
    @Body('patientId') patientId: string,
    @Body('description') description: string,
    @Body('reportLink') reportLink?: string,
    @Body('labId') labId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    const patientIdNum = parseInt(patientId);
    const labIdNum = labId ? parseInt(labId) : undefined;

    if (isNaN(patientIdNum)) {
      throw new BadRequestException('Invalid patient ID');
    }

    return this.labReportService.createWithPDF(
      patientIdNum,
      description,
      file,
      reportLink,
      labIdNum
    );
  }

  // Upload report with both image and PDF
  @Post('upload-both')
  @UseInterceptors(FilesInterceptor('files', 2, {
    fileFilter: (req, file, callback) => {
      if (file.fieldname === 'image' && !file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return callback(new BadRequestException('Only image files are allowed for image field!'), false);
      }
      if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
        return callback(new BadRequestException('Only PDF files are allowed for pdf field!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB limit
    },
  }))
  async uploadWithBoth(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('patientId') patientId: string,
    @Body('description') description: string,
    @Body('reportLink') reportLink?: string,
    @Body('labId') labId?: string,
  ) {
    if (!files || files.length !== 2) {
      throw new BadRequestException('Both image and PDF files are required');
    }

    const imageFile = files.find(file => file.mimetype.match(/\/(jpg|jpeg|png|gif)$/));
    const pdfFile = files.find(file => file.mimetype === 'application/pdf');

    if (!imageFile || !pdfFile) {
      throw new BadRequestException('Both image and PDF files are required');
    }

    const patientIdNum = parseInt(patientId);
    const labIdNum = labId ? parseInt(labId) : undefined;

    if (isNaN(patientIdNum)) {
      throw new BadRequestException('Invalid patient ID');
    }

    return this.labReportService.createWithImageAndPDF(
      patientIdNum,
      description,
      imageFile,
      pdfFile,
      reportLink,
      labIdNum
    );
  }

  // Alternative endpoint for the Flutter frontend with proper multipart handling
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 2, {
    fileFilter: (req, file, callback) => {
      // Allow images and PDFs
      const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
        'application/pdf'
      ];
      
      if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Only image and PDF files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB limit
    },
  }))
  async uploadReport(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('patientId') patientId: string,
    @Body('description') description: string,
    @Body('reportLink') reportLink?: string,
    @Body('labId') labId?: string,
    @Body('uploadMethod') uploadMethod: string = 'link',
  ) {
    const patientIdNum = parseInt(patientId);
    const labIdNum = labId ? parseInt(labId) : undefined;

    if (isNaN(patientIdNum)) {
      throw new BadRequestException('Invalid patient ID');
    }

    switch (uploadMethod) {
      case 'link':
        if (!reportLink) {
          throw new BadRequestException('Report link is required for link upload method');
        }
        return this.labReportService.create({
          patientId: patientIdNum,
          description,
          reportLink,
          labId: labIdNum
        });

      case 'image':
        if (!files || files.length === 0) {
          throw new BadRequestException('Image file is required for image upload method');
        }
        const imageFile = files.find(file => file.mimetype.match(/^image\//));
        if (!imageFile) {
          throw new BadRequestException('Valid image file is required');
        }
        return this.labReportService.createWithImage(
          patientIdNum,
          description,
          imageFile,
          reportLink,
          labIdNum
        );

      case 'pdf':
        if (!files || files.length === 0) {
          throw new BadRequestException('PDF file is required for PDF upload method');
        }
        const pdfFile = files.find(file => file.mimetype === 'application/pdf');
        if (!pdfFile) {
          throw new BadRequestException('Valid PDF file is required');
        }
        return this.labReportService.createWithPDF(
          patientIdNum,
          description,
          pdfFile,
          reportLink,
          labIdNum
        );

      case 'both':
        if (!files || files.length < 2) {
          throw new BadRequestException('Both image and PDF files are required for both upload method');
        }
        const imgFile = files.find(file => file.mimetype.match(/^image\//));
        const pdfFileForBoth = files.find(file => file.mimetype === 'application/pdf');
        
        if (!imgFile || !pdfFileForBoth) {
          throw new BadRequestException('Both valid image and PDF files are required');
        }
        
        return this.labReportService.createWithImageAndPDF(
          patientIdNum,
          description,
          imgFile,
          pdfFileForBoth,
          reportLink,
          labIdNum
        );

      default:
        throw new BadRequestException('Invalid upload method. Use: link, image, pdf, or both');
    }
  }

  @Get()
  findAll(
    @Query('patientId') patientId?: string,
    @Query('labId') labId?: string,
  ) {
    const patientIdNum = patientId ? parseInt(patientId) : undefined;
    const labIdNum = labId ? parseInt(labId) : undefined;
    
    return this.labReportService.findAll(patientIdNum, labIdNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.labReportService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateLabReportDto: UpdateLabReportDto
  ) {
    return this.labReportService.update(id, updateLabReportDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.labReportService.remove(id);
  }

  // Serve uploaded files
  @Get('files/:filename')
  async serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'lab-reports', filename);
    
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    return res.sendFile(filePath);
  }
}
