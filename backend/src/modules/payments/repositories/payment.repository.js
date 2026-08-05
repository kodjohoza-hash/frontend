const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Paiement,
  Reservation,
  Billet,
  Client,
  Agent,
  Depart,
  Bus,
  Trajet,
  Agence,
  Compagnie,
  Ville,
  Guichet,
  AbonnementCompagnie,
  HistoriqueReservation,
} = require('../../../models');

const clientAttrs = ['id', 'prenom', 'nom', 'telephone', 'email'];
const agentAttrs = ['id', 'prenom', 'nom', 'matricule'];
const agenceAttrs = ['id', 'nom', 'telephone', 'compagnie_id'];
const compagnieAttrs = ['id', 'nom', 'couleur', 'logo'];
const villeAttrs = ['id', 'nom'];

const reservationInclude = [
  { model: Agence, as: 'agence', attributes: agenceAttrs },
  {
    model: Depart,
    as: 'depart',
    attributes: ['id', 'code', 'date_depart', 'heure_depart', 'date_arrivee', 'heure_arrivee', 'prix_base', 'quai', 'statut'],
    include: [
      {
        model: Trajet,
        as: 'trajet',
        include: [
          { model: Ville, as: 'villeDepart', attributes: villeAttrs },
          { model: Ville, as: 'villeArrivee', attributes: villeAttrs },
        ],
      },
      { model: Bus, as: 'bus', attributes: ['id', 'immatriculation', 'type_bus', 'classe'] },
      { model: Compagnie, as: 'compagnie', attributes: compagnieAttrs },
    ],
  },
];

/** Associations de détail (client, agent, billet, réservation + voyage + agence). */
const detailInclude = [
  { model: Client, as: 'client', attributes: clientAttrs },
  { model: Agent, as: 'agent', attributes: agentAttrs },
  { model: Billet, as: 'billet', attributes: ['id', 'reference', 'siege', 'statut'] },
  { model: Reservation, as: 'reservation', attributes: ['id', 'reference', 'statut', 'agence_id', 'nb_places', 'montant', 'date_creation'], include: reservationInclude },
];

/* ══════════════════════════════════════════════════════════════
   Constructions de requêtes
   ══════════════════════════════════════════════════════════════ */

/** Construit la clause WHERE (périmètre + filtres) pour la liste Sequelize. */
const buildWhere = (filters = {}, scope = {}) => {
  const where = {};
  const andClauses = [];

  if (scope.clientId) {
    where.client_id = scope.clientId;
  }

  /* Périmètre agence / compagnie : les paiements rattachés à une réservation de
     l'agence + les paiements manuels (sans réservation) enregistrés par l'équipe. */
  if (scope.agenceIds) {
    andClauses.push({
      [Op.or]: [
        {
          '$reservation.agence_id$': scope.agenceIds.length ? { [Op.in]: scope.agenceIds } : { [Op.in]: [] },
        },
        { reservation_id: null },
      ],
    });
  }

  if (filters.statut) where.statut = filters.statut;
  if (filters.methode) where.methode = filters.methode;
  if (filters.type) where.type = filters.type;
  if (filters.categorie) where.categorie = filters.categorie;
  if (filters.agenceId && !scope.agenceIds) where['$reservation.agence_id$'] = filters.agenceId;
  if (filters.clientId && !scope.clientId) where.client_id = filters.clientId;
  if (filters.compagnieId && !scope.compagnieId) where['$reservation.agence.compagnie_id$'] = filters.compagnieId;

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    andClauses.push({
      [Op.or]: [
        { reference: { [Op.like]: q } },
        { id: { [Op.like]: q } },
        { '$client.prenom$': { [Op.like]: q } },
        { '$client.nom$': { [Op.like]: q } },
        { '$client.telephone$': { [Op.like]: q } },
        { '$reservation.reference$': { [Op.like]: q } },
        { '$reservation.depart.code$': { [Op.like]: q } },
      ],
    });
  }
  if (andClauses.length) where[Op.and] = andClauses;

  const range = {};
  if (filters.dateDebut) range[Op.gte] = `${filters.dateDebut} 00:00:00`;
  if (filters.dateFin) range[Op.lte] = `${filters.dateFin} 23:59:59`;
  if (Object.keys(range).length) where.cree_le = range;

  const montants = {};
  if (filters.montantMin !== '' && filters.montantMin != null) montants[Op.gte] = Number(filters.montantMin);
  if (filters.montantMax !== '' && filters.montantMax != null) montants[Op.lte] = Number(filters.montantMax);
  /* NOTE : Op.gte/Op.lte sont des symboles Sequelize → Object.keys() les ignore. */
  if (filters.montantMin != null && filters.montantMin !== '' || filters.montantMax != null && filters.montantMax !== '') {
    where.montant = montants;
  }

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [['cree_le', 'ASC']];
    case 'montant_desc':
      return [['montant', 'DESC']];
    case 'montant_asc':
      return [['montant', 'ASC']];
    case 'newest':
    default:
      return [['cree_le', 'DESC']];
  }
};

