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
      select: { id: true, roles: true, name: true, email: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.roles !== 'LAB_ADMIN') {
      throw new Error('User is not a Lab Admin');
    }

    // Try to find a lab associated with this user
    const labAdmin = await this.prisma.labAdmin.findUnique({
      where: { userId: userId },
    });

    if (!labAdmin) {
      // If no lab admin record exists, create a basic response
      return {
        id: user.id,
        name: `${user.name}'s Lab`,
        registrationNumber: 'REG-' + user.id.slice(0, 8),
        contactNumber: null,
        website: null,
        address: null,
        description: `Lab profile for ${user.name}`,
        certificate: null,
        userId: user.id,
      };
    }

    // Return lab profile with labAdmin data
    return {
      id: labAdmin.id,
      name: `${user.name}'s Lab`,
      registrationNumber: 'REG-' + labAdmin.id.toString(),
      contactNumber: null,
      website: null,
      address: null,
      description: `Lab profile for ${user.name}`,
      certificate: null,
      userId: user.id,
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
