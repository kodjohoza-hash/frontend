const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Billet,
  ScanBillet,
  Reservation,
  PlaceReservee,
  Client,
  Agent,
  Depart,
  Bus,
  Trajet,
  Agence,
  Compagnie,
  Ville,
  HistoriqueReservation,
  Passenger,
  EmergencyContact,
} = require('../../../models');

const clientAttrs = ['id', 'prenom', 'nom', 'telephone', 'email'];
const agentAttrs = ['id', 'prenom', 'nom', 'matricule'];
const agenceAttrs = ['id', 'nom', 'telephone', 'compagnie_id'];
const compagnieAttrs = ['id', 'nom', 'couleur', 'logo', 'telephone', 'email', 'adresse', 'site_web'];
const villeAttrs = ['id', 'nom'];

/** Associations du voyage (trajet + villes, bus, compagnie, agence). */
const departInclude = [
  {
    model: Trajet,
    as: 'trajet',
    include: [
      { model: Ville, as: 'villeDepart', attributes: villeAttrs },
      { model: Ville, as: 'villeArrivee', attributes: villeAttrs },
    ],
  },
  { model: Bus, as: 'bus', attributes: ['id', 'immatriculation', 'type_bus', 'classe', 'capacite'] },
  { model: Compagnie, as: 'compagnie', attributes: compagnieAttrs },
  { model: Agence, as: 'agence', attributes: agenceAttrs },
];

/** Associations de détail d'un billet (client, émetteur, vérificateur, réservation, voyage). */
const detailInclude = [
  { model: Client, as: 'client', attributes: clientAttrs },
  { model: Agent, as: 'creePar', attributes: agentAttrs },
  { model: Agent, as: 'verifiePar', attributes: agentAttrs },
  {
    model: Reservation,
    as: 'reservation',
    attributes: ['id', 'reference', 'statut', 'nb_places', 'montant', 'agence_id', 'date_creation'],
    include: [{ model: Agence, as: 'agence', attributes: agenceAttrs }],
  },
  {
    model: Depart,
    as: 'depart',
    attributes: ['id', 'code', 'date_depart', 'heure_depart', 'date_arrivee', 'heure_arrivee', 'prix_base', 'quai', 'statut'],
    include: departInclude,
  },
];

/* ══════════════════════════════════════════════════════════════
   Constructions de requêtes
   ══════════════════════════════════════════════════════════════ */

/** Construit la clause WHERE (périmètre + filtres) pour la liste Sequelize. */
const buildWhere = (filters = {}, scope = {}) => {
  const where = {};

  if (scope.clientId) {
    where.client_id = scope.clientId;
  }
  if (scope.agenceIds) {
    where['$reservation.agence_id$'] = scope.agenceIds.length ? { [Op.in]: scope.agenceIds } : { [Op.in]: [] };
  }

  if (filters.statut) where.statut = filters.statut;
  if (filters.reservationId) where.reservation_id = filters.reservationId;
  if (filters.departId) where.depart_id = filters.departId;
  if (filters.clientId && !scope.clientId) where.client_id = filters.clientId;
  if (filters.agenceId && !scope.agenceIds) where['$reservation.agence_id$'] = filters.agenceId;

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    where[Op.or] = [
      { reference: { [Op.like]: q } },
      { id: { [Op.like]: q } },
      { code_barre: { [Op.like]: q } },
      { '$client.prenom$': { [Op.like]: q } },
      { '$client.nom$': { [Op.like]: q } },
      { '$client.telephone$': { [Op.like]: q } },
      { '$reservation.reference$': { [Op.like]: q } },
      { '$depart.code$': { [Op.like]: q } },
    ];
  }

  if (filters.dateDebut || filters.dateFin) {
    const range = {};
    if (filters.dateDebut) range[Op.gte] = `${filters.dateDebut} 00:00:00`;
    if (filters.dateFin) range[Op.lte] = `${filters.dateFin} 23:59:59`;
    where.cree_le = range;
  }

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [['cree_le', 'ASC']];
    case 'prix_desc':
      return [['prix', 'DESC']];
    case 'prix_asc':
      return [['prix', 'ASC']];
    case 'newest':
    default:
      return [['cree_le', 'DESC']];
  }
};

