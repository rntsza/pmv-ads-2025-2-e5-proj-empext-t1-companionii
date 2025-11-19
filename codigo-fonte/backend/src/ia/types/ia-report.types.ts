export enum IAReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface IAReportMetadata {
  tokensUsed?: number;
  model?: string;
  processingTimeMs?: number;
}

// --- Tipos de Dados Ricos do Relatório ---
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

// --- Interface Principal (Sistema + Dados Ricos) ---
export interface AIReportData {
  // Campos Obrigatórios do Sistema
  id: string;
  userId: string;
  title: string;
  prompt: string;
  status: IAReportStatus;
  result: string | null; 
  metadata?: IAReportMetadata;
  createdAt: Date;
  updatedAt: Date;
  
  // Campos de Dados Ricos (do seu novo design)
  scope?: AIReportScope;
  period?: AIReportPeriod;
  generatedAt: string; // ISO
  metrics?: {
    tasksCompleted: number;
    totalTasks: number;
    productivity: number; // 0..100
    hoursWorked: string; // "6h 30m"
    efficiency: number; // 0..100
  };
  tasks?: AITaskItem[];
  aiInsights?: AIInsightBlock;
  priorityDistribution?: AIPrioritySlice[];
}

export type CreateIAReportDTO = Pick<AIReportData, 'title' | 'prompt' | 'userId'> & {
  options?: Record<string, any>;
};

export type UpdateIAReportDTO = Partial<Pick<AIReportData, 'title' | 'result' | 'status' | 'metadata'>>;