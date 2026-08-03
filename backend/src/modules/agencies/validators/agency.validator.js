const Joi = require('joi');

/**
 * Module AGENCIES — validators.
 * Statuts agence alignés sur la colonne `agence.statut`.
 * (ACTIVE / INACTIVE / SUSPENDED → actif / inactif / suspendu)
 */
const STATUTS = ['actif', 'inactif', 'suspendu'];

/** Types de point de vente (alignés sur le frontend agencyTypes). */
const TYPES = ['gare', 'agence', 'bouette', 'bureau'];

/** Jours d'ouverture (alignés sur le frontend daysOfWeek). */
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

/** Services d'une agence (alignés sur le frontend services). */
const SERVICES = [
  'vente_billets',
  'reservation',
  'wifi',
  'parking',
  'cafeteria',
  'guichet_bancaire',
  'recharge_mobile',
  'location_vehicules',
  'vestiaire',
  'securite',
];

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const idSchema = Joi.object({
  id: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant agence est requis.",
  }),
});

/** Filtres de liste : recherche, pagination, tri, ville, statut, type. */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  villeId: Joi.string().max(3).optional().allow(''),
  statut: Joi.string().valid(...STATUTS).optional().allow(''),
  type: Joi.string().valid(...TYPES).optional().allow(''),
  sort: Joi.string()
    .valid('newest', 'oldest', 'name_asc', 'name_desc')
    .default('newest'),
});

/** Création d'une agence. */
const createSchema = Joi.object({
  nom: Joi.string().max(120).required().messages({
    'any.required': "Le nom de l'agence est requis.",
  }),
  villeId: Joi.string().max(3).required().messages({
    'any.required': "La ville de l'agence est requise.",
  }),
  compagnieId: Joi.string().max(4).optional().allow('', null),
  region: Joi.string().max(60).optional().allow('', null),
  adresse: Joi.string().max(255).optional().allow('', null),
  quartier: Joi.string().max(120).optional().allow('', null),
  telephone: Joi.string().max(20).optional().allow('', null),
  description: Joi.string().max(2000).optional().allow('', null),
  email: Joi.string().email().max(120).optional().allow('', null),
  statut: Joi.string().valid(...STATUTS).optional().default('actif'),
  type: Joi.string().valid(...TYPES).optional().allow('', null),
  latitude: Joi.number().min(-90).max(90).optional().allow(null),
  longitude: Joi.number().min(-180).max(180).optional().allow(null),
  heureOuverture: Joi.string().pattern(TIME_PATTERN).optional().allow('', null),
  heureFermeture: Joi.string().pattern(TIME_PATTERN).optional().allow('', null),
  joursOuverture: Joi.array().items(Joi.string().valid(...JOURS)).optional(),
  services: Joi.array().items(Joi.string().valid(...SERVICES)).optional(),
});

/** Mise à jour partielle d'une agence. */
const updateSchema = Joi.object({
  nom: Joi.string().max(120).optional(),
  villeId: Joi.string().max(3).optional(),
  region: Joi.string().max(60).optional().allow('', null),
  adresse: Joi.string().max(255).optional().allow('', null),
  quartier: Joi.string().max(120).optional().allow('', null),
  telephone: Joi.string().max(20).optional().allow('', null),
  description: Joi.string().max(2000).optional().allow('', null),
  email: Joi.string().email().max(120).optional().allow('', null),
  statut: Joi.string().valid(...STATUTS).optional(),
  type: Joi.string().valid(...TYPES).optional().allow('', null),
  latitude: Joi.number().min(-90).max(90).optional().allow(null),
  longitude: Joi.number().min(-180).max(180).optional().allow(null),
  heureOuverture: Joi.string().pattern(TIME_PATTERN).optional().allow('', null),
  heureFermeture: Joi.string().pattern(TIME_PATTERN).optional().allow('', null),
  joursOuverture: Joi.array().items(Joi.string().valid(...JOURS)).optional(),
  services: Joi.array().items(Joi.string().valid(...SERVICES)).optional(),
}).min(1);

/** Changement de statut opérationnel (activer / fermer / suspendre…). */
const statusSchema = Joi.object({
  statut: Joi.string().valid(...STATUTS).required(),
  raison: Joi.string().max(255).optional().allow('', null),
});

module.exports = {
  STATUTS,
  TYPES,
  JOURS,
  SERVICES,
  idSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
};
