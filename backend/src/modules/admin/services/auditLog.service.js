const ApiError = require('../../../utils/ApiError');
const { auditLogRepository } = require('../repositories');

/** Sérialise une ligne du journal (jamais de donnée sensible). */
const serialize = (row) => {
  let details = null;
  if (row.details) {
    try {
      details = JSON.parse(row.details);
    } catch (_err) {
      details = row.details;
    }
  }
  return {
    id: row.id,
    utilisateur: row.utilisateur,
    role: row.role,
    action: row.action,
    entite: row.entite,
    entiteId: row.entite_id,
    details,
    ip: row.ip,
    date: row.date,
  };
};

/**
 * GET /admin/audit-logs — liste paginée et filtrable du journal d'audit.
 * Réservé au super admin (contrôlé dans routes.js).
 */
const list = async ({ query }) => {
  const where = auditLogRepository.buildWhere(query);
  const { rows, count } = await auditLogRepository.findPage({
    where,
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });
  return {
    items: rows.map(serialize),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: count,
      pages: Math.ceil(count / query.limit),
    },
  };
};

/** GET /admin/audit-logs/stats — KPIs du journal (avec filtres éventuels). */
const stats = async ({ query }) => {
  const filters = {};
  ['action', 'entite', 'role', 'utilisateur', 'dateDebut', 'dateFin', 'search'].forEach((k) => {
    if (query[k] !== undefined) filters[k] = query[k];
  });
  return auditLogRepository.summary({ filters });
};

/** GET /admin/audit-logs/:id — détail d'une entrée du journal. */
const getById = async ({ id }) => {
  const row = await auditLogRepository.findById(id);
  if (!row) throw new ApiError(404, 'Entrée de journal introuvable.');
  return serialize(row);
};

module.exports = { list, stats, getById, serialize };
