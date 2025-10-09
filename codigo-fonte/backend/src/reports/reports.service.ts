import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ia/gemini.service';
import { GenerateReportDto, Period, Scope } from './dto/generate-report.dto';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { BoardStatus, TaskPriority } from '@prisma/client';

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
  private readonly tokenBudget = Number(
    process.env.AI_REPORT_MAX_OUTPUT_TOKENS || 2048,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  async generate(dto: GenerateReportDto) {
    const { start, end } = this.resolveRange(dto);
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

    // 3) Limit the size of the “facts” to avoid exceeding the budget
    const factsStr = this.shrinkFacts(JSON.stringify(facts), this.tokenBudget);

    // 4) Call IA -> HTML
    const html = await this.gemini.htmlFromFacts(this.basePrompt, factsStr);

    // 5) (Opcional) Persists report
    const report = await this.prisma.report.create({
      data: {
        userId: await this.ensureSystemUserId(),
        companyId: null,
        title: `Relatório ${dto.period === Period.DAILY ? 'Diário' : dto.period === Period.WEEKLY ? 'Semanal' : 'Mensal'}`,
        aiSummary: html,
        periodStart: start,
        periodEnd: end,
        totalTasks: agg.totals.tasks,
        totalMinutes: agg.totals.minutes,
      },
    });

    return { reportId: report.id, html };
  }

  private resolveRange(dto: { period: Period }) {
    const now = new Date();

    if (dto.period === Period.DAILY) {
      const start = startOfDay(now);
      const end = endOfDay(now);
      return { start, end };
    }

    if (dto.period === Period.WEEKLY) {
      // semana ISO: segunda-domingo (ajuste se quiser domingo-sábado)
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
    const byPriority: any = { alta: 0, media: 0, baixa: 0 };
    let minutes = 0;

    for (const t of tasks) {
      byStatus[t.status] = (byStatus[t.status] ?? 0) + 1;
      if (t.priority && ['alta', 'media', 'baixa'].includes(t.priority))
        byPriority[t.priority]++;
      minutes += t.actualMinutes ?? 0;
    }

    const companiesMap = new Map<string, any>();
    for (const t of tasks) {
      const c = t.company;
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
        p.minutes += t.actualMinutes ?? 0;
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

  /** shrink JSON to fit a simple character budget (~token ~= 4 chars) */
  private shrinkFacts(json: string, maxTokens: number) {
    const approxMaxChars = Math.floor(maxTokens * 4 * 0.9); // margem
    if (json.length <= approxMaxChars) return json;

    // safe cut: keeps header and part of the tasks
    const headEnd = json.indexOf('"tasks":');
    if (headEnd === -1) return json.slice(0, approxMaxChars);

    const head = json.slice(0, headEnd);
    const tasksStart = json.indexOf('[', headEnd);
    const tasksEnd = json.lastIndexOf(']');
    const tasksArr = JSON.parse(json.slice(tasksStart, tasksEnd + 1)) as any[];

    // keep max N tasks
    const keep = Math.max(20, Math.floor(tasksArr.length * 0.25));
    const trimmed = JSON.stringify(tasksArr.slice(0, keep));

    let candidate = `${head}"tasks":${trimmed}}`;
    if (candidate.length > approxMaxChars) {
      // shorter fallback: only headers
      candidate = `${head}"tasks":[]}`;
    }
    return candidate;
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
