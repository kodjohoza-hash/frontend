import { create } from 'zustand';
import SubscriptionService from '../services/subscriptionService';
import useAuthStore from './auth.store';
import {
  plans as mockPlans,
  subscriptions as mockSubscriptions,
  subscriptionStats as mockStats,
  billingRecords as mockBilling,
  subscriptionTimeline as mockTimeline,
} from '../data/adminSubscriptionData';

/* ══════════════════════════════════════════════════════════════
   ADAPTATEURS — API Express → forme attendue par les composants admin
   ══════════════════════════════════════════════════════════════ */

const DURATION_LABEL = { 30: 'monthly', 90: 'quarterly', 180: 'biannual', 365: 'yearly' };

const adaptPlan = (p) => ({
  id: String(p.id),
  name: p.nom,
  code: p.code,
  description: p.description || '',
  price: Number(p.prix_mensuel || 0),
  annualPrice: p.prix_annuel ? Number(p.prix_annuel) : null,
  currency: 'XOF',
  duration: DURATION_LABEL[p.duree_jours] || 'custom',
  duree_jours: p.duree_jours,
  maxBuses: p.max_bus ?? -1,
  maxAgents: p.max_agents ?? -1,
  maxBranches: p.max_agences ?? -1,
  maxTrips: p.max_reservations ?? -1,
  storage: '—',
  apiIncluded: Array.isArray(p.fonctionnalites) ? p.fonctionnalites.includes('api_access') : false,
  features: Array.isArray(p.fonctionnalites) ? p.fonctionnalites : [],
  sortOrder: p.ordre || 0,
  color: p.code === 'GRATUIT' ? '#6B7280' : p.code === 'PREMIUM' ? '#F59E0B' : p.code === 'ENTERPRISE' ? '#EF4444' : '#8B5CF6',
  status: p.statut === 'actif' ? 'active' : 'inactive',
  createdAt: p.cree_le ? String(p.cree_le).slice(0, 10) : new Date().toISOString().slice(0, 10),
  popular: p.code === 'PREMIUM',
  companiesCount: 0,
  revenue: 0,
});

const adaptPlanToApi = (p) => ({
  code: p.code,
  nom: p.name,
  description: p.description,
  prix_mensuel: Number(p.price) || 0,
  prix_annuel: p.annualPrice ? Number(p.annualPrice) : null,
  duree_jours: p.duree_jours || 30,
  max_bus: p.maxBuses && p.maxBuses > 0 ? p.maxBuses : null,
  max_agences: p.maxBranches && p.maxBranches > 0 ? p.maxBranches : null,
  max_agents: p.maxAgents && p.maxAgents > 0 ? p.maxAgents : null,
  max_reservations: p.maxTrips && p.maxTrips > 0 ? p.maxTrips : null,
  fonctionnalites: p.features || [],
  statut: p.status === 'active' ? 'actif' : 'inactif',
  ordre: p.sortOrder || 0,
});

const adaptSubscription = (s) => {
  const statusMap = {
    actif: 'active',
    en_attente: 'trial',
    en_retard: 'overdue',
    expire: 'expired',
    suspendu: 'suspended',
    annule: 'cancelled',
  };
  return {
    id: `sub_${s.id}`,
    companyId: s.compagnie_id,
    companyName: s.compagnie?.nom || s.compagnie_id,
    planId: String(s.plan_id),
    status: statusMap[s.statut] || s.statut,
    startDate: s.date_debut,
    endDate: s.date_fin,
    trialEnd: null,
    autoRenew: Boolean(s.renouvellement_auto),
    paymentMethod: '—',
    lastPayment: null,
    nextBilling: s.date_fin,
    billingCycle: 'monthly',
    amount: Number(s.plan?.prix_mensuel || 0),
    currency: 'XOF',
    joursRestants: s.jours_restants ?? null,
    planName: s.plan?.nom || '',
  };
};

const adaptPayment = (p) => ({
  id: p.reference || String(p.id),
  subscriptionId: `sub_${p.abonnement_compagnie_id}`,
  companyName: p.compagnie?.nom || p.compagnie_id,
  planName: p.plan?.nom || '',
  amount: Number(p.montant),
  total: Number(p.montant),
  status: p.statut === 'paye' ? 'paid' : p.statut,
  paymentDate: String(p.date).slice(0, 10),
  paymentMethod: p.methode,
  dueDate: String(p.date).slice(0, 10),
  period: String(p.date).slice(0, 7),
  receiptUrl: p.facture_url || '#',
  reference: p.reference,
});

const adaptTimeline = (h) => ({
  id: `evt_${h.id}`,
  subscriptionId: `sub_${h.abonnement_compagnie_id}`,
  action: h.action === 'renouvellement' ? 'renewed' : h.action === 'suspension' ? 'suspended' : h.action === 'reprise' ? 'reactivated' : h.action,
  title: h.detail || h.action,
  description: h.detail || '',
  time: String(h.date).replace('T', ' ').slice(0, 16),
  user: h.auteur || 'Système',
});

const adaptNotification = (n) => ({
  id: n.id,
  type: n.type,
  compagnieId: n.compagnie_id,
  companyName: n.compagnie?.nom || n.compagnie_id,
  title: n.titre,
  message: n.message,
  canal: n.canal,
  lu: Boolean(n.lu),
  date: n.cree_le,
});

