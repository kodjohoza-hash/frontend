const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Agent,
  Agence,
  Compagnie,
  Bus,
  Depart,
  Chauffeur,
  ChauffeurDocument,
  ChauffeurIncident,
  ChauffeurAffectation,
} = require('../../../models');

/** Associations de liste (agence → compagnie + profil chauffeur + bus actuel). */
const listInclude = [
  { model: Agence, as: 'agence', include: [{ model: Compagnie, as: 'compagnie' }] },
  { model: Chauffeur, as: 'chauffeurProfile' },
  { model: Bus, as: 'busesConduites', separate: false, order: [['date_creation', 'DESC']] },
];

/** Associations de détail (liste + documents + incidents + affectations). */
const detailInclude = [
  ...listInclude,
  { model: ChauffeurDocument, as: 'chauffeurDocuments', order: [['date_creation', 'DESC']] },
  { model: ChauffeurIncident, as: 'chauffeurIncidents', order: [['date', 'DESC']] },
  { model: ChauffeurAffectation, as: 'chauffeurAffectations', include: [{ model: Bus, as: 'bus' }], order: [['date_debut', 'DESC']] },
];

/** Ids des agences d'une compagnie (périmètre company_admin). */
const agenceIdsOfCompany = (compagnieId) =>
  Agence.findAll({ where: { compagnie_id: compagnieId }, attributes: ['id'] })
    .then((rows) => rows.map((r) => r.id));

/** Construit la clause WHERE à partir des filtres validés + périmètre. */
const buildWhere = (filters = {}, scope = {}) => {
  const where = { role: 'chauffeur' };

  if (scope.agenceIds && scope.agenceIds.length) {
    where.agence_id = { [Op.in]: scope.agenceIds };
  }

  if (filters.recherche) {
    const q = `%${filters.recherche.trim()}%`;
    where[Op.or] = [
      { prenom: { [Op.like]: q } },
      { nom: { [Op.like]: q } },
      { telephone: { [Op.like]: q } },
      { email: { [Op.like]: q } },
      { matricule: { [Op.like]: q } },
      { id: { [Op.like]: q } },
      { '$chauffeurProfile.permis_numero$': { [Op.like]: q } },
    ];
  }

  if (filters.statut) where['$chauffeurProfile.statut$'] = filters.statut;
  if (filters.ville) where['$chauffeurProfile.ville$'] = filters.ville;
  if (filters.permisCategorie) where['$chauffeurProfile.permis_categorie$'] = filters.permisCategorie;

  if (filters.agenceId) where.agence_id = filters.agenceId;
  if (filters.compagnieId) where['$agence.compagnie_id$'] = filters.compagnieId;

  if (filters.experienceMin !== undefined && filters.experienceMin !== '' && filters.experienceMin !== null) {
    where['$chauffeurProfile.annees_experience$'] = {
      ...(where['$chauffeurProfile.annees_experience$'] || {}),
      [Op.gte]: Number(filters.experienceMin),
    };
  }
  if (filters.experienceMax !== undefined && filters.experienceMax !== '' && filters.experienceMax !== null) {
    where['$chauffeurProfile.annees_experience$'] = {
      ...(where['$chauffeurProfile.annees_experience$'] || {}),
      [Op.lte]: Number(filters.experienceMax),
    };
  }

  if (filters.assignedBus === 'yes') where['$busesConduites.id$'] = { [Op.ne]: null };
  if (filters.assignedBus === 'no') where['$busesConduites.id$'] = null;
  if (filters.available === 'yes') where['$chauffeurProfile.statut$'] = 'available';
  if (filters.available === 'no') where['$chauffeurProfile.statut$'] = { [Op.ne]: 'available' };

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [['date_creation', 'ASC']];
    case 'name_asc':
      return [['nom', 'ASC'], ['prenom', 'ASC']];
    case 'name_desc':
      return [['nom', 'DESC'], ['prenom', 'DESC']];
    case 'experience_asc':
      return [[{ model: Chauffeur, as: 'chauffeurProfile' }, 'annees_experience', 'ASC']];
    case 'experience_desc':
      return [[{ model: Chauffeur, as: 'chauffeurProfile' }, 'annees_experience', 'DESC']];
    case 'status_asc':
      return [[{ model: Chauffeur, as: 'chauffeurProfile' }, 'statut', 'ASC']];
    case 'newest':
    default:
      return [['date_creation', 'DESC']];
  }
};

