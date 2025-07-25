import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Complaint } from '@prisma/client';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateComplaintDto, userId?: string, userEmail?: string): Promise<Complaint> {
    // Generate a unique complaint ID
    const complaintId = `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return this.prisma.complaint.create({
      data: {
        complaintId: complaintId,
        complaintText: dto.complaint_text,
        title: dto.title || 'Untitled',
        description: dto.description || '',
        category: dto.category || 'GENERAL',
        priority: dto.priority || 'MEDIUM',
        status: 'OPEN',
        userId: userId || null,
        userEmail: userEmail || null,
      },
    });
  }

  async findByUserEmail(userEmail: string): Promise<Complaint[]> {
    return this.prisma.complaint.findMany({
      where: { userEmail },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: string): Promise<Complaint[]> {
    return this.prisma.complaint.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<Complaint[]> {
    return this.prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