const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Billet.findAndCountAll({
    where,
    include: detailInclude,
    order: buildOrder(sort),
    distinct: true,
    subQuery: false,
    offset,
    limit,
  });
  return { rows, count };
};

const findByIdFull = (id) => Billet.findOne({ where: { id }, include: detailInclude });

const findById = (id) => Billet.findByPk(id);

const findBilletByReference = (reference) => Billet.findOne({ where: { reference } });

const findBilletByToken = (token) => Billet.findOne({ where: { token } });

const findBilletByTokenHash = (hash) => Billet.findOne({ where: { token_hash: hash } });

const findFullByTokenHash = (hash) => Billet.findOne({ where: { token_hash: hash }, include: detailInclude });

const createScanBillet = (data, options = {}) => ScanBillet.create(data, options);

const createBillet = (data, options = {}) => Billet.create(data, options);

const updateBillet = (billet, data, options = {}) => billet.update(data, options);

const findBilletsByReservation = (reservationId, options = {}) =>
  Billet.findAll({ where: { reservation_id: reservationId }, ...options });

const countBilletsByReservation = (reservationId, options = {}) =>
  Billet.count({ where: { reservation_id: reservationId }, ...options });

/** Réservation complète (sièges + passagers + client + voyage + agence) pour l'émission. */
const findReservationWithPlaces = (id) =>
  Reservation.findByPk(id, {
    include: [
      { model: PlaceReservee, as: 'places' },
      {
        model: Passenger,
        as: 'passengers',
        attributes: ['id', 'place_reservee_id', 'first_name', 'last_name', 'gender', 'birth_date', 'phone', 'email'],
        include: [
          { model: PlaceReservee, as: 'place', attributes: ['id', 'siege'] },
          { model: EmergencyContact, as: 'emergencyContact', attributes: ['id', 'full_name', 'phone', 'relationship', 'address'] },
        ],
      },
      { model: Client, as: 'client', attributes: clientAttrs },
      {
        model: Depart,
        as: 'depart',
        attributes: ['id', 'code', 'date_depart', 'heure_depart', 'prix_base', 'places_total', 'statut'],
        include: departInclude,
      },
      { model: Agence, as: 'agence', attributes: agenceAttrs },
    ],
  });

const findAgencesByCompagnie = (compagnieId) =>
  Agence.findAll({ where: { compagnie_id: compagnieId }, attributes: ['id'] });

/** Historique d'audit (mêmes conventions que les modules Bookings/Payments). */
const createHistorique = (data, options = {}) => HistoriqueReservation.create(data, options);

/* ══════════════════════════════════════════════════════════════
   Statistiques (tableaux de bord)
   ══════════════════════════════════════════════════════════════ */

/** Périmètre SQL (join via `reservation` pour agences / compagnie). */
const scopeClause = (scope = {}) => {
  if (scope.agenceIds) {
    return { sql: 'r.agence_id IN (:agenceIds)', params: { agenceIds: scope.agenceIds } };
  }
  if (scope.compagnieId) {
    return {
      sql: 'r.agence_id IN (SELECT id FROM agence WHERE compagnie_id = :compagnieId)',
      params: { compagnieId: scope.compagnieId },
    };
  }
  if (scope.clientId) {
    return { sql: 'b.client_id = :clientId', params: { clientId: scope.clientId } };
  }
  return { sql: '', params: {} };
};

/** Clause de dates (période ou bornes explicites). Valeurs validées par Joi. */
const dateClause = (filters = {}) => {
  if (filters.dateDebut || filters.dateFin) {
    const range = [];
    if (filters.dateDebut) range.push(`b.cree_le >= '${filters.dateDebut} 00:00:00'`);
    if (filters.dateFin) range.push(`b.cree_le <= '${filters.dateFin} 23:59:59'`);
    return range.join(' AND ');
  }
  switch (filters.periode || 'tout') {
    case 'jour':
      return 'b.cree_le >= CURDATE()';
    case 'semaine':
      return 'b.cree_le >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    case 'mois':
      return 'b.cree_le >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    default:
      return '';
  }
};

