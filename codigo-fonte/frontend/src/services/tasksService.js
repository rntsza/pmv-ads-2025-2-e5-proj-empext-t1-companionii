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
  list: async ({ projectId, status, q } = {}) => {
    try {
      const params = {};
      if (projectId && projectId !== 'all') params.projectId = projectId;
      if (status && status !== 'all')
        params.status = STATUS_MAP[status] || 'TODO';
      if (q) params.q = q;
      const res = await api.get('/tasks', { params });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  updateStatus: async (id, uiStatus) => {
    try {
      const status = STATUS_MAP[uiStatus] || 'TODO';
      const res = await api.patch(`/tasks/${id}`, { status });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

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
