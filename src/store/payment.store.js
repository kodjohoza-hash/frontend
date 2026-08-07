import { create } from 'zustand';
import PaymentService from '../services/paymentService';
import useAuthStore from './auth.store';

/**
 * BUS TIX CONNECT — Payment Store (Module 11 — Gestion des paiements)
 * Branché sur l'API Express `/api/v1/payments` via paymentService.
 * Expose des paiements adaptés en une forme commune consommable par les
 * pages Guichet (Counter) et Agence/Compagnie (Agency) :
 *   - statut    : valeur backend française (paye / en_attente / ...)
 *   - status    : alias anglais pour les composants Counter
 *   - client / route / bookingId / seats / timeline : forme Agency
 * Mutations : confirm / cancel / fail / refund + rechargement local.
 */

const STATUS_FR_TO_EN = {
  initie: 'initiated',
  paye: 'paid',
  en_attente: 'pending',
  echoue: 'failed',
  annule: 'cancelled',
  rembourse: 'refunded',
  partiellement_rembourse: 'partially_refunded',
};

const STATUS_LABELS = {
  initie: 'Initié',
  paye: 'Payé',
  en_attente: 'En attente',
  echoue: 'Échoué',
  annule: 'Annulé',
  rembourse: 'Remboursé',
  partiellement_rembourse: 'Partiellement remboursé',
};

const METHOD_META = {
  orange_money: { label: 'Orange Money', icon: 'bi-phone', color: '#FF7900' },
  mtn_money: { label: 'MTN Mobile Money', icon: 'bi-phone', color: '#FFCC00' },
  carte_bancaire: { label: 'Carte bancaire', icon: 'bi-credit-card', color: '#1A1F71' },
  especes: { label: 'Espèces', icon: 'bi-cash', color: '#10B981' },
  virement_bancaire: { label: 'Virement bancaire', icon: 'bi-bank', color: '#0B1D51' },
  bon_reduction: { label: 'Bon de réduction', icon: 'bi-ticket-perforated', color: '#8B5CF6' },
  code_promo: { label: 'Code promotionnel', icon: 'bi-percent', color: '#F59E0B' },
  express_union_mobile: { label: 'Express Union Mobile', icon: 'bi-phone', color: '#DC2626' },
  autre: { label: 'Autre', icon: 'bi-wallet2', color: '#64748B' },
};

const buildTimeline = (p) => {
  const events = [];
  if (p.creeLe) {
    events.push({ id: 1, label: 'Paiement initié', time: p.creeLe, icon: 'bi-play-circle', color: 'info' });
  }
  const time = p.paiementLe || p.creeLe;
  if (p.statut === 'en_attente') {
    events.push({ id: 2, label: 'En attente de confirmation', time, icon: 'bi-clock', color: 'warning' });
  } else if (p.statut === 'echoue') {
    events.push({ id: 2, label: 'Paiement échoué', time, icon: 'bi-x-circle', color: 'danger' });
  } else if (p.statut === 'annule') {
    events.push({ id: 2, label: 'Paiement annulé', time, icon: 'bi-x-circle', color: 'danger' });
  } else if (p.statut === 'paye' || p.statut === 'rembourse' || p.statut === 'partiellement_rembourse') {
    events.push({ id: 2, label: 'Paiement confirmé', time, icon: 'bi-check-circle', color: 'success' });
  }
  if (p.remboursement != null) {
    events.push({
      id: 3,
      label: `Remboursement de ${Number(p.remboursement).toLocaleString('fr-FR')} XAF`,
      time: p.paiementLe || p.creeLe,
      icon: 'bi-arrow-counterclockwise',
      color: 'primary',
    });
  }
  return events;
};