/* ══════════════════════════════════════════════════════════════
   STORE
   ══════════════════════════════════════════════════════════════ */

const hasToken = () => Boolean(useAuthStore.getState().token);

const useSubscriptionsStore = create((set, get) => ({
  /* état */
  plans: [],
  subscriptions: [],
  payments: [],
  notifications: [],
  revenue: null,
  stats: mockStats,
  loading: false,
  usingMock: false,
  error: null,

  /* utils internes */
  _fallback: (kind, data) => {
    set({ usingMock: true });
    switch (kind) {
      case 'plans': set({ plans: data }); break;
      case 'subscriptions': set({ subscriptions: data }); break;
      case 'revenue': set({ revenue: data }); break;
      case 'notifications': set({ notifications: data }); break;
      default: break;
    }
  },

  /* ── CHARGEURS ── */
  loadPlans: async () => {
    set({ loading: true, error: null });
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const plans = await SubscriptionService.listPlans();
      const mapped = plans.map(adaptPlan);
      set({ plans: mapped, usingMock: false });
      return mapped;
    } catch (err) {
      get()._fallback('plans', mockPlans);
      set({ error: err.message });
      return mockPlans;
    } finally {
      set({ loading: false });
    }
  },

  loadSubscriptions: async () => {
    set({ loading: true, error: null });
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const subs = await SubscriptionService.listSubscriptions();
      const mapped = subs.map(adaptSubscription);
      set({ subscriptions: mapped, usingMock: false });
      return mapped;
    } catch (err) {
      get()._fallback('subscriptions', mockSubscriptions);
      set({ error: err.message });
      return mockSubscriptions;
    } finally {
      set({ loading: false });
    }
  },

  loadMySubscription: async () => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const sub = await SubscriptionService.getMySubscription();
      return { ok: true, data: adaptSubscription(sub) };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  loadRevenue: async () => {
    set({ loading: true, error: null });
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const revenue = await SubscriptionService.getRevenue();
      set({ revenue, usingMock: false });
      return revenue;
    } catch (err) {
      set({ error: err.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  loadNotifications: async () => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const notifs = await SubscriptionService.listAllNotifications();
      set({ notifications: notifs.map(adaptNotification), usingMock: false });
      return notifs;
    } catch (err) {
      set({ error: err.message });
      return [];
    }
  },

  refreshStats: () => {
    const { plans, subscriptions, payments, revenue } = get();
    const stats = {
      total: { label: 'Total plans', value: plans.length, trend: 0 },
      active: { label: 'Plans actifs', value: plans.filter((p) => p.status === 'active').length, trend: 0 },
      inactive: { label: 'Plans inactifs', value: plans.filter((p) => p.status === 'inactive').length, trend: 0 },
      subscribed: { label: 'Compagnies abonnées', value: subscriptions.filter((s) => s.status === 'active').length, trend: 0 },
      trials: { label: 'Essais', value: subscriptions.filter((s) => s.status === 'en_attente').length, trend: 0 },
      expired: { label: 'Expirés', value: subscriptions.filter((s) => s.status === 'expire').length, trend: 0 },
      renewals: { label: 'Paiements', value: payments.length, trend: 0 },
      revenue: { label: 'Revenus (MRR)', value: revenue?.mrr ?? 0, trend: 0, isCurrency: true },
    };
    set({ stats });
    return stats;
  },

  /* ── ACTIONS PLANS ── */
  createPlan: async (plan) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const created = await SubscriptionService.createPlan(adaptPlanToApi(plan));
      set({ plans: [adaptPlan(created), ...get().plans], usingMock: false });
      return { ok: true, plan: adaptPlan(created) };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  updatePlan: async (id, plan) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const updated = await SubscriptionService.updatePlan(Number(id), adaptPlanToApi(plan));
      set({ plans: get().plans.map((p) => (p.id === id ? adaptPlan(updated) : p)), usingMock: false });
      return { ok: true, plan: adaptPlan(updated) };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  deletePlan: async (id) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      await SubscriptionService.deletePlan(Number(id));
      set({ plans: get().plans.filter((p) => p.id !== id), usingMock: false });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  /* ── ACTIONS ABONNEMENTS ── */
  renewSubscription: async (compagnieId, payload) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const updated = await SubscriptionService.renewSubscription(compagnieId, payload);
      return { ok: true, data: updated };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  suspendSubscription: async (compagnieId, motif) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const updated = await SubscriptionService.suspendSubscription(compagnieId, { motif });
      return { ok: true, data: updated };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  reactivateSubscription: async (compagnieId) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const updated = await SubscriptionService.reactivateSubscription(compagnieId);
      return { ok: true, data: updated };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  /* ── ACTIONS PAIEMENTS ── */
  recordPayment: async (payload) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const created = await SubscriptionService.recordPayment(payload);
      set({ payments: [adaptPayment(created), ...get().payments], usingMock: false });
      return { ok: true, payment: adaptPayment(created) };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  loadPayments: async () => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const payments = await SubscriptionService.listPayments();
      set({ payments: payments.map(adaptPayment), usingMock: false });
      return payments;
    } catch (err) {
      return [];
    }
  },

  /* mise à jour locale optimiste (fallback mock) */
  updateLocalSubscription: (s) => set({ subscriptions: get().subscriptions.map((x) => (x.id === s.id ? { ...x, ...s } : x)) }),
  clearError: () => set({ error: null }),
}));

export default useSubscriptionsStore;
