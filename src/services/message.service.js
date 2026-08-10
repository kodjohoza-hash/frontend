import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Message Service (API réelle)
 * Endpoints (l'accès est TOUJOURS déduit côté serveur de req.user) :
 *   GET    /messages/conversations                  — conversations de l'utilisateur (page, limit)
 *   POST   /messages/conversations                  — nouvelle conversation (dédoublonnée)
 *   GET    /messages/conversations/:id              — détail d'une conversation
 *   PATCH  /messages/conversations/:id/read         — marquer la conversation comme lue
 *   GET    /messages/conversations/:id/messages     — messages paginés (ancien → récent)
 *   POST   /messages/conversations/:id/messages     — envoyer un message
 *   PATCH  /messages/:id/read                       — témoin de lecture d'un message reçu
 *   DELETE /messages/:id                            — supprimer son propre message
 *   GET    /messages/unread-count                   — nombre total de messages non lus
 *   GET    /messages/companies                      — compagnies actives (super_admin)
 *   GET    /messages/companies/:id/clients          — clients d'une compagnie (admin/super)
 */
const messageService = {
  getConversations: async ({ page = 1, limit = 20 } = {}) =>
    apiClient.get('/messages/conversations', { params: { page, limit } }),

  createConversation: async ({ subject, recipientType, recipientId, contextType, contextId } = {}) =>
    apiClient.post('/messages/conversations', {
      subject,
      recipient: { type: recipientType, id: recipientId },
      context: contextType && contextId ? { type: contextType, id: contextId } : undefined,
    }),

  getConversation: async (id) => apiClient.get(`/messages/conversations/${id}`),

  markConversationRead: async (id) => apiClient.patch(`/messages/conversations/${id}/read`),

  getMessages: async (conversationId, { page = 1, limit = 30 } = {}) =>
    apiClient.get(`/messages/conversations/${conversationId}/messages`, { params: { page, limit } }),

  sendMessage: async (conversationId, content) =>
    apiClient.post(`/messages/conversations/${conversationId}/messages`, { content }),

  markMessageRead: async (id) => apiClient.patch(`/messages/${id}/read`),

  deleteMessage: async (id) => apiClient.delete(`/messages/${id}`),

  getUnreadCount: async () => apiClient.get('/messages/unread-count'),

  getCompanies: async () => apiClient.get('/messages/companies'),

  getCompanyClients: async (companyId) => apiClient.get(`/messages/companies/${companyId}/clients`),
};

export default messageService;
