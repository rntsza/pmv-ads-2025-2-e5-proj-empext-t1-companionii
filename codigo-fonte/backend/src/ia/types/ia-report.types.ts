export type AIReportScope = 'all' | 'project';
export type AIReportPeriod = 'daily' | 'weekly' | 'monthly';

export interface AIInsightBlock {
  summary: string;
  recommendations: string[];
  risks?: string[];
  opportunities?: string[];
}

export interface AITaskItem {
  title: string;
  project: string | null;
  timeSpent: string; // "2h 15m"
  status: 'completed' | 'in_progress';
}

export interface AIPrioritySlice {
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  count: number;
  percentage: number; // 0..100
}

export interface AIReportData {
  scope: AIReportScope;
  period: AIReportPeriod;
  generatedAt: string; // ISO
  metrics: {
    tasksCompleted: number;
    totalTasks: number;
    productivity: number; // 0..100
    hoursWorked: string; // "6h 30m"
    efficiency: number; // 0..100
  };
  tasks: AITaskItem[];
  aiInsights: AIInsightBlock;
  priorityDistribution: AIPrioritySlice[];
}