/** Série complète : forme commune Agency + champs Counter (status/method*). */
const adaptPayment = (p) => {
  const method = METHOD_META[p.methode] || { label: p.methode, icon: 'bi-wallet', color: '#6B7280' };
  const fullName = p.clientName || [p.client?.firstName, p.client?.lastName].filter(Boolean).join(' ');
  const nameParts = (fullName || 'Client').split(' ').filter(Boolean);
  const seats = p.reservation?.nbPlaces ? Array.from({ length: p.reservation.nbPlaces }, (_, i) => i + 1) : [];
  const route =
    p.tripFrom && p.tripTo
      ? `${p.tripFrom} → ${p.tripTo}`
      : p.tripFrom || p.tripTo || p.reservation?.depart?.trajet?.villeDepart
        ? `${p.reservation.depart.trajet.villeDepart} → ${p.reservation.depart.trajet.villeArrivee}`
        : '—';

  return {
    id: p.id,
    backendId: p.id,
    reference: p.reference || p.id,
    type: p.type,
    clientName: fullName,
    clientPhone: p.clientPhone || p.client?.phone,
    clientEmail: p.clientEmail || p.client?.email,
    client: {
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      phone: p.clientPhone || p.client?.phone,
      email: p.clientEmail || p.client?.email,
    },
    bookingId: p.bookingRef || p.reservation?.reference,
    ticketRef: p.ticketRef,
    tripFrom: p.tripFrom,
    tripTo: p.tripTo,
    route,
    tripDate: p.tripDate || p.reservation?.depart?.dateDepart || null,
    seats,
    amount: Number(p.montant) || 0,
    fees: Number(p.frais) || 0,
    discount: 0,
    totalPaid: Number(p.montant) || 0,
    currency: p.devise || 'XAF',
    method: p.methode,
    methodLabel: method.label,
    methodIcon: method.icon,
    methodColor: method.color,
    transactionRef: p.reference || p.id,
    status: p.statut,
    statusLabel: STATUS_LABELS[p.statut] || p.statut,
    statusEn: STATUS_FR_TO_EN[p.statut] || p.statut,
    outlet: p.agenceName || p.agence?.nom,
    agent: p.agentName || p.agent?.name || '—',
    notes: p.note,
    motifRemboursement: p.motifRemboursement,
    remboursement: p.remboursement != null ? Number(p.remboursement) : null,
    categorie: p.categorie,
    provider: p.provider,
    referenceFournisseur: p.referenceFournisseur,
    compagnieId: p.compagnieId,
    guichetId: p.guichetId,
    abonnementCompagnie: p.abonnementCompagnie,
    balance: p.balance
      ? {
          montantPaye: Number(p.balance.montantPaye) || 0,
          resteAPayer: Number(p.balance.resteAPayer) || 0,
          montantReservation: Number(p.balance.montantReservation) || 0,
        }
      : null,
    metadata: p.metadata || {},
    createdAt: p.creeLe,
    updatedAt: p.paiementLe || p.creeLe,
    timeline: buildTimeline(p),
  };
};

/** KPIs → tableau de cartes (forme AgencyPaymentStats). */
const adaptStats = (s) => {
  if (!s) return [];
  const byStatus = Array.isArray(s.parStatut) ? s.parStatut : [];
  const countOf = (st) => byStatus.find((r) => r.statut === st)?.total ?? 0;
  return [
    { id: 'today', label: "Paiements aujourd'hui", value: String(s.today?.total ?? 0), icon: 'bi-credit-card', trend: '', color: 'accent' },
    { id: 'successful', label: 'Paiements réussis', value: String(countOf('paye')), icon: 'bi-check-circle', trend: '', color: 'success' },
    { id: 'pending', label: 'Paiements en attente', value: String(countOf('en_attente')), icon: 'bi-clock-history', trend: '', color: 'warning' },
    { id: 'failed', label: 'Paiements échoués', value: String(countOf('echoue')), icon: 'bi-x-circle', trend: '', color: 'danger' },
    { id: 'refunded', label: 'Paiements remboursés', value: String(countOf('rembourse') + countOf('partiellement_rembourse')), icon: 'bi-arrow-counterclockwise', trend: '', color: 'info' },
    { id: 'revenue', label: "Chiffre d'affaires", value: `${(s.netRevenu ?? s.encaisse ?? 0).toLocaleString('fr-FR')} XAF`, icon: 'bi-cash-stack', trend: '', color: 'primary' },
  ];
};

