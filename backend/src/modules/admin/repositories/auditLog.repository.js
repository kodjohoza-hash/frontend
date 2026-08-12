const { Op } = require('sequelize');
const { AuditLog } = require('../../../models');

/** Construit le filtre WHERE du journal d'audit à partir de la requête validée. */
const buildWhere = (query = {}) => {
  const where = {};

  if (query.action) where.action = query.action;
  if (query.entite) where.entite = query.entite;
  if (query.role) where.role = query.role;
  if (query.utilisateur) where.utilisateur = { [Op.like]: `%${query.utilisateur}%` };

  if (query.search) {
    const like = `%${query.search}%`;
    where[Op.or] = [
      { utilisateur: { [Op.like]: like } },
      { action: { [Op.like]: like } },
      { entite: { [Op.like]: like } },
      { entite_id: { [Op.like]: like } },
      { details: { [Op.like]: like } },
      { ip: { [Op.like]: like } },
    ];
  }

  if (query.dateDebut || query.dateFin) {
    where.date = {};
    if (query.dateDebut) where.date[Op.gte] = `${query.dateDebut} 00:00:00`;
    if (query.dateFin) where.date[Op.lte] = `${query.dateFin} 23:59:59`;
  }

  return where;
};

const findPage = async ({ where, page, limit, sort }) => {
  const order = sort === 'date_asc' ? [['date', 'ASC']] : [['date', 'DESC']];
  const { rows, count } = await AuditLog.findAndCountAll({
    where,
    order,
    offset: (page - 1) * limit,
    limit,
  });
  return { rows, count };
};

const findById = (id) => AuditLog.findByPk(id);

/** KPIs du journal d'audit. */
const summary = async ({ filters = {} } = {}) => {
  const where = buildWhere(filters);

  const [total, todayStart, byAction, byEntite, byRole] = await Promise.all([
    AuditLog.count({ where }),
    AuditLog.count({
      where: { ...where, date: { [Op.gte]: new Date().setHours(0, 0, 0, 0) } },
    }),
    AuditLog.findAll({ where, attributes: ['action', [AuditLog.sequelize.fn('COUNT', AuditLog.sequelize.col('id')), 'n']], group: ['action'], raw: true }),
    AuditLog.findAll({ where, attributes: ['entite', [AuditLog.sequelize.fn('COUNT', AuditLog.sequelize.col('id')), 'n']], group: ['entite'], raw: true }),
    AuditLog.findAll({ where, attributes: ['role', [AuditLog.sequelize.fn('COUNT', AuditLog.sequelize.col('id')), 'n']], group: ['role'], raw: true }),
  ]);

  const byActionMap = Object.fromEntries(byAction.map((r) => [r.action, Number(r.n)]));
  const byEntiteMap = Object.fromEntries(byEntite.map((r) => [r.entite, Number(r.n)]));
  const byRoleMap = Object.fromEntries(byRole.map((r) => [r.role || 'systeme', Number(r.n)]));

  const criticals = ['delete', 'suspend', 'reject', 'permission_change', 'status']
    .reduce((s, a) => s + (byActionMap[a] || 0), 0);

  return {
    total: Number(total),
    logins: byActionMap.login || 0,
    loginsToday: Number(todayStart),
    failedLogins: byActionMap.login_failed || 0,
    criticals,
    creations: byActionMap.create || 0,
    modifications: byActionMap.update || 0,
    deletions: byActionMap.delete || 0,
    validations: byActionMap.validate || 0,
    byAction: byActionMap,
    byEntite: byEntiteMap,
    byRole: byRoleMap,
  };
};

module.exports = { buildWhere, findPage, findById, summary };
