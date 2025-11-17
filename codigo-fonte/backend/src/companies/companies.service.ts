import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCompanyDto, ownerId: string) {
    return this.prisma.company.create({
      data: {
        name: dto.name,
        description: dto.description,
        colorHex: dto.colorHex ?? '#3498db',
        ownerId,
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        members: { include: { user: { select: { id: true, name: true, imageUrl: true } } } },
        reports: true,
        integrations: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, name: true, imageUrl: true } } } },
        reports: true,
        integrations: true,
      },
    });
  }

  async update(id: string, dto: UpdateCompanyDto) {
    return this.prisma.company.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.company.delete({ where: { id } });
  }

  async addMember(companyId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'COLLABORATOR' | 'CLIENT') {
    return this.prisma.companyMember.create({
      data: {
        companyId,
        userId,
        role,
      },
    });
  }

  async listMembers(companyId: string) {
    return this.prisma.companyMember.findMany({
      where: { companyId },
      include: { user: { select: { id: true, name: true, email: true, imageUrl: true } } },
    });
  }
}
