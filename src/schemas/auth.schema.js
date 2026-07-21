import { z } from 'zod';

/**
 * BUS TIX CONNECT — Auth Validation Schemas (Zod)
 * All messages in French (fr_CM)
 */

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Adresse email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(/^(\+?237)?[69]\d{8}$/, 'Numéro de téléphone camerounais invalide (ex: 6XX XXX XXX)'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Adresse email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(passwordRegex, 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  confirmPassword: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise'),
  acceptsTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Vous devez accepter les conditions d\'utilisation',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Adresse email invalide'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(passwordRegex, 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  confirmPassword: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(1, 'Le code de vérification est requis')
    .length(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d+$/, 'Le code ne doit contenir que des chiffres'),
});
