const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Compagnie,
  Agence,
  Agent,
  AbonnementCompagnie,
  PlanAbonnement,
  DocumentCompagnie,
} = require('../../../models');

/** Associations de liste (abonnement SaaS + plan). */
const listInclude = [
  {
    model: AbonnementCompagnie,
    as: 'abonnementSaaS',
    include: [{ model: PlanAbonnement, as: 'plan' }],
  },
];

/** Associations de détail (agences + abonnement + documents). */
const detailInclude = [
  { model: Agence, as: 'agences' },
  {
    model: AbonnementCompagnie,
    as: 'abonnementSaaS',
    include: [{ model: PlanAbonnement, as: 'plan' }],
  },
  { model: DocumentCompagnie, as: 'documents' },
];

/** Construit la clause WHERE à partir des filtres validés + périmètre. */
const buildWhere = (filters = {}, scope = {}) => {
  const where = {};

  if (scope.compagnieIds) {
    where.id = { [Op.in]: scope.compagnieIds };
  }

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    where[Op.or] = [
      { nom: { [Op.like]: q } },
      { email: { [Op.like]: q } },
      { ville: { [Op.like]: q } },
      { rccm: { [Op.like]: q } },
      { numero_contribuable: { [Op.like]: q } },
    ];
  }
  if (filters.statut) where.statut = filters.statut;
  if (filters.ville) where.ville = filters.ville;
  if (filters.pays) where.pays = filters.pays;
  if (filters.plan) where['$abonnementSaaS.plan.code$'] = filters.plan;

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [
        ['date_creation', 'ASC'],
        ['nom', 'ASC'],
      ];
    case 'name_asc':
      return [['nom', 'ASC']];
    case 'name_desc':
      return [['nom', 'DESC']];
    case 'newest':
    default:
      return [
        ['date_creation', 'DESC'],
        ['nom', 'ASC'],
      ];
  }
};

/** Liste paginée + comptage total. */
const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Compagnie.findAndCountAll({
    where,
    include: listInclude,
    order: buildOrder(sort),
    distinct: true,
    offset,
    limit,
  });
  return { rows, count };
};

const findByIdFull = (id) => Compagnie.findOne({ where: { id }, include: detailInclude });

const findById = (id) => Compagnie.findByPk(id);

const findByEmail = (email) => Compagnie.findOne({ where: { email } });

const create = (data, options = {}) => Compagnie.create(data, options);

const update = (compagnie, data, options = {}) => compagnie.update(data, options);

const remove = (compagnie, options = {}) => compagnie.destroy(options);

/** Retourne toutes les compagnies (avec abonnement+plan) pour les KPIs. */
const findAllWithSubscription = (where = {}) =>
  Compagnie.findAll({ where, include: listInclude });

/* ══════════════════════════════════════════════════════════════
   Compteurs agrégés (tables métier sans modèle : bus, depart,
   reservation, billet) via SQL brut — réservés aux KPIs.
   ══════════════════════════════════════════════════════════════ */

const COUNT_SELECT = `
  (SELECT COUNT(*) FROM bus WHERE compagnie_id = c.id) AS buses,
  (SELECT COUNT(*) FROM agence WHERE compagnie_id = c.id) AS agences,
  (SELECT COUNT(*) FROM agent a JOIN agence ag ON a.agence_id = ag.id
     WHERE ag.compagnie_id = c.id) AS agents,
  (SELECT COUNT(*) FROM agent a JOIN agence ag ON a.agence_id = ag.id
     WHERE ag.compagnie_id = c.id AND a.role LIKE '%hauffeur%') AS chauffeurs,
  (SELECT COUNT(*) FROM depart d JOIN bus b ON d.bus_id = b.id
     WHERE b.compagnie_id = c.id) AS voyages,
  (SELECT COUNT(*) FROM reservation r JOIN agence ag ON r.agence_id = ag.id
     WHERE ag.compagnie_id = c.id) AS reservations,
  (SELECT COUNT(*) FROM reservation r JOIN agence ag ON r.agence_id = ag.id
     WHERE ag.compagnie_id = c.id AND r.statut = 'confirmee') AS reservations_confirmees,
  (SELECT COUNT(*) FROM billet t JOIN reservation r ON t.reservation_id = r.id
     JOIN agence ag ON r.agence_id = ag.id WHERE ag.compagnie_id = c.id) AS tickets,
  (SELECT COALESCE(SUM(montant), 0) FROM reservation r JOIN agence ag ON r.agence_id = ag.id
     WHERE ag.compagnie_id = c.id AND r.statut = 'confirmee') AS revenus
`;

/** Compteurs pour une liste de compagnies (une seule requête GROUP BY). */
const countsForCompanies = async (ids) => {
  if (!ids || !ids.length) return [];
  return sequelize.query(
    `SELECT c.id, ${COUNT_SELECT} FROM compagnie c WHERE c.id IN (:ids)`,
    { type: QueryTypes.SELECT, replacements: { ids } }
  );
};

/** Compteurs pour une seule compagnie. */
const countsForCompany = async (id) => {
  const [rows] = await countsForCompanies([id]);
  return rows || null;
};

/** Documents d'une compagnie (filtrés optionnellement par catégorie). */
const findDocuments = (compagnieId, categorie) => {
  const where = { compagnie_id: compagnieId };
  if (categorie) where.categorie = categorie;
  return DocumentCompagnie.findAll({ where, order: [['televerse_le', 'DESC']] });
};

const findDocumentById = (id) => DocumentCompagnie.findByPk(id);

const createDocument = (data, options = {}) => DocumentCompagnie.create(data, options);

const removeDocument = (doc, options = {}) => doc.destroy(options);

module.exports = {
  listInclude,
  detailInclude,
  buildWhere,
  buildOrder,
  findPage,
  findByIdFull,
  findById,
  findByEmail,
  create,
  update,
  remove,
  findAllWithSubscription,
  countsForCompanies,
  countsForCompany,
  findDocuments,
  findDocumentById,
  createDocument,
  removeDocument,
  AbonnementCompagnie,
  PlanAbonnement,
  Agent,
  Agence,
};
