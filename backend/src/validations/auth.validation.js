const Joi = require('joi');

const email = Joi.string().email().max(120).required().messages({
  'string.email': 'Email invalide.',
  'any.required': 'L\'email est requis.',
});

const motDePasse = Joi.string().min(6).max(128).required().messages({
  'string.min': 'Le mot de passe doit contenir au moins 6 caractères.',
  'any.required': 'Le mot de passe est requis.',
});

const nouveauMotDePasse = Joi.string().min(8).max(128).required().messages({
  'string.min': 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
  'any.required': 'Le nouveau mot de passe est requis.',
});

const loginSchema = Joi.object({
  email,
  motDePasse,
});

const registerAgentSchema = Joi.object({
  matricule: Joi.string().max(20).required(),
  prenom: Joi.string().max(60).required(),
  nom: Joi.string().max(60).required(),
  email: Joi.string().email().max(120).required(),
  telephone: Joi.string().max(20).required(),
  role: Joi.string().valid('counter_agent', 'company_admin', 'super_admin').required(),
  genre: Joi.string().valid('F', 'M', 'Autre').optional().allow(null),
  date_naissance: Joi.date().optional().allow(null),
  adresse: Joi.string().max(255).optional().allow('', null),
  langue: Joi.string().max(40).optional().allow('', null),
  date_embauche: Joi.date().required(),
  agence_id: Joi.string().max(10).required(),
  superieur_id: Joi.string().max(10).optional().allow(null),
  motDePasse: nouveauMotDePasse,
});

const registerClientSchema = Joi.object({
  prenom: Joi.string().max(60).required(),
  nom: Joi.string().max(60).required(),
  telephone: Joi.string().max(20).required(),
  email,
  motDePasse: nouveauMotDePasse,
  pays: Joi.string().max(60).required(),
  ville: Joi.string().max(60).required(),
  adresse: Joi.string().max(255).optional().allow('', null),
});

const registerCompanySchema = Joi.object({
  companyName: Joi.string().max(120).required(),
  address: Joi.string().max(255).optional().allow('', null),
  city: Joi.string().max(120).required(),
  country: Joi.string().max(60).required(),
  website: Joi.string().max(255).optional().allow('', null),
  description: Joi.string().max(1000).optional().allow('', null),
  rccm: Joi.string().max(60).required(),
  taxpayerNumber: Joi.string().max(60).required(),
  managerLastName: Joi.string().max(60).required(),
  managerFirstName: Joi.string().max(60).required(),
  phone: Joi.string().max(20).required(),
  email,
  motDePasse: nouveauMotDePasse,
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Le refresh token est requis.',
  }),
});

const logoutSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Le refresh token est requis.',
  }),
});

const forgotPasswordSchema = Joi.object({ email });

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Le jeton de réinitialisation est requis.',
  }),
  motDePasse: nouveauMotDePasse,
});

const changePasswordSchema = Joi.object({
  motDePasseActuel: motDePasse,
  nouveauMotDePasse,
});

const updateProfileSchema = Joi.object({
  prenom: Joi.string().max(60).optional().allow(''),
  nom: Joi.string().max(60).optional().allow(''),
  telephone: Joi.string().max(20).optional().allow(''),
  adresse: Joi.string().max(255).optional().allow('', null),
  pays: Joi.string().max(60).optional().allow('', null),
  ville: Joi.alternatives().try(Joi.number().integer(), Joi.string().max(60)).optional().allow(null),
  typePiece: Joi.string().max(40).optional().allow('', null),
  numeroPiece: Joi.string().max(60).optional().allow('', null),
  langue: Joi.string().max(40).optional().allow('', null),
  theme: Joi.string().valid('sombre', 'clair', 'systeme').optional().allow(null),
}).min(1);

const verifyEmailSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Le jeton de vérification est requis.',
  }),
});

const resendVerificationSchema = Joi.object({ email });

module.exports = {
  loginSchema,
  registerAgentSchema,
  registerClientSchema,
  registerCompanySchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
  resendVerificationSchema,
};
