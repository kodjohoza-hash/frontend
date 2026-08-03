const Joi = require('joi');

const idSchema = Joi.object({
  id: Joi.string().max(10).required().messages({
    'any.required': 'L\'identifiant est requis.',
  }),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  statut: Joi.string().valid('actif', 'inactif', 'suspendu').optional(),
  recherche: Joi.string().max(120).optional().allow(''),
});

module.exports = { idSchema, listQuerySchema };
