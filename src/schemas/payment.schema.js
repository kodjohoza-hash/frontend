import { z } from 'zod';

const phoneRegex = /^(\+?237)?[69]\d{8}$/;

export const paymentFormSchema = z.object({
  reference: z.string().optional(),
  bookingId: z.string().min(1, 'La réservation est requise'),
  clientName: z.string().min(1, 'Le nom du client est requis').min(2),
  clientPhone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(phoneRegex, 'Numéro camerounais invalide'),
  clientEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  amount: z.number().min(1, 'Le montant doit être supérieur à 0'),
  currency: z.string().default('XAF'),
  method: z.string().min(1, 'Le mode de paiement est requis'),
  outlet: z.string().optional().or(z.literal('')),
  agent: z.string().optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export const paymentRefundSchema = z.object({
  reason: z.string().min(1, 'Le motif du remboursement est requis').min(10, 'Le motif doit contenir au moins 10 caractères'),
  amount: z.number().min(1, 'Le montant doit être supérieur à 0'),
  method: z.string().min(1, 'Le mode de remboursement est requis'),
});