/** Liste paginée + comptage total. */
const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Agent.findAndCountAll({
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

/** Associations légères (agence → compagnie + profil chauffeur). */
const singleInclude = [
  { model: Agence, as: 'agence', include: [{ model: Compagnie, as: 'compagnie' }] },
  { model: Chauffeur, as: 'chauffeurProfile' },
];

const findByIdFull = (id) => Agent.findOne({ where: { id, role: 'chauffeur' }, include: detailInclude });

const findById = (id) => Agent.findOne({ where: { id, role: 'chauffeur' }, include: singleInclude });

const findAll = (where = {}) => Agent.findAll({ where, include: listInclude });

const findByEmail = (email) => Agent.findOne({ where: { email } });

const findByMatricule = (matricule) => Agent.findOne({ where: { matricule } });

const findByPermisNumero = (permisNumero) =>
  Chauffeur.findOne({ where: { permis_numero: permisNumero } });

const createAgent = (data, options = {}) => Agent.create(data, options);

const updateAgent = (agent, data, options = {}) => agent.update(data, options);

const createChauffeur = (data, options = {}) => Chauffeur.create(data, options);

const updateChauffeur = (chauffeur, data, options = {}) => chauffeur.update(data, options);

/* ══════════════════════════════════════════════════════════════
   Voyages (table `depart`)
   ══════════════════════════════════════════════════════════════ */

/** Voyage actif (prochain départ non annulé) assigné au chauffeur. */
const activeDepart = async (chauffeurId) => {
  const [row] = await sequelize.query(
    tripSelectSql({ id: chauffeurId }, { activeOnly: true }),
    { type: QueryTypes.SELECT, replacements: { id: chauffeurId } }
  );
  return row || null;
};

/** Voyages actifs pour une liste de chauffeurs (évite le N+1 en liste). */
const activeDepartsForDrivers = (chauffeurIds) => {
  if (!chauffeurIds || !chauffeurIds.length) return [];
  return sequelize.query(
    tripSelectSql({ ids: chauffeurIds }, { activeOnly: true }),
    { type: QueryTypes.SELECT, replacements: { ids: chauffeurIds } }
  );
};

/** Historique des voyages du chauffeur (tous les départs assignés). */
const listVoyages = (chauffeurId) =>
  sequelize.query(
    tripSelectSql({ id: chauffeurId }, { activeOnly: false }),
    { type: QueryTypes.SELECT, replacements: { id: chauffeurId } }
  );

/** SQL commun de sélection des départs d'un (des) chauffeur(s). */
const tripSelectSql = ({ id, ids }, { activeOnly }) => {
  const where = id
    ? 'WHERE d.chauffeur_id = :id'
    : 'WHERE d.chauffeur_id IN (:ids)';
  const active = activeOnly
    ? " AND d.date_depart >= CURDATE() AND d.statut <> 'annule'"
    : '';
  const order = activeOnly
    ? 'ORDER BY d.date_depart ASC, d.heure_depart ASC'
    : 'ORDER BY d.date_depart DESC, d.heure_depart DESC';
  return `SELECT d.id, d.chauffeur_id, d.date_depart, d.heure_depart, d.heure_arrivee, d.bus_id,
            d.trajet_id, d.statut AS depart_statut, d.prix_base, d.places_total, d.places_dispo,
            b.immatriculation AS bus_plate, b.interne AS bus_interne, b.modele AS bus_modele,
            vd.nom AS ville_depart, va.nom AS ville_arrivee
       FROM depart d
       LEFT JOIN bus b   ON b.id = d.bus_id
       LEFT JOIN trajet t ON t.id = d.trajet_id
       LEFT JOIN ville vd ON vd.id = t.ville_depart_id
       LEFT JOIN ville va ON va.id = t.ville_arrivee_id
      ${where}${active}
      ${order}`;
};

/** Compteurs de carrière : voyages + kilomètres parcourus. */
const departStatsForDriver = async (chauffeurId) => {
  const [rows] = await sequelize.query(
    `SELECT COUNT(*) AS voyages,
            COALESCE(SUM(t.distance_km), 0) AS total_km
       FROM depart d
       LEFT JOIN trajet t ON t.id = d.trajet_id
      WHERE d.chauffeur_id = :id`,
    { type: QueryTypes.SELECT, replacements: { id: chauffeurId } }
  );
  return rows || null;
};

const findDepart = (id) => Depart.findByPk(id);

const updateDepart = (depart, data, options = {}) => depart.update(data, options);

/* ══════════════════════════════════════════════════════════════
   Incidents
   ══════════════════════════════════════════════════════════════ */

const listIncidents = (chauffeurId, options = {}) =>
  ChauffeurIncident.findAll({ where: { chauffeur_id: chauffeurId }, order: [['date', 'DESC']], ...options });

const findIncident = (id) => ChauffeurIncident.findByPk(id);

const createIncident = (data, options = {}) => ChauffeurIncident.create(data, options);

const updateIncident = (incident, data, options = {}) => incident.update(data, options);

const deleteIncident = (incident, options = {}) => incident.destroy(options);

/* ══════════════════════════════════════════════════════════════
   Documents
   ══════════════════════════════════════════════════════════════ */

const listDocuments = (chauffeurId, options = {}) =>
  ChauffeurDocument.findAll({ where: { chauffeur_id: chauffeurId }, order: [['date_creation', 'DESC']], ...options });

const findDocument = (id) => ChauffeurDocument.findByPk(id);

const createDocument = (data, options = {}) => ChauffeurDocument.create(data, options);

const deleteDocument = (document, options = {}) => document.destroy(options);

/* ══════════════════════════════════════════════════════════════
   Affectations (bus)
   ══════════════════════════════════════════════════════════════ */

const listAffectations = (chauffeurId, options = {}) =>
  ChauffeurAffectation.findAll({
    where: { chauffeur_id: chauffeurId },
    include: [{ model: Bus, as: 'bus' }],
    order: [['date_debut', 'DESC']],
    ...options,
  });

const openAffectation = (chauffeurId, busId) =>
  ChauffeurAffectation.findOne({ where: { chauffeur_id: chauffeurId, bus_id: busId, date_fin: null } });

const createAffectation = (data, options = {}) => ChauffeurAffectation.create(data, options);

const updateAffectation = (affectation, data, options = {}) => affectation.update(data, options);

module.exports = {
  listInclude,
  detailInclude,
  agenceIdsOfCompany,
  buildWhere,
  buildOrder,
  findPage,
  findByIdFull,
  findById,
  findAll,
  findByEmail,
  findByMatricule,
  findByPermisNumero,
  createAgent,
  updateAgent,
  createChauffeur,
  updateChauffeur,
  activeDepart,
  activeDepartsForDrivers,
  listVoyages,
  departStatsForDriver,
  findDepart,
  updateDepart,
  listIncidents,
  findIncident,
  createIncident,
  updateIncident,
  deleteIncident,
  listDocuments,
  findDocument,
  createDocument,
  deleteDocument,
  listAffectations,
  openAffectation,
  createAffectation,
  updateAffectation,
};
