import { ActivityType } from '@prisma/client';

type Diff = Record<string, { from: any; to: any }>;

export function buildDiff(
  before: any,
  after: any,
  keys: string[],
): Diff | undefined {
  const out: Diff = {};
  for (const k of keys) {
    const from = before?.[k];
    const to = after?.[k];
    if (JSON.stringify(from) !== JSON.stringify(to)) {
      out[k] = { from, to };
    }
  }
  return Object.keys(out).length ? out : undefined;
}

export function formatMessage(params: {
  type: ActivityType;
  actorName?: string;
  before?: any;
  after?: any;
  diff?: Diff;
}) {
  const who = params.actorName ? `${params.actorName} ` : '';
  switch (params.type) {
    case 'CREATE':
      return `${who}criou a tarefa.`;
    case 'UPDATE':
      return `${who}editou a tarefa (${Object.keys(params.diff ?? {}).join(', ')}).`;
    case 'MOVE':
      return `${who}moveu a tarefa de ${params.diff?.status?.from} para ${params.diff?.status?.to}.`;
    case 'STATUS_CHANGE':
      return `${who}alterou o status: ${params.diff?.status?.from} → ${params.diff?.status?.to}.`;
    case 'TAG_ADD':
      return `${who}adicionou tags: ${(params.diff?.tags?.to ?? []).join(', ')}.`;
    case 'TAG_REMOVE':
      return `${who}removeu tags: ${(params.diff?.tags?.from ?? []).join(', ')}.`;
    case 'DELETE':
      return `${who}removeu a tarefa.`;
    case 'COMMENT':
      return `${who}comentou na tarefa.`;
    default:
      return `${who}atualizou a tarefa.`;
  }
}
