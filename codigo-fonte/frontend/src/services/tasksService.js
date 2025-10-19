import { api, handleApiError } from './api';

const STATUS_MAP = {
  todo: 'TODO',
  'in-progress': 'IN_PROGRESS',
  review: 'REVIEW',
  done: 'DONE',
};

const PRIORITY_MAP = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  urgent: 'URGENT',
};

export const tasksService = {
  create: async form => {
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        projectId: form.projectId,
        status: STATUS_MAP[form.status || 'todo'],
        priority: PRIORITY_MAP[form.priority || 'medium'],
        dueDate: form.dueDate || undefined,
        estimatedMin: form.estimatedHours
          ? Math.round(Number(form.estimatedHours) * 60)
          : undefined,
        tags: form.tags || [],
      };

      const res = await api.post('/tasks', payload);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};
