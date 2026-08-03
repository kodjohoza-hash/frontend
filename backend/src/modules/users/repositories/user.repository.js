const { Op } = require('sequelize');
const { Agent, Agence, Compagnie, CompteAgent } = require('../../../models');

/** Associations à charger pour la vue "détail utilisateur". */
const detailInclude = [
  {
    model: Agence,
    as: 'agence',
    include: [{ model: Compagnie, as: 'compagnie' }],
  },
  { model: CompteAgent, as: 'compte' },
];

/** Construit la clause WHERE à partir des filtres validés. */
const buildWhere = (filters = {}, scope = {}) => {
  const where = {};

  if (scope.compagnieId) {
    /* Périmètre compagnie : on filtre sur la compagnie de l'agence de l'agent. */
    where['$agence.compagnie_id$'] = scope.compagnieId;
  }
  if (scope.roleScope) {
    where.role = { [Op.in]: scope.roleScope };
  }
  if (scope.excludeIds) {
    where.id = { [Op.notIn]: scope.excludeIds };
  }

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    where[Op.or] = [
      { prenom: { [Op.like]: q } },
      { nom: { [Op.like]: q } },
      { email: { [Op.like]: q } },
      { matricule: { [Op.like]: q } },
    ];
  }
  if (filters.role) where.role = filters.role;
  if (filters.statut) where.statut = filters.statut;
  if (filters.compagnieId) where['$agence.compagnie_id$'] = filters.compagnieId;
  if (filters.agenceId) where.agence_id = filters.agenceId;

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [
        ['date_creation', 'ASC'],
        ['date_embauche', 'ASC'],
      ];
    case 'name_asc':
      return [
        ['nom', 'ASC'],
        ['prenom', 'ASC'],
      ];
    case 'name_desc':
      return [
        ['nom', 'DESC'],
        ['prenom', 'DESC'],
      ];
    case 'lastLogin_desc':
      return [
        ['compte', 'derniere_connexion', 'DESC'],
        ['date_creation', 'DESC'],
      ];
    case 'newest':
    default:
      return [
        ['date_creation', 'DESC'],
        ['date_embauche', 'DESC'],
      ];
  }
};

/** Liste paginée + comptage total. */
const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Agent.findAndCountAll({
    where,
    include: detailInclude,
    order: buildOrder(sort),
    distinct: true,
    offset,
    limit,
  });
  return { rows, count };
};

const findByIdFull = (id) =>
  Agent.findOne({ where: { id }, include: detailInclude });

const findByEmail = (email) => Agent.findOne({ where: { email } });

const findByMatricule = (matricule) => Agent.findOne({ where: { matricule } });

const create = (data, options = {}) => Agent.create(data, options);

const update = (agent, data, options = {}) => agent.update(data, options);

const remove = (agent, options = {}) => agent.destroy(options);

/** Compte (credentials) d'un utilisateur. */
const findCompte = (agentId) => CompteAgent.findByPk(agentId);

/** Statistiques par rôle (pour les KPIs de la page utilisateurs). */
const countByRole = async (where = {}) => {
  const rows = await Agent.findAll({
    attributes: ['role', 'statut'],
    where,
    /* Nécessaire pour résoudre `$agence.compagnie_id$` du périmètre compagnie */
    include: [{ model: Agence, as: 'agence' }],
  });
  const stats = { total: rows.length, parRole: {}, parStatut: {} };
  rows.forEach((r) => {
    stats.parRole[r.role] = (stats.parRole[r.role] || 0) + 1;
    stats.parStatut[r.statut] = (stats.parStatut[r.statut] || 0) + 1;
  });
  return stats;
};

module.exports = {
  detailInclude,
  buildWhere,
  findPage,
  findByIdFull,
  findByEmail,
  findByMatricule,
  create,
  update,
  remove,
  findCompte,
  countByRole,
};
