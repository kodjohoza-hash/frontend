const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Reservation,
  PlaceReservee,
  Paiement,
  HistoriqueReservation,
  Client,
  Depart,
  Bus,
  Trajet,
  Agence,
  Compagnie,
  Agent,
  Guichet,
  Ville,
} = require('../../../models');

/** Statuts qui « bloquent » un siège (en attente / brouillon, expirent). */
const HOLDING_STATUTS = ['brouillon', 'en_attente'];

/** Statuts qui occupent / réservent / bloquent un siège (tous sauf finaux). */
const ACTIVE_STATUTS = ['brouillon', 'en_attente', 'confirmee', 'payee', 'partiellement_payee'];

const clientAttrs = ['id', 'prenom', 'nom', 'telephone', 'email'];
const agentAttrs = ['id', 'prenom', 'nom', 'matricule'];
const agenceAttrs = ['id', 'nom', 'telephone', 'compagnie_id'];
const compagnieAttrs = ['id', 'nom', 'couleur', 'logo'];
const villeAttrs = ['id', 'nom'];
const paiementAttrs = ['id', 'reference', 'montant', 'methode', 'statut', 'cree_le', 'paiement_le', 'note'];

const departInclude = [
  { model: Trajet, as: 'trajet', include: [
    { model: Ville, as: 'villeDepart', attributes: villeAttrs },
    { model: Ville, as: 'villeArrivee', attributes: villeAttrs },
  ] },
  { model: Bus, as: 'bus', attributes: ['id', 'immatriculation', 'type_bus', 'classe', 'capacite'] },
  { model: Compagnie, as: 'compagnie', attributes: compagnieAttrs },
  { model: Agence, as: 'agence', attributes: agenceAttrs },
];

/** Associations de liste (client, voyage, agence, agent, guichet, sièges, paiements). */
const listInclude = [
  { model: Client, as: 'client', attributes: clientAttrs },
  { model: Depart, as: 'depart', attributes: ['id', 'code', 'date_depart', 'heure_depart', 'prix_base', 'places_total', 'places_dispo', 'statut'], include: departInclude },
  { model: Agence, as: 'agence', attributes: agenceAttrs },
  { model: Agent, as: 'agent', attributes: agentAttrs },
  { model: Guichet, as: 'guichet', attributes: ['id', 'code', 'nom'] },
  { model: PlaceReservee, as: 'places' },
  { model: Paiement, as: 'paiements', attributes: paiementAttrs },
];

/** Associations de détail (liste + historique d'audit). */
const detailInclude = [
  ...listInclude,
  { model: HistoriqueReservation, as: 'historique', order: [['timestamp', 'ASC']] },
];

/* ══════════════════════════════════════════════════════════════
   Constructions de requêtes
   ══════════════════════════════════════════════════════════════ */

/** Construit la clause WHERE à partir des filtres validés + périmètre. */
const buildWhere = (filters = {}, scope = {}) => {
  const where = {};

  if (scope.clientId) {
    where.client_id = scope.clientId;
  }
  if (scope.agenceIds) {
    where.agence_id = scope.agenceIds.length ? { [Op.in]: scope.agenceIds } : { [Op.in]: [] };
  }

  if (filters.statut) where.statut = filters.statut;
  if (filters.departId) where.depart_id = filters.departId;
  if (filters.clientId && !scope.clientId) where.client_id = filters.clientId;
  if (filters.agenceId) where.agence_id = filters.agenceId;

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    where[Op.or] = [
      { reference: { [Op.like]: q } },
      { id: { [Op.like]: q } },
      { '$client.prenom$': { [Op.like]: q } },
      { '$client.nom$': { [Op.like]: q } },
      { '$depart.code$': { [Op.like]: q } },
    ];
  }

  if (filters.dateDebut || filters.dateFin) {
    const range = {};
    if (filters.dateDebut) range[Op.gte] = `${filters.dateDebut} 00:00:00`;
    if (filters.dateFin) range[Op.lte] = `${filters.dateFin} 23:59:59`;
    where.date_creation = range;
  }

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [['date_creation', 'ASC']];
    case 'montant_desc':
      return [['montant', 'DESC']];
    case 'montant_asc':
      return [['montant', 'ASC']];
    case 'newest':
    default:
      return [['date_creation', 'DESC']];
  }
};

