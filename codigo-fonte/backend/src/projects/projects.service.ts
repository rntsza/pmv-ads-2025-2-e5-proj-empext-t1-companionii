import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { BoardStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto, createdById: string) {
    const companyId = await this.ensureCompanyId(dto, createdById);

    return await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        colorHex: dto.colorHex,
        companyId,
        createdById,
      },
    });
  }

  async findAll(filter: { companyId?: string }) {
    const where = filter.companyId
      ? { companyId: filter.companyId }
      : undefined;

    return await this.prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { name: true } },
        _count: { select: { tasks: true } },
      },
    });
  }

  async findAllSelect(filter: { companyId?: string }) {
    const where = filter.companyId
      ? { companyId: filter.companyId }
      : undefined;

    return await this.prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        companyId: true,
        company: { select: { id: true, name: true } },
        _count: { select: { tasks: true } },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.project.findUnique({
      where: { id },
      include: {
        company: true,
        members: {
          include: {
            user: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
    });
  }

  async listTags(projectId: string, opts?: { q?: string; take?: number }) {
    const where = {
      projectId,
      ...(opts?.q
        ? { name: { contains: opts.q, mode: 'insensitive' as const } }
        : {}),
    };

    return this.prisma.tag.findMany({
      where,
      select: { id: true, name: true, colorHex: true, createdAt: true },
      orderBy: [{ name: 'asc' }],
      take: opts?.take ?? 20,
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    return await this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return await this.prisma.project.delete({ where: { id } });
  }

  async metrics(projectId: string) {
    const byStatus = await this.prisma.task.groupBy({
      by: ['status'],
      where: { projectId },
      _count: { _all: true },
      _sum: { actualMin: true },
    });

    const total = byStatus.reduce((s, r) => s + r._count._all, 0);
    const done =
      byStatus.find((r) => r.status === BoardStatus.DONE)?._count._all ?? 0;
    const minutes = byStatus.reduce((s, r) => s + (r._sum.actualMin ?? 0), 0);

    return {
      totalTasks: total,
      doneTasks: done,
      totalHours: +(minutes / 60).toFixed(2),
      progress: total ? Math.round((done / total) * 100) : 0,
      byStatus,
    };
  }

  private async ensureCompanyId(dto: CreateProjectDto, createdById: string) {
    if (dto.companyId) return dto.companyId;

    if (dto.clientName) {
      const existing = await this.prisma.company.findFirst({
        where: { name: dto.clientName },
        select: { id: true },
      });

      if (existing) return existing.id;

      const created = await this.prisma.company.create({
        data: {
          name: dto.clientName,
          owner: { connect: { id: createdById } },
        },
        select: { id: true },
      });

      return created.id;
    }

    throw new BadRequestException(
      'Provide companyId or clientName to associate the project with a company.',
    );
  }

  async listByProjectsMember(userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return this.prisma.project.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      select: {
        id: true,
        name: true,
        colorHex: true,
        description: true,
        // company: {
        //   select: {
        //     id: true,
        //     name: true,
        //   },
        // },
      },
    });
  }
}