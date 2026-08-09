const { z } = require('zod');

/** Filtres de liste — destinataire toujours déduit de l'utilisateur authentifié. */
const listSchema = z.object({
  statut: z.enum(['lu', 'non_lu']).optional(),
  type: z.string().trim().min(1).max(50).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const idParamSchema = z.object({
  id: z.string().trim().min(1).max(26),
});

module.exports = { listSchema, idParamSchema };
