const { z } = require('zod');

const subscriptionCreateSchema = z.object({
  compagnie_id: z.string().length(4),
  plan_id: z.number().int().positive(),
  date_debut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date_debut au format YYYY-MM-DD'),
  date_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date_fin au format YYYY-MM-DD'),
  renouvellement_auto: z.boolean().default(false),
});

const subscriptionRenewSchema = z.object({
  plan_id: z.number().int().positive(),
  date_debut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  methode: z.enum(['orange_money', 'mtn_money', 'carte_bancaire', 'virement_bancaire', 'especes']).default('virement_bancaire'),
  montant: z.number().int().min(0).optional(),
  renouvellement_auto: z.boolean().optional(),
});

const subscriptionChangePlanSchema = z.object({
  plan_id: z.number().int().positive(),
  date_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const subscriptionSuspendSchema = z.object({
  motif: z.string().max(255).optional(),
});

const subscriptionFilterSchema = z.object({
  statut: z.enum(['actif', 'en_attente', 'en_retard', 'expire', 'suspendu', 'annule']).optional(),
  plan_id: z.coerce.number().int().optional(),
  recherche: z.string().max(120).optional(),
  expirant: z.coerce.boolean().optional(), // filtre "expire bientôt" (<= 7 jours)
});

module.exports = {
  subscriptionCreateSchema,
  subscriptionRenewSchema,
  subscriptionChangePlanSchema,
  subscriptionSuspendSchema,
  subscriptionFilterSchema,
};
