const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Trajet,
  Escale,
  Ville,
  Compagnie,
  Depart,
} = require('../../../models');

/** Associations de liste (villes + compagnie). */
const listInclude = [
  { model: Ville, as: 'villeDepart' },
  { model: Ville, as: 'villeArrivee' },
  { model: Compagnie, as: 'compagnie', attributes: ['id', 'nom', 'couleur', 'logo'] },
];

/** Associations de détail (liste + escales triées + nombre de voyages). */
const detailInclude = [
  ...listInclude,
  { model: Escale, as: 'escales', include: [{ model: Ville, as: 'ville' }], order: [['ordre', 'ASC']] },
];

/** Construit la clause WHERE à partir des filtres validés + périmètre. */
const buildWhere = (filters = {}, scope = {}) => {
  const where = {};

  if (scope.compagnieId) {
    where.compagnie_id = scope.compagnieId;
  }

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    where[Op.or] = [
      { nom: { [Op.like]: q } },
      { code: { [Op.like]: q } },
      { id: { [Op.like]: q } },
      { '$villeDepart.nom$': { [Op.like]: q } },
      { '$villeArrivee.nom$': { [Op.like]: q } },
      { '$compagnie.nom$': { [Op.like]: q } },
    ];
  }

  if (filters.statut) where.statut = filters.statut;
  if (filters.villeDepart) where.ville_depart_id = filters.villeDepart;
  if (filters.villeArrivee) where.ville_arrivee_id = filters.villeArrivee;
  if (filters.compagnieId) where.compagnie_id = filters.compagnieId;

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [['date_creation', 'ASC']];
    case 'name_asc':
      return [['nom', 'ASC']];
    case 'name_desc':
      return [['nom', 'DESC']];
    case 'distance_asc':
      return [['distance_km', 'ASC']];
    case 'distance_desc':
      return [['distance_km', 'DESC']];
    case 'duration_asc':
      return [['duree', 'ASC']];
    case 'duration_desc':
      return [['duree', 'DESC']];
    case 'newest':
    default:
      return [['date_creation', 'DESC']];
  }
};

/** Liste paginée + comptage total. */
const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Trajet.findAndCountAll({
    where,
    include: listInclude,
    order: buildOrder(sort),
    distinct: true,
    subQuery: false,
    offset,
    limit,
  });
  return { rows, count };
};

const findByIdFull = (id) => Trajet.findOne({ where: { id }, include: detailInclude });

const findById = (id) => Trajet.findOne({ where: { id }, include: listInclude });

const findRoute = (id) => Trajet.findByPk(id);

const findByCode = (code) => Trajet.findOne({ where: { code } });

const findAll = (where = {}) => Trajet.findAll({ where, include: listInclude });

const createRoute = (data, options = {}) => Trajet.create(data, options);

const updateRoute = (route, data, options = {}) => route.update(data, options);

const countDeparts = (trajetId) => Depart.count({ where: { trajet_id: trajetId } });

/** Nombre d'escales par itinéraire (évite le N+1 en liste). */
const countEscalesByTrajets = async (trajetIds) => {
  if (!trajetIds || !trajetIds.length) return new Map();
  const rows = await Escale.findAll({
    where: { trajet_id: { [Op.in]: trajetIds } },
    attributes: ['trajet_id', [sequelize.fn('COUNT', sequelize.col('Escale.id')), 'nb']],
    group: ['trajet_id'],
    raw: true,
  });
  return new Map(rows.map((r) => [r.trajet_id, Number(r.nb)]));
};

/* ══════════════════════════════════════════════════════════════
   Escales
   ══════════════════════════════════════════════════════════════ */

const listEscales = (trajetId, options = {}) =>
  Escale.findAll({
    where: { trajet_id: trajetId },
    include: [{ model: Ville, as: 'ville' }],
    order: [['ordre', 'ASC']],
    ...options,
  });

const findEscale = (id) => Escale.findByPk(id);

const findEscaleByOrder = (trajetId, ordre) =>
  Escale.findOne({ where: { trajet_id: trajetId, ordre } });

