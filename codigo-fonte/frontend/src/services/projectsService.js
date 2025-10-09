import { api, handleApiError } from './api';

export const projectsService = {
  listAllSelect: async (params = {}) => {
    try {
      const res = await api.get('/projects/select', { params });
      return res.data.map(p => ({
        id: p.id,
        name: p.name,
        companyName: p.company?.name ?? null,
        tasksCount: p._count?.tasks ?? 0,
      }));
    } catch (err) {
      handleApiError(err);
    }
  },
};