/* ══════════════════════════════════════════════════════════════
   Réservations
   ══════════════════════════════════════════════════════════════ */

const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Reservation.findAndCountAll({
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

const findByIdFull = (id) => Reservation.findOne({ where: { id }, include: detailInclude });

const findById = (id) => Reservation.findOne({ where: { id }, include: listInclude });

const findReservation = (id) => Reservation.findByPk(id);

const findReservationByReference = (reference) => Reservation.findOne({ where: { reference } });

const createReservation = (data, options = {}) => Reservation.create(data, options);

const updateReservation = (reservation, data, options = {}) => reservation.update(data, options);

const destroyReservation = (reservation, options = {}) => reservation.destroy(options);

/* ══════════════════════════════════════════════════════════════
   Sièges (place_reservee)
   ══════════════════════════════════════════════════════════════ */

/**
 * Sièges actifs d'un voyage (occupés / réservés / bloqués), hors
 * réservations expirées (les sièges sont alors libérés automatiquement).
 */
const findSeatsByDepart = (departId, options = {}) =>
  sequelize.query(
    `SELECT pr.siege AS siege, r.statut AS statut, r.date_expiration AS date_expiration
       FROM place_reservee pr
       JOIN reservation r ON r.id = pr.reservation_id
      WHERE r.depart_id = :departId
        AND r.statut IN (:statuts)
        AND (r.date_expiration IS NULL OR r.date_expiration > :now)`,
    {
      type: QueryTypes.SELECT,
      replacements: { departId, statuts: ACTIVE_STATUTS, now: new Date() },
      ...options,
    }
  );

const findPlacesByReservation = (reservationId, options = {}) =>
  PlaceReservee.findAll({ where: { reservation_id: reservationId }, ...options });

const createPlace = (data, options = {}) => PlaceReservee.create(data, options);

const updatePlace = (place, data, options = {}) => place.update(data, options);

const destroyPlace = (place, options = {}) => place.destroy(options);

const destroyPlacesByReservation = (reservationId, options = {}) =>
  PlaceReservee.destroy({ where: { reservation_id: reservationId }, ...options });

/* ══════════════════════════════════════════════════════════════
   Paiements
   ══════════════════════════════════════════════════════════════ */

const createPaiement = (data, options = {}) => Paiement.create(data, options);

const findPaiement = (id) => Paiement.findByPk(id);

const findPaiementByReference = (reference) => Paiement.findOne({ where: { reference } });

/** Somme des paiements effectivement payés pour une réservation. */
const sumPaidByReservation = async (reservationId, options = {}) => {
  const [row] = await sequelize.query(
    `SELECT COALESCE(SUM(montant), 0) AS total
       FROM paiement
      WHERE reservation_id = :reservationId AND statut = 'paye'`,
    { type: QueryTypes.SELECT, replacements: { reservationId }, ...options }
  );
  return Number(row?.total) || 0;
};

/** Somme déjà remboursée pour une réservation (garde anti double-remboursement). */
const sumRefundedByReservation = async (reservationId, options = {}) => {
  const [row] = await sequelize.query(
    `SELECT COALESCE(SUM(montant), 0) AS total
       FROM paiement
      WHERE reservation_id = :reservationId AND statut = 'rembourse'`,
    { type: QueryTypes.SELECT, replacements: { reservationId }, ...options }
  );
  return Number(row?.total) || 0;
};

/* ══════════════════════════════════════════════════════════════
   Historique d'audit
   ══════════════════════════════════════════════════════════════ */

const createHistorique = (data, options = {}) => HistoriqueReservation.create(data, options);

const destroyHistoriqueByReservation = (reservationId, options = {}) =>
  HistoriqueReservation.destroy({ where: { reservation_id: reservationId }, ...options });

/* ══════════════════════════════════════════════════════════════
   Voyages / clients / agences / guichets
   ══════════════════════════════════════════════════════════════ */

const findDepart = (id, options = {}) =>
  Depart.findOne({
    where: { id },
    include: departInclude,
    ...options,
  });

/** Verrouille la ligne `depart` (FOR UPDATE) pour sérialiser les réservations. */
const lockDepart = (id, transaction) =>
  Depart.findByPk(id, { lock: transaction.LOCK.UPDATE, transaction });

/** Ajuste le compteur de places disponibles d'un voyage. */
const adjustDepartDispo = (departId, delta, options = {}) =>
  sequelize.query(
    'UPDATE depart SET places_dispo = places_dispo + :delta WHERE id = :departId',
    { type: QueryTypes.UPDATE, replacements: { delta, departId }, ...options }
  );

const findClient = (id) => Client.findByPk(id);

const findGuichet = (id) => Guichet.findByPk(id);

/** Agences d'une compagnie (périmètre company_admin). */
const findAgencesByCompagnie = (compagnieId) =>
  Agence.findAll({ where: { compagnie_id: compagnieId }, attributes: ['id'] });

/* ══════════════════════════════════════════════════════════════
   Statistiques (tableaux de bord)
   ══════════════════════════════════════════════════════════════ */

/** Statistiques d'un client (portail client). */
const clientStats = async (clientId) => {
  const [totals] = await sequelize.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN r.statut = 'en_attente' THEN 1 ELSE 0 END), 0) AS en_attente,
            COALESCE(SUM(CASE WHEN r.statut = 'brouillon' THEN 1 ELSE 0 END), 0) AS brouillon,
            COALESCE(SUM(CASE WHEN r.statut = 'confirmee' THEN 1 ELSE 0 END), 0) AS confirmee,
            COALESCE(SUM(CASE WHEN r.statut = 'payee' THEN 1 ELSE 0 END), 0) AS payee,
            COALESCE(SUM(CASE WHEN r.statut = 'partiellement_payee' THEN 1 ELSE 0 END), 0) AS partiellement_payee,
            COALESCE(SUM(CASE WHEN r.statut = 'annulee' THEN 1 ELSE 0 END), 0) AS annulee,
            COALESCE(SUM(CASE WHEN r.statut = 'expiree' THEN 1 ELSE 0 END), 0) AS expiree,
            COALESCE(SUM(CASE WHEN r.statut = 'remboursee' THEN 1 ELSE 0 END), 0) AS remboursee
       FROM reservation r
      WHERE r.client_id = :clientId`,
    { type: QueryTypes.SELECT, replacements: { clientId } }
  );

  const [upcoming] = await sequelize.query(
    `SELECT COUNT(*) AS upcoming
       FROM reservation r
       JOIN depart d ON d.id = r.depart_id
      WHERE r.client_id = :clientId
        AND d.date_depart >= CURDATE()
        AND r.statut IN ('en_attente', 'confirmee', 'payee', 'partiellement_payee')`,
    { type: QueryTypes.SELECT, replacements: { clientId } }
  );

  return {
    total: Number(totals?.total) || 0,
    upcoming: Number(upcoming?.upcoming) || 0,
    byStatus: {
      brouillon: Number(totals?.brouillon) || 0,
      en_attente: Number(totals?.en_attente) || 0,
      confirmee: Number(totals?.confirmee) || 0,
      payee: Number(totals?.payee) || 0,
      partiellement_payee: Number(totals?.partiellement_payee) || 0,
      annulee: Number(totals?.annulee) || 0,
      expiree: Number(totals?.expiree) || 0,
      remboursee: Number(totals?.remboursee) || 0,
    },
  };
};

/** Construit la clause WHERE (périmètre) pour les statistiques SQL. */
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
  return { sql: '', params: {} };
};

/** Statistiques globales (compagnie / super admin). */
const scopeStats = async (scope = {}) => {
  const { sql, params } = scopeClause(scope);
  const where = sql ? `WHERE ${sql}` : '';

  const [totals] = await sequelize.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN DATE(r.date_creation) = CURDATE() THEN 1 ELSE 0 END), 0) AS today,
            COALESCE(SUM(CASE WHEN r.date_creation >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 ELSE 0 END), 0) AS week,
            COALESCE(SUM(CASE WHEN r.statut IN ('confirmee','payee','partiellement_payee') THEN 1 ELSE 0 END), 0) AS actives,
            COALESCE(SUM(CASE WHEN r.statut = 'payee' THEN r.montant ELSE 0 END), 0) AS revenu,
            COALESCE(SUM(CASE WHEN DATE(r.date_creation) = CURDATE() AND r.statut = 'payee' THEN r.montant ELSE 0 END), 0) AS revenu_jour,
            COALESCE(SUM(CASE WHEN r.statut = 'annulee' THEN 1 ELSE 0 END), 0) AS annulees,
            COALESCE(SUM(CASE WHEN r.statut = 'expiree' THEN 1 ELSE 0 END), 0) AS expirees
       FROM reservation r
       ${where}`,
    { type: QueryTypes.SELECT, replacements: params }
  );

  const [fill] = await sequelize.query(
    `SELECT COALESCE(SUM(d.places_total), 0) AS places_total,
            COALESCE(SUM(d.places_total - d.places_dispo), 0) AS places_vendues
       FROM depart d
       ${sql ? `WHERE ${sql.replaceAll('r.agence_id', 'd.agence_id')}` : ''}`,
    { type: QueryTypes.SELECT, replacements: params }
  );

  const trips = await sequelize.query(
    `SELECT r.depart_id AS departId, d.code AS code, d.date_depart AS dateDepart, COUNT(*) AS nb,
            COALESCE(SUM(r.montant), 0) AS revenu
       FROM reservation r
       JOIN depart d ON d.id = r.depart_id
       ${where}
      GROUP BY r.depart_id, d.code, d.date_depart
      ORDER BY nb DESC
      LIMIT 5`,
    { type: QueryTypes.SELECT, replacements: params }
  );

  const placesTotal = Number(fill?.places_total) || 0;
  const placesVendues = Number(fill?.places_vendues) || 0;

  return {
    total: Number(totals?.total) || 0,
    today: Number(totals?.today) || 0,
    week: Number(totals?.week) || 0,
    actives: Number(totals?.actives) || 0,
    annulees: Number(totals?.annulees) || 0,
    expirees: Number(totals?.expirees) || 0,
    revenu: Number(totals?.revenu) || 0,
    revenuJour: Number(totals?.revenu_jour) || 0,
    fillRate: placesTotal ? Math.round((placesVendues / placesTotal) * 100) : 0,
    topTrips: trips.map((t) => ({
      departId: t.departId,
      code: t.code,
      dateDepart: t.dateDepart,
      reservations: Number(t.nb),
      revenu: Number(t.revenu),
    })),
  };
};

