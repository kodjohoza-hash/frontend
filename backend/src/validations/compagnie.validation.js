const Joi = require('joi');

const createCompagnieSchema = Joi.object({
  nom: Joi.string().max(100).required(),
  sigle: Joi.string().max(20).required(),
  adresse: Joi.string().max(255).optional().allow('', null),
  telephone: Joi.string().max(20).required(),
  email: Joi.string().email().max(120).required(),
  logo_url: Joi.string().max(255).optional().allow('', null),
});

const updateCompagnieSchema = Joi.object({
  nom: Joi.string().max(100).optional(),
  sigle: Joi.string().max(20).optional(),
  adresse: Joi.string().max(255).optional().allow('', null),
  telephone: Joi.string().max(20).optional(),
  email: Joi.string().email().max(120).optional(),
  logo_url: Joi.string().max(255).optional().allow('', null),
  statut: Joi.string().valid('active', 'inactive', 'suspendue').optional(),
}).min(1);

module.exports = { createCompagnieSchema, updateCompagnieSchema };
