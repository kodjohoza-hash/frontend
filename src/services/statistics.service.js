import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Statistiques & Rapports (API réelle, aucun mock)
 * Endpoints backend (module statistics, monté sous /api/v1) :
 *   GET /statistics/dashboard      (KPIs par rôle, scope déduit du JWT)
 *   GET /statistics/revenue        (paiements confirmés, XAF)
 *   GET /statistics/bookings       (réservations par statut)
 *   GET /statistics/tickets        (billets par statut)
 *   GET /statistics/trips          (voyages + taux de remplissage)
 *   GET /statistics/performances   (par agence/guichet ; super admin via compagnieId)
 *   GET /statistics/subscriptions  (Super Admin uniquement)
 *
 * Périodes (param `periode`) : today | yesterday | 7d | 30d | this_month |
 * last_month | this_year | all — ou période libre via `dateDebut` + `dateFin`
 * (le backend répond alors `periode: 'custom'`).
 *
 * L'apiClient dépaquette déjà la réponse : on reçoit le payload du service
 * `{ periode, devise, role, data }` ; les métriques sont donc dans `.data`.
 */

/** Périodes proposées dans les filtres de l'interface. */
export const STATISTICS_PERIODS = [
  { value: 'today', label: "Aujourd'hui" },
  { value: 'yesterday', label: 'Hier' },
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: 'this_month', label: 'Ce mois' },
  { value: 'last_month', label: 'Mois dernier' },
  { value: 'this_year', label: 'Cette année' },
  { value: 'all', label: 'Tout' },
];

/** Libellé court d'un mois 'YYYY-MM' → 'Janv. 2026'. */
export const monthLabel = (mois) => {
  const [y, m] = String(mois || '').split('-');
  const names = ['', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${names[Number(m)] || m} ${y}`.trim();
};

/** Convertit `revenue.parMois` en série recharts [{ mois, total }]. */
export const toMonthlySeries = (parMois = []) =>
  (Array.isArray(parMois) ? parMois : []).map((r) => ({ mois: r.mois, total: Number(r.total) || 0 }));

/** Convertit `revenue.parJour` en série recharts [{ jour, nb, total }]. */
export const toDailySeries = (parJour = []) =>
  (Array.isArray(parJour) ? parJour : []).map((r) => ({ jour: r.jour, nb: Number(r.nb) || 0, total: Number(r.total) || 0 }));

/** Convertit `performances.agences` en liste de lignes pour les classements. */
export const toAgenciesRows = (agences = []) =>
  (Array.isArray(agences) ? agences : []).map((a) => ({
    id: a.agenceId,
    name: a.nom || a.agenceId,
    reservations: Number(a.reservations) || 0,
    ca: Number(a.ca) || 0,
    voyages: Number(a.voyages) || 0,
    tauxRemplissage: Number(a.tauxRemplissage) || 0,
  }));

const statisticsService = {
  /** KPIs du tableau de bord — rôle déduit du token. */
  dashboard: async (params = {}) => {
    const data = await apiClient.get('/statistics/dashboard', { params });
    return data;
  },

  /** Revenus (encaissés/remboursés/net), par jour/mois/méthode/catégorie. */
  revenue: async (params = {}) => {
    const data = await apiClient.get('/statistics/revenue', { params });
    return data;
  },

  /** Réservations par statut + série temporelle. */
  bookings: async (params = {}) => {
    const data = await apiClient.get('/statistics/bookings', { params });
    return data;
  },

  /** Billets par statut + montants. */
  tickets: async (params = {}) => {
    const data = await apiClient.get('/statistics/tickets', { params });
    return data;
  },

  /** Voyages (compteurs + taux de remplissage). */
  trips: async (params = {}) => {
    const data = await apiClient.get('/statistics/trips', { params });
    return data;
  },

  /** Performances par agence/guichet (Super Admin : compagnieId requis). */
  performances: async (params = {}) => {
    const data = await apiClient.get('/statistics/performances', { params });
    return data;
  },

  /** Abonnements compagnies (Super Admin uniquement). */
  subscriptions: async (params = {}) => {
    const data = await apiClient.get('/statistics/subscriptions', { params });
    return data;
  },
};

export default statisticsService;
