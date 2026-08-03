const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Agence,
  Compagnie,
  Ville,
  Agent,
  Guichet,
} = require('../../../models');

/** Associations de liste (ville + compagnie). */
const listInclude = [
  { model: Ville, as: 'ville' },
  { model: Compagnie, as: 'compagnie' },
];

/** Associations de détail (ville + compagnie + guichets + agents). */
const detailInclude = [
  ...listInclude,
  { model: Guichet, as: 'guichets' },
  { model: Agent, as: 'agents' },
];

/** Construit la clause WHERE à partir des filtres validés + périmètre. */
const buildWhere = (filters = {}, scope = {}) => {
  const where = {};

  if (scope.compagnieIds) {
    where.compagnie_id = { [Op.in]: scope.compagnieIds };
  }

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    where[Op.or] = [
      { nom: { [Op.like]: q } },
      { adresse: { [Op.like]: q } },
      { telephone: { [Op.like]: q } },
      { email: { [Op.like]: q } },
    ];
  }
  if (filters.villeId) where.ville_id = filters.villeId;
  if (filters.statut) where.statut = filters.statut;
  if (filters.type) where.type = filters.type;

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [['nom', 'ASC']];
    case 'name_asc':
      return [['nom', 'ASC']];
    case 'name_desc':
      return [['nom', 'DESC']];
    case 'newest':
    default:
      return [['id', 'DESC']];
  }
};

/** Liste paginée + comptage total. */
const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Agence.findAndCountAll({
    where,
    include: listInclude,
    order: buildOrder(sort),
    distinct: true,
    offset,
    limit,
  });
  return { rows, count };
};

const findByIdFull = (id) => Agence.findOne({ where: { id }, include: detailInclude });

const findById = (id) => Agence.findByPk(id);

const findByName = (nom, compagnieId) =>
  Agence.findOne({ where: { nom, ...(compagnieId ? { compagnie_id: compagnieId } : {}) } });

const create = (data, options = {}) => Agence.create(data, options);

const update = (agence, data, options = {}) => agence.update(data, options);

const findAll = (where = {}) => Agence.findAll({ where, include: listInclude });

/* ══════════════════════════════════════════════════════════════
   Compteurs agrégés (tables métier sans modèle : reservation,
   depart) via SQL brut — réservés aux KPIs.
   ══════════════════════════════════════════════════════════════ */

const AGENCY_COUNT_SELECT = `
  (SELECT COUNT(*) FROM agent a WHERE a.agence_id = ag.id) AS agents,
  (SELECT COUNT(*) FROM guichet g WHERE g.agence_id = ag.id) AS guichets,
  (SELECT COUNT(*) FROM guichet g WHERE g.agence_id = ag.id AND g.statut = 'ouvert') AS guichets_ouverts,
  (SELECT COUNT(*) FROM reservation r WHERE r.agence_id = ag.id) AS reservations,
  (SELECT COUNT(*) FROM reservation r WHERE r.agence_id = ag.id AND r.statut = 'confirmee') AS reservations_confirmees,
  (SELECT COALESCE(SUM(montant), 0) FROM reservation r
     WHERE r.agence_id = ag.id AND r.statut = 'confirmee') AS revenus,
  (SELECT COUNT(DISTINCT r.depart_id) FROM reservation r WHERE r.agence_id = ag.id) AS voyages
`;

/** Compteurs pour une liste d'agences (une seule requête GROUP BY). */
const countsForAgencies = async (ids) => {
  if (!ids || !ids.length) return [];
  return sequelize.query(
    `SELECT ag.id, ${AGENCY_COUNT_SELECT} FROM agence ag WHERE ag.id IN (:ids)`,
    { type: QueryTypes.SELECT, replacements: { ids } }
  );
};

/** Compteurs pour une seule agence. */
const countsForAgency = async (id) => {
  const [rows] = await countsForAgencies([id]);
  return rows || null;
};

/** Villes disponibles (filtres + formulaires). */
const listVilles = () => Ville.findAll({ order: [['nom', 'ASC']] });

const findVilleById = (id) => Ville.findByPk(id);

/** Agences actives proches d'un point GPS (distance Haversine en km). */
const findNearby = async ({ lat, lng, radiusKm = 25, limit = 10 }) => {
  return sequelize.query(
    `SELECT ag.id, ag.nom, ag.ville_id, ag.adresse, ag.telephone, ag.type,
            ag.latitude, ag.longitude,
            IFNULL(
              ROUND(6371 * ACOS(
                LEAST(1, COS(RADIANS(:lat)) * COS(RADIANS(ag.latitude)) *
                COS(RADIANS(ag.longitude) - RADIANS(:lng)) +
                SIN(RADIANS(:lat)) * SIN(RADIANS(ag.latitude)))
              ), 1)
            , NULL) AS distance_km
       FROM agence ag
      WHERE ag.statut = 'actif'
        AND ag.latitude IS NOT NULL
        AND ag.longitude IS NOT NULL
      HAVING distance_km IS NOT NULL AND distance_km <= :radiusKm
      ORDER BY distance_km ASC
      LIMIT :limit`,
    { type: QueryTypes.SELECT, replacements: { lat, lng, radiusKm, limit } }
  );
};

module.exports = {
  listInclude,
  detailInclude,
  buildWhere,
  buildOrder,
  findPage,
  findByIdFull,
  findById,
  findByName,
  create,
  update,
  findAll,
  countsForAgencies,
  countsForAgency,
  listVilles,
  findVilleById,
  findNearby,
  Compagnie,
  Agent,
  Guichet,
};
