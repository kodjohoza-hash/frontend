import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Notification Service (API réelle)
 * Endpoints (toujours relatifs à l'utilisateur authentifié) :
 *   GET    /notifications                   — liste paginée (page, limit, statut, type)
 *   GET    /notifications/unread-count      — compteur non lues
 *   PATCH  /notifications/read-all          — tout marquer comme lu
 *   PATCH  /notifications/:id/read          — marquer une notification comme lue
 *   DELETE /notifications/:id               — supprimer une notification
 * Le destinataire est déduit côté serveur (req.user.id) : jamais transmis ici.
 */
const notificationService = {
  getList: async ({ page = 1, limit = 10, statut, type } = {}) => {
    const params = { page, limit };
    if (statut) params.statut = statut;
    if (type) params.type = type;
    return apiClient.get('/notifications', { params });
  },

  getUnreadCount: async () => apiClient.get('/notifications/unread-count'),

  markRead: async (id) => apiClient.patch(`/notifications/${id}/read`),

  markAllRead: async () => apiClient.patch('/notifications/read-all'),

  remove: async (id) => apiClient.delete(`/notifications/${id}`),
};

export default notificationService;
