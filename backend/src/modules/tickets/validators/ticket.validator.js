const Joi = require('joi');

/**
 * Module TICKETS (Module 12) — validators.
 * Statuts d'un billet (alignés sur la table `billet.statut`) :
 *   valide / utilise / expire / annule / rembourse / impaye / inconnu
 * Un billet est émis automatiquement quand la réservation est entièrement
 * payée (`payee`), un billet par siège (un billet = un passager = un siège).
 */

/** Statuts d'un billet. */
const STATUTS = ['valide', 'utilise', 'expire', 'annule', 'rembourse', 'impaye', 'inconnu'];

/** Codes de tri de la liste des billets. */
const SORTS = ['newest', 'oldest', 'prix_desc', 'prix_asc'];

const idSchema = Joi.object({
  id: Joi.string().max(15).required().messages({
    'any.required': "L'identifiant du billet est requis.",
  }),
}).unknown(true);

/** Jeton de vérification d'un QR (48 hex, issu de crypto.randomBytes(24)). */
const verifyTokenSchema = Joi.object({
  token: Joi.string().hex().length(48).required().messages({
    'any.required': 'Le jeton du QR est requis.',
    'string.length': 'Jeton de QR invalide.',
    'string.hex': 'Jeton de QR invalide.',
  }),
}).unknown(true);

/** Filtres de liste : pagination, tri, statut, réservation, voyage, client, dates, recherche. */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  statut: Joi.string().valid(...STATUTS).optional().allow(''),
  reservationId: Joi.string().max(15).optional().allow(''),
  departId: Joi.string().max(10).optional().allow(''),
  clientId: Joi.string().max(12).optional().allow(''),
  agenceId: Joi.string().max(10).optional().allow(''),
  dateDebut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  dateFin: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  sort: Joi.string().valid(...SORTS).default('newest'),
});

/** Filtres de statistiques. */
const statsQuerySchema = Joi.object({
  periode: Joi.string().valid('jour', 'semaine', 'mois', 'tout').optional().default('tout'),
  dateDebut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  dateFin: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  agenceId: Joi.string().max(10).optional().allow(''),
});

/** Transition de statut d'un billet. */
const statusSchema = Joi.object({
  statut: Joi.string().valid(...STATUTS).required().messages({
    'any.required': 'Le statut cible est requis.',
    'any.only': 'Statut de billet invalide.',
  }),
});

module.exports = {
  STATUTS,
  SORTS,
  idSchema,
  verifyTokenSchema,
  listQuerySchema,
  statsQuerySchema,
  statusSchema,
};
