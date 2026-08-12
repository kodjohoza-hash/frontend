const Joi = require('joi');

/**
 * Module COUNTERS — validators.
 * Statuts guichet alignés sur la colonne `guichet.statut`.
 * (OPEN / CLOSED / MAINTENANCE → ouvert / ferme / maintenance)
 */
const STATUTS = ['ouvert', 'ferme', 'maintenance'];

/** Types de guichet. */
const TYPES = ['vente_billets', 'reservation', 'caisse', 'renseignement', 'autre'];

/** Types de pièce d'identité client (alignés sur `client.type_piece`). */
const PIECES = ['cni', 'passeport', 'permis', 'aucune', 'autre'];

const idSchema = Joi.object({
  id: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant guichet est requis.",
  }),
});

/** Filtres de liste : recherche, pagination, tri, agence, statut, type. */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  agenceId: Joi.string().max(10).optional().allow(''),
  statut: Joi.string().valid(...STATUTS).optional().allow(''),
  type: Joi.string().valid(...TYPES).optional().allow(''),
  sort: Joi.string()
    .valid('newest', 'oldest', 'code_asc', 'code_desc', 'nom_asc', 'nom_desc')
    .default('newest'),
});

/** Création d'un guichet. */
const createSchema = Joi.object({
  agenceId: Joi.string().max(10).required().messages({
    'any.required': "L'agence du guichet est requise.",
  }),
  code: Joi.string().max(20).optional().allow('', null),
  nom: Joi.string().max(120).optional().allow('', null),
  type: Joi.string().valid(...TYPES).optional().default('vente_billets'),
  statut: Joi.string().valid(...STATUTS).optional().default('ouvert'),
  description: Joi.string().max(255).optional().allow('', null),
});

/** Mise à jour partielle d'un guichet. */
const updateSchema = Joi.object({
  agenceId: Joi.string().max(10).optional(),
  code: Joi.string().max(20).optional().allow('', null),
  nom: Joi.string().max(120).optional().allow('', null),
  type: Joi.string().valid(...TYPES).optional(),
  statut: Joi.string().valid(...STATUTS).optional(),
  description: Joi.string().max(255).optional().allow('', null),
}).min(1);

/** Changement de statut opérationnel (ouvrir / fermer / maintenance). */
const statusSchema = Joi.object({
  statut: Joi.string().valid(...STATUTS).required(),
  raison: Joi.string().max(255).optional().allow('', null),
});

/** Affectation / retrait d'agents à un guichet. */
const assignSchema = Joi.object({
  agentIds: Joi.array().items(Joi.string().max(10)).min(1).required().messages({
    'any.required': 'La liste des agents est requise.',
  }),
});

/** Transfert d'agents d'un guichet vers un autre. */
const transferSchema = Joi.object({
  agentIds: Joi.array().items(Joi.string().max(10)).min(1).required(),
  toGuichetId: Joi.string().max(10).required().messages({
    'any.required': "Le guichet de destination est requis.",
  }),
});

/** Recherche de client au guichet (nom / téléphone / email, scope compagnie). */
const clientSearchSchema = Joi.object({
  recherche: Joi.string().max(120).optional().allow('').default(''),
  limite: Joi.number().integer().min(1).max(50).default(20),
});

/** Création d'un client au guichet (sans compte : pas de mot de passe). */
const clientCreateSchema = Joi.object({
  prenom: Joi.string().max(60).required().messages({
    'any.required': 'Le prénom du client est requis.',
  }),
  nom: Joi.string().max(60).required().messages({
    'any.required': 'Le nom du client est requis.',
  }),
  telephone: Joi.string().max(20).required().messages({
    'any.required': 'Le téléphone du client est requis.',
  }),
  email: Joi.string().email().max(120).optional().allow('', null),
  adresse: Joi.string().max(255).optional().allow('', null),
  villeId: Joi.string().max(3).optional().allow('', null),
  pays: Joi.string().max(60).optional().default('Cameroun'),
  typePiece: Joi.string().valid(...PIECES).optional().default('aucune'),
  numeroPiece: Joi.string().max(40).optional().allow('', null),
});

module.exports = {
  STATUTS,
  TYPES,
  PIECES,
  idSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  assignSchema,
  transferSchema,
  clientSearchSchema,
  clientCreateSchema,
};
