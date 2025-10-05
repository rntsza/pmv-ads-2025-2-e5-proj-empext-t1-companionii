import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfDay, endOfDay, parseISO, isValid, subDays } from 'date-fns';
import { BoardStatus, TaskPriority } from '@prisma/client';
import {
  GenerateReportDto,
  Period,
  Scope,
} from '../reports/dto/generate-report.dto';

type ScopeQuery = {
  scope: 'all' | 'project';
  projectId?: string;
  date?: string;
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getHome(q: ScopeQuery) {
    const [projects, tasksSummary, hours, tasksList] = await Promise.all([
      this.getActiveProjects(q),
      this.getTodayTasksSummary(q),
      this.getTodayHours(q),
      this.getTodayTasksList(q),
    ]);

    return {
      cards: {
        projetosAtivos: projects.count,
        tarefasHoje: { done: tasksSummary.done, total: tasksSummary.total },
        horasHoje: hours, // { minutes, hours }
      },
      listas: {
        tarefasDeHoje: tasksList.items,
        projetosAtivos: projects.items,
      },
    };
  }

  async getActiveProjects(q: ScopeQuery) {
    // “Projetos ativos” = todos os projetos (ou 1 se filtrado)
    const whereProject: any = {
      ...(q.scope === 'project' && q.projectId ? { id: q.projectId } : {}),
    };

    const [count, items] = await Promise.all([
      this.prisma.project.count({ where: whereProject }),
      this.prisma.project.findMany({
        where: whereProject,
        select: { id: true, name: true, colorHex: true, companyId: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ]);

    return { count, items };
  }

  async getTodayTasksSummary(q: ScopeQuery) {
    const { start, end } = this.resolveDay(q.date);

    const base: any = {
      ...(q.scope === 'project' && q.projectId
        ? { projectId: q.projectId }
        : {}),
      OR: [
        { dueDate: { gte: start, lte: end } }, // programadas para hoje
        { completedAt: { gte: start, lte: end } }, // concluídas hoje
      ],
    };

    const [total, done] = await Promise.all([
      this.prisma.task.count({ where: base }),
      this.prisma.task.count({ where: { ...base, status: BoardStatus.DONE } }),
    ]);

    return { total, done };
  }

  async getTodayTasksList(q: ScopeQuery) {
    const { start, end } = this.resolveDay(q.date);

    const where: any = {
      ...(q.scope === 'project' && q.projectId
        ? { projectId: q.projectId }
        : {}),
      dueDate: { gte: start, lte: end }, // tarefas “do dia”
    };

    const items = await this.prisma.task.findMany({
      where,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        estimatedMin: true,
        actualMin: true,
        project: { select: { id: true, name: true } },
      },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
      take: 20,
    });

    return { items };
  }

  async getTodayHours(q: ScopeQuery) {
    const { start, end } = this.resolveDay(q.date);

    // Preferência: somar TaskTimeLog no período (por projeto quando filtrado)
    const sumLogs = await this.prisma.taskTimeLog.aggregate({
      _sum: { durationMin: true },
      where: {
        startTime: { gte: start, lte: end },
        ...(q.scope === 'project' && q.projectId
          ? { task: { projectId: q.projectId } }
          : {}),
      },
    });
    let minutes = sumLogs._sum.durationMin ?? 0;

    if (minutes === 0) {
      // Fallback: soma dos actualMin das tasks concluídas hoje
      const tasks = await this.prisma.task.findMany({
        where: {
          ...(q.scope === 'project' && q.projectId
            ? { projectId: q.projectId }
            : {}),
          completedAt: { gte: start, lte: end },
        },
        select: { actualMin: true },
      });
      minutes = tasks.reduce((acc, t) => acc + (t.actualMin ?? 0), 0);
    }

    return { minutes, hours: Number((minutes / 60).toFixed(2)) };
  }

  async getSummary(dto: GenerateReportDto) {
    const { start, end } = this.resolveRange(dto);

    const whereBase: any = {
      ...(dto.scope === Scope.PROJECT ? { projectId: dto.projectId } : {}),
      OR: [
        { createdAt: { gte: start, lte: end } },
        { startedAt: { gte: start, lte: end } },
        { completedAt: { gte: start, lte: end } },
      ],
    };

    const tasks = await this.prisma.task.findMany({
      where: whereBase,
      select: {
        status: true,
        priority: true,
        actualMin: true,
        estimatedMin: true,
        dueDate: true,
      },
    });

    const [inProgressCount, overdueCount] = await Promise.all([
      this.prisma.task.count({
        where: { ...whereBase, status: BoardStatus.IN_PROGRESS },
      }),
      this.prisma.task.count({
        where: {
          ...(dto.scope === Scope.PROJECT ? { projectId: dto.projectId } : {}),
          dueDate: { lt: end },
          status: { not: BoardStatus.DONE },
        },
      }),
    ]);

    const sumLogs = await this.prisma.taskTimeLog.aggregate({
      _sum: { durationMin: true },
      where: {
        startTime: { gte: start, lte: end },
        ...(dto.scope === Scope.PROJECT
          ? { task: { projectId: dto.projectId } }
          : {}),
      },
    });
    let minutes = sumLogs._sum.durationMin ?? 0;

    if (minutes === 0) {
      const tasksDone = tasks.filter((t) => t.status === BoardStatus.DONE);
      minutes = tasksDone.reduce((acc, t) => acc + (t.actualMin ?? 0), 0);
    }

    // Distribuição por prioridade (aderente ao enum)
    const priorityDist: Record<TaskPriority, number> = {
      [TaskPriority.LOW]: 0,
      [TaskPriority.MEDIUM]: 0,
      [TaskPriority.HIGH]: 0,
      [TaskPriority.URGENT]: 0,
    };
    for (const t of tasks) {
      if (t.priority) priorityDist[t.priority]++;
    }

    const totalTasks = tasks.length;

    const totalActual = tasks.reduce((acc, t) => acc + (t.actualMin ?? 0), 0);
    const totalEstimate = tasks.reduce(
      (acc, t) => acc + (t.estimatedMin ?? 0),
      0,
    );
    const eficienciaPct =
      totalEstimate > 0
        ? Number(((totalActual / totalEstimate) * 100).toFixed(1))
        : 100;

    return {
      distribuicaoPrioridade: priorityDist,
      produtividade: { minutos: minutes, totalTasks },
      eficiencia: { value: eficienciaPct },
      emProgresso: inProgressCount,
      atrasadas: overdueCount,
    };
  }

  private resolveDay(date?: string) {
    const base = date && isValid(parseISO(date)) ? parseISO(date) : new Date();
    return { start: startOfDay(base), end: endOfDay(base) };
  }

  private resolveRange(dto: GenerateReportDto) {
    if (dto.period === Period.CUSTOM) {
      if (!dto.startDate || !dto.endDate) {
        throw new Error('Período custom requer startDate e endDate');
      }
      return {
        start: startOfDay(new Date(dto.startDate)),
        end: endOfDay(new Date(dto.endDate)),
      };
    }
    if (dto.period === Period.DAILY) {
      const end = endOfDay(new Date());
      const start = startOfDay(new Date());
      return { start, end };
    }
    const end = endOfDay(new Date());
    const start = startOfDay(subDays(end, 6));
    return { start, end };
  }
}