const createEscale = (data, options = {}) => Escale.create(data, options);

const updateEscale = (escale, data, options = {}) => escale.update(data, options);

const deleteEscale = (escale, options = {}) => escale.destroy(options);

/* ══════════════════════════════════════════════════════════════
   Villes
   ══════════════════════════════════════════════════════════════ */

const listVilles = (where = {}, options = {}) =>
  Ville.findAll({ where, order: [['nom', 'ASC']], ...options });

const findVille = (id) => Ville.findByPk(id);

const createVille = (data, options = {}) => Ville.create(data, options);

const updateVille = (ville, data, options = {}) => ville.update(data, options);

/** Nombre de références d'une ville (agences, itinéraires, escales). */
const countVilleUsage = async (villeId) => {
  const [row] = await sequelize.query(
    `SELECT
       (SELECT COUNT(*) FROM agence WHERE ville_id = :id)  AS agences,
       (SELECT COUNT(*) FROM trajet WHERE ville_depart_id = :id) AS trajets_depart,
       (SELECT COUNT(*) FROM trajet WHERE ville_arrivee_id = :id) AS trajets_arrivee,
       (SELECT COUNT(*) FROM escale WHERE ville_id = :id)   AS escales`,
    { type: QueryTypes.SELECT, replacements: { id: villeId } }
  );
  return row || { agences: 0, trajets_depart: 0, trajets_arrivee: 0, escales: 0 };
};

/* ══════════════════════════════════════════════════════════════
   Statistiques (KPIs tableau de bord)
   ══════════════════════════════════════════════════════════════ */

/** KPIs : total / actifs / inactifs / archivés / distance / villes desservies. */
const stats = async (scope = {}) => {
  const companyWhere = scope.compagnieId
    ? `WHERE t.compagnie_id = :compagnieId`
    : '';
  const params = scope.compagnieId ? { compagnieId: scope.compagnieId } : {};

  const [row] = await sequelize.query(
    `SELECT COUNT(*)                                                          AS total,
            COALESCE(SUM(t.statut = 'active'), 0)                             AS actifs,
            COALESCE(SUM(t.statut = 'inactive'), 0)                           AS inactifs,
            COALESCE(SUM(t.statut = 'archived'), 0)                           AS archives,
            COALESCE(SUM(t.statut = 'active' AND t.distance_km IS NOT NULL), 0) AS trajets_distance,
            COALESCE(SUM(CASE WHEN t.statut = 'active' AND t.distance_km IS NOT NULL THEN t.distance_km ELSE 0 END), 0) AS distance_km
       FROM trajet t
       ${companyWhere}`,
    { type: QueryTypes.SELECT, replacements: params }
  );

  const [villes] = await sequelize.query(
    `SELECT COUNT(DISTINCT v.id) AS villes
       FROM ville v
      WHERE v.statut = 'active'
        AND (v.id IN (SELECT ville_depart_id  FROM trajet t ${companyWhere})
          OR v.id IN (SELECT ville_arrivee_id FROM trajet t ${companyWhere})
          OR v.id IN (SELECT e.ville_id FROM escale e JOIN trajet t ON t.id = e.trajet_id ${companyWhere}))`,
    { type: QueryTypes.SELECT, replacements: params }
  );

  return {
    total: Number(row?.total) || 0,
    actifs: Number(row?.actifs) || 0,
    inactifs: Number(row?.inactifs) || 0,
    archives: Number(row?.archives) || 0,
    totalDistanceKm: Number(row?.distance_km) || 0,
    villesDesservies: Number(villes?.villes) || 0,
  };
};

module.exports = {
  listInclude,
  detailInclude,
  buildWhere,
  buildOrder,
  findPage,
  findByIdFull,
  findById,
  findRoute,
  findByCode,
  findAll,
  createRoute,
  updateRoute,
  countDeparts,
  countEscalesByTrajets,
  listEscales,
  findEscale,
  findEscaleByOrder,
  createEscale,
  updateEscale,
  deleteEscale,
  listVilles,
  findVille,
  createVille,
  updateVille,
  countVilleUsage,
  stats,
};
