const { z } = require('zod');

const idParamSchema = z.object({
  id: z.coerce.number().int().positive('Identifiant invalide.'),
});

const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

module.exports = { idParamSchema, pageQuerySchema };
