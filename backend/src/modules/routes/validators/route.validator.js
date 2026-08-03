const Joi = require('joi');

/**
 * Module ROUTES — validators.
 * Statuts itinéraire / ville / escale alignés sur la demande :
 *   ACTIVE / INACTIVE / ARCHIVED → active / inactive / archived
 */

/** Statuts d'un itinéraire (trajet). */
const STATUTS = ['active', 'inactive', 'archived'];

/** Codes de tri de la liste des itinéraires. */
const SORTS = [
  'newest',
  'oldest',
  'name_asc',
  'name_desc',
  'distance_asc',
  'distance_desc',
  'duration_asc',
  'duration_desc',
];

const idSchema = Joi.object({
  id: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant de l'itinéraire est requis.",
  }),
}).unknown(true);

const villeIdSchema = Joi.object({
  villeId: Joi.string().max(3).required().messages({
    'any.required': "L'identifiant de la ville est requis.",
  }),
}).unknown(true);

const stopIdSchema = Joi.object({
  stopId: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant de l'escale est requis.",
  }),
}).unknown(true);

/** Filtres de liste : recherche, pagination, tri, statut, villes, compagnie. */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  statut: Joi.string().valid(...STATUTS).optional().allow(''),
  villeDepart: Joi.string().max(3).optional().allow(''),
  villeArrivee: Joi.string().max(3).optional().allow(''),
  compagnieId: Joi.string().max(4).optional().allow(''),
  sort: Joi.string().valid(...SORTS).default('newest'),
});

/** Création d'un itinéraire. */
const routeCreateSchema = Joi.object({
  name: Joi.string().max(120).required().messages({
    'any.required': 'Le nom de l\'itinéraire est requis.',
  }),
  code: Joi.string().max(20).optional().allow('', null),
  departureCityId: Joi.string().max(3).required().messages({
    'any.required': 'La ville de départ est requise.',
  }),
  arrivalCityId: Joi.string().max(3).required().messages({
    'any.required': "La ville d'arrivée est requise.",
  }),
  companyId: Joi.string().max(4).optional().allow('', null),
  distanceKm: Joi.number().integer().min(0).max(20000).optional().allow('', null),
  duration: Joi.string().max(10).required().messages({
    'any.required': 'La durée du trajet est requise.',
  }),
  priceMin: Joi.number().integer().min(0).optional().allow('', null),
  priceMax: Joi.number().integer().min(0).optional().allow('', null),
  status: Joi.string().valid(...STATUTS).optional().default('active'),
  description: Joi.string().max(5000).optional().allow('', null),
}).custom((value, helpers) => {
  if (value.departureCityId && value.arrivalCityId && value.departureCityId === value.arrivalCityId) {
    return helpers.error('any.custom', { message: 'La ville de départ et la ville d\'arrivée doivent être différentes.' });
  }
  if (value.priceMin !== undefined && value.priceMin !== null && value.priceMin !== '' &&
      value.priceMax !== undefined && value.priceMax !== null && value.priceMax !== '' &&
      Number(value.priceMin) > Number(value.priceMax)) {
    return helpers.error('any.custom', { message: 'Le prix minimum ne peut pas dépasser le prix maximum.' });
  }
  return value;
}).messages({ 'any.custom': 'Valeurs incohérentes.' });

/** Mise à jour partielle d'un itinéraire. */
const routeUpdateSchema = Joi.object({
  name: Joi.string().max(120).optional(),
  code: Joi.string().max(20).optional().allow('', null),
  departureCityId: Joi.string().max(3).optional(),
  arrivalCityId: Joi.string().max(3).optional(),
  companyId: Joi.string().max(4).optional().allow('', null),
  distanceKm: Joi.number().integer().min(0).max(20000).optional().allow('', null),
  duration: Joi.string().max(10).optional(),
  priceMin: Joi.number().integer().min(0).optional().allow('', null),
  priceMax: Joi.number().integer().min(0).optional().allow('', null),
  status: Joi.string().valid(...STATUTS).optional(),
  description: Joi.string().max(5000).optional().allow('', null),
}).custom((value, helpers) => {
  if (value.departureCityId && value.arrivalCityId && value.departureCityId === value.arrivalCityId) {
    return helpers.error('any.custom', { message: 'La ville de départ et la ville d\'arrivée doivent être différentes.' });
  }
  if (value.priceMin !== undefined && value.priceMin !== null && value.priceMin !== '' &&
      value.priceMax !== undefined && value.priceMax !== null && value.priceMax !== '' &&
      Number(value.priceMin) > Number(value.priceMax)) {
    return helpers.error('any.custom', { message: 'Le prix minimum ne peut pas dépasser le prix maximum.' });
  }
  return value;
}).messages({ 'any.custom': 'Valeurs incohérentes.' }).min(1);

/** Changement de statut d'un itinéraire. */
const statusSchema = Joi.object({
  statut: Joi.string().valid(...STATUTS).required().messages({
    'any.required': 'Le statut est requis.',
  }),
  raison: Joi.string().max(255).optional().allow('', null),
});

/** Calculs : heure de départ facultative pour estimer l'heure d'arrivée. */
const calculsQuerySchema = Joi.object({
  heureDepart: Joi.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/).optional().allow('', null),
});

/** Création / mise à jour d'une ville. */
const villeCreateSchema = Joi.object({
  id: Joi.string().uppercase().max(3).min(2).required().messages({
    'any.required': 'Le code de la ville est requis.',
  }),
  name: Joi.string().max(60).required().messages({
    'any.required': 'Le nom de la ville est requis.',
  }),
  region: Joi.string().max(100).optional().allow('', null),
  country: Joi.string().max(60).optional().allow('', null),
  latitude: Joi.number().min(-90).max(90).optional().allow('', null),
  longitude: Joi.number().min(-180).max(180).optional().allow('', null),
  status: Joi.string().valid(...STATUTS).optional().default('active'),
});

/** Mise à jour partielle d'une ville. */
const villeUpdateSchema = Joi.object({
  name: Joi.string().max(60).optional(),
  region: Joi.string().max(100).optional().allow('', null),
  country: Joi.string().max(60).optional().allow('', null),
  latitude: Joi.number().min(-90).max(90).optional().allow('', null),
  longitude: Joi.number().min(-180).max(180).optional().allow('', null),
  status: Joi.string().valid(...STATUTS).optional(),
}).min(1);

/** Création d'une escale. */
const stopCreateSchema = Joi.object({
  villeId: Joi.string().max(3).required().messages({
    'any.required': 'La ville de l\'escale est requise.',
  }),
  ordre: Joi.number().integer().min(0).optional(),
  heureEstimee: Joi.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/).optional().allow('', null),
  dureeArret: Joi.number().integer().min(0).optional().allow('', null),
  description: Joi.string().max(255).optional().allow('', null),
});

/** Mise à jour partielle d'une escale. */
const stopUpdateSchema = Joi.object({
  villeId: Joi.string().max(3).optional(),
  ordre: Joi.number().integer().min(0).optional(),
  heureEstimee: Joi.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/).optional().allow('', null),
  dureeArret: Joi.number().integer().min(0).optional().allow('', null),
  description: Joi.string().max(255).optional().allow('', null),
}).min(1);

module.exports = {
  STATUTS,
  SORTS,
  idSchema,
  villeIdSchema,
  stopIdSchema,
  listQuerySchema,
  routeCreateSchema,
  routeUpdateSchema,
  statusSchema,
  calculsQuerySchema,
  villeCreateSchema,
  villeUpdateSchema,
  stopCreateSchema,
  stopUpdateSchema,
};