const hasToken = () => Boolean(useAuthStore.getState().token);

const usePaymentStore = create((set, get) => ({
  payments: [],
  stats: null,
  statsCards: [],
  payment: null,
  receipt: null,
  loading: false,
  loadingDetail: false,
  loadingReceipt: false,
  error: null,

  /* ── CHARGEURS ── */
  fetchPayments: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const data = await PaymentService.listPayments(params);
      const items = (data?.items || []).map(adaptPayment);
      set({ payments: items, loading: false });
      return { items, pagination: data?.pagination };
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger les paiements.' });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const stats = await PaymentService.getPaymentStats();
      set({ stats, statsCards: adaptStats(stats), error: null });
      return stats;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les statistiques.' });
      return null;
    }
  },

  refresh: async () => {
    await Promise.all([get().fetchPayments(), get().fetchStats()]);
  },

  fetchPayment: async (id) => {
    set({ loadingDetail: true, error: null });
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const p = await PaymentService.getPayment(id);
      set({ payment: adaptPayment(p), loadingDetail: false });
      return get().payment;
    } catch (err) {
      set({ loadingDetail: false, error: err.message || 'Impossible de charger le paiement.' });
      throw err;
    }
  },

  fetchReceipt: async (id) => {
    set({ loadingReceipt: true, error: null });
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const receipt = await PaymentService.getReceipt(id);
      set({ receipt, loadingReceipt: false });
      return receipt;
    } catch (err) {
      set({ loadingReceipt: false, error: err.message || 'Impossible de générer le reçu.' });
      throw err;
    }
  },

  /* ── MUTATIONS ── */
  confirmPayment: async (id) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const updated = await PaymentService.confirmPayment(id);
      const mapped = adaptPayment(updated.payment || updated);
      get()._patchLocal(mapped);
      return { ok: true, data: mapped, message: updated.message };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  cancelPayment: async (id, motif) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const updated = await PaymentService.cancelPayment(id, motif);
      const mapped = adaptPayment(updated.payment || updated);
      get()._patchLocal(mapped);
      return { ok: true, data: mapped, message: updated.message };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  failPayment: async (id, motif) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const updated = await PaymentService.failPayment(id, motif);
      const mapped = adaptPayment(updated.payment || updated);
      get()._patchLocal(mapped);
      return { ok: true, data: mapped, message: updated.message };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  refundPayment: async (id, payload) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const updated = await PaymentService.refundPayment(id, payload);
      const mapped = adaptPayment(updated.payment || updated);
      get()._patchLocal(mapped);
      return { ok: true, data: mapped, message: updated.message };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  createPayment: async (payload) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const created = await PaymentService.createPayment(payload);
      const mapped = adaptPayment(created.payment || created);
      set({ payments: [mapped, ...get().payments] });
      return { ok: true, data: mapped, message: created.message };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  updatePayment: async (id, payload) => {
    try {
      if (!hasToken()) throw new Error('Non authentifié');
      const updated = await PaymentService.updatePayment(id, payload);
      const mapped = adaptPayment(updated.payment || updated);
      get()._patchLocal(mapped);
      return { ok: true, data: mapped, message: updated.message };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  /* met à jour la liste locale + le détail courant après mutation */
  _patchLocal: (mapped) => {
    set({
      payments: get().payments.map((p) => (p.backendId === mapped.backendId ? mapped : p)),
      payment: get().payment?.backendId === mapped.backendId ? mapped : get().payment,
    });
  },

  clearError: () => set({ error: null }),
}));

export default usePaymentStore;
