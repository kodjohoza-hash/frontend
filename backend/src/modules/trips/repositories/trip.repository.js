const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Depart,
  Trajet,
  Ville,
  Compagnie,
  Agence,
  Bus,
  Agent,
  Reservation,
  PlaceReservee,
} = require('../../../models');

/** Statuts de réservation qui bloquent un siège (disponibilité réelle). */
const HOLDING_RESERVATION_STATUTS = ['brouillon', 'en_attente', 'confirmee', 'payee', 'partiellement_payee'];

/** Associations de liste (itinéraire + villes + compagnie + agence + bus + chauffeurs). */
const listIncludes = [
  { model: Trajet, as: 'trajet', include: [
    { model: Ville, as: 'villeDepart' },
    { model: Ville, as: 'villeArrivee' },
  ] },
  { model: Compagnie, as: 'compagnie', attributes: ['id', 'nom', 'couleur', 'logo', 'statut', 'actif'] },
  { model: Agence, as: 'agence', attributes: ['id', 'nom'] },
  { model: Bus, as: 'bus', attributes: ['id', 'immatriculation', 'interne', 'modele', 'marque', 'capacite', 'type_bus', 'classe', 'statut'] },
  { model: Agent, as: 'chauffeur', attributes: ['id', 'prenom', 'nom', 'matricule'] },
  { model: Agent, as: 'chauffeurRemplacant', attributes: ['id', 'prenom', 'nom', 'matricule'] },
];

/** Associations de détail (liste + escales de l'itinéraire). */
const detailIncludes = [
  ...listIncludes,
  { model: Trajet, as: 'trajet', include: [
    { model: Ville, as: 'villeDepart' },
    { model: Ville, as: 'villeArrivee' },
    { model: sequelize.models.Escale, as: 'escales', include: [{ model: Ville, as: 'ville' }], order: [['ordre', 'ASC']], required: false },
  ] },
];

/** Clause WHERE des filtres de la liste (périmètre + filtres validés). */
const buildWhere = (filters = {}, scope = {}) => {
  const where = {};

  if (scope.compagnieId) where.compagnie_id = scope.compagnieId;
  if (scope.agenceId) where.agence_id = scope.agenceId;

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    where[Op.or] = [
      { code: { [Op.like]: q } },
      { id: { [Op.like]: q } },
      { '$trajet.villeDepart.nom$': { [Op.like]: q } },
      { '$trajet.villeArrivee.nom$': { [Op.like]: q } },
      { '$trajet.code$': { [Op.like]: q } },
      { '$compagnie.nom$': { [Op.like]: q } },
      { '$bus.immatriculation$': { [Op.like]: q } },
      { '$bus.interne$': { [Op.like]: q } },
    ];
  }

  if (filters.statut) where.statut = filters.statut;
  if (filters.from) where['$trajet.ville_depart_id$'] = filters.from;
  if (filters.to) where['$trajet.ville_arrivee_id$'] = filters.to;
  if (filters.companyId) where.compagnie_id = filters.companyId;

  if (filters.date) where.date_depart = filters.date;
  if (filters.dateFrom || filters.dateTo) {
    where.date_depart = {};
    if (filters.dateFrom) where.date_depart[Op.gte] = filters.dateFrom;
    if (filters.dateTo) where.date_depart[Op.lte] = filters.dateTo;
  }

  if (filters.priceMin !== undefined && filters.priceMin !== null && filters.priceMin !== '') {
    where.prix_base = { ...(where.prix_base || {}), [Op.gte]: Number(filters.priceMin) };
  }
  if (filters.priceMax !== undefined && filters.priceMax !== null && filters.priceMax !== '') {
    where.prix_base = { ...(where.prix_base || {}), [Op.lte]: Number(filters.priceMax) };
  }

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'date') => {
  switch (sort) {
    case 'oldest':
      return [['date_creation', 'ASC']];
    case 'date_asc':
      return [['date_depart', 'ASC'], ['heure_depart', 'ASC']];
    case 'date_desc':
      return [['date_depart', 'DESC'], ['heure_depart', 'DESC']];
    case 'price_asc':
      return [['prix_base', 'ASC']];
    case 'price_desc':
      return [['prix_base', 'DESC']];
    case 'status':
      return [['statut', 'ASC'], ['date_depart', 'ASC']];
    case 'capacity_asc':
      return [['places_total', 'ASC']];
    case 'capacity_desc':
      return [['places_total', 'DESC']];
    case 'newest':
    default:
      return [['date_depart', 'DESC'], ['heure_depart', 'DESC']];
  }
};