/** Assemble la clause WHERE SQL complète (périmètre + dates). */
const buildStatsWhere = ({ filters = {}, scope = {} } = {}) => {
  const parts = [];
  const params = {};

  const scopeResult = scopeClause(scope);
  if (scopeResult.sql) {
    parts.push(scopeResult.sql);
    Object.assign(params, scopeResult.params);
  }

  if (filters.agenceId) {
    parts.push('r.agence_id = :agenceId');
    params.agenceId = filters.agenceId;
  }

  const dc = dateClause(filters);
  if (dc) parts.push(dc);

  return {
    where: parts.length ? `WHERE ${parts.join(' AND ')}` : '',
    params,
  };
};

const FROM = 'FROM billet b LEFT JOIN reservation r ON r.id = b.reservation_id';

/** Synthèse : totaux émis, par statut, vérifiés, aujourd'hui, semaine. */
const summary = async ({ filters = {}, scope = {} } = {}) => {
  const { where, params } = buildStatsWhere({ filters, scope });
  const [row] = await sequelize.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN b.statut = 'valide' THEN 1 ELSE 0 END), 0) AS valides,
            COALESCE(SUM(CASE WHEN b.statut = 'utilise' THEN 1 ELSE 0 END), 0) AS utilises,
            COALESCE(SUM(CASE WHEN b.statut = 'annule' THEN 1 ELSE 0 END), 0) AS annules,
            COALESCE(SUM(CASE WHEN b.statut = 'rembourse' THEN 1 ELSE 0 END), 0) AS rembourses,
            COALESCE(SUM(CASE WHEN b.statut = 'expire' THEN 1 ELSE 0 END), 0) AS expires,
            COALESCE(SUM(CASE WHEN b.verifie_le IS NOT NULL THEN 1 ELSE 0 END), 0) AS verifies,
            COALESCE(SUM(CASE WHEN DATE(b.cree_le) = CURDATE() THEN 1 ELSE 0 END), 0) AS today_total,
            COALESCE(SUM(CASE WHEN b.cree_le >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 ELSE 0 END), 0) AS week_total
       ${FROM}
       ${where}`,
    { type: QueryTypes.SELECT, replacements: params }
  );

  return {
    total: Number(row?.total) || 0,
    valides: Number(row?.valides) || 0,
    utilises: Number(row?.utilises) || 0,
    annules: Number(row?.annules) || 0,
    rembourses: Number(row?.rembourses) || 0,
    expires: Number(row?.expires) || 0,
    verifies: Number(row?.verifies) || 0,
    today: Number(row?.today_total) || 0,
    week: Number(row?.week_total) || 0,
  };
};

/** Répartition par statut. */
const byStatut = async ({ filters = {}, scope = {} } = {}) => {
  const { where, params } = buildStatsWhere({ filters, scope });
  const rows = await sequelize.query(
    `SELECT b.statut AS statut, COUNT(*) AS total
       ${FROM}
       ${where}
      GROUP BY b.statut
      ORDER BY total DESC`,
    { type: QueryTypes.SELECT, replacements: params }
  );
  return rows.map((r) => ({ statut: r.statut, total: Number(r.total) }));
};

/** Tendances quotidiennes (7 derniers jours). */
const byJour = async ({ filters = {}, scope = {} } = {}) => {
  const base = buildStatsWhere({ filters, scope });
  const parts = [base.where && base.where.replace(/^WHERE /, '')].filter(Boolean);
  parts.push('b.cree_le >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)');
  const where = `WHERE ${parts.join(' AND ')}`;
  const rows = await sequelize.query(
    `SELECT DATE(b.cree_le) AS jour, COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN b.statut = 'valide' THEN 1 ELSE 0 END), 0) AS valides
       ${FROM}
       ${where}
      GROUP BY DATE(b.cree_le)
      ORDER BY jour ASC`,
    { type: QueryTypes.SELECT, replacements: base.params }
  );
  return rows.map((r) => ({ jour: r.jour, total: Number(r.total), valides: Number(r.valides) }));
};

module.exports = {
  buildWhere,
  buildOrder,
  findPage,
  findByIdFull,
  findById,
  findBilletByReference,
  findBilletByToken,
  findBilletByTokenHash,
  findFullByTokenHash,
  createScanBillet,
  createBillet,
  updateBillet,
  findBilletsByReservation,
  countBilletsByReservation,
  findReservationWithPlaces,
  findAgencesByCompagnie,
  createHistorique,
  summary,
  byStatut,
  byJour,
};
