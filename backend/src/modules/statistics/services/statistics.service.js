const ApiError = require('../../../utils/ApiError');
const { ROLES } = require('../../../middlewares/auth');
const { resolvePeriod, today } = require('../utils/dates');
const { platformDashboard, companyDashboard, counterDashboard, clientDashboard } = require('../repositories/dashboard.repository');
const {
  revenueSummary,
  bookingsSummary,
  tripsSummary,
  ticketsSummary,
  subscriptionsSummary,
  performances,
} = require('../repositories/analytics.repository');

/* ══════════════════════════════════════════════════════════════
   Périmètre & période
   ══════════════════════════════════════════════════════════════ */

/**
 * Périmètre de données déduit UNIQUEMENT du token (req.user) :
 * aucun identifiant fourni par le frontend ne fait autorité.
 */
const resolveScope = (actor) => {
  switch (actor.role) {
    case ROLES.SUPER_ADMIN:
      return {};
    case ROLES.COMPANY_ADMIN:
      if (!actor.compagnieId) throw new ApiError(403, 'Aucune compagnie rattachée à ce compte.');
      return { compagnieId: actor.compagnieId };
    case ROLES.COUNTER_AGENT:
      if (actor.guichetId) return { guichetId: actor.guichetId, agenceId: actor.agenceId };
      if (actor.agenceId) return { agenceId: actor.agenceId };
      return {};
    case ROLES.CLIENT:
      return { clientId: actor.id };
    default:
      throw new ApiError(403, 'Rôle non autorisé pour les statistiques.');
  }
};

/** Bornes de période résolues + métadonnées communes. */
const resolveFilters = (query = {}) => {
  const { periode, dateDebut, dateFin } = resolvePeriod(query);
  return {
    periode,
    dateDebut,
    dateFin,
    filters: { dateDebut, dateFin },
    devise: 'XAF',
  };
};

/* ══════════════════════════════════════════════════════════════
   Dashboard par rôle
   ══════════════════════════════════════════════════════════════ */

const dashboard = async ({ actor, query }) => {
  const meta = resolveFilters(query);
  const scope = resolveScope(actor);
  const j = today();

  let data;
  switch (actor.role) {
    case ROLES.SUPER_ADMIN:
      data = await platformDashboard({ filters: meta.filters });
      break;
    case ROLES.COMPANY_ADMIN:
      data = await companyDashboard({ compagnieId: actor.compagnieId, filters: meta.filters });
      break;
    case ROLES.COUNTER_AGENT:
      data = await counterDashboard({ scope, filters: meta.filters, today: j });
      break;
    case ROLES.CLIENT:
      data = await clientDashboard({ clientId: actor.id, filters: meta.filters, today: j });
      break;
    default:
      throw new ApiError(403, 'Rôle non autorisé pour le tableau de bord.');
  }

  return { ...meta, role: actor.role, data };
};

/* ══════════════════════════════════════════════════════════════
   Revenus (tous rôles) — paiements confirmés uniquement, XAF.
   ══════════════════════════════════════════════════════════════ */

const revenue = async ({ actor, query }) => {
  const meta = resolveFilters(query);
  const scope = resolveScope(actor);
  const data = await revenueSummary({ scope, filters: meta.filters });
  return { ...meta, role: actor.role, data };
};

/* ══════════════════════════════════════════════════════════════
   Réservations (tous rôles)
   ══════════════════════════════════════════════════════════════ */

const bookings = async ({ actor, query }) => {
  const meta = resolveFilters(query);
  const scope = resolveScope(actor);
  const data = await bookingsSummary({ scope, filters: meta.filters });
  return { ...meta, role: actor.role, data };
};

/* ══════════════════════════════════════════════════════════════
   Voyages (super_admin / company_admin / counter_agent)
   ══════════════════════════════════════════════════════════════ */

const trips = async ({ actor, query }) => {
  const meta = resolveFilters(query);
  const scope = resolveScope(actor);
  const data = await tripsSummary({ scope, filters: meta.filters });
  return { ...meta, role: actor.role, data };
};

/* ══════════════════════════════════════════════════════════════
   Billets (tous rôles)
   ══════════════════════════════════════════════════════════════ */

const tickets = async ({ actor, query }) => {
  const meta = resolveFilters(query);
  const scope = resolveScope(actor);
  const data = await ticketsSummary({ scope, filters: meta.filters });
  return { ...meta, role: actor.role, data };
};

/* ══════════════════════════════════════════════════════════════
   Abonnements (Super Admin uniquement)
   ══════════════════════════════════════════════════════════════ */

const subscriptions = async ({ query }) => {
  const meta = resolveFilters(query);
  const data = await subscriptionsSummary({ filters: meta.filters });
  return { ...meta, role: ROLES.SUPER_ADMIN, data };
};

/* ══════════════════════════════════════════════════════════════
   Performances par agence / par guichet
   (Super Admin via compagnieId explicite ; Company Admin sur sa compagnie)
   ══════════════════════════════════════════════════════════════ */

const performance = async ({ actor, query }) => {
  const meta = resolveFilters(query);

  if (actor.role === ROLES.COMPANY_ADMIN) {
    if (!actor.compagnieId) throw new ApiError(403, 'Aucune compagnie rattachée à ce compte.');
    const data = await performances({ compagnieId: actor.compagnieId, filters: meta.filters });
    return { ...meta, role: actor.role, compagnieId: actor.compagnieId, data };
  }

  if (actor.role === ROLES.SUPER_ADMIN) {
    if (!query.compagnieId) throw new ApiError(400, 'compagnieId est requis pour un super admin.');
    const data = await performances({ compagnieId: query.compagnieId, filters: meta.filters });
    return { ...meta, role: actor.role, compagnieId: query.compagnieId, data };
  }

  throw new ApiError(403, 'Accès refusé aux performances.');
};

module.exports = {
  dashboard,
  revenue,
  bookings,
  trips,
  tickets,
  subscriptions,
  performance,
};
