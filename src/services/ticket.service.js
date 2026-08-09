import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Tickets Service (API réelle, Module 15)
 * Endpoints backend :
 *   GET  /tickets/verify/:token          (vérification sécurisée d'un QR scanné)
 *   POST /tickets/:id/check-in           (contrôle d'embarquement — anti-double)
 *   GET  /tickets/:id/check-in-history   (journal des contrôles du billet)
 *   GET  /tickets?recherche=…            (recherche par référence / passager / siège)
 *   GET  /tickets/stats                  (KPIs tableau de bord)
 *   GET  /tickets/:id/pdf                (billet PDF — impression)
 *
 * Toute la logique de validation (paiement, statut, périmètre compagnie/agence,
 * anti-double-embarquement) est exécutée côté backend : ce service ne fait que
 * transporter les résultats (codes VALID / ALREADY_USED / CANCELLED / REFUNDED /
 * EXPIRED / UNPAID / INVALID / WRONG_COMPANY).
 */
const ticketService = {
  /** Vérifie un QR (jeton 48 hex) : journalise le scan côté serveur. */
  verifyToken: async (token) => apiClient.get(`/tickets/verify/${encodeURIComponent(token)}`),

  /** Embarquement : transaction + verrouillage pessimiste côté serveur. */
  checkIn: async (id) => apiClient.post(`/tickets/${id}/check-in`),

  /** Journal des contrôles du billet (scans + check-ins). */
  checkInHistory: async (id) => apiClient.get(`/tickets/${id}/check-in-history`),

  /** Recherche (référence, passager, téléphone, siège) — liste paginée. */
  search: async (query, page = 1, limit = 8) =>
    apiClient.get('/tickets', { params: { recherche: query, page, limit, sort: 'newest' } }),

  /** KPIs de la journée (émis, valides, utilisés, vérifiés…). */
  stats: async () => apiClient.get('/tickets/stats', { params: { periode: 'jour' } }),

  /** Télécharge le PDF du billet (Blob) pour impression. */
  pdf: async (id) => apiClient.get(`/tickets/${id}/pdf`, { responseType: 'blob' }),
};

export default ticketService;
