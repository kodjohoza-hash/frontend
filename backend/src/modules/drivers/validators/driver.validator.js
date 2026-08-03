const Joi = require('joi');

/**
 * Module DRIVERS — validators.
 * Statuts chauffeur alignés sur la demande :
 *   AVAILABLE / ON_TRIP / ON_LEAVE / SUSPENDED / INACTIVE
 *     → available / on_trip / on_leave / suspended / inactive
 */

/** Statuts opérationnels d'un chauffeur. */
const STATUTS = ['available', 'on_trip', 'on_leave', 'suspended', 'inactive'];

/** Catégories de permis de conduire (alignées sur le frontend). */
const PERMIS_CATEGORIES = ['A', 'B', 'C', 'D', 'E'];

/** Genres (alignés sur la table agent). */
const GENRES = ['M', 'F', 'Autre'];

/** Types de documents d'un chauffeur. */
const DOCUMENT_TYPES = ['permis', 'cni', 'medical', 'contrat', 'photo', 'autre'];

/** Types d'incidents. */
const INCIDENT_TYPES = ['accident', 'panne', 'retard', 'sanction', 'observation'];

/** Sévérités d'incident. */
const INCIDENT_SEVERITES = ['low', 'medium', 'high'];

const idSchema = Joi.object({
  id: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant chauffeur est requis.",
  }),
});

const incidentIdSchema = Joi.object({
  incidentId: Joi.string().max(20).required().messages({
    'any.required': "L'identifiant incident est requis.",
  }),
});

const documentIdSchema = Joi.object({
  documentId: Joi.string().max(20).required().messages({
    'any.required': "L'identifiant document est requis.",
  }),
});

/** Filtres de liste : recherche, pagination, tri, statut, permis, ville, disponibilité… */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  statut: Joi.string().valid(...STATUTS).optional().allow(''),
  ville: Joi.string().max(120).optional().allow(''),
  permisCategorie: Joi.string().valid(...PERMIS_CATEGORIES).optional().allow(''),
  agenceId: Joi.string().max(10).optional().allow(''),
  compagnieId: Joi.string().max(4).optional().allow(''),
  available: Joi.string().valid('yes', 'no').optional().allow(''),
  assignedBus: Joi.string().valid('yes', 'no').optional().allow(''),
  experienceMin: Joi.number().integer().min(0).optional().allow('', null),
  experienceMax: Joi.number().integer().min(0).optional().allow('', null),
  sort: Joi.string()
    .valid('newest', 'oldest', 'name_asc', 'name_desc', 'experience_asc', 'experience_desc', 'status_asc')
    .default('newest'),
});

/** Création d'un chauffeur. */
const createSchema = Joi.object({
  firstName: Joi.string().max(60).required().messages({ 'any.required': 'Le prénom est requis.' }),
  lastName: Joi.string().max(60).required().messages({ 'any.required': 'Le nom est requis.' }),
  phone: Joi.string().max(20).required().messages({ 'any.required': 'Le téléphone est requis.' }),
  email: Joi.string().email().max(120).required().messages({
    'any.required': 'L\'email est requis.',
    'string.email': 'Email invalide.',
  }),
  dateOfBirth: Joi.date().iso().optional().allow('', null),
  gender: Joi.string().valid(...GENRES).optional().allow(''),
  address: Joi.string().max(255).optional().allow('', null),
  nationality: Joi.string().max(60).optional().allow('', null),
  city: Joi.string().max(120).optional().allow('', null),
  country: Joi.string().max(60).optional().allow('', null),
  licenseNumber: Joi.string().max(40).optional().allow('', null),
  licenseCategory: Joi.string().valid(...PERMIS_CATEGORIES).optional().allow('', null),
  licenseObtained: Joi.date().iso().optional().allow('', null),
  licenseExpiry: Joi.date().iso().optional().allow('', null),
  experience: Joi.number().integer().min(0).max(60).optional().default(0),
  hireDate: Joi.date().iso().optional().allow('', null),
  status: Joi.string().valid(...STATUTS).optional().default('available'),
  observations: Joi.string().max(2000).optional().allow('', null),
  agenceId: Joi.string().max(10).optional().allow('', null),
  assignedBusId: Joi.string().max(10).optional().allow('', null),
});

/** Mise à jour partielle d'un chauffeur. */
const updateSchema = Joi.object({
  firstName: Joi.string().max(60).optional(),
  lastName: Joi.string().max(60).optional(),
  phone: Joi.string().max(20).optional(),
  email: Joi.string().email().max(120).optional(),
  dateOfBirth: Joi.date().iso().optional().allow('', null),
  gender: Joi.string().valid(...GENRES).optional().allow(''),
  address: Joi.string().max(255).optional().allow('', null),
  nationality: Joi.string().max(60).optional().allow('', null),
  city: Joi.string().max(120).optional().allow('', null),
  country: Joi.string().max(60).optional().allow('', null),
  licenseNumber: Joi.string().max(40).optional().allow('', null),
  licenseCategory: Joi.string().valid(...PERMIS_CATEGORIES).optional().allow('', null),
  licenseObtained: Joi.date().iso().optional().allow('', null),
  licenseExpiry: Joi.date().iso().optional().allow('', null),
  experience: Joi.number().integer().min(0).max(60).optional(),
  hireDate: Joi.date().iso().optional().allow('', null),
  status: Joi.string().valid(...STATUTS).optional(),
  observations: Joi.string().max(2000).optional().allow('', null),
  agenceId: Joi.string().max(10).optional().allow('', null),
  assignedBusId: Joi.string().max(10).optional().allow('', null),
}).min(1);

/** Changement de statut opérationnel. */
const statusSchema = Joi.object({
  statut: Joi.string().valid(...STATUTS).required(),
  raison: Joi.string().max(255).optional().allow('', null),
});

/** Création d'un incident. */
const incidentCreateSchema = Joi.object({
  type: Joi.string().valid(...INCIDENT_TYPES).required().messages({
    'any.required': 'Le type d\'incident est requis.',
  }),
  date: Joi.date().iso().required().messages({
    'any.required': 'La date d\'incident est requise.',
  }),
  description: Joi.string().max(2000).optional().allow('', null),
  severite: Joi.string().valid(...INCIDENT_SEVERITES).optional().default('low'),
  resolu: Joi.boolean().optional().default(false),
});

/** Mise à jour d'un incident. */
const incidentUpdateSchema = Joi.object({
  type: Joi.string().valid(...INCIDENT_TYPES).optional(),
  date: Joi.date().iso().optional(),
  description: Joi.string().max(2000).optional().allow('', null),
  severite: Joi.string().valid(...INCIDENT_SEVERITES).optional(),
  resolu: Joi.boolean().optional(),
}).min(1);

/** Affectation / libération d'un voyage (depart). */
const tripSchema = Joi.object({
  departId: Joi.string().max(20).optional().allow('', null),
});

module.exports = {
  STATUTS,
  PERMIS_CATEGORIES,
  GENRES,
  DOCUMENT_TYPES,
  INCIDENT_TYPES,
  INCIDENT_SEVERITES,
  idSchema,
  incidentIdSchema,
  documentIdSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  incidentCreateSchema,
  incidentUpdateSchema,
  tripSchema,
};
