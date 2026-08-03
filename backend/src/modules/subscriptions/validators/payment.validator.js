const { z } = require('zod');

const paymentCreateSchema = z.object({
  abonnement_compagnie_id: z.number().int().positive(),
  plan_id: z.number().int().positive().optional(),
  montant: z.number().int().min(0),
  methode: z.enum(['orange_money', 'mtn_money', 'carte_bancaire', 'virement_bancaire', 'especes']),
  statut: z.enum(['paye', 'en_attente', 'echoue', 'rembourse']).default('paye'),
  date: z.string().datetime({ offset: true }).optional(),
  facture_url: z.string().max(255).optional().nullable(),
});

const paymentFilterSchema = z.object({
  compagnie_id: z.string().length(4).optional(),
  statut: z.enum(['paye', 'en_attente', 'echoue', 'rembourse']).optional(),
});

module.exports = { paymentCreateSchema, paymentFilterSchema };
