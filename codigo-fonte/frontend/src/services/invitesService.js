import { api, handleApiError } from './api';

/**
 * Serviço para gerenciar convites de colaboradores
 */
const invitesService = {
  /**
   * Cria um novo convite para colaborador
   * @param {Object} inviteData - Dados do convite
   * @param {string} inviteData.email - Email do usuário a ser convidado
   * @param {string} [inviteData.role] - Papel do usuário (COLLABORATOR, ADMIN)
   * @param {string} [inviteData.companyId] - ID da empresa associada
   * @returns {Promise<Object>} Dados do convite criado
   */
  async createInvite(inviteData) {
    try {
      const response = await api.post('/admin/invites', inviteData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Lista todos os convites
   * @returns {Promise<Array>} Lista de convites
   */
  async getAllInvites() {
    try {
      const response = await api.get('/admin/invites');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Revoga um convite existente
   * @param {string} inviteId - ID do convite a ser revogado
   * @returns {Promise<Object>} Dados do convite revogado
   */
  async revokeInvite(inviteId) {
    try {
      const response = await api.delete(`/admin/invites/${inviteId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default invitesService;
