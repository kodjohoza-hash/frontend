const Joi = require('joi');

const createAgenceSchema = Joi.object({
  nom: Joi.string().max(120).required(),
  ville_id: Joi.string().max(3).required(),
  adresse: Joi.string().max(255).optional().allow('', null),
  telephone: Joi.string().max(20).optional().allow('', null),
  compagnie_id: Joi.string().max(4).optional().allow(null),
  statut_abonnement: Joi.string().valid('actif', 'en_retard', 'suspendu').default('suspendu'),
  abonnement_expire_le: Joi.date().optional().allow(null),
});

const updateAgenceSchema = Joi.object({
  nom: Joi.string().max(120).optional(),
  ville_id: Joi.string().max(3).optional(),
  adresse: Joi.string().max(255).optional().allow('', null),
  telephone: Joi.string().max(20).optional().allow('', null),
  statut_abonnement: Joi.string().valid('actif', 'en_retard', 'suspendu').optional(),
  abonnement_expire_le: Joi.date().optional().allow(null),
}).min(1);

module.exports = { createAgenceSchema, updateAgenceSchema };
