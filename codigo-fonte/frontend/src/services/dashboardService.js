import { api, handleApiError } from './api';

export const dashboardsService = {
  summary: async ({ projectId, period }) => {
    try {
      const scope = projectId ? 'project' : 'all';
      const body = { scope, period };
      if (projectId) body.projectId = projectId;

      const res = await api.post('/dashboard/summary', body);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
  async home({ projectId, date }) {
    try {
      const scope = projectId ? 'project' : 'all';
      const res = await api.get('/dashboard/home', {
        params: { scope, projectId, date },
      });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};
