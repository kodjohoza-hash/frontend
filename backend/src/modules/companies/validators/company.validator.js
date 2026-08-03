const Joi = require('joi');

/**
 * Statuts compagnie — alignés sur la colonne compagnie.statut.
 * (ACTIVE / PENDING / SUSPENDED / BANNED / EXPIRED en français DB)
 */
const STATUTS = ['actif', 'en_attente', 'suspendu', 'banni', 'expire'];

/** Catégories de documents administratifs d'une compagnie. */
const CATEGORIES_DOCUMENT = ['rccm', 'contribuable', 'licence', 'autorisation_transport', 'autre'];

/** Codes des plans SaaS (table plan_abonnement). */
const PLANS = ['gratuit', 'standard', 'premium', 'enterprise'];

const idSchema = Joi.object({
  id: Joi.string().max(4).required().messages({
    'any.required': "L'identifiant compagnie est requis.",
  }),
});

/** Filtres de liste : recherche, pagination, tri, statut, ville, pays, plan. */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  statut: Joi.string().valid(...STATUTS).optional(),
  ville: Joi.string().max(120).optional().allow(''),
  pays: Joi.string().max(60).optional().allow(''),
  plan: Joi.string().valid(...PLANS).optional().allow(''),
  sort: Joi.string()
    .valid('newest', 'oldest', 'name_asc', 'name_desc')
    .default('newest'),
});

/** Création d'une compagnie (+ abonnement et, optionnellement, premier admin). */
const createSchema = Joi.object({
  nom: Joi.string().max(120).required().messages({
    'any.required': 'Le nom de la compagnie est requis.',
  }),
  description: Joi.string().max(2000).optional().allow('', null),
  telephone: Joi.string().max(20).optional().allow('', null),
  email: Joi.string().email().max(120).optional().allow('', null),
  site_web: Joi.string().max(255).optional().allow('', null),
  adresse: Joi.string().max(255).optional().allow('', null),
  ville: Joi.string().max(120).optional().allow('', null),
  pays: Joi.string().max(60).optional().allow('', null),
  rccm: Joi.string().max(60).optional().allow('', null),
  numero_contribuable: Joi.string().max(60).optional().allow('', null),
  couleur: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/).optional().allow(null),
  date_creation: Joi.date().optional().allow(null),
  plan: Joi.string().valid(...PLANS).optional().default('gratuit'),
  agence: Joi.object({
    nom: Joi.string().max(120).required(),
    villeId: Joi.string().max(3).required(),
    adresse: Joi.string().max(255).optional().allow('', null),
    telephone: Joi.string().max(20).optional().allow('', null),
  }).optional(),
  admin: Joi.object({
    prenom: Joi.string().max(60).required(),
    nom: Joi.string().max(60).required(),
    email: Joi.string().email().max(120).required(),
    telephone: Joi.string().max(20).required(),
    motDePasse: Joi.string().min(8).max(128).required().messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères.',
    }),
  }).optional(),
});

/** Mise à jour partielle d'une compagnie (profil d'entreprise). */
const updateSchema = Joi.object({
  nom: Joi.string().max(120).optional(),
  description: Joi.string().max(2000).optional().allow('', null),
  telephone: Joi.string().max(20).optional().allow('', null),
  email: Joi.string().email().max(120).optional().allow('', null),
  site_web: Joi.string().max(255).optional().allow('', null),
  adresse: Joi.string().max(255).optional().allow('', null),
  ville: Joi.string().max(120).optional().allow('', null),
  pays: Joi.string().max(60).optional().allow('', null),
  rccm: Joi.string().max(60).optional().allow('', null),
  numero_contribuable: Joi.string().max(60).optional().allow('', null),
  couleur: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/).optional().allow(null),
  date_creation: Joi.date().optional().allow(null),
}).min(1);

/** Changement de statut de modération (valider / suspendre / réactiver / refuser…). */
const statusSchema = Joi.object({
  statut: Joi.string().valid(...STATUTS).required(),
  raison: Joi.string().max(255).optional().allow('', null),
});

/** Filtres de liste des documents d'une compagnie. */
const documentQuerySchema = Joi.object({
  categorie: Joi.string().valid(...CATEGORIES_DOCUMENT).optional().allow(''),
});

const documentIdSchema = Joi.object({
  documentId: Joi.number().integer().min(1).required().messages({
    'any.required': "L'identifiant document est requis.",
  }),
});

/** Params combinés (compagnie + document) pour les routes imbriquées. */
const companyDocumentParamsSchema = Joi.object({
  id: Joi.string().max(4).required(),
  documentId: Joi.number().integer().min(1).required(),
});

module.exports = {
  STATUTS,
  CATEGORIES_DOCUMENT,
  PLANS,
  idSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  documentQuerySchema,
  documentIdSchema,
  companyDocumentParamsSchema,
};
