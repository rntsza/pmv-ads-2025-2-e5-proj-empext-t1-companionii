import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { BoardStatus, Prisma, TaskPriority } from '@prisma/client';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ia/gemini.service';
import { AIReportData } from '../ia/types/ia-report.types';
import { GenerateReportDto, Period, Scope } from './dto/generate-report.dto';

type Facts = {
  scope: 'all' | 'project';
  projectId?: string | null;
  period: { start: string; end: string; label: 'daily' | 'weekly' | 'monthly' };
  totals: {
    tasks: number;
    minutes: number;
    byStatus: Record<BoardStatus, number>;
    byPriority: Record<TaskPriority, number>;
  };
  companies: Array<{
    id: string;
    name: string;
    colorHex: string;
    totals: { tasks: number; minutes: number };
    projects?: Array<{
      id: string;
      name: string;
      tasks: number;
      minutes: number;
    }>;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    company: string | null;
    project: string | null;
    status: BoardStatus;
    priority: TaskPriority | null;
    estimateMin: number | null;
    actualMin: number | null;
    startedAt?: string | null;
    completedAt?: string | null;
  }>;
};

@Injectable()
export class ReportsService {
  private readonly basePrompt = process.env.AI_REPORT_PROMPT!;

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  async generate(dto: GenerateReportDto) {
    const { start, end } = this.resolveRange(dto);

    // unique fingerprint for caching by period and scope
    const reportKey = this.buildKey(dto, start, end);

    // 0) try to find an existing report
    const existing = await this.prisma.report.findFirst({
      where: { reportKey },
      select: { id: true, aiData: true },
    });

    if (existing?.aiData)
      return {
        reportId: existing.id,
        data: existing.aiData as unknown as AIReportData,
      };

    // 1) Fetch tasks + minimal joins for filters
    const tasks = await this.prisma.task.findMany({
      where: {
        ...(dto.scope === Scope.PROJECT ? { projectId: dto.projectId } : {}),
        // considers tasks created, started, or completed within the period
        OR: [
          { createdAt: { gte: start, lte: end } },
          { startedAt: { gte: start, lte: end } },
          { completedAt: { gte: start, lte: end } },
        ],
      },
      include: {
        project: { include: { company: true } },
        timeLogs: {
          where: { startTime: { gte: start, lte: end } },
          select: { durationMin: true },
        },
      },
      orderBy: [{ completedAt: 'desc' }, { createdAt: 'desc' }],
      take: 1000,
    });

    // 2) Aggregate for UI (and for AI)
    const agg = this.aggregate(tasks);

    const facts: Facts = {
      scope: dto.scope,
      projectId: dto.projectId ?? null,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        label: dto.period,
      },
      totals: agg.totals,
      companies: agg.companies,
      tasks: tasks.slice(0, 500).map((t) => ({
        id: t.id,
        title: t.title,
        company: t.project?.company?.name ?? null,
        project: t.project?.name ?? null,
        status: t.status,
        priority: t.priority ?? null,
        estimateMin: t.estimatedMin ?? null,
        actualMin: t.actualMin ?? null,
        startedAt: t.startedAt?.toISOString() ?? null,
        completedAt: t.completedAt?.toISOString() ?? null,
      })),
    };

    // 3) Call IA -> structured JSON
    const aiData = await this.gemini.jsonFromFacts(
      this.basePrompt,
      JSON.stringify(facts),
    );
    const aiDataClean = JSON.parse(JSON.stringify(aiData)) as unknown;
    const aiPayload: Prisma.InputJsonValue =
      aiDataClean as Prisma.InputJsonValue;

    // 5) (Opcional) Persists report
    const title = `Relatório ${dto.period === Period.DAILY ? 'Diário' : dto.period === Period.WEEKLY ? 'Semanal' : 'Mensal'}`;
    const report = await this.prisma.report.create({
      data: {
        userId: await this.ensureSystemUserId(),
        companyId: null,
        title,
        aiData: aiPayload,
        periodStart: start,
        periodEnd: end,
        totalTasks: agg.totals.tasks,
        totalMinutes: agg.totals.minutes,
        reportKey,
      },
    });

    return { reportId: report.id, data: aiData };
  }

  private buildKey(dto: GenerateReportDto, start: Date, end: Date) {
    const raw = `${dto.scope}:${dto.projectId ?? 'all'}:${start.toISOString()}:${end.toISOString()}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  private resolveRange(dto: { period: Period }) {
    const now = new Date();

    if (dto.period === Period.DAILY) {
      const start = startOfDay(now);
      const end = endOfDay(now);
      return { start, end };
    }

    if (dto.period === Period.WEEKLY) {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      return { start, end };
    }

    // MONTHLY
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return { start, end };
  }

  private aggregate(tasks: any[]) {
    const byStatus: Record<string, number> = {};
    const byPriority: Record<TaskPriority, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };
    let minutes = 0;

    for (const t of tasks) {
      byStatus[t.status] = (byStatus[t.status] ?? 0) + 1;
      if (t.priority)
        (byPriority as any)[t.priority] =
          ((byPriority as any)[t.priority] ?? 0) + 1;
      minutes +=
        (t.actualMin ?? 0) ||
        (t.timeLogs?.reduce(
          (a: number, l: any) => a + (l.durationMin ?? 0),
          0,
        ) ??
          0);
    }

    const companiesMap = new Map<string, any>();
    for (const t of tasks) {
      const c = t.project?.company;
      if (!c) continue;
      const entry = companiesMap.get(c.id) ?? {
        id: c.id,
        name: c.name,
        colorHex: c.colorHex,
        totals: { tasks: 0, minutes: 0 },
        projects: new Map(),
      };
      entry.totals.tasks++;
      entry.totals.minutes += t.actualMinutes ?? 0;
      if (t.project) {
        const p = entry.projects.get(t.project.id) ?? {
          id: t.project.id,
          name: t.project.name,
          tasks: 0,
          minutes: 0,
        };
        p.tasks++;
        p.minutes += t.actualMin ?? 0;
        entry.projects.set(t.project.id, p);
      }
      companiesMap.set(c.id, entry);
    }

    const companies = [...companiesMap.values()].map((e) => ({
      id: e.id,
      name: e.name,
      colorHex: e.colorHex,
      totals: e.totals,
      projects: [...e.projects.values()],
    }));

    return {
      totals: {
        tasks: tasks.length,
        minutes,
        byStatus,
        byPriority,
      },
      companies,
    };
  }

  private async ensureSystemUserId(): Promise<string> {
    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    if (admin?.id) return admin.id;
    const user = await this.prisma.user.findFirst();
    if (!user) throw new Error('No user found in the database');
    return user.id;
  }
}
