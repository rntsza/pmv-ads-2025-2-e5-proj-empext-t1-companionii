import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { Prisma, TaskPriority, BoardStatus } from '@prisma/client';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { chromium } from 'playwright';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../ia/gemini.service';
import { AIReportData } from '../ia/types/ia-report.types';
import { GenerateReportDto, Period, Scope } from './dto/generate-report.dto';

type Facts = {
    scope: 'all' | 'project';
    projectId?: string | null;
    period: { start: string; end: string; label: 'daily' | 'weekly' | 'monthly' };
    totals: { tasks: number; minutes: number; byStatus: Record<BoardStatus, number>; byPriority: Record<TaskPriority, number>; };
    companies: any[];
    tasks: any[];
};

@Injectable()
export class ReportsService {
    private readonly defaultPrompt = "Você é um analista de produtividade. Analise os dados fornecidos e gere o relatório seguindo estritamente o Schema JSON. Preencha todos os campos.";

    constructor(
        private readonly prisma: PrismaService,
        private readonly gemini: GeminiService,
    ) {}

    async generate(dto: GenerateReportDto) {
        const { start, end } = this.resolveRange(dto); 
        const reportKey = this.buildKey(dto, start, end);

        const existing = await this.prisma.report.findFirst({
            where: { reportKey },
            select: { id: true, aiData: true },
        });

        if (existing?.aiData) {
            return {
                reportId: existing.id,
                data: existing.aiData as unknown as AIReportData,
            };
        }

        const tasks = await this.prisma.task.findMany({
            where: {
                ...(dto.scope === Scope.PROJECT ? { projectId: dto.projectId } : {}),
                OR: [
                    { createdAt: { gte: start, lte: end } },
                    { startedAt: { gte: start, lte: end } },
                    { completedAt: { gte: start, lte: end } },
                ],
            },
            include: {
                project: { include: { company: true } },
                timeLogs: { select: { durationMin: true } },
            },
            orderBy: [{ completedAt: 'desc' }, { createdAt: 'desc' }],
            take: 1000,
        });

        const agg = this.aggregate(tasks);

        const facts: Facts = {
            scope: dto.scope,
            projectId: dto.projectId ?? null,
            period: { start: start.toISOString(), end: end.toISOString(), label: dto.period },
            totals: agg.totals,
            companies: agg.companies,
            tasks: tasks.slice(0, 500).map((t: any) => ({
                id: t.id, title: t.title, company: t.project?.company?.name ?? null, project: t.project?.name ?? null, status: t.status, priority: t.priority ?? null, estimateMin: t.estimatedMin ?? null, actualMin: t.actualMin ?? null, startedAt: t.startedAt?.toISOString() ?? null, completedAt: t.completedAt?.toISOString() ?? null,
            })),
        };

        const systemUserId = await this.ensureSystemUserId();
        const promptToUse = process.env.AI_REPORT_PROMPT || this.defaultPrompt;

        const aiData = await this.gemini.jsonFromFacts(
            promptToUse,
            JSON.stringify(facts),
            systemUserId
        );

        const report = await this.prisma.report.create({
            data: {
                userId: systemUserId,
                companyId: null,
                title: aiData.title,
                aiData: aiData as unknown as Prisma.InputJsonValue,
                periodStart: start,
                periodEnd: end,
                totalTasks: agg.totals.tasks,
                totalMinutes: agg.totals.minutes,
                reportKey: reportKey,
            },
        });

        return { reportId: report.id, data: aiData };
    }

    async generatePdf(reportId: string): Promise<Buffer> {
        const report = await this.prisma.report.findUnique({
            where: { id: reportId },
        });

        if (!report || !report.aiData) {
            throw new Error('Relatório não encontrado ou dados da IA ausentes.');
        }

        const aiData = report.aiData as unknown as AIReportData;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${aiData.title || 'Relatório de Produtividade'}</title>
                <style> body { font-family: sans-serif; padding: 20px; } h1 { color: #5C6BC0; } </style>
            </head>
            <body>
                <h1>Relatório de Atividades - ${aiData.period}</h1>
                <p>Gerado em: ${new Date(aiData.generatedAt).toLocaleDateString()}</p>
                <div class="content">
                    <h2>Análise de Insights</h2>
                    <div>${aiData.result || 'Sem análise disponível.'}</div>
                </div>
            </body>
            </html>
        `;

        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle' });

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();
        return pdfBuffer;
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