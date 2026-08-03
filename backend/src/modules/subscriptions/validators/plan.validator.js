const { z } = require('zod');

const planCreateSchema = z.object({
  code: z.string().min(2).max(20),
  nom: z.string().min(2).max(60),
  description: z.string().max(255).optional().nullable(),
  prix_mensuel: z.number().int().min(0).default(0),
  prix_annuel: z.number().int().min(0).optional().nullable(),
  duree_jours: z.number().int().min(1).default(30),
  max_bus: z.number().int().min(0).optional().nullable(),
  max_agences: z.number().int().min(0).optional().nullable(),
  max_agents: z.number().int().min(0).optional().nullable(),
  max_reservations: z.number().int().min(0).optional().nullable(),
  fonctionnalites: z.array(z.string()).optional().default([]),
  statut: z.enum(['actif', 'inactif']).default('actif'),
  ordre: z.number().int().min(0).default(0),
});

const planUpdateSchema = planCreateSchema.partial();

module.exports = { planCreateSchema, planUpdateSchema };
