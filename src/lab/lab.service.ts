import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { CreateComplaintDto } from '../complaint/dto/create-complaint.dto';
import { Complaint } from '@prisma/client';

@Injectable()
export class LabService {
  constructor(private prisma: PrismaService) {}

  async createComplaint(dto: CreateComplaintDto, userId: string): Promise<Complaint> {
    // Generate a unique complaint ID
    const complaintId = `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return this.prisma.complaint.create({
      data: {
        complaintId: complaintId,
        complaintText: dto.complaint_text,
        userId: userId,
        title: dto.title || 'Lab Complaint',
        description: dto.description || '',
        category: dto.category || 'LAB',
        priority: dto.priority || 'MEDIUM',
        status: 'OPEN',
      },
    });
  }
   async getLabUserProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        contactNo: true,
        gender: true,
        roles: true,
        address: true,
        nic: true,
        dob: true,
        labAdmin: {
          select: {
            id: true,
            userId: true,
          }
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.roles !== 'LAB_ADMIN') {
      throw new Error('User is not a Lab Admin');
    }

    return user;
   }  

  async getLabProfileByUserId(userId: string) {
    // First verify the user is a Lab Admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, roles: true, name: true, email: true, contactNo: true, address: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.roles !== 'LAB_ADMIN') {
      throw new Error('User is not a Lab Admin');
    }

    // Try to find an existing lab for this user
    const existingLab = await this.prisma.lab.findUnique({
      where: { userId: userId },
    });

    if (existingLab) {
      // Return the existing lab data
      return {
        id: existingLab.id,
        name: existingLab.name,
        registrationNumber: existingLab.registrationNumber,
        contactNumber: existingLab.contactNumber,
        website: existingLab.website,
        address: existingLab.address,
        description: existingLab.description,
        certificate: existingLab.certificate,
        userId: existingLab.userId,
      };
    }

    // If no lab exists, create one with proper data
    const newLab = await this.prisma.lab.create({
      data: {
        name: `${user.name}'s Lab`,
        registrationNumber: 'REG-' + user.id.slice(0, 8),
        contactNumber: user.contactNo,
        website: `https://${user.name.toLowerCase().replace(/\s+/g, '-')}-lab.com`,
        address: user.address,
        description: `Lab profile for ${user.name}`,
        certificate: `CERT-LAB-2024-${Date.now().toString().slice(-3)}`,
        userId: user.id,
      },
    });

    // Also create/update the LabAdmin record
    const labAdmin = await this.prisma.labAdmin.findUnique({
      where: { userId: userId },
    });

    if (labAdmin) {
      // Update existing LabAdmin to link to the new lab
      await this.prisma.labAdmin.update({
        where: { userId: userId },
        data: { labId: newLab.id },
      });
    } else {
      // Create new LabAdmin record
      await this.prisma.labAdmin.create({
        data: {
          userId: userId,
          labId: newLab.id,
        },
      });
    }

    return {
      id: newLab.id,
      name: newLab.name,
      registrationNumber: newLab.registrationNumber,
      contactNumber: newLab.contactNumber,
      website: newLab.website,
      address: newLab.address,
      description: newLab.description,
      certificate: newLab.certificate,
      userId: newLab.userId,
    };
  }

  async getAllLabReports() {
    return this.prisma.labReport.findMany();
  }

  async createLabReport(data: { patientId: number; description: string; reportLink?: string; imagePath?: string; pdfPath?: string }) {
    await this.prisma.labReport.create({
      data: {
        // Using available fields from the current client
        description: data.description,
        reportLink: data.reportLink,
        imagePath: data.imagePath,
        pdfPath: data.pdfPath,
        patientId: data.patientId,
      },
    });
    return { message: 'Lab report created successfully' };
  }

  async deleteLabReport(reportId: string) {
    try {
      const id = parseInt(reportId);
      if (isNaN(id)) {
        return { error: 'Invalid report ID', status: 400 };
      }

      // Find the report first
      const report = await this.prisma.labReport.findUnique({
        where: { id },
      });

      if (!report) {
        return { error: 'Lab report not found', status: 404 };
      }

      // Delete the report
      await this.prisma.labReport.delete({
        where: { id },
      });

      return { message: 'Lab report deleted successfully' };
    } catch (error) {
      return { error: 'Failed to delete lab report', details: error.message };
    }
  }
}
