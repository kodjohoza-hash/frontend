const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Guichet,
  Agence,
  Agent,
  Ville,
  Client,
  Reservation,
} = require('../../../models');

/** Associations de liste (agence + ville). */
const listInclude = [
  {
    model: Agence,
    as: 'agence',
    include: [{ model: Ville, as: 'ville' }],
  },
];

/** Associations de détail (agence + ville + agents affectés). */
const detailInclude = [
  ...listInclude,
  { model: Agent, as: 'agents' },
];

/** Construit la clause WHERE à partir des filtres validés + périmètre. */
const buildWhere = (filters = {}, scope = {}) => {
  const where = {};

  if (scope.agenceIds) {
    where.agence_id = { [Op.in]: scope.agenceIds };
  }

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    where[Op.or] = [
      { code: { [Op.like]: q } },
      { nom: { [Op.like]: q } },
      { description: { [Op.like]: q } },
    ];
  }
  if (filters.agenceId) where.agence_id = filters.agenceId;
  if (filters.statut) where.statut = filters.statut;
  if (filters.type) where.type = filters.type;

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [['date_creation', 'ASC']];
    case 'code_asc':
      return [['code', 'ASC']];
    case 'code_desc':
      return [['code', 'DESC']];
    case 'nom_asc':
      return [['nom', 'ASC']];
    case 'nom_desc':
      return [['nom', 'DESC']];
    case 'newest':
    default:
      return [['date_creation', 'DESC']];
  }
};

/** Liste paginée + comptage total. */
const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Guichet.findAndCountAll({
    where,
    include: listInclude,
    order: buildOrder(sort),
    distinct: true,
    offset,
    limit,
  });
  return { rows, count };
};

const findByIdFull = (id) => Guichet.findOne({ where: { id }, include: detailInclude });

const findById = (id) => Guichet.findByPk(id);

const findByCode = (code, agenceId) =>
  Guichet.findOne({ where: { code, ...(agenceId ? { agence_id: agenceId } : {}) } });

const create = (data, options = {}) => Guichet.create(data, options);

const update = (guichet, data, options = {}) => guichet.update(data, options);

const findAll = (where = {}) => Guichet.findAll({ where, include: listInclude });

/* ══════════════════════════════════════════════════════════════
   Compteurs agrégés (tables métier sans modèle : reservation)
   via SQL brut — réservés aux KPIs.
   ══════════════════════════════════════════════════════════════ */

const COUNTER_COUNT_SELECT = `
  (SELECT COUNT(*) FROM agent a WHERE a.guichet_id = g.id) AS agents,
  (SELECT COUNT(*) FROM agent a JOIN reservation r ON r.agent_id = a.id
     WHERE a.guichet_id = g.id AND r.date_creation >= CURDATE()) AS reservations_jour,
  (SELECT COUNT(*) FROM agent a JOIN reservation r ON r.agent_id = a.id
     WHERE a.guichet_id = g.id AND r.date_creation >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)) AS reservations_semaine,
  (SELECT COUNT(*) FROM agent a JOIN reservation r ON r.agent_id = a.id
     WHERE a.guichet_id = g.id) AS reservations_total,
  (SELECT COALESCE(SUM(r.montant), 0) FROM agent a JOIN reservation r ON r.agent_id = a.id
     WHERE a.guichet_id = g.id AND r.date_creation >= CURDATE() AND r.statut = 'confirmee') AS revenu_jour,
  (SELECT COALESCE(SUM(r.montant), 0) FROM agent a JOIN reservation r ON r.agent_id = a.id
     WHERE a.guichet_id = g.id AND r.date_creation >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       AND r.statut = 'confirmee') AS revenu_semaine,
  (SELECT COALESCE(SUM(r.montant), 0) FROM agent a JOIN reservation r ON r.agent_id = a.id
     WHERE a.guichet_id = g.id AND r.statut = 'confirmee') AS revenu_total
`;

/** Compteurs pour une liste de guichets (une seule requête GROUP BY). */
const countsForGuichets = async (ids) => {
  if (!ids || !ids.length) return [];
  return sequelize.query(
    `SELECT g.id, ${COUNTER_COUNT_SELECT} FROM guichet g WHERE g.id IN (:ids)`,
    { type: QueryTypes.SELECT, replacements: { ids } }
  );
};

/** Compteurs pour un seul guichet. */
const countsForGuichet = async (id) => {
  const [rows] = await countsForGuichets([id]);
  return rows || null;
};

/** Statistiques opérationnelles du guichet d'un agent (dashboard guichet). */
const statsForAgentGuichet = async (guichetId) => {
  if (!guichetId) return null;
  const [rows] = await sequelize.query(
    `SELECT
       (SELECT COUNT(*) FROM agent a WHERE a.guichet_id = :guichetId) AS agents,
       (SELECT COUNT(*) FROM agent a JOIN reservation r ON r.agent_id = a.id
          WHERE a.guichet_id = :guichetId AND r.date_creation >= CURDATE()) AS reservations_jour,
       (SELECT COUNT(*) FROM agent a JOIN reservation r ON r.agent_id = a.id
          WHERE a.guichet_id = :guichetId AND r.date_creation >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)) AS reservations_semaine,
       (SELECT COUNT(*) FROM agent a JOIN reservation r ON r.agent_id = a.id
          WHERE a.guichet_id = :guichetId) AS reservations_total,
       (SELECT COALESCE(SUM(r.montant), 0) FROM agent a JOIN reservation r ON r.agent_id = a.id
          WHERE a.guichet_id = :guichetId AND r.date_creation >= CURDATE() AND r.statut = 'confirmee') AS revenu_jour,
       (SELECT COALESCE(SUM(r.montant), 0) FROM agent a JOIN reservation r ON r.agent_id = a.id
          WHERE a.guichet_id = :guichetId AND r.date_creation >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            AND r.statut = 'confirmee') AS revenu_semaine,
       (SELECT COALESCE(SUM(r.montant), 0) FROM agent a JOIN reservation r ON r.agent_id = a.id
          WHERE a.guichet_id = :guichetId AND r.statut = 'confirmee') AS revenu_total`,
    { type: QueryTypes.SELECT, replacements: { guichetId } }
  );
  return rows;
};