/** Liste paginée (admin) — ORM avec associations. */
const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'date' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Depart.findAndCountAll({
    where,
    include: listIncludes,
    order: buildOrder(sort),
    distinct: true,
    subQuery: false,
    offset,
    limit,
  });
  return { rows, count };
};

/**
 * Recherche publique : voyages réservables.
 * Ne renvoie QUE les voyages :
 *   - statut programme / embarquement
 *   - date de départ >= aujourd'hui
 *   - places disponibles (réelles) > 0
 *   - compagnie active
 *   - bus opérationnel
 */
const publicSearch = async ({ filters = {}, page = 1, limit = 20 }) => {
  const conditions = [
    `d.statut IN ('programme','embarquement')`,
    `d.date_depart >= CURDATE()`,
    `(d.places_total - COALESCE(o.occupees, 0)) > 0`,
    `c.statut = 'actif' AND c.actif = 1`,
    `b.statut <> 'inactive'`,
  ];
  const params = {};

  /* from/to acceptent un identifiant ville (ex: DLA) OU un nom de ville
     (ex: Douala), insensible à la casse, pour la recherche publique. */
  if (filters.from) {
    conditions.push(`(t.ville_depart_id = :from OR LOWER(TRIM(vd.nom)) = LOWER(TRIM(:from)))`);
    params.from = filters.from;
  }
  if (filters.to) {
    conditions.push(`(t.ville_arrivee_id = :to OR LOWER(TRIM(va.nom)) = LOWER(TRIM(:to)))`);
    params.to = filters.to;
  }
  if (filters.date) { conditions.push(`d.date_depart = :date`); params.date = filters.date; }
  if (filters.dateFrom) { conditions.push(`d.date_depart >= :dateFrom`); params.dateFrom = filters.dateFrom; }
  if (filters.dateTo) { conditions.push(`d.date_depart <= :dateTo`); params.dateTo = filters.dateTo; }
  if (filters.companyId) { conditions.push(`d.compagnie_id = :companyId`); params.companyId = filters.companyId; }
  if (filters.recherche) {
    conditions.push(`(d.code LIKE :recherche OR vd.nom LIKE :recherche OR va.nom LIKE :recherche OR c.nom LIKE :recherche OR b.immatriculation LIKE :recherche)`);
    params.recherche = `%${filters.recherche.trim()}%`;
  }
  if (filters.priceMin !== undefined && filters.priceMin !== null && filters.priceMin !== '') {
    conditions.push(`d.prix_base >= :priceMin`);
    params.priceMin = Number(filters.priceMin);
  }
  if (filters.priceMax !== undefined && filters.priceMax !== null && filters.priceMax !== '') {
    conditions.push(`d.prix_base <= :priceMax`);
    params.priceMax = Number(filters.priceMax);
  }

  const order = publicSortClause(filters.sort);

  const where = conditions.join(' AND ');
  const offset = (page - 1) * limit;

  const rows = await sequelize.query(
    `SELECT d.*,
            t.id AS trajet_id, t.code AS trajet_code,
            vd.nom AS ville_depart_nom, va.nom AS ville_arrivee_nom,
            c.nom AS compagnie_nom, c.couleur AS compagnie_couleur, c.logo AS compagnie_logo,
            b.immatriculation AS bus_immatriculation, b.interne AS bus_interne,
            b.modele AS bus_modele, b.marque AS bus_marque, b.type_bus, b.classe, b.capacite,
            ag.nom AS agence_nom,
            COALESCE(o.occupees, 0) AS occupees
       FROM depart d
       JOIN trajet t  ON t.id = d.trajet_id
       JOIN ville vd  ON vd.id = t.ville_depart_id
       JOIN ville va  ON va.id = t.ville_arrivee_id
       JOIN compagnie c ON c.id = d.compagnie_id
       JOIN bus b     ON b.id = d.bus_id
       LEFT JOIN agence ag ON ag.id = d.agence_id
       LEFT JOIN (
         SELECT r.depart_id, COUNT(*) AS occupees
           FROM place_reservee pr
           JOIN reservation r ON r.id = pr.reservation_id
          WHERE r.statut IN (:holding)
          GROUP BY r.depart_id
       ) o ON o.depart_id = d.id
      WHERE ${where}
      ORDER BY ${order}
      LIMIT :limit OFFSET :offset`,
    {
      type: QueryTypes.SELECT,
      replacements: { ...params, holding: HOLDING_RESERVATION_STATUTS, limit, offset },
    }
  );

  const totalRow = await sequelize.query(
    `SELECT COUNT(*) AS total
       FROM depart d
       JOIN trajet t  ON t.id = d.trajet_id
       JOIN ville vd  ON vd.id = t.ville_depart_id
       JOIN ville va  ON va.id = t.ville_arrivee_id
       JOIN compagnie c ON c.id = d.compagnie_id
       JOIN bus b     ON b.id = d.bus_id
       LEFT JOIN (
         SELECT r.depart_id, COUNT(*) AS occupees
           FROM place_reservee pr
           JOIN reservation r ON r.id = pr.reservation_id
          WHERE r.statut IN (:holding)
          GROUP BY r.depart_id
       ) o ON o.depart_id = d.id
      WHERE ${where}`,
    { type: QueryTypes.SELECT, replacements: { ...params, holding: HOLDING_RESERVATION_STATUTS } }
  );

  return { rows, total: Number(totalRow?.[0]?.total) || 0 };
};

