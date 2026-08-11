const z = require('zod');

/** Périodes prédéfinies supportées par le module Statistiques. */
const PERIODES = ['today', 'yesterday', '7d', '30d', 'this_month', 'last_month', 'this_year', 'all'];

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

/** Schéma de requête commun (filtre de période). */
const statisticsQuerySchema = z
  .object({
    periode: z.enum(PERIODES).default('all'),
    dateDebut: z.string().regex(datePattern, 'dateDebut invalide (attendu YYYY-MM-DD).').optional(),
    dateFin: z.string().regex(datePattern, 'dateFin invalide (attendu YYYY-MM-DD).').optional(),
    compagnieId: z.string().regex(/^[A-Za-z0-9]{1,10}$/, 'compagnieId invalide.').optional(),
  })
  .superRefine((val, ctx) => {
    if (val.dateDebut && val.dateFin && val.dateFin < val.dateDebut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'dateFin doit être postérieure ou égale à dateDebut.',
        path: ['dateFin'],
      });
    }
  });

module.exports = { statisticsQuerySchema, PERIODES };
