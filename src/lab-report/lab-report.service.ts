import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabReportDto } from './dto/create-lab-report.dto';
import { UpdateLabReportDto } from './dto/update-lab-report.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LabReportService {
  constructor(private prisma: PrismaService) {}

  async create(createLabReportDto: CreateLabReportDto) {
    // Verify patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: createLabReportDto.patientId }
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${createLabReportDto.patientId} not found`);
    }

    // Verify lab exists if provided
    if (createLabReportDto.labId) {
      const lab = await this.prisma.lab.findUnique({
        where: { id: createLabReportDto.labId }
      });

      if (!lab) {
        throw new NotFoundException(`Lab with ID ${createLabReportDto.labId} not found`);
      }
    }

    return this.prisma.labReport.create({
      data: createLabReportDto,
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNo: true
              }
            }
          }
        },
        lab: {
          select: {
            id: true,
            name: true,
            contactNumber: true
          }
        }
      }
    });
  }

  async createWithImage(
    patientId: number, 
    description: string, 
    imageFile: Express.Multer.File,
    reportLink?: string,
    labId?: number
  ) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'lab-reports');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const imageExtension = path.extname(imageFile.originalname);
    const imageName = `image_${timestamp}${imageExtension}`;
    const imagePath = path.join(uploadDir, imageName);

    // Save image file
    fs.writeFileSync(imagePath, imageFile.buffer);

    return this.create({
      patientId,
      description,
      reportLink,
      labId,
      imagePath: `uploads/lab-reports/${imageName}`
    });
  }

  async createWithPDF(
    patientId: number, 
    description: string, 
    pdfFile: Express.Multer.File,
    reportLink?: string,
    labId?: number
  ) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'lab-reports');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const pdfName = `pdf_${timestamp}.pdf`;
    const pdfPath = path.join(uploadDir, pdfName);

    // Save PDF file
    fs.writeFileSync(pdfPath, pdfFile.buffer);

    return this.create({
      patientId,
      description,
      reportLink,
      labId,
      pdfPath: `uploads/lab-reports/${pdfName}`
    });
  }

  async createWithImageAndPDF(
    patientId: number, 
    description: string, 
    imageFile: Express.Multer.File,
    pdfFile: Express.Multer.File,
    reportLink?: string,
    labId?: number
  ) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'lab-reports');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filenames
    const timestamp = Date.now();
    const imageExtension = path.extname(imageFile.originalname);
    const imageName = `image_${timestamp}${imageExtension}`;
    const pdfName = `pdf_${timestamp}.pdf`;
    
    const imagePath = path.join(uploadDir, imageName);
    const pdfPath = path.join(uploadDir, pdfName);

    // Save files
    fs.writeFileSync(imagePath, imageFile.buffer);
    fs.writeFileSync(pdfPath, pdfFile.buffer);

    return this.create({
      patientId,
      description,
      reportLink,
      labId,
      imagePath: `uploads/lab-reports/${imageName}`,
      pdfPath: `uploads/lab-reports/${pdfName}`
    });
  }

  async findAll(patientId?: number, labId?: number) {
    const where: any = {};
    
    if (patientId) where.patientId = patientId;
    if (labId) where.labId = labId;

    return this.prisma.labReport.findMany({
      where,
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNo: true
              }
            }
          }
        },
        lab: {
          select: {
            id: true,
            name: true,
            contactNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const labReport = await this.prisma.labReport.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNo: true
              }
            }
          }
        },
        lab: {
          select: {
            id: true,
            name: true,
            contactNumber: true
          }
        }
      }
    });

    if (!labReport) {
      throw new NotFoundException(`Lab report with ID ${id} not found`);
    }

    return labReport;
  }

  async update(id: number, updateLabReportDto: UpdateLabReportDto) {
    const existingReport = await this.findOne(id);

    // Verify patient exists if updating patientId
    if (updateLabReportDto.patientId) {
      const patient = await this.prisma.patient.findUnique({
        where: { id: updateLabReportDto.patientId }
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${updateLabReportDto.patientId} not found`);
      }
    }

    // Verify lab exists if updating labId
    if (updateLabReportDto.labId) {
      const lab = await this.prisma.lab.findUnique({
        where: { id: updateLabReportDto.labId }
      });

      if (!lab) {
        throw new NotFoundException(`Lab with ID ${updateLabReportDto.labId} not found`);
      }
    }

    return this.prisma.labReport.update({
      where: { id },
      data: updateLabReportDto,
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNo: true
              }
            }
          }
        },
        lab: {
          select: {
            id: true,
            name: true,
            contactNumber: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const labReport = await this.findOne(id);

    // Delete associated files
    if (labReport.imagePath && fs.existsSync(labReport.imagePath)) {
      fs.unlinkSync(labReport.imagePath);
    }
    if (labReport.pdfPath && fs.existsSync(labReport.pdfPath)) {
      fs.unlinkSync(labReport.pdfPath);
    }

    return this.prisma.labReport.delete({
      where: { id }
    });
  }
}
