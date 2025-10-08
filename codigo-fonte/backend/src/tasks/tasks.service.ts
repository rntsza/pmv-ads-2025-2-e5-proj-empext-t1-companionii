import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { BoardStatus } from '@prisma/client';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto, createdById?: string) {
    const tagCreates = (dto.tags ?? []).map((name) => ({
      tag: {
        connectOrCreate: {
          where: { projectId_name: { projectId: dto.projectId, name } }, // UNIQUE de Tag
          create: { name, projectId: dto.projectId },
        },
      },
    }));

    return await this.prisma.task.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        status: dto.status ?? BoardStatus.TODO,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        estimatedMin: dto.estimatedMin,
        createdById: createdById ?? null,
        tags: tagCreates.length ? { create: tagCreates } : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  async list(filter: { projectId: string; status?: BoardStatus }) {
    return await this.prisma.task.findMany({
      where: { projectId: filter.projectId, status: filter.status },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      include: {
        tags: { include: { tag: true } },
        project: {
          select: { company: { select: { name: true, colorHex: true } } },
        },
      },
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    const before = await this.prisma.task.findUnique({ where: { id } });
    if (!before) throw new NotFoundException('Task not found');

    const data: any = { ...dto };

    const statusWillChange = dto.status && dto.status !== before.status;

    if (statusWillChange) {
      data.statusChangedAt = new Date();

      // startedAt/completedAt
      if (dto.status === BoardStatus.IN_PROGRESS && !before.startedAt) {
        data.startedAt = new Date();
      }
      if (dto.status === BoardStatus.DONE) {
        data.completedAt = new Date();

        const open = await this.prisma.taskTimeLog.findFirst({
          where: { taskId: id, endTime: null },
          orderBy: { startTime: 'desc' },
        });
        if (open) {
          const endTime = new Date();
          const duration = Math.max(
            0,
            Math.round((+endTime - +open.startTime) / 60000),
          );
          await this.prisma.$transaction([
            this.prisma.taskTimeLog.update({
              where: { id: open.id },
              data: { endTime, durationMin: duration },
            }),
            this.prisma.task.update({
              where: { id },
              data: { actualMin: { increment: duration } },
            }),
          ]);
        }
      } else if (before.status === BoardStatus.DONE) {
        data.completedAt = null;
      }

      const max = await this.prisma.task.aggregate({
        where: { projectId: before.projectId, status: dto.status! },
        _max: { position: true },
      });
      data.position = (max._max.position ?? 0) + 1;
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
      },
      include: { tags: { include: { tag: true } } },
    });
  }

  async remove(id: string) {
    return await this.prisma.task.delete({ where: { id } });
  }

  async setTags(taskId: string, tags: string[]) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const ensure = await Promise.all(
      tags.map((name) =>
        this.prisma.tag.upsert({
          where: { projectId_name: { projectId: task.projectId, name } },
          update: {},
          create: { projectId: task.projectId, name },
        }),
      ),
    );

    await this.prisma.taskTag.deleteMany({ where: { taskId } });
    await this.prisma.taskTag.createMany({
      data: ensure.map((t) => ({ taskId, tagId: t.id })),
      skipDuplicates: true,
    });

    return this.prisma.task.findUnique({
      where: { id: taskId },
      include: { tags: { include: { tag: true } } },
    });
  }

  async startTimer(taskId: string) {
    const open = await this.prisma.taskTimeLog.findFirst({
      where: { taskId, endTime: null },
    });
    if (open) throw new BadRequestException('Timer already running');
    return this.prisma.taskTimeLog.create({
      data: { taskId, startTime: new Date() },
    });
  }

  async stopTimer(taskId: string) {
    const open = await this.prisma.taskTimeLog.findFirst({
      where: { taskId, endTime: null },
      orderBy: { startTime: 'desc' },
    });
    if (!open) throw new BadRequestException('No running timer');

    const endTime = new Date();
    const duration = Math.max(
      0,
      Math.round((+endTime - +open.startTime) / 60000),
    );

    const [log] = await this.prisma.$transaction([
      this.prisma.taskTimeLog.update({
        where: { id: open.id },
        data: { endTime, durationMin: duration },
      }),
      this.prisma.task.update({
        where: { id: taskId },
        data: { actualMin: { increment: duration } },
      }),
    ]);
    return log;
  }
}
