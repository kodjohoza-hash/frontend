const z = require('zod');

/** Actions indexées par le journal d'audit (alignées sur l'UI admin). */
const ACTIONS = [
  'login', 'logout', 'login_failed', 'create', 'update', 'delete',
  'validate', 'reject', 'suspend', 'reactivate', 'renew', 'expire',
  'payment', 'status', 'change_role', 'permission_change', 'export',
];

/** Entités journalisées. */
const ENTITES = [
  'auth', 'compagnie', 'abonnement', 'plan', 'paiement', 'utilisateur',
  'voyage', 'billet', 'parametre',
];

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

/** Schéma de requête commun : pagination + filtres du journal d'audit. */
const auditQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
    search: z.string().trim().max(120).optional(),
    action: z.enum(ACTIONS).optional(),
    entite: z.enum(ENTITES).optional(),
    role: z.string().trim().max(40).optional(),
    utilisateur: z.string().trim().max(120).optional(),
    dateDebut: z.string().regex(datePattern, 'dateDebut invalide (attendu YYYY-MM-DD).').optional(),
    dateFin: z.string().regex(datePattern, 'dateFin invalide (attendu YYYY-MM-DD).').optional(),
    sort: z.enum(['date_desc', 'date_asc']).default('date_desc'),
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

module.exports = { auditQuerySchema, ACTIONS, ENTITES };
