const { z } = require('zod');

/** Pagination + filtre « avant » (curseur temporel des messages). */
const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  before: z.string().datetime({ offset: true }).optional(),
});

const conversationIdParamSchema = z.object({
  conversationId: z.string().trim().min(1).max(26),
});

const idParamSchema = z.object({
  id: z.string().trim().min(1).max(26),
});

/** Création de conversation : destinataire requis, contexte optionnel. */
const createConversationSchema = z.object({
  subject: z.string().trim().max(160).optional(),
  recipient: z
    .object({
      type: z.enum(['client', 'agent', 'company']),
      id: z.string().trim().min(1).max(26),
    })
    .strict(),
  context: z
    .object({
      type: z.enum(['reservation', 'voyage', 'company']),
      id: z.string().trim().min(1).max(40),
    })
    .strict()
    .optional(),
});

const sendMessageSchema = z.object({
  content: z.string().trim().min(1, 'Le message ne peut pas être vide.').max(2000, 'Message trop long (2000 caractères maximum).'),
});

module.exports = {
  listQuerySchema,
  conversationIdParamSchema,
  idParamSchema,
  createConversationSchema,
  sendMessageSchema,
};