const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Paiement.findAndCountAll({
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

const findByIdFull = (id) => Paiement.findOne({ where: { id }, include: detailInclude });

const findById = (id) => Paiement.findByPk(id);

const createPaiement = (data, options = {}) => Paiement.create(data, options);

const findPaiementByReference = (reference) => Paiement.findOne({ where: { reference } });

const updatePaiement = (paiement, data, options = {}) => paiement.update(data, options);

/* ══════════════════════════════════════════════════════════════
   Réservations / agences (transitions + périmètre)
   ══════════════════════════════════════════════════════════════ */

/** Agences d'une compagnie (périmètre company_admin). */
const findAgencesByCompagnie = (compagnieId) => Agence.findAll({ where: { compagnie_id: compagnieId }, attributes: ['id'] });

const findReservation = (id) => Reservation.findByPk(id);

/** Réservation avec le minimum nécessaire au grand livre (agence + voyage). */
const findReservationLedger = (id) =>
  Reservation.findByPk(id, {
    include: [
      { model: Agence, as: 'agence', attributes: ['id', 'compagnie_id'] },
      { model: Depart, as: 'depart', attributes: ['id', 'compagnie_id'] },
    ],
  });

const updateReservation = (reservation, data, options = {}) => reservation.update(data, options);

/** Vérifie qu'un abonnement compagnie existe (paiement « abonnement »). */
const findAbonnementCompagnie = (id) => AbonnementCompagnie.findByPk(id, { attributes: ['id', 'compagnie_id', 'statut'] });

/** Client minimal pour l'enregistrement d'un paiement. */
const findClient = (id) => Client.findByPk(id, { attributes: ['id', 'prenom', 'nom', 'telephone', 'email'] });

/** Somme des paiements réellement encaissés pour une réservation. */
const sumPaidByReservation = async (reservationId, options = {}) => {
  const [row] = await sequelize.query(
    `SELECT COALESCE(SUM(montant), 0) AS total
       FROM paiement
      WHERE reservation_id = :reservationId AND statut = 'paye'`,
    { type: QueryTypes.SELECT, replacements: { reservationId }, ...options }
  );
  return Number(row?.total) || 0;
};

/** Somme déjà remboursée pour une réservation (lignes de remboursement). */
const sumRefundedByReservation = async (reservationId, options = {}) => {
  const [row] = await sequelize.query(
    `SELECT COALESCE(SUM(montant), 0) AS total
       FROM paiement
      WHERE reservation_id = :reservationId AND statut = 'rembourse'`,
    { type: QueryTypes.SELECT, replacements: { reservationId }, ...options }
  );
  return Number(row?.total) || 0;
};

/** Historique d'audit (mêmes conventions que le module Bookings). */
const createHistorique = (data, options = {}) => HistoriqueReservation.create(data, options);

/* ══════════════════════════════════════════════════════════════
   Statistiques (tableaux de bord)
   ══════════════════════════════════════════════════════════════ */

/** Périmètre SQL (join via `reservation` pour agences / compagnie). */
const scopeClause = (scope = {}) => {
  if (scope.agenceIds) {
    return { sql: '(r.agence_id IN (:agenceIds) OR p.reservation_id IS NULL)', params: { agenceIds: scope.agenceIds } };
  }
  if (scope.compagnieId) {
    return {
      sql: '((r.agence_id IN (SELECT id FROM agence WHERE compagnie_id = :compagnieId)) OR p.reservation_id IS NULL)',
      params: { compagnieId: scope.compagnieId },
    };
  }
  if (scope.clientId) {
    return { sql: 'p.client_id = :clientId', params: { clientId: scope.clientId } };
  }
  return { sql: '', params: {} };
};

/** Clause de dates (période ou bornes explicites). Valeurs validées par Joi. */
const dateClause = (filters = {}) => {
  if (filters.dateDebut || filters.dateFin) {
    const range = [];
    if (filters.dateDebut) range.push(`p.cree_le >= '${filters.dateDebut} 00:00:00'`);
    if (filters.dateFin) range.push(`p.cree_le <= '${filters.dateFin} 23:59:59'`);
    return range.join(' AND ');
  }
  switch (filters.periode || 'tout') {
    case 'jour':
      return 'p.cree_le >= CURDATE()';
    case 'semaine':
      return 'p.cree_le >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
    case 'mois':
      return 'p.cree_le >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
    default:
      return '';
  }
};

/** Assemble la clause WHERE SQL complète (périmètre + filtres + dates). */
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
  if (filters.clientId) {
    parts.push('p.client_id = :clientId');
    params.clientId = filters.clientId;
  }

  const dc = dateClause(filters);
  if (dc) parts.push(dc);

  return {
    where: parts.length ? `WHERE ${parts.join(' AND ')}` : '',
    params,
  };
};

const FROM = 'FROM paiement p LEFT JOIN reservation r ON r.id = p.reservation_id';

/** Synthèse : totaux, encaissé, remboursé, aujourd'hui, semaine. */
const summary = async ({ filters = {}, scope = {} } = {}) => {
  const { where, params } = buildStatsWhere({ filters, scope });
  const [row] = await sequelize.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN p.statut = 'paye' THEN p.montant ELSE 0 END), 0) AS encaisse,
            COALESCE(SUM(CASE WHEN p.statut = 'rembourse' THEN p.montant ELSE 0 END), 0) AS rembourse,
            COALESCE(SUM(CASE WHEN p.statut = 'partiellement_rembourse' THEN COALESCE(p.remboursement, p.montant) ELSE 0 END), 0) AS partiel_rembourse,
            COALESCE(SUM(CASE WHEN DATE(p.cree_le) = CURDATE() THEN 1 ELSE 0 END), 0) AS today_total,
            COALESCE(SUM(CASE WHEN DATE(p.cree_le) = CURDATE() AND p.statut = 'paye' THEN p.montant ELSE 0 END), 0) AS today_encaisse,
            COALESCE(SUM(CASE WHEN p.cree_le >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 ELSE 0 END), 0) AS week_total
       ${FROM}
       ${where}`,
    { type: QueryTypes.SELECT, replacements: params }
  );

  const encaisse = Number(row?.encaisse) || 0;
  const rembourse = Number(row?.rembourse) || 0;
  const partielRembourse = Number(row?.partiel_rembourse) || 0;

  return {
    total: Number(row?.total) || 0,
    today: {
      total: Number(row?.today_total) || 0,
      encaisse: Number(row?.today_encaisse) || 0,
    },
    week: Number(row?.week_total) || 0,
    encaisse,
    rembourse,
    remboursePartiel: partielRembourse,
    netRevenu: Math.max(0, encaisse - rembourse - partielRembourse),
  };
};

/** Répartition par statut. */
const byStatus = async ({ filters = {}, scope = {} } = {}) => {
  const { where, params } = buildStatsWhere({ filters, scope });
  const rows = await sequelize.query(
    `SELECT p.statut AS statut, COUNT(*) AS total, COALESCE(SUM(p.montant), 0) AS montant
       ${FROM}
       ${where}
      GROUP BY p.statut
      ORDER BY total DESC`,
    { type: QueryTypes.SELECT, replacements: params }
  );
  return rows.map((r) => ({ statut: r.statut, total: Number(r.total), montant: Number(r.montant) }));
};

/** Répartition par mode de paiement. */
const byMethod = async ({ filters = {}, scope = {} } = {}) => {
  const { where, params } = buildStatsWhere({ filters, scope });
  const rows = await sequelize.query(
    `SELECT p.methode AS methode, COUNT(*) AS total, COALESCE(SUM(CASE WHEN p.statut = 'paye' THEN p.montant ELSE 0 END), 0) AS montant
       ${FROM}
       ${where}
      GROUP BY p.methode
      ORDER BY montant DESC`,
    { type: QueryTypes.SELECT, replacements: params }
  );
  return rows.map((r) => ({ methode: r.methode, total: Number(r.total), montant: Number(r.montant) }));
};

/** Tendances quotidiennes (7 derniers jours). */
const byDay = async ({ filters = {}, scope = {} } = {}) => {
  const base = buildStatsWhere({ filters, scope });
  const parts = [base.where && base.where.replace(/^WHERE /, '')].filter(Boolean);
  parts.push("p.cree_le >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)");
  const where = `WHERE ${parts.join(' AND ')}`;
  const rows = await sequelize.query(
    `SELECT DATE(p.cree_le) AS jour, COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN p.statut = 'paye' THEN p.montant ELSE 0 END), 0) AS montant
       ${FROM}
       ${where}
      GROUP BY DATE(p.cree_le)
      ORDER BY jour ASC`,
    { type: QueryTypes.SELECT, replacements: base.params }
  );
  return rows.map((r) => ({ jour: r.jour, total: Number(r.total), montant: Number(r.montant) }));
};

/** Répartition par agence (top 10). */
const byAgency = async ({ filters = {}, scope = {} } = {}) => {
  const { where, params } = buildStatsWhere({ filters, scope });
  const rows = await sequelize.query(
    `SELECT r.agence_id AS agenceId, a.nom AS agenceNom,
            COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN p.statut = 'paye' THEN p.montant ELSE 0 END), 0) AS montant
       ${FROM}
       LEFT JOIN agence a ON a.id = r.agence_id
       ${where}
      GROUP BY r.agence_id, a.nom
      ORDER BY montant DESC
      LIMIT 10`,
    { type: QueryTypes.SELECT, replacements: params }
  );
  return rows.map((r) => ({
    agenceId: r.agenceId,
    agenceNom: r.agenceNom,
    total: Number(r.total),
    montant: Number(r.montant),
  }));
};

/** Tendances mensuelles (recettes par mois). */
const byMonth = async ({ filters = {}, scope = {} } = {}) => {
  const { where, params } = buildStatsWhere({ filters, scope });
  const rows = await sequelize.query(
    `SELECT DATE_FORMAT(p.cree_le, '%Y-%m') AS mois,
            COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN p.statut = 'paye' THEN p.montant ELSE 0 END), 0) AS montant
       ${FROM}
       ${where}
      GROUP BY DATE_FORMAT(p.cree_le, '%Y-%m')
      ORDER BY mois ASC`,
    { type: QueryTypes.SELECT, replacements: params }
  );
  return rows.map((r) => ({ mois: r.mois, total: Number(r.total), montant: Number(r.montant) }));
};

/** Top compagnies par recettes (paiement lié réservation ou compagnie directe). */
const byCompagnie = async ({ filters = {}, scope = {} } = {}) => {
  const { where, params } = buildStatsWhere({ filters, scope });
  const rows = await sequelize.query(
    `SELECT c.id AS compagnieId, COALESCE(c.nom, p.compagnie_id) AS compagnieNom,
            COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN p.statut = 'paye' THEN p.montant ELSE 0 END), 0) AS montant
       ${FROM}
       LEFT JOIN agence a ON a.id = r.agence_id
       LEFT JOIN compagnie c ON c.id = COALESCE(p.compagnie_id, a.compagnie_id)
       ${where}
      GROUP BY c.id, c.nom, p.compagnie_id
      ORDER BY montant DESC
      LIMIT 10`,
    { type: QueryTypes.SELECT, replacements: params }
  );
  return rows.map((r) => ({
    compagnieId: r.compagnieId || r.compagnieNom,
    compagnieNom: r.compagnieNom,
    total: Number(r.total),
    montant: Number(r.montant),
  }));
};

/** Répartition par catégorie métier (réservation / abonnement / …). */
const byCategorie = async ({ filters = {}, scope = {} } = {}) => {
  const { where, params } = buildStatsWhere({ filters, scope });
  const rows = await sequelize.query(
    `SELECT p.categorie AS categorie,
            COUNT(*) AS total,
            COALESCE(SUM(CASE WHEN p.statut = 'paye' THEN p.montant ELSE 0 END), 0) AS montant
       ${FROM}
       ${where}
      GROUP BY p.categorie
      ORDER BY montant DESC`,
    { type: QueryTypes.SELECT, replacements: params }
  );
  return rows.map((r) => ({ categorie: r.categorie, total: Number(r.total), montant: Number(r.montant) }));
};

module.exports = {
  buildWhere,
  buildOrder,
  findPage,
  findByIdFull,
  findById,
  createPaiement,
  findPaiementByReference,
  updatePaiement,
  findAgencesByCompagnie,
  findReservation,
  findReservationLedger,
  updateReservation,
  findAbonnementCompagnie,
  findClient,
  sumPaidByReservation,
  sumRefundedByReservation,
  createHistorique,
  summary,
  byStatus,
  byMethod,
  byDay,
  byAgency,
  byMonth,
  byCompagnie,
  byCategorie,
};
