import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Subscription Service Layer (SaaS par compagnie)
 * Appels réels vers l'API Express `/api/v1` :
 *   plans, abonnements compagnie, paiements, notifications, revenus.
 * Si aucun token n'est présent, chaque méthode lève une erreur —
 * le store retombe alors sur les mocks (voir subscriptions.store.js).
 */

const SubscriptionService = {
  /* ── Plans ── */
  listPlans: () => apiClient.get('/plans'),
  getPlan: (id) => apiClient.get(`/plans/${id}`),
  createPlan: (payload) => apiClient.post('/plans', payload),
  updatePlan: (id, payload) => apiClient.patch(`/plans/${id}`, payload),
  deletePlan: (id) => apiClient.delete(`/plans/${id}`),

  /* ── Abonnements compagnie ── */
  listSubscriptions: (params) => apiClient.get('/subscriptions', { params }),
  getSubscription: (id) => apiClient.get(`/subscriptions/${id}`),
  getMySubscription: () => apiClient.get('/subscriptions/mine'),
  createSubscription: (payload) => apiClient.post('/subscriptions', payload),
  renewSubscription: (compagnieId, payload) => apiClient.post(`/subscriptions/${compagnieId}/renew`, payload),
  suspendSubscription: (compagnieId, payload) => apiClient.post(`/subscriptions/${compagnieId}/suspend`, payload),
  reactivateSubscription: (compagnieId) => apiClient.post(`/subscriptions/${compagnieId}/reactivate`),

  /* ── Paiements ── */
  listPayments: (params) => apiClient.get('/payments', { params }),
  revenueByCompany: () => apiClient.get('/payments/revenue/by-company'),
  recordPayment: (payload) => apiClient.post('/payments', payload),

  /* ── Notifications (abonnements SaaS, sous /abonnements) ── */
  listAllNotifications: (params) => apiClient.get('/abonnements/notifications', { params }),
  getMyNotifications: () => apiClient.get('/abonnements/notifications/mine'),

  /* ── Revenus (dashboard financier) ── */
  getRevenue: () => apiClient.get('/revenue'),
};

export default SubscriptionService;