/* ══════════════════════════════════════════════════════════════
   Affectation des agents aux guichets
   ══════════════════════════════════════════════════════════════ */

/** Agents appartenant à une agence (pour validation avant affectation). */
const findAgentsByAgence = (agenceId, ids) =>
  Agent.findAll({ where: { id: { [Op.in]: ids }, agence_id: agenceId } });

/** Affecte des agents à un guichet. */
const assignAgentsToGuichet = (guichetId, ids, options = {}) =>
  Agent.update({ guichet_id: guichetId }, { where: { id: { [Op.in]: ids } }, ...options });

/** Retire des agents d'un guichet (seuls ceux effectivement affectés). */
const unassignAgentsFromGuichet = (guichetId, ids, options = {}) =>
  Agent.update(
    { guichet_id: null },
    { where: { id: { [Op.in]: ids }, guichet_id: guichetId }, ...options }
  );

/** Transfère des agents vers un autre guichet (+ leur agence si différente). */
const transferAgentsToGuichet = (toGuichetId, agenceId, ids, options = {}) =>
  Agent.update(
    { guichet_id: toGuichetId, agence_id: agenceId },
    { where: { id: { [Op.in]: ids } }, ...options }
  );

/** Agent courant avec son guichet + agence + ville (dashboard guichet). */
const findAgentWithGuichet = (agentId) =>
  Agent.findOne({
    where: { id: agentId },
    include: [
      {
        model: Guichet,
        as: 'guichet',
        include: [
          {
            model: Agence,
            as: 'agence',
            include: [{ model: Ville, as: 'ville' }],
          },
        ],
      },
    ],
  });

/* ══════════════════════════════════════════════════════════════
   Clients (contexte guichet — API métier dédiée)
   Recherche + création de clients SANS compte (vente au guichet).
   Le périmètre d'un agent de guichet est la compagnie de son agence :
   on ne voit que les clients ayant réservé dans une agence de la compagnie.
   ══════════════════════════════════════════════════════════════ */

/** Ids des agences d'une compagnie. */
const findAgenceIdsByCompagnie = async (compagnieId) => {
  const agences = await Agence.findAll({
    where: { compagnie_id: compagnieId },
    attributes: ['id'],
  });
  return agences.map((a) => a.id);
};

/** Recherche de clients ayant réservé dans les agences de la compagnie. */
const searchClientsByCompagnie = async ({ compagnieId, agenceIds, recherche = '', limite = 20 }) => {
  const where = {};
  const q = String(recherche || '').trim();
  if (q) {
    const like = `%${q}%`;
    where[Op.or] = [
      { prenom: { [Op.like]: like } },
      { nom: { [Op.like]: like } },
      { telephone: { [Op.like]: like } },
      { email: { [Op.like]: like } },
    ];
  }
  const reservationScope = { agence_id: { [Op.in]: agenceIds } };
  return Client.findAll({
    where,
    include: [
      { model: Reservation, as: 'reservations', required: true, where: reservationScope, attributes: [] },
      { model: Ville, as: 'ville' },
    ],
    distinct: true,
    order: [['date_inscription', 'DESC']],
    limit: limite,
  });
};

/** Client par email (insensible à la casse, normalisé). */
const findClientByEmail = (email) =>
  Client.findOne({ where: { email: String(email || '').trim().toLowerCase() }, include: [{ model: Ville, as: 'ville' }] });

/** Client par téléphone (premier trouvé). */
const findClientByTelephone = (telephone) =>
  Client.findOne({ where: { telephone: String(telephone || '').trim() }, include: [{ model: Ville, as: 'ville' }] });

/** Client par id (avec ville). */
const findClientById = (id) => Client.findByPk(id, { include: [{ model: Ville, as: 'ville' }] });

/** Création d'un client (pas de compte : aucun mot de passe). */
const createClient = (data, options = {}) => Client.create(data, options);

module.exports = {
  listInclude,
  detailInclude,
  buildWhere,
  buildOrder,
  findPage,
  findByIdFull,
  findById,
  findByCode,
  create,
  update,
  findAll,
  countsForGuichets,
  countsForGuichet,
  statsForAgentGuichet,
  findAgentsByAgence,
  assignAgentsToGuichet,
  unassignAgentsFromGuichet,
  transferAgentsToGuichet,
  findAgentWithGuichet,
  findAgenceIdsByCompagnie,
  searchClientsByCompagnie,
  findClientByEmail,
  findClientByTelephone,
  findClientById,
  createClient,
  Agence,
  Agent,
  Ville,
};
