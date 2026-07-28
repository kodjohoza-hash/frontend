import { z } from 'zod';

const phoneRegex = /^(\+?237)?[69]\d{8}$/;

export const clientProfileSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis').min(2),
  lastName: z.string().min(1, 'Le nom est requis').min(2),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(phoneRegex, 'Numéro camerounais invalide'),
  city: z.string().min(1, 'La ville est requise'),
  country: z.string().min(1, 'Le pays est requis'),
  address: z.string().optional(),
  notes: z.string().max(1000).optional(),
  isVip: z.boolean().optional().default(false),
});

export const clientNoteSchema = z.object({
  content: z.string().min(1, 'La note est requise').min(10, 'Minimum 10 caractères').max(500),
});
