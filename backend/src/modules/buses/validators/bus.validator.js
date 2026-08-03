const Joi = require('joi');

/**
 * Module BUSES — validators.
 * Statuts bus alignés sur la demande :
 *   AVAILABLE / ON_TRIP / MAINTENANCE / OUT_OF_SERVICE / INACTIVE
 *     → available / on_trip / maintenance / out_of_service / inactive
 */
const STATUTS = ['available', 'on_trip', 'maintenance', 'out_of_service', 'inactive'];

/** Types de bus (alignés sur le frontend busTypes). */
const TYPES = ['vip', 'confort', 'standard', 'economique', 'minibus', 'double_deck'];

/** Classes de bus (alignées sur le frontend busClasses). */
const CLASSES = ['first', 'business', 'economy', 'mixed'];

/** Carburants (alignés sur le frontend). */
const CARBURANTS = ['diesel', 'essence', 'electrique', 'hybride'];

/** Types de maintenance (alignés sur le frontend maintenanceTypes). */
const MAINTENANCE_TYPES = [
  'revision',
  'vidange',
  'pneu',
  'frein',
  'climatisation',
  'carrosserie',
  'electrique',
  'moteur',
  'controle_technique',
  'nettoyage',
  'autre',
];

/** Statuts de maintenance (alignés sur le frontend). */
const MAINTENANCE_STATUS = ['planifiee', 'en_cours', 'terminee'];

const idSchema = Joi.object({
  id: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant bus est requis.",
  }),
});

const maintenanceIdSchema = Joi.object({
  maintenanceId: Joi.string().max(20).required().messages({
    'any.required': "L'identifiant maintenance est requis.",
  }),
});

/** Filtres de liste : recherche, pagination, tri, type, statut, classe, places, équipements. */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  type: Joi.string().valid(...TYPES).optional().allow(''),
  statut: Joi.string().valid(...STATUTS).optional().allow(''),
  classe: Joi.string().valid(...CLASSES).optional().allow(''),
  marque: Joi.string().max(40).optional().allow(''),
  seatsMin: Joi.number().integer().min(1).optional().allow('', null),
  seatsMax: Joi.number().integer().min(1).optional().allow('', null),
  climatisation: Joi.boolean().optional().allow('', null),
  wifi: Joi.boolean().optional().allow('', null),
  serviceDateFrom: Joi.date().iso().optional().allow('', null),
  serviceDateTo: Joi.date().iso().optional().allow('', null),
  sort: Joi.string()
    .valid('newest', 'oldest', 'plate_asc', 'plate_desc', 'capacity_asc', 'capacity_desc')
    .default('newest'),
});

/** Création d'un bus. */
const createSchema = Joi.object({
  plate: Joi.string().max(15).required().messages({
    'any.required': "L'immatriculation est requise.",
  }),
  internalNumber: Joi.string().max(30).optional().allow('', null),
  brand: Joi.string().max(40).optional().allow('', null),
  model: Joi.string().max(60).optional().allow('', null),
  year: Joi.number().integer().min(2000).max(2100).optional().allow(null),
  seats: Joi.number().integer().min(4).max(200).required().messages({
    'any.required': 'Le nombre de places est requis.',
  }),
  type: Joi.string().valid(...TYPES).optional().default('standard'),
  class: Joi.string().valid(...CLASSES).optional().default('economy'),
  compagnieId: Joi.string().max(4).optional().allow('', null),
  status: Joi.string().valid(...STATUTS).optional().default('available'),
  fuelType: Joi.string().valid(...CARBURANTS).optional().default('diesel'),
  color: Joi.string().max(7).optional().allow('', null),
  notes: Joi.string().max(2000).optional().allow('', null),
  chauffeurId: Joi.string().max(10).optional().allow('', null),
  serviceDate: Joi.date().iso().optional().allow('', null),
  lastMaintenance: Joi.date().iso().optional().allow('', null),
  nextMaintenance: Joi.date().iso().optional().allow('', null),
  mileage: Joi.number().integer().min(0).optional().default(0),
  amenities: Joi.object().optional(),
});

/** Mise à jour partielle d'un bus. */
const updateSchema = Joi.object({
  plate: Joi.string().max(15).optional(),
  internalNumber: Joi.string().max(30).optional().allow('', null),
  brand: Joi.string().max(40).optional().allow('', null),
  model: Joi.string().max(60).optional().allow('', null),
  year: Joi.number().integer().min(2000).max(2100).optional().allow(null),
  seats: Joi.number().integer().min(4).max(200).optional(),
  type: Joi.string().valid(...TYPES).optional(),
  class: Joi.string().valid(...CLASSES).optional(),
  status: Joi.string().valid(...STATUTS).optional(),
  fuelType: Joi.string().valid(...CARBURANTS).optional(),
  color: Joi.string().max(7).optional().allow('', null),
  notes: Joi.string().max(2000).optional().allow('', null),
  chauffeurId: Joi.string().max(10).optional().allow('', null),
  serviceDate: Joi.date().iso().optional().allow('', null),
  lastMaintenance: Joi.date().iso().optional().allow('', null),
  nextMaintenance: Joi.date().iso().optional().allow('', null),
  mileage: Joi.number().integer().min(0).optional(),
  amenities: Joi.object().optional(),
}).min(1);

/** Changement de statut opérationnel. */
const statusSchema = Joi.object({
  statut: Joi.string().valid(...STATUTS).required(),
  raison: Joi.string().max(255).optional().allow('', null),
});

/** Plan de sièges. */
const seatLayoutSchema = Joi.object({
  rows: Joi.number().integer().min(1).max(100).required(),
  seatsPerSide: Joi.number().integer().min(1).max(6).required(),
  aisleAfter: Joi.array().items(Joi.number().integer().min(1)).optional().default([]),
  vipRows: Joi.array().items(Joi.number().integer().min(1)).optional().default([]),
  pmrSeats: Joi.array().items(Joi.number().integer().min(1)).optional().default([]),
});

/** Création d'une maintenance. */
const maintenanceCreateSchema = Joi.object({
  type: Joi.string().valid(...MAINTENANCE_TYPES).required().messages({
    'any.required': 'Le type de maintenance est requis.',
  }),
  date: Joi.date().iso().required().messages({
    'any.required': 'La date de maintenance est requise.',
  }),
  completedDate: Joi.date().iso().optional().allow('', null),
  mileage: Joi.number().integer().min(0).optional().default(0),
  cost: Joi.number().integer().min(0).optional().default(0),
  provider: Joi.string().max(120).optional().allow('', null),
  status: Joi.string().valid(...MAINTENANCE_STATUS).optional().default('planifiee'),
  notes: Joi.string().max(2000).optional().allow('', null),
});

/** Mise à jour d'une maintenance. */
const maintenanceUpdateSchema = Joi.object({
  type: Joi.string().valid(...MAINTENANCE_TYPES).optional(),
  date: Joi.date().iso().optional(),
  completedDate: Joi.date().iso().optional().allow('', null),
  mileage: Joi.number().integer().min(0).optional(),
  cost: Joi.number().integer().min(0).optional(),
  provider: Joi.string().max(120).optional().allow('', null),
  status: Joi.string().valid(...MAINTENANCE_STATUS).optional(),
  notes: Joi.string().max(2000).optional().allow('', null),
}).min(1);

module.exports = {
  STATUTS,
  TYPES,
  CLASSES,
  CARBURANTS,
  MAINTENANCE_TYPES,
  MAINTENANCE_STATUS,
  idSchema,
  maintenanceIdSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  seatLayoutSchema,
  maintenanceCreateSchema,
  maintenanceUpdateSchema,
};
