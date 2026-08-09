const Joi = require('joi');

/**
 * Module TRIPS — validators.
 * Ressource « voyage » = une instance programmée d'un itinéraire (table `depart`).
 *
 * Statuts alignés sur l'enum existant de `depart` :
 *   programme / embarquement / en_cours / termine / annule / retarde
 * Les libellés métier (draft, scheduled, boarding, in_progress, completed,
 * cancelled) sont acceptés en aliases et mappés sur cet enum — aucun nouvel
 * enum n'est introduit.
 */

/** Statuts canoniques (valeurs de la colonne `depart.statut`). */
const STATUTS = ['programme', 'embarquement', 'en_cours', 'termine', 'annule', 'retarde'];

/** Traduction des libellés métier → valeurs DB (aucun nouvel enum). */
const STATUT_ALIASES = {
  draft: 'programme',
  scheduled: 'programme',
  boarding: 'embarquement',
  in_progress: 'en_cours',
  completed: 'termine',
  cancelled: 'annule',
};

/** Valeurs acceptées en entrée (canoniques + aliases). */
const STATUTS_ACCEPTED = [...STATUTS, ...Object.keys(STATUT_ALIASES)];

/** Codes de tri de la liste des voyages. */
const SORTS = [
  'newest',
  'oldest',
  'date',
  'date_asc',
  'date_desc',
  'price_asc',
  'price_desc',
  'status',
  'capacity_asc',
  'capacity_desc',
];

/** Transtypage des statuts d'entrée vers les valeurs DB. */
const normalizeStatus = (value) => STATUT_ALIASES[value] || value;

const idSchema = Joi.object({
  id: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant du voyage est requis.",
  }),
}).unknown(true);

/** Heure au format « HH:MM(:SS) ». */
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

/**
 * Filtres de la liste (admin) et de la recherche publique :
 *   from / to      : villes de départ / arrivée (codes) via l'itinéraire
 *   date           : date exacte de départ (YYYY-MM-DD)
 *   dateFrom/dateTo: plage de dates de départ
 *   companyId      : compagnie propriétaire
 *   priceMin/Max   : fourchette de prix (XAF)
 *   statut         : statut (valeurs canoniques ou aliases)
 */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  /* from/to acceptent un identifiant ville (max 3) OU un nom de ville. */
  from: Joi.string().max(80).optional().allow(''),
  to: Joi.string().max(80).optional().allow(''),
  date: Joi.date().iso().optional().allow(''),
  dateFrom: Joi.date().iso().optional().allow(''),
  dateTo: Joi.date().iso().optional().allow(''),
  companyId: Joi.string().max(4).optional().allow(''),
  priceMin: Joi.number().integer().min(0).optional().allow(''),
  priceMax: Joi.number().integer().min(0).optional().allow(''),
  statut: Joi.string().valid(...STATUTS_ACCEPTED).optional().allow(''),
  sort: Joi.string().valid(...SORTS).default('date'),
});

/** Création d'un voyage. Tous les champs obligatoires sont requis. */
const tripCreateSchema = Joi.object({
  routeId: Joi.string().max(10).required().messages({
    'any.required': "L'itinéraire (routeId) est requis.",
  }),
  busId: Joi.string().max(10).required().messages({
    'any.required': 'Le bus (busId) est requis.',
  }),
  date: Joi.date().iso().required().messages({
    'any.required': 'La date de départ est requise.',
  }),
  departureTime: Joi.string().regex(TIME_RE).required().messages({
    'any.required': "L'heure de départ est requise.",
    'string.pattern.base': "L'heure de départ doit être au format HH:MM.",
  }),
  arrivalTime: Joi.string().regex(TIME_RE).required().messages({
    'any.required': "L'heure d'arrivée est requise.",
    'string.pattern.base': "L'heure d'arrivée doit être au format HH:MM.",
  }),
  price: Joi.number().integer().min(1).required().messages({
    'any.required': 'Le prix (XAF) est requis.',
    'number.min': 'Le prix doit être un montant positif en XAF.',
  }),
  companyId: Joi.string().max(4).optional().allow('', null),
  agencyId: Joi.string().max(10).optional().allow('', null),
  driverId: Joi.string().max(10).optional().allow('', null),
  substituteDriverId: Joi.string().max(10).optional().allow('', null),
  arrivalDate: Joi.date().iso().optional().allow('', null),
  quai: Joi.string().max(20).optional().allow('', null),
  observations: Joi.string().max(5000).optional().allow('', null),
  code: Joi.string().max(30).optional().allow('', null),
  status: Joi.string().valid(...STATUTS_ACCEPTED).optional().default('programme'),
}).custom((value, helpers) => {
  if (value.departureTime && value.arrivalTime) {
    const dep = timeToMinutes(value.departureTime);
    const arr = timeToMinutes(value.arrivalTime);
    const overnight = value.arrivalDate && value.arrivalDate > value.date;
    if (!overnight && arr <= dep) {
      return helpers.error('any.custom', { message: "L'heure d'arrivée doit être postérieure à l'heure de départ (ou renseigner une date d'arrivée au lendemain)." });
    }
  }
  return value;
}).messages({ 'any.custom': 'Valeurs de date/heure incohérentes.' });

/** Mise à jour partielle d'un voyage. */
const tripUpdateSchema = Joi.object({
  routeId: Joi.string().max(10).optional(),
  busId: Joi.string().max(10).optional(),
  date: Joi.date().iso().optional(),
  departureTime: Joi.string().regex(TIME_RE).optional(),
  arrivalTime: Joi.string().regex(TIME_RE).optional(),
  price: Joi.number().integer().min(1).optional(),
  companyId: Joi.string().max(4).optional().allow('', null),
  agencyId: Joi.string().max(10).optional().allow('', null),
  driverId: Joi.string().max(10).optional().allow('', null),
  substituteDriverId: Joi.string().max(10).optional().allow('', null),
  arrivalDate: Joi.date().iso().optional().allow('', null),
  quai: Joi.string().max(20).optional().allow('', null),
  observations: Joi.string().max(5000).optional().allow('', null),
  code: Joi.string().max(30).optional().allow('', null),
  status: Joi.string().valid(...STATUTS_ACCEPTED).optional(),
}).custom((value, helpers) => {
  if (value.departureTime && value.arrivalTime) {
    const dep = timeToMinutes(value.departureTime);
    const arr = timeToMinutes(value.arrivalTime);
    const overnight = value.arrivalDate && value.date && value.arrivalDate > value.date;
    if (!overnight && arr <= dep) {
      return helpers.error('any.custom', { message: "L'heure d'arrivée doit être postérieure à l'heure de départ." });
    }
  }
  return value;
}).messages({ 'any.custom': 'Valeurs de date/heure incohérentes.' }).min(1);

/** Changement de statut d'un voyage. */
const statusSchema = Joi.object({
  statut: Joi.string().valid(...STATUTS_ACCEPTED).required().messages({
    'any.required': 'Le statut est requis.',
  }),
  raison: Joi.string().max(255).optional().allow('', null),
});

/** « HH:MM(:SS) » → minutes. */
const timeToMinutes = (t) => {
  const parts = String(t).split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
};

module.exports = {
  STATUTS,
  STATUT_ALIASES,
  SORTS,
  normalizeStatus,
  idSchema,
  listQuerySchema,
  tripCreateSchema,
  tripUpdateSchema,
  statusSchema,
};