/** Clause ORDER BY de la recherche publique (tri limité aux colonnes sécurisées). */
const publicSortClause = (sort) => {
  switch (sort) {
    case 'price_asc': return 'd.prix_base ASC, d.date_depart ASC, d.heure_depart ASC';
    case 'price_desc': return 'd.prix_base DESC, d.date_depart ASC, d.heure_depart ASC';
    case 'capacity_asc': return 'd.places_total ASC, d.date_depart ASC';
    case 'capacity_desc': return 'd.places_total DESC, d.date_depart ASC';
    case 'oldest': return 'd.date_depart ASC, d.heure_depart ASC';
    default: return 'd.date_depart ASC, d.heure_depart ASC';
  }
};

const findByIdFull = (id) => Depart.findOne({ where: { id }, include: detailIncludes });

const findById = (id) => Depart.findOne({ where: { id }, include: listIncludes });

const findByPk = (id) => Depart.findByPk(id);

const findByCode = (code) => Depart.findOne({ where: { code } });

const createDepart = (data, options = {}) => Depart.create(data, options);

const updateDepart = (depart, data, options = {}) => depart.update(data, options);

const destroyDepart = (depart, options = {}) => depart.destroy(options);

/** Nombre de réservations référençant ce voyage. */
const countReservations = async (departId) =>
  Reservation.count({ where: { depart_id: departId } });

/** Sièges réellement occupés par voyage (map depart_id → nombre). */
const batchAvailability = async (departIds) => {
  if (!departIds || !departIds.length) return new Map();
  const rows = await PlaceReservee.findAll({
    attributes: [
      'reservation.depart_id',
      [sequelize.fn('COUNT', sequelize.col('PlaceReservee.id')), 'occupees'],
    ],
    include: [{ model: Reservation, as: 'reservation', attributes: [], where: {
      depart_id: { [Op.in]: departIds },
      statut: { [Op.in]: HOLDING_RESERVATION_STATUTS },
    } }],
    group: ['reservation.depart_id'],
    raw: true,
  });
  const map = new Map();
  rows.forEach((r) => map.set(r.depart_id, Number(r.occupees)));
  return map;
};

/** Sièges réellement occupés pour UN voyage. */
const availabilityFor = async (departId) => {
  const map = await batchAvailability([departId]);
  return map.get(departId) || 0;
};

/**
 * Voyages en conflit pour un même bus (même date, horaires qui se chevauchent,
 * statut non terminal). Retourne la liste des voyages conflictuels.
 */
