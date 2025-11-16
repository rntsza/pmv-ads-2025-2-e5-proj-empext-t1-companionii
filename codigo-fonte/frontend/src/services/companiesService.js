import { api, handleApiError } from './api';

export const companiesService = {
  listAll: async () => {
    try {
      const res = await api.get('/companies');
      return res.data.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description ?? null,
        colorHex: c.colorHex,
        membersCount: c.members?.length ?? 0,
      }));
    } catch (err) {
      handleApiError(err);
    }
  },

  listOne: async companyId => {
    try {
      const res = await api.get(`/companies/${companyId}`);
      return {
        id: res.data.id,
        name: res.data.name,
        description: res.data.description ?? null,
        colorHex: res.data.colorHex,
        members:
          res.data.members?.map(m => ({
            id: m.user.id,
            name: m.user.name,
            imageUrl: m.user.imageUrl,
            role: m.role,
          })) ?? [],
      };
    } catch (err) {
      handleApiError(err);
    }
  },

  create: async ({ name, description, color }) => {
    try {
      const payload = {
        name,
        description,
        colorHex: color,
      };

      const res = await api.post('/companies', payload);
      return res.data;
    } catch (err) {
      if (err.response?.status === 403) {
        throw new Error(
          'Permissão negada. Apenas administradores podem criar empresas.',
        );
      }
      handleApiError(err);
    }
  },

  update: async (companyId, { name, description, color }) => {
    try {
      const payload = {
        name,
        description,
        colorHex: color,
      };

      const res = await api.patch(`/companies/${companyId}`, payload);
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },

  delete: async companyId => {
    try {
      const res = await api.delete(`/companies/${companyId}`);
      return res.data;
    } catch (err) {
      if (err.response?.status === 403) {
        throw new Error(
          'Permissão negada. Apenas administradores podem excluir empresas.',
        );
      }
      handleApiError(err);
    }
  },

  listMembers: async companyId => {
    try {
      const res = await api.get(`/companies/${companyId}/members`);
      return res.data.map(m => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        imageUrl: m.user.imageUrl,
        role: m.role,
      }));
    } catch (err) {
      handleApiError(err);
    }
  },

  addMember: async (companyId, { userId, role }) => {
    try {
      const res = await api.post(`/companies/${companyId}/members`, {
        userId,
        role,
      });
      return res.data;
    } catch (err) {
      handleApiError(err);
    }
  },
};
