import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { BoardStatus } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto, createdById: string) {
    return await this.prisma.project.create({
      data: { ...dto, createdById: createdById },
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
}