/** Statistiques d'un agent de guichet. */
const agentStats = async ({ agentId, agenceId }) => {
  const [totals] = await sequelize.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN DATE(r.date_creation) = CURDATE() THEN 1 ELSE 0 END), 0) AS today,
            COALESCE(SUM(CASE WHEN r.date_creation >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 ELSE 0 END), 0) AS week
       FROM reservation r
      WHERE r.agent_id = :agentId`,
    { type: QueryTypes.SELECT, replacements: { agentId } }
  );

  const [payments] = await sequelize.query(
    `SELECT COALESCE(SUM(CASE WHEN DATE(p.paiement_le) = CURDATE() THEN p.montant ELSE 0 END), 0) AS today,
            COALESCE(SUM(p.montant), 0) AS total
       FROM paiement p
      WHERE p.agent_id = :agentId AND p.statut = 'paye'`,
    { type: QueryTypes.SELECT, replacements: { agentId } }
  );

  const [agence] = await sequelize.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN DATE(r.date_creation) = CURDATE() THEN 1 ELSE 0 END), 0) AS today
       FROM reservation r
      WHERE r.agence_id = :agenceId`,
    { type: QueryTypes.SELECT, replacements: { agenceId } }
  );

  return {
    agent: {
      total: Number(totals?.total) || 0,
      today: Number(totals?.today) || 0,
      week: Number(totals?.week) || 0,
      revenuJour: Number(payments?.today) || 0,
      revenuTotal: Number(payments?.total) || 0,
    },
    agence: {
      total: Number(agence?.total) || 0,
      today: Number(agence?.today) || 0,
    },
  };
};

module.exports = {
  HOLDING_STATUTS,
  ACTIVE_STATUTS,
  buildWhere,
  buildOrder,
  findPage,
  findByIdFull,
  findById,
  findReservation,
  findReservationByReference,
  createReservation,
  updateReservation,
  destroyReservation,
  findSeatsByDepart,
  findPlacesByReservation,
  createPlace,
  updatePlace,
  destroyPlace,
  destroyPlacesByReservation,
  createPaiement,
  findPaiement,
  findPaiementByReference,
  sumPaidByReservation,
  sumRefundedByReservation,
  createHistorique,
  destroyHistoriqueByReservation,
  findDepart,
  lockDepart,
  adjustDepartDispo,
  findClient,
  findGuichet,
  findAgencesByCompagnie,
  clientStats,
  scopeStats,
  agentStats,
};
