import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ActivityType, BoardStatus } from '@prisma/client';
import { UpdateTaskDto } from './dto/update-task.dto';
import { buildDiff, formatMessage } from '../utils/activity-formatter';

type Diff = Record<string, { from: any; to: any }>;

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

    const created = await this.prisma.task.create({
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

    const formattedMessage = formatMessage({
      type: ActivityType.CREATE,
    });

    const snapshot = {
      id: created.id,
      title: created.title,
      description: created.description,
      status: created.status,
      priority: created.priority,
      dueDate: created.dueDate?.toISOString() ?? null,
      tags: created.tags?.map((t) => t.tag.name) ?? [],
    };

    await this.logActivity({
      taskId: created.id,
      actorId: createdById ?? null,
      type: ActivityType.CREATE,
      formattedMessage,
      diff: {
        created: { from: null, to: snapshot },
      },
    });

    return created;
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        project: {
          select: { company: { select: { name: true, colorHex: true } } },
        },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async list(filter: { projectId?: string; status?: BoardStatus }) {
    const where: any = {};
    if (filter.projectId && filter.projectId !== 'all')
      where.projectId = filter.projectId;
    if (filter.status) where.status = filter.status;

    return await this.prisma.task.findMany({
      where,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      include: {
        tags: { include: { tag: true } },
        project: {
          select: { company: { select: { name: true, colorHex: true } } },
        },
      },
    });
  }

  async update(id: string, dto: UpdateTaskDto, actorId: string) {
    const before = await this.prisma.task.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    if (!before) throw new NotFoundException('Task not found');

    const { tags, ...rest } = dto as UpdateTaskDto & { tags?: string[] };
    const data: any = { ...rest };

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

      const targetStatus = rest.status!;
      const max = await this.prisma.task.aggregate({
        where: { projectId: before.projectId, status: targetStatus },
        _max: { position: true },
      });
      data.position = (max._max.position ?? 0) + 1;
    }

    if (rest.dueDate) data.dueDate = new Date(rest.dueDate);

    const updated = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        tags: { include: { tag: true } },
        project: {
          select: { company: { select: { name: true, colorHex: true } } },
        },
      },
    });

    if (Array.isArray(tags)) {
      await this.setTags(id, tags);
    }

    const diff = buildDiff(
      {
        title: before.title,
        description: before.description,
        status: before.status,
        priority: before.priority,
        dueDate: before.dueDate?.toISOString(),
        tags: before.tags?.map((t) => t.tag.name).sort(),
      },
      {
        title: updated.title,
        description: updated.description,
        status: updated.status,
        priority: updated.priority,
        dueDate: updated.dueDate?.toISOString(),
        tags: updated.tags?.map((t) => t.tag.name).sort(),
      },
      ['title', 'description', 'status', 'priority', 'dueDate', 'tags'],
    );

    const type = diff?.status
      ? ActivityType.STATUS_CHANGE
      : diff?.tags &&
          !diff?.title &&
          !diff?.description &&
          !diff?.priority &&
          !diff?.dueDate
        ? diff.tags.from?.length < (diff.tags.to?.length ?? 0)
          ? ActivityType.TAG_ADD
          : ActivityType.TAG_REMOVE
        : ActivityType.UPDATE;

    const formattedMessage = formatMessage({
      type,
      diff,
    });

    await this.logActivity({
      taskId: id,
      actorId,
      type,
      diff,
      formattedMessage,
    });

    return updated;
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

  async listActivitiesByTask(
    taskId: string,
    opts: { cursor?: string; take?: number },
  ) {
    const take = Math.min(Math.max(opts?.take ?? 20, 1), 100);
    return this.prisma.taskActivity.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      take,
      ...(opts?.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
      include: {
        actor: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async logActivity(params: {
    taskId: string;
    actorId: string | null;
    type: ActivityType;
    diff?: Diff;
    formattedMessage: string;
  }) {
    const { taskId, actorId, type, diff, formattedMessage } = params;
    return this.prisma.taskActivity.create({
      data: { taskId, actorId, type, diff, formattedMessage },
    });
  }
}
