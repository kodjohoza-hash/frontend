const Joi = require('joi');
const { currency: currencyConfig } = require('../../../config/env');

/**
 * Module PAYMENTS (Module 11) — validators.
 * Statuts paiement (alignés sur la table `paiement.statut`) :
 *   initie / paye / en_attente / echoue / annule / rembourse /
 *   partiellement_rembourse
 * Types paiement (sens de flux) :
 *   encaissement (entrée d'argent) / remboursement (sortie d'argent)
 * Catégories métier : reservation / abonnement / complement / remboursement / manuel
 * Modes paiement : orange_money / mtn_money / carte_bancaire / especes /
 *   virement_bancaire / bon_reduction / code_promo / express_union_mobile / autre
 */

/** Statuts d'un paiement. */
const STATUTS = [
  'initie',
  'paye',
  'en_attente',
  'echoue',
  'annule',
  'rembourse',
  'partiellement_rembourse',
];

/** Types de paiement (sens de flux d'argent). */
const TYPES = ['encaissement', 'remboursement'];

/** Catégories métier d'un paiement. */
const CATEGORIES = ['reservation', 'abonnement', 'complement', 'remboursement', 'manuel'];

/** Modes de paiement (alignés sur la table `paiement.methode`). */
const MODES = [
  'orange_money',
  'mtn_money',
  'carte_bancaire',
  'especes',
  'virement_bancaire',
  'bon_reduction',
  'code_promo',
  'express_union_mobile',
  'autre',
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
  categorie: Joi.string().valid(...CATEGORIES).optional().allow(''),
  agenceId: Joi.string().max(10).optional().allow(''),
  clientId: Joi.string().max(12).optional().allow(''),
  compagnieId: Joi.string().max(4).optional().allow(''),
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

/** Création d'un paiement (POST /payments) — grand livre unique. */
const createPaymentSchema = Joi.object({
  clientId: Joi.string().max(12).optional().allow('', null),
  reservationId: Joi.string().max(15).optional().allow('', null),
  abonnementCompagnieId: Joi.number().integer().min(1).optional().allow('', null),
  montant: Joi.number().integer().min(1).required().messages({
    'any.required': 'Le montant est requis.',
    'number.min': 'Le montant doit être positif.',
  }),
  frais: Joi.number().integer().min(0).optional().default(0),
  devise: Joi.string().length(3).optional().default(currencyConfig.default),
  methode: Joi.string().valid(...MODES).required().messages({
    'any.required': 'Le mode de paiement est requis.',
    'any.only': 'Mode de paiement invalide.',
  }),
  statut: Joi.string().valid('initie', 'en_attente', 'paye').optional().default('en_attente'),
  categorie: Joi.string().valid(...CATEGORIES).optional(),
  referenceFournisseur: Joi.string().max(100).optional().allow('', null),
  provider: Joi.string().max(100).optional().allow('', null),
  note: Joi.string().max(255).optional().allow('', null),
  metadata: Joi.object().optional().allow(null),
});

/** Mise à jour d'un paiement (PATCH /payments/:id). */
const updatePaymentSchema = Joi.object({
  montant: Joi.number().integer().min(1).optional(),
  frais: Joi.number().integer().min(0).optional(),
  methode: Joi.string().valid(...MODES).optional(),
  statut: Joi.string().valid(...STATUTS).optional(),
  referenceFournisseur: Joi.string().max(100).optional().allow('', null),
  provider: Joi.string().max(100).optional().allow('', null),
  note: Joi.string().max(255).optional().allow('', null),
  paiementLe: Joi.date().iso().optional().allow('', null),
  metadata: Joi.object().optional().allow(null),
}).min(1).messages({
  'object.min': 'Aucune donnée à mettre à jour.',
});

module.exports = {
  STATUTS,
  TYPES,
  CATEGORIES,
  MODES,
  SORTS,
  idSchema,
  listQuerySchema,
  statsQuerySchema,
  cancelSchema,
  failSchema,
  refundSchema,
  createPaymentSchema,
  updatePaymentSchema,
};
