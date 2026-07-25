import { z } from 'zod';

export const bookingFormSchema = z.object({
  clientFirstName: z.string().min(1, 'Le prénom est requis').min(2),
  clientLastName: z.string().min(1, 'Le nom est requis').min(2),
  clientPhone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(/^(\+?237)?[69]\d{8}$/, 'Numéro camerounais invalide'),
  clientEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  tripId: z.string().min(1, 'Le voyage est requis'),
  busId: z.string().min(1, 'Le bus est requis'),
  seats: z.array(z.number()).min(1, 'Sélectionnez au moins une place'),
  outlet: z.string().optional().or(z.literal('')),
  agent: z.string().optional().or(z.literal('')),
  paymentMethod: z.string().min(1, 'Le mode de paiement est requis'),
  discount: z.number().min(0).max(100).optional().default(0),
  notes: z.string().max(500).optional().or(z.literal('')),
});
