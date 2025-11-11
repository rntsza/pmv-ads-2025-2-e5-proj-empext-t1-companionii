import { api, handleApiError } from './api';

export const aiReportsService = {
  generate: async ({ projectId, period }) => {
    try {
      const scope = projectId ? 'project' : 'all';
      const body = { scope, period };
      if (projectId) body.projectId = projectId;

      const res = await api.post('/reports/ai', body);
      // { reportId, data }
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};
