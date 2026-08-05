const Joi = require('joi');

/**
 * Module BOOKINGS — validators.
 * Statuts réservation alignés sur la demande :
 *   BROUILLON / EN_ATTENTE / CONFIRMEE / PAYEE / PARTIELLEMENT_PAYEE /
 *   ANNULEE / EXPIREE / REMBOURSEE
 * Modes réservation : en_ligne / guichet / telephone
 */

/** Statuts d'une réservation. */
const STATUTS = [
  'brouillon',
  'en_attente',
  'confirmee',
  'payee',
  'partiellement_payee',
  'annulee',
  'expiree',
  'remboursee',
];

/** Statuts acceptés à la création (les autres sont des transitions). */
const INITIAL_STATUTS = ['en_attente', 'brouillon'];

/** Modes de réservation. */
const MODES_RESERVATION = ['en_ligne', 'guichet', 'telephone'];

/** Modes de paiement (alignés sur la table `paiement.methode`). */
const MODES_PAIEMENT = [
  'orange_money',
  'mtn_money',
  'carte_bancaire',
  'especes',
  'virement_bancaire',
  'bon_reduction',
  'code_promo',
];

/** Codes de tri de la liste des réservations. */
const SORTS = ['newest', 'oldest', 'montant_desc', 'montant_asc'];

const idSchema = Joi.object({
  id: Joi.string().max(15).required().messages({
    'any.required': "L'identifiant de la réservation est requis.",
  }),
}).unknown(true);

const availabilityQuerySchema = Joi.object({
  departId: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant du voyage est requis.",
  }),
});

const statsQuerySchema = Joi.object({
  periode: Joi.string().valid('jour', 'semaine', 'mois', 'tout').optional().default('tout'),
});

/** Filtres de liste : pagination, tri, statut, voyage, client, dates, recherche. */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  statut: Joi.string().valid(...STATUTS).optional().allow(''),
  departId: Joi.string().max(10).optional().allow(''),
  clientId: Joi.string().max(12).optional().allow(''),
  agenceId: Joi.string().max(10).optional().allow(''),
  dateDebut: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  dateFin: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().allow(''),
  sort: Joi.string().valid(...SORTS).default('newest'),
});

const seatSchema = Joi.object({
  siege: Joi.string().trim().uppercase().max(5).required().messages({
    'any.required': 'Le numéro de siège est requis.',
  }),
  nomPassager: Joi.string().max(120).optional().allow('', null),
  tarif: Joi.number().integer().min(0).optional().allow('', null),
});

const seatsSchema = Joi.array()
  .items(seatSchema)
  .min(1)
  .max(60)
  .required()
  .messages({
    'any.required': 'Au moins un siège est requis.',
    'array.min': 'Au moins un siège est requis.',
    'array.max': 'Le nombre de sièges demandés est trop élevé.',
  })
  .custom((value, helpers) => {
    const normalized = value.map((s) => String(s.siege).trim().toUpperCase());
    if (new Set(normalized).size !== normalized.length) {
      return helpers.error('any.custom', { message: 'Des sièges en double ont été fournis.' });
    }
    return value;
  })
  .messages({ 'any.custom': 'Valeurs incohérentes.' });

/** Création d'une réservation. */
const createSchema = Joi.object({
  departId: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant du voyage (depart) est requis.",
  }),
  clientId: Joi.string().max(12).optional().allow('', null),
  guichetId: Joi.string().max(10).optional().allow('', null),
  seats: seatsSchema,
  modeReservation: Joi.string().valid(...MODES_RESERVATION).optional().default('en_ligne'),
  modePaiement: Joi.string().valid(...MODES_PAIEMENT).optional().allow('', null),
  remise: Joi.number().integer().min(0).default(0),
  taxes: Joi.number().integer().min(0).default(0),
  observations: Joi.string().max(500).optional().allow('', null),
  statut: Joi.string().valid(...INITIAL_STATUTS).optional().default('en_attente'),
});

/** Mise à jour partielle d'une réservation (sièges, remise, taxes, observations). */
const updateSchema = Joi.object({
  seats: Joi.array().items(seatSchema).min(1).max(60).optional().custom((value, helpers) => {
    const normalized = value.map((s) => String(s.siege).trim().toUpperCase());
    if (new Set(normalized).size !== normalized.length) {
      return helpers.error('any.custom', { message: 'Des sièges en double ont été fournis.' });
    }
    return value;
  }).messages({ 'any.custom': 'Valeurs incohérentes.' }),
  modeReservation: Joi.string().valid(...MODES_RESERVATION).optional(),
  modePaiement: Joi.string().valid(...MODES_PAIEMENT).optional().allow('', null),
  remise: Joi.number().integer().min(0).optional(),
  taxes: Joi.number().integer().min(0).optional(),
  observations: Joi.string().max(500).optional().allow('', null),
}).custom((value, helpers) => {
  if (value.remise !== undefined && value.remise !== null && value.remise < 0) {
    return helpers.error('any.custom', { message: 'La remise ne peut pas être négative.' });
  }
  return value;
}).messages({ 'any.custom': 'Valeurs incohérentes.' }).min(1);

/** Annulation d'une réservation. */
const cancelSchema = Joi.object({
  motif: Joi.string().max(255).required().messages({
    'any.required': 'Le motif d\'annulation est requis.',
  }),
});

/** Enregistrement d'un paiement. */
const paymentSchema = Joi.object({
  montant: Joi.number().integer().min(1).required().messages({
    'any.required': 'Le montant du paiement est requis.',
    'number.min': 'Le montant doit être supérieur à zéro.',
  }),
  methode: Joi.string().valid(...MODES_PAIEMENT).required().messages({
    'any.required': 'Le mode de paiement est requis.',
  }),
  note: Joi.string().max(255).optional().allow('', null),
});

/** Remboursement d'une réservation payée. */
const refundSchema = Joi.object({
  montant: Joi.number().integer().min(1).optional(),
  motif: Joi.string().max(255).optional().allow('', null),
  note: Joi.string().max(255).optional().allow('', null),
});

module.exports = {
  STATUTS,
  INITIAL_STATUTS,
  MODES_RESERVATION,
  MODES_PAIEMENT,
  SORTS,
  idSchema,
  availabilityQuerySchema,
  statsQuerySchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  cancelSchema,
  paymentSchema,
  refundSchema,
};
