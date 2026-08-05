const Joi = require('joi');

/**
 * Module PAYMENTS (Module 11) — validators.
 * Statuts paiement (alignés sur la table `paiement.statut`) :
 *   paye / en_attente / echoue / annule / rembourse / partiellement_rembourse
 * Types paiement :
 *   encaissement (entrée d'argent) / remboursement (sortie d'argent)
 * Modes paiement : orange_money / mtn_money / carte_bancaire / especes /
 *   virement_bancaire / bon_reduction / code_promo
 */

/** Statuts d'un paiement. */
const STATUTS = [
  'paye',
  'en_attente',
  'echoue',
  'annule',
  'rembourse',
  'partiellement_rembourse',
];

/** Types de paiement. */
const TYPES = ['encaissement', 'remboursement'];

/** Modes de paiement (alignés sur la table `paiement.methode`). */
const MODES = [
  'orange_money',
  'mtn_money',
  'carte_bancaire',
  'especes',
  'virement_bancaire',
  'bon_reduction',
  'code_promo',
];

/** Codes de tri de la liste des paiements. */
const SORTS = ['newest', 'oldest', 'montant_desc', 'montant_asc'];

const idSchema = Joi.object({
  id: Joi.string().max(15).required().messages({
    'any.required': "L'identifiant du paiement est requis.",
  }),
}).unknown(true);

/** Filtres de liste : pagination, tri, statut, mode, type, agence, dates, montants, recherche. */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  statut: Joi.string().valid(...STATUTS).optional().allow(''),
  methode: Joi.string().valid(...MODES).optional().allow(''),
  type: Joi.string().valid(...TYPES).optional().allow(''),
  agenceId: Joi.string().max(10).optional().allow(''),
  clientId: Joi.string().max(12).optional().allow(''),
  dateDebut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  dateFin: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  montantMin: Joi.number().integer().min(0).optional().allow(''),
  montantMax: Joi.number().integer().min(0).optional().allow(''),
  sort: Joi.string().valid(...SORTS).default('newest'),
});

/** Filtres de statistiques. */
const statsQuerySchema = Joi.object({
  periode: Joi.string().valid('jour', 'semaine', 'mois', 'tout').optional().default('tout'),
  dateDebut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  dateFin: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  agenceId: Joi.string().max(10).optional().allow(''),
});

/** Annulation d'un paiement en attente. */
const cancelSchema = Joi.object({
  motif: Joi.string().max(255).required().messages({
    'any.required': "Le motif d'annulation est requis.",
  }),
});

/** Échec d'un paiement en attente. */
const failSchema = Joi.object({
  motif: Joi.string().max(255).optional().allow('', null),
});

/** Remboursement d'un paiement encaissé (délègue au module Bookings). */
const refundSchema = Joi.object({
  montant: Joi.number().integer().min(1).optional(),
  motif: Joi.string().max(255).optional().allow('', null),
  note: Joi.string().max(255).optional().allow('', null),
});

module.exports = {
  STATUTS,
  TYPES,
  MODES,
  SORTS,
  idSchema,
  listQuerySchema,
  statsQuerySchema,
  cancelSchema,
  failSchema,
  refundSchema,
};
