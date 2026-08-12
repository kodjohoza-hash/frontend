import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Admin Service (Module 19 : Administration Super Admin)
 * Endpoints backend (réservés au rôle super_admin) :
 *   GET /admin/audit-logs          (journal d'audit paginé + filtres)
 *   GET /admin/audit-logs/stats    (KPIs du journal)
 *   GET /admin/audit-logs/:id      (détail d'une entrée)
 *   GET /admin/payments            (paiements opérationnels — toutes compagnies)
 *   GET /admin/payments/stats      (KPIs des paiements opérationnels)
 */

const adminService = {
  /** Journal d'audit paginé (query : page, limit, search, action, entite,
      role, utilisateur, dateDebut, dateFin, sort). */
  getAuditLogs: async (params = {}) => {
    const data = await apiClient.get('/admin/audit-logs', { params });
    return data;
  },

  /** KPIs du journal d'audit. */
  getAuditStats: async (params = {}) => {
    const data = await apiClient.get('/admin/audit-logs/stats', { params });
    return data;
  },

  /** Détail d'une entrée du journal. */
  getAuditLog: async (id) => {
    const data = await apiClient.get(`/admin/audit-logs/${id}`);
    return data;
  },

  /** Paiements opérationnels globaux (toutes compagnies). */
  getPayments: async (params = {}) => {
    const data = await apiClient.get('/admin/payments', { params });
    return data;
  },

  /** KPIs des paiements opérationnels. */
  getPaymentsStats: async (params = {}) => {
    const data = await apiClient.get('/admin/payments/stats', { params });
    return data;
  },
};

export default adminService;