const findOverlappingBus = async ({ busId, date, depMinutes, arrMinutes, overnight, excludeId }) => {
  const conditions = { bus_id: busId, date_depart: date, statut: { [Op.notIn]: ['termine', 'annule'] } };
  if (excludeId) conditions.id = { [Op.ne]: excludeId };
  const candidates = await Depart.findAll({ where: conditions, attributes: ['id', 'date_depart', 'date_arrivee', 'heure_depart', 'heure_arrivee'] });
  return candidates.filter((t) => {
    const d = timeToMinutes(t.heure_depart);
    const a = timeToMinutes(t.heure_arrivee) + (t.date_arrivee && t.date_arrivee > t.date_depart ? 1440 : 0);
    return d < arrMinutes + (overnight ? 1440 : 0) && depMinutes < a;
  });
};

/** Voyages en conflit pour un même chauffeur (mêmes règles que le bus). */
const findOverlappingDriver = async ({ driverId, date, depMinutes, arrMinutes, overnight, excludeId }) => {
  const conditions = { chauffeur_id: driverId, date_depart: date, statut: { [Op.notIn]: ['termine', 'annule'] } };
  if (excludeId) conditions.id = { [Op.ne]: excludeId };
  const candidates = await Depart.findAll({ where: conditions, attributes: ['id', 'date_depart', 'date_arrivee', 'heure_depart', 'heure_arrivee'] });
  return candidates.filter((t) => {
    const d = timeToMinutes(t.heure_depart);
    const a = timeToMinutes(t.heure_arrivee) + (t.date_arrivee && t.date_arrivee > t.date_depart ? 1440 : 0);
    return d < arrMinutes + (overnight ? 1440 : 0) && depMinutes < a;
  });
};

/** « HH:MM(:SS) » → minutes. */
const timeToMinutes = (t) => {
  const parts = String(t).split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
};

/** KPIs voyages (périmètre par rôle). */
const stats = async (scope = {}) => {
  const companyWhere = scope.compagnieId ? 'AND d.compagnie_id = :compagnieId' : '';
  const agenceWhere = scope.agenceId ? 'AND d.agence_id = :agenceId' : '';
  const params = {};
  if (scope.compagnieId) params.compagnieId = scope.compagnieId;
  if (scope.agenceId) params.agenceId = scope.agenceId;

  const row = await sequelize.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(d.date_depart = CURDATE()), 0) AS today,
            COALESCE(SUM(d.statut IN ('programme','embarquement','retarde') AND d.date_depart >= CURDATE()), 0) AS planned,
            COALESCE(SUM(d.statut = 'en_cours'), 0) AS active,
            COALESCE(SUM(d.statut = 'termine'), 0) AS completed,
            COALESCE(SUM(d.statut = 'annule'), 0) AS cancelled,
            COALESCE(SUM(d.places_dispo = 0 AND d.statut NOT IN ('annule','termine')), 0) AS full,
            COALESCE(SUM(d.places_total), 0) AS seats_total,
            COALESCE(SUM(d.places_total - d.places_dispo), 0) AS seats_sold
       FROM depart d
      WHERE 1 = 1 ${companyWhere} ${agenceWhere}`,
    { type: QueryTypes.SELECT, replacements: params }
  );

  const r = row?.[0] || {};
  const total = Number(r.total) || 0;
  const seatsTotal = Number(r.seats_total) || 0;
  return {
    total,
    today: Number(r.today) || 0,
    planned: Number(r.planned) || 0,
    active: Number(r.active) || 0,
    completed: Number(r.completed) || 0,
    cancelled: Number(r.cancelled) || 0,
    full: Number(r.full) || 0,
    occupancy: seatsTotal ? Math.round(((Number(r.seats_sold) || 0) / seatsTotal) * 100) : 0,
  };
};

module.exports = {
  HOLDING_RESERVATION_STATUTS,
  listIncludes,
  detailIncludes,
  buildWhere,
  buildOrder,
  findPage,
  publicSearch,
  findByIdFull,
  findById,
  findByPk,
  findByCode,
  createDepart,
  updateDepart,
  destroyDepart,
  countReservations,
  batchAvailability,
  availabilityFor,
  findOverlappingBus,
  findOverlappingDriver,
  stats,
};
