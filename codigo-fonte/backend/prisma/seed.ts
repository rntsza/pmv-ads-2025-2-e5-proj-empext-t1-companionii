/* prisma/seed.ts */
import { PrismaClient, Role, BoardStatus, TaskPriority } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Defaults for non-production environments
const DEV_DEFAULTS = {
  ADMIN_ID: '11111111-1111-1111-1111-111111111111',
  COLLAB_ID: '22222222-2222-2222-2222-222222222222',
  COMPANY_ID: '33333333-3333-3333-3333-333333333333',
  PROJECT_ID: '44444444-4444-4444-4444-444444444444',

  // Some fixed tasks to make the board alive
  TASK_TODO_ID: '77777777-7777-7777-7777-777777777777',
  TASK_PROGRESS_ID: '88888888-8888-8888-8888-888888888888',
  TASK_REVIEW_ID: '99999999-9999-9999-9999-999999999999',
  TASK_DONE_ID: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
};

// Baseline tags used in both DEV and PRODUCTION
const BASE_TAGS: Array<{ name: string; colorHex: string }> = [
  { name: 'DevOps', colorHex: '#22c55e' },
  { name: 'Backend', colorHex: '#0ea5e9' },
  { name: 'Frontend', colorHex: '#f59e0b' },
  { name: 'Design', colorHex: '#a78bfa' },
  { name: 'QA', colorHex: '#10b981' },
  { name: 'Infra', colorHex: '#ef4444' },
  { name: 'Docs', colorHex: '#6366f1' },
  { name: 'Research', colorHex: '#06b6d4' },
  { name: 'Bug', colorHex: '#dc2626' },
  { name: 'Feature', colorHex: '#84cc16' },
  { name: 'Enhance', colorHex: '#14b8a6' },
];

function minusMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() - minutes * 60_000);
}

async function createAdminByEnv() {
  const adminEmail = (process.env.ADMIN_EMAIL as string) || 'admin@test.dev';
  const adminPass = (process.env.ADMIN_PASSWORD as string) || 'dev';
  const passwordHash = await bcrypt.hash(adminPass, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });
  return admin;
}

// Ensure baseline tags exist for a given project
async function ensureBaselineTags(projectId: string) {
  for (const spec of BASE_TAGS) {
    await prisma.tag.upsert({
      where: { projectId_name: { projectId, name: spec.name } },
      update: { colorHex: spec.colorHex },
      create: { projectId, name: spec.name, colorHex: spec.colorHex },
    });
  }
}

// Create a collaborator (dev only)
async function ensureDevCollaborator(id: string) {
  return prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      name: 'Colaborador',
      email: 'colaborador@test.dev',
      passwordHash: await bcrypt.hash('dev', 10),
      role: Role.COLLABORATOR,
    },
  });
}

