import { z } from 'zod';

export const AiReportSchema = z.object({
  scope: z.enum(['all', 'project']),
  period: z.enum(['daily', 'weekly', 'monthly']),
  generatedAt: z.string(),
  metrics: z.object({
    tasksCompleted: z.number(),
    totalTasks: z.number(),
    productivity: z.number(),
    hoursWorked: z.string(),
    efficiency: z.number(),
  }),
  tasks: z.array(
    z.object({
      title: z.string(),
      project: z.string().nullable(),
      timeSpent: z.string(),
      status: z.enum(['completed', 'in_progress']),
    }),
  ),
  aiInsights: z.object({
    summary: z.string(),
    recommendations: z.array(z.string()).default([]),
    risks: z.array(z.string()).optional(),
    opportunities: z.array(z.string()).optional(),
  }),
  priorityDistribution: z
    .array(
      z.object({
        priority: z.enum(['URGENT', 'HIGH', 'MEDIUM', 'LOW']),
        count: z.number(),
        percentage: z.number(),
      }),
    )
    .default([]),
});

export type AiReportSchemaType = z.infer<typeof AiReportSchema>;
