import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const cameroonPhoneRegex = /^(\+?237)?[69]\d{8}$/;

/* ================================================
   CLIENT — Independent schemas
   ================================================ */

export const clientLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Adresse email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
  rememberMe: z.boolean().optional().default(false),
});

export const clientRegisterSchema = z.object({
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
    .regex(/^(\+?237)?[69]\d{8}$/, 'Numéro camerounais invalide (ex: 6XX XXX XXX)'),
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
  country: z
    .string()
    .min(1, 'Le pays est requis'),
  city: z
    .string()
    .min(1, 'La ville est requise')
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(50, 'La ville ne peut pas dépasser 50 caractères'),
  acceptsTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Vous devez accepter les conditions d\'utilisation',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

/* ================================================
   COMPANY — Independent schemas
   ================================================ */

export const companyLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email professionnel est requis')
    .email('Adresse email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
  rememberMe: z.boolean().optional().default(false),
});

/** Step 1: General Information */
export const companyRegisterStep1Schema = z.object({
  companyName: z
    .string()
    .min(1, 'Le nom de la compagnie est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  address: z
    .string()
    .min(1, 'L\'adresse est requise'),
  city: z
    .string()
    .min(1, 'La ville est requise'),
  country: z
    .string()
    .min(1, 'Le pays est requis'),
  website: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val === '') return true;
      try { new URL(val); return true; } catch { return false; }
    }, 'URL invalide'),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
});

/** Step 2: Manager Information */
export const companyRegisterStep2Schema = z.object({
  managerLastName: z
    .string()
    .min(1, 'Le nom du responsable est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  managerFirstName: z
    .string()
    .min(1, 'Le prénom du responsable est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(/^(\+?237)?[69]\d{8}$/, 'Numéro camerounais invalide (ex: 6XX XXX XXX)'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Adresse email invalide'),
});

/** Step 3: Documents */
export const companyRegisterStep3Schema = z.object({
  rccm: z
    .string()
    .min(1, 'Le numéro RCCM est requis'),
  taxpayerNumber: z
    .string()
    .min(1, 'Le numéro contribuable est requis'),
});

/** Step 4: Account */
export const companyRegisterStep4Schema = z.object({
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

/* ================================================
   COUNTER — Independent schema
   ================================================ */

export const counterLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'identifiant est requis'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
  rememberMe: z.boolean().optional().default(false),
});

/* ================================================
   SUPER ADMIN — Independent schema
   ================================================ */

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Adresse email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
  rememberMe: z.boolean().optional().default(false),
});

/* ================================================
   SHARED — Password flows
   ================================================ */

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
