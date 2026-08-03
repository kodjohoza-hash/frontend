const Joi = require('joi');

const createAbonnementSchema = Joi.object({
  agence_id: Joi.string().max(10).required(),
  mois: Joi.number().integer().min(1).max(12).required(),
  annee: Joi.number().integer().min(2000).max(2100).required(),
  montant: Joi.number().integer().min(0).required(),
  date_debut: Joi.date().required(),
  date_fin: Joi.date().greater(Joi.ref('date_debut')).required(),
  statut_paiement: Joi.string().valid('paye', 'partiel', 'impaye', 'en_retard').default('impaye'),
  statut: Joi.string().valid('actif', 'expire', 'suspendu', 'renouvele', 'annule').default('actif'),
  date_paiement: Joi.date().optional().allow(null),
  reference_paiement: Joi.string().max(40).optional().allow(null),
});

const updateAbonnementSchema = Joi.object({
  statut_paiement: Joi.string().valid('paye', 'partiel', 'impaye', 'en_retard').optional(),
  statut: Joi.string().valid('actif', 'expire', 'suspendu', 'renouvele', 'annule').optional(),
  date_paiement: Joi.date().optional().allow(null),
  reference_paiement: Joi.string().max(40).optional().allow(null),
}).min(1);

module.exports = { createAbonnementSchema, updateAbonnementSchema };
