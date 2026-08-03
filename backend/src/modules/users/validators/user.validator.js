const Joi = require('joi');

/**
 * Statuts utilisateur — alignés sur la colonne agent.statut.
 * (ACTIVE / INACTIVE / SUSPENDED / DELETED / BANNED en français DB)
 */
const STATUTS = ['actif', 'inactif', 'suspendu', 'supprime', 'banni'];
const ROLES = ['client', 'company_admin', 'counter_agent', 'super_admin'];
const GENRES = ['F', 'M', 'Autre'];

const emailSchema = Joi.string().email().max(120).required().messages({
  'string.email': 'Email invalide.',
  'any.required': "L'email est requis.",
});

const motDePasseSchema = Joi.string().min(8).max(128).required().messages({
  'string.min': 'Le mot de passe doit contenir au moins 8 caractères.',
  'any.required': 'Le mot de passe est requis.',
});

const idSchema = Joi.object({
  id: Joi.string().max(10).required().messages({
    'any.required': "L'identifiant utilisateur est requis.",
  }),
});

/** Filtres de liste : recherche, pagination, tri, rôle, statut, compagnie, agence. */
const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  recherche: Joi.string().max(120).optional().allow('').default(''),
  role: Joi.string().valid(...ROLES).optional(),
  statut: Joi.string().valid(...STATUTS).optional(),
  compagnieId: Joi.string().max(4).optional().allow(''),
  agenceId: Joi.string().max(10).optional().allow(''),
  sort: Joi.string()
    .valid('newest', 'oldest', 'name_asc', 'name_desc', 'lastLogin_desc')
    .default('newest'),
});

/** Création d'un utilisateur (agent + compte) — super admin / company admin. */
const createSchema = Joi.object({
  prenom: Joi.string().max(60).required(),
  nom: Joi.string().max(60).required(),
  email: emailSchema,
  telephone: Joi.string().max(20).required(),
  role: Joi.string().valid(...ROLES).required(),
  genre: Joi.string().valid(...GENRES).optional().allow(null),
  date_naissance: Joi.date().optional().allow(null),
  adresse: Joi.string().max(255).optional().allow('', null),
  langue: Joi.string().max(40).optional().allow('', null),
  nationalite: Joi.string().max(60).optional().allow('', null),
  date_embauche: Joi.date().optional().allow(null),
  agence_id: Joi.string().max(10).required(),
  superieur_id: Joi.string().max(10).optional().allow(null),
  motDePasse: motDePasseSchema,
});

/** Mise à jour partielle d'un utilisateur. */
const updateSchema = Joi.object({
  prenom: Joi.string().max(60).optional(),
  nom: Joi.string().max(60).optional(),
  telephone: Joi.string().max(20).optional(),
  genre: Joi.string().valid(...GENRES).optional().allow(null),
  date_naissance: Joi.date().optional().allow(null),
  adresse: Joi.string().max(255).optional().allow('', null),
  langue: Joi.string().max(40).optional().allow('', null),
  nationalite: Joi.string().max(60).optional().allow('', null),
  role: Joi.string().valid(...ROLES).optional(),
  agence_id: Joi.string().max(10).optional(),
  superieur_id: Joi.string().max(10).optional().allow(null),
  motDePasse: Joi.string().min(8).max(128).optional(),
}).min(1);

/** Changement de statut (bloquer / débloquer / suspendre / supprimer…). */
const statusSchema = Joi.object({
  id: Joi.string().max(10).required(),
  statut: Joi.string().valid(...STATUTS).required(),
  raison: Joi.string().max(255).optional().allow('', null),
});

/** Changement de mot de passe (soi-même). */
const passwordSchema = Joi.object({
  motDePasseActuel: Joi.string().min(6).max(128).required().messages({
    'any.required': 'Le mot de passe actuel est requis.',
  }),
  nouveauMotDePasse: motDePasseSchema,
});

/** Mise à jour de son propre profil. */
const profileUpdateSchema = Joi.object({
  prenom: Joi.string().max(60).optional().allow(''),
  nom: Joi.string().max(60).optional().allow(''),
  telephone: Joi.string().max(20).optional().allow(''),
  adresse: Joi.string().max(255).optional().allow('', null),
  date_naissance: Joi.date().optional().allow(null),
  genre: Joi.string().valid(...GENRES).optional().allow(null),
  nationalite: Joi.string().max(60).optional().allow('', null),
  langue: Joi.string().max(40).optional().allow('', null),
  theme: Joi.string().valid('sombre', 'clair', 'systeme').optional().allow(null),
}).min(1);

module.exports = {
  STATUTS,
  ROLES,
  idSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  passwordSchema,
  profileUpdateSchema,
};
