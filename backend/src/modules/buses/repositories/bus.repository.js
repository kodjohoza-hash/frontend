const { Op, QueryTypes } = require('sequelize');
const {
  sequelize,
  Bus,
  Compagnie,
  Agent,
  BusSeatLayout,
  BusMaintenance,
  BusImage,
  Depart,
} = require('../../../models');

/** Associations de liste (compagnie + chauffeur). */
const listInclude = [
  { model: Compagnie, as: 'compagnie' },
  { model: Agent, as: 'chauffeur' },
];

/** Associations de détail (liste + plan de sièges + maintenances + images). */
const detailInclude = [
  ...listInclude,
  { model: BusSeatLayout, as: 'seatLayout' },
  { model: BusMaintenance, as: 'maintenances' },
  { model: BusImage, as: 'images' },
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
      { immatriculation: { [Op.like]: q } },
      { interne: { [Op.like]: q } },
      { marque: { [Op.like]: q } },
      { modele: { [Op.like]: q } },
    ];
  }
  if (filters.type) where.type_bus = filters.type;
  if (filters.statut) where.statut = filters.statut;
  if (filters.classe) where.classe = filters.classe;
  if (filters.marque) where.marque = filters.marque;

  if (filters.seatsMin) where.capacite = { ...(where.capacite || {}), [Op.gte]: Number(filters.seatsMin) };
  if (filters.seatsMax) where.capacite = { ...(where.capacite || {}), [Op.lte]: Number(filters.seatsMax) };

  if (filters.climatisation === true || filters.climatisation === 'true') {
    where['equipements.climatisation'] = true;
  }
  if (filters.climatisation === false || filters.climatisation === 'false') {
    where['equipements.climatisation'] = { [Op.ne]: true };
  }
  if (filters.wifi === true || filters.wifi === 'true') {
    where['equipements.wifi'] = true;
  }
  if (filters.wifi === false || filters.wifi === 'false') {
    where['equipements.wifi'] = { [Op.ne]: true };
  }

  if (filters.serviceDateFrom) where.mise_en_service = { [Op.gte]: filters.serviceDateFrom };
  if (filters.serviceDateTo) where.mise_en_service = { [Op.lte]: filters.serviceDateTo };

  return where;
};

/** Ordre de tri — map de sort → tableau Sequelize. */
const buildOrder = (sort = 'newest') => {
  switch (sort) {
    case 'oldest':
      return [['date_creation', 'ASC']];
    case 'plate_asc':
      return [['immatriculation', 'ASC']];
    case 'plate_desc':
      return [['immatriculation', 'DESC']];
    case 'capacity_asc':
      return [['capacite', 'ASC']];
    case 'capacity_desc':
      return [['capacite', 'DESC']];
    case 'newest':
    default:
      return [['date_creation', 'DESC']];
  }
};

/** Liste paginée + comptage total. */
const findPage = async ({ where = {}, page = 1, limit = 20, sort = 'newest' } = {}) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Bus.findAndCountAll({
    where,
    include: listInclude,
    order: buildOrder(sort),
    distinct: true,
    offset,
    limit,
  });
  return { rows, count };
};

const findByIdFull = (id) => Bus.findOne({ where: { id }, include: detailInclude });

const findById = (id) => Bus.findByPk(id);

const findByPlate = (immatriculation, compagnieId) =>
  Bus.findOne({ where: { immatriculation, ...(compagnieId ? { compagnie_id: compagnieId } : {}) } });

const findByInterne = (interne, compagnieId) =>
  Bus.findOne({ where: { interne, ...(compagnieId ? { compagnie_id: compagnieId } : {}) } });

const create = (data, options = {}) => Bus.create(data, options);

const update = (bus, data, options = {}) => bus.update(data, options);

const findAll = (where = {}) => Bus.findAll({ where, include: listInclude });

/* ══════════════════════════════════════════════════════════════
   Statistiques d'utilisation (table `depart`)
   ══════════════════════════════════════════════════════════════ */

/** Compteurs pour une liste de bus : voyages + taux d'occupation moyen. */
const departStatsForBuses = async (ids) => {
  if (!ids || !ids.length) return [];
  return sequelize.query(
    `SELECT bus_id,
            COUNT(*) AS voyages,
            COALESCE(ROUND(AVG(
              CASE WHEN places_total > 0
                   THEN ((places_total - places_dispo) * 100.0) / places_total
                   ELSE 0 END
            )), 0) AS avg_occupancy
       FROM depart
      WHERE bus_id IN (:ids)
      GROUP BY bus_id`,
    { type: QueryTypes.SELECT, replacements: { ids } }
  );
};

/** Compteurs pour un seul bus. */
const departStatsForBus = async (id) => {
  const [rows] = await departStatsForBuses([id]);
  return rows || null;
};

/* ══════════════════════════════════════════════════════════════
   Plan de sièges
   ══════════════════════════════════════════════════════════════ */

const getSeatLayout = (busId) => BusSeatLayout.findOne({ where: { bus_id: busId } });

const createSeatLayout = (data, options = {}) => BusSeatLayout.create(data, options);

const updateSeatLayout = (layout, data, options = {}) => layout.update(data, options);

/* ══════════════════════════════════════════════════════════════
   Maintenances
   ══════════════════════════════════════════════════════════════ */

const listMaintenances = (busId, options = {}) =>
  BusMaintenance.findAll({ where: { bus_id: busId }, order: [['date', 'DESC']], ...options });

const findMaintenance = (id) => BusMaintenance.findByPk(id);

const createMaintenance = (data, options = {}) => BusMaintenance.create(data, options);

const updateMaintenance = (maintenance, data, options = {}) => maintenance.update(data, options);

const deleteMaintenance = (maintenance, options = {}) => maintenance.destroy(options);

/* ══════════════════════════════════════════════════════════════
   Images
   ══════════════════════════════════════════════════════════════ */

const listImages = (busId, options = {}) =>
  BusImage.findAll({ where: { bus_id: busId }, order: [['is_primary', 'DESC'], ['date_creation', 'DESC']], ...options });

const findImage = (id) => BusImage.findByPk(id);

const createImage = (data, options = {}) => BusImage.create(data, options);

const deleteImage = (image, options = {}) => image.destroy(options);

module.exports = {
  listInclude,
  detailInclude,
  buildWhere,
  buildOrder,
  findPage,
  findByIdFull,
  findById,
  findByPlate,
  findByInterne,
  create,
  update,
  findAll,
  departStatsForBuses,
  departStatsForBus,
  getSeatLayout,
  createSeatLayout,
  updateSeatLayout,
  listMaintenances,
  findMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  listImages,
  findImage,
  createImage,
  deleteImage,
  Compagnie,
  Agent,
  Depart,
};
