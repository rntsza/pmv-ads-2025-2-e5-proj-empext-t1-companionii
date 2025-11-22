import { api, handleApiError } from './api';

export const projectsService = {
  listAllSelect: async (params = {}) => {
    try {
      const res = await api.get('/projects/select', { params });
      return res.data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description ?? '',
        color: p.colorHex ?? '#3B82F6',
        companyId: p.companyId ?? null,
        companyName: p.company?.name ?? null,
        client: p.company?.name ?? null,
        company: p.company ? { id: p.company.id, name: p.company.name } : null,
        tasksCount: p._count?.tasks ?? 0,
      }));
    } catch (err) {
      handleApiError(err);
    }
  },

  create: async ({
    name,
    client, // vem do form (nome da empresa/cliente)
    description,
    color,
    companyId, // opcional (se vier de outro fluxo)
  }) => {
    try {
      const payload = {
        name,
        description,
        colorHex: color,
      };
      if (companyId) payload.companyId = companyId;
      if (client) payload.clientName = client; // backend fará upsert da Company

      const res = await api.post('/projects', payload);
      return res.data;
    } catch (err) {
      // Tratamento específico de 403 (apenas ADMIN pode criar)
      if (err.response.status === 403) {
        throw new Error(
          'Permissão negada. Apenas administradores podem criar projetos.',
        );
      }
      handleApiError(err);
    }
  },

  listTagsByProject: async (projectId, q = '', take = '20') => {
    try {
      const res = await api.get(`/projects/${projectId}/tags`, {
        params: { q, take },
      });
      return res.data; // [{id,name,colorHex,createdAt}, ...]
    } catch (err) {
      handleApiError(err);
    }
  },

  listByCompany: async (params = {}) => {
    try {
      const res = await api.get('/projects/select', { params });
      return res.data.map(p => ({
        id: p.id,
        name: p.name,
        companyId: p.companyId ?? null,
        companyName: p.company?.name ?? null,
        tasksCount: p._count?.tasks ?? 0,
      }));
    } catch (err) {
      handleApiError(err);
    }
  },

  edit: async (projectId, data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        colorHex: data.color,
      };
      if (data.companyId) payload.companyId = data.companyId;
      if (data.client) payload.clientName = data.client;

      const res = await api.patch(`/projects/${projectId}`, payload);
      return res.data;
    } catch (err) {
      if (err.response?.status === 403) {
        throw new Error(
          'Permissão negada. Apenas administradores podem editar projetos.',
        );
      }
      handleApiError(err);
    }
  },

  delete: async projectId => {
    try {
      const res = await api.delete(`/projects/${projectId}`);
      return res.data;
    } catch (err) {
      if (err.response?.status === 403) {
        throw new Error(
          'Permissão negada. Apenas administradores podem excluir projetos.',
        );
      }
      handleApiError(err);
    }
  },
};