async function seedDevData(adminId: string) {
  const {
    COLLAB_ID,
    COMPANY_ID,
    PROJECT_ID,
    TASK_TODO_ID,
    TASK_PROGRESS_ID,
    TASK_REVIEW_ID,
    TASK_DONE_ID,
  } = DEV_DEFAULTS;

  // Collaborator
  const collab = await ensureDevCollaborator(COLLAB_ID);

  // Company
  await prisma.company.upsert({
    where: { id: COMPANY_ID },
    update: {},
    create: {
      id: COMPANY_ID,
      ownerId: adminId,
      name: 'PUC',
      description: 'Empresa/cliente para testes',
      colorHex: '#3498db',
    },
  });

  // Company memberships
  await prisma.companyMember.upsert({
    where: { userId_companyId: { userId: adminId, companyId: COMPANY_ID } },
    update: {},
    create: { userId: adminId, companyId: COMPANY_ID, role: Role.ADMIN },
  });
  await prisma.companyMember.upsert({
    where: { userId_companyId: { userId: collab.id, companyId: COMPANY_ID } },
    update: {},
    create: {
      userId: collab.id,
      companyId: COMPANY_ID,
      role: Role.COLLABORATOR,
    },
  });

  // Project
  await prisma.project.upsert({
    where: { id: PROJECT_ID },
    update: {},
    create: {
      id: PROJECT_ID,
      name: 'Kanban do Renato',
      description: 'Seria legal ter um dark mode pra deixar o Renato feliz',
      colorHex: '#8b5cf6',
      companyId: COMPANY_ID,
      createdById: adminId,
    },
  });

  // Project memberships
  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: adminId, projectId: PROJECT_ID } },
    update: {},
    create: { userId: adminId, projectId: PROJECT_ID, role: Role.ADMIN },
  });
  await prisma.projectMember.upsert({
    where: { userId_projectId: { userId: collab.id, projectId: PROJECT_ID } },
    update: {},
    create: {
      userId: collab.id,
      projectId: PROJECT_ID,
      role: Role.COLLABORATOR,
    },
  });

  // === BASELINE TAGS (dev) ===
  await ensureBaselineTags(PROJECT_ID);

  // Pull created tags for ids
  const tags = await prisma.tag.findMany({ where: { projectId: PROJECT_ID } });
  const tagId = (name: string) => tags.find((t) => t.name === name)!.id;

  // Tasks in different columns
  const now = new Date();
  await prisma.task.upsert({
    where: { id: TASK_TODO_ID },
    update: {},
    create: {
      id: TASK_TODO_ID,
      projectId: PROJECT_ID,
      title: 'Planejar backlog inicial',
      description: 'Mapear épicos e quebrar em tarefas',
      status: BoardStatus.TODO,
      priority: TaskPriority.MEDIUM,
      estimatedMin: 120,
      dueDate: minusMinutes(now, -60), // +1h
      position: 1,
      statusChangedAt: now,
      createdById: adminId,
      assigneeId: collab.id,
      tags: { create: [{ tagId: tagId('Docs') }, { tagId: tagId('Feature') }] },
    },
  });

  await prisma.task.upsert({
    where: { id: TASK_PROGRESS_ID },
    update: {},
    create: {
      id: TASK_PROGRESS_ID,
      projectId: PROJECT_ID,
      title: 'Configurar CI/CD',
      description: 'Pipeline básico com testes e lint',
      status: BoardStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      estimatedMin: 150,
      startedAt: minusMinutes(now, 180),
      actualMin: 60,
      position: 1,
      statusChangedAt: minusMinutes(now, 180),
      createdById: adminId,
      assigneeId: collab.id,
      tags: { create: [{ tagId: tagId('DevOps') }, { tagId: tagId('QA') }] },
    },
  });

  await prisma.task.upsert({
    where: { id: TASK_REVIEW_ID },
    update: {},
    create: {
      id: TASK_REVIEW_ID,
      projectId: PROJECT_ID,
      title: 'Tela do Kanban',
      description: 'Quadro com colunas e DnD',
      status: BoardStatus.REVIEW,
      priority: TaskPriority.MEDIUM,
      startedAt: minusMinutes(now, 240),
      actualMin: 90,
      position: 1,
      statusChangedAt: minusMinutes(now, 30),
      createdById: adminId,
      assigneeId: collab.id,
      tags: {
        create: [{ tagId: tagId('Frontend') }, { tagId: tagId('Design') }],
      },
    },
  });

  await prisma.task.upsert({
    where: { id: TASK_DONE_ID },
    update: {},
    create: {
      id: TASK_DONE_ID,
      projectId: PROJECT_ID,
      title: 'Reunião de kick-off',
      description: 'Alinhar escopo e milestones',
      status: BoardStatus.DONE,
      priority: TaskPriority.LOW,
      actualMin: 45,
      completedAt: minusMinutes(now, 300),
      position: 1,
      statusChangedAt: minusMinutes(now, 300),
      createdById: adminId,
      assigneeId: collab.id,
      tags: {
        create: [{ tagId: tagId('Research') }, { tagId: tagId('Infra') }],
      },
    },
  });

  // Time logs
  await prisma.taskTimeLog.create({
    data: {
      taskId: TASK_PROGRESS_ID,
      startTime: minusMinutes(now, 150),
      endTime: minusMinutes(now, 90),
      durationMin: 60,
      notes: 'Setup pipeline',
    },
  });
  await prisma.taskTimeLog.create({
    data: {
      taskId: TASK_REVIEW_ID,
      startTime: minusMinutes(now, 210),
      endTime: minusMinutes(now, 120),
      durationMin: 90,
      notes: 'Implementação UI/Drag',
    },
  });
  await prisma.taskTimeLog.create({
    data: {
      taskId: TASK_DONE_ID,
      startTime: minusMinutes(now, 345),
      endTime: minusMinutes(now, 300),
      durationMin: 45,
      notes: 'Reunião inicial',
    },
  });
}

async function seedProdTagsForAllProjects() {
  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
  });
  if (!projects.length) {
    console.log(
      'ℹ️ Production: no projects found — tags will be created when projects exist.',
    );
    return;
  }
  for (const p of projects) {
    await ensureBaselineTags(p.id);
    console.log(`✅ Baseline tags ensured for project: ${p.name} (${p.id})`);
  }
}

async function main() {
  const isProd = process.env.NODE_ENV === 'production';

  // Always ensure admin using env credentials
  const admin = await createAdminByEnv();

  if (isProd) {
    await seedProdTagsForAllProjects();
    console.log('🌱 Production seed: admin ensured and baseline tags applied.');
    console.log('✅ Seed successfully:', { admin: admin.email });
    return;
  }

  // Dev / Staging: build out full demo workspace
  await seedDevData(admin.id);

  console.log('✅ Seed DEV successfully:', {
    admin: admin.email,
    tips: 'Use the Postman collection to test RBAC & CRUDs.',
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
