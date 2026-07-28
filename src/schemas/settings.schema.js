import { z } from 'zod';

export const generalInfoSchema = z.object({
  name: z.string().min(2).max(100),
  slogan: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  website: z.string().url().or(z.literal('')).optional(),
  address: z.string().max(300).optional(),
  city: z.string().max(100),
  country: z.string().max(100),
  gpsLat: z.string().optional(),
  gpsLng: z.string().optional(),
  hours: z.object({
    weekdayOpen: z.string(),
    weekdayClose: z.string(),
    weekendOpen: z.string(),
    weekendClose: z.string(),
  }),
});

export const managerInfoSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().min(8).max(20),
  email: z.string().email(),
  role: z.string().max(100),
  photo: z.nullable(z.unknown()).optional(),
  signature: z.nullable(z.unknown()).optional(),
});

export const appearanceSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur primaire invalide'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur secondaire invalide'),
  logoLight: z.nullable(z.unknown()).optional(),
  logoDark: z.nullable(z.unknown()).optional(),
  favicon: z.nullable(z.unknown()).optional(),
  coverImage: z.nullable(z.unknown()).optional(),
});

export const paymentMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  commission: z.number().min(0).max(100),
});

export const paymentSettingsSchema = z.object({
  methods: z.array(paymentMethodSchema).min(1),
  currency: z.string(),
  taxRate: z.number().min(0).max(100),
});

export const reservationSettingsSchema = z.object({
  maxSeatsPerBooking: z.number().int().min(1).max(60),
  autoExpiryMinutes: z.number().int().min(5).max(1440),
  allowCancellation: z.boolean(),
  refundPolicy: z.enum(['strict', 'flexible', 'non-refundable']),
  instantBooking: z.boolean(),
  manualValidation: z.boolean(),
  autoNumbering: z.boolean(),
  numberPrefix: z.string().max(10),
  cancellationDeadlineHours: z.number().int().min(0).max(168),
  refundPercentage: z.number().min(0).max(100),
});

const notificationChannelSchema = z.object({
  enabled: z.boolean(),
  events: z.array(z.string()),
});

export const notificationSettingsSchema = z.object({
  email: notificationChannelSchema.optional().default({ enabled: false, events: [] }),
  sms: notificationChannelSchema.optional().default({ enabled: false, events: [] }),
  push: notificationChannelSchema.optional().default({ enabled: false, events: [] }),
  whatsapp: notificationChannelSchema.optional().default({ enabled: false, events: [] }),
  internal: notificationChannelSchema.optional().default({ enabled: false, events: [] }),
});

export const securitySchema = z.object({
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string().min(8).optional(),
  confirmPassword: z.string().optional(),
  twoFactorEnabled: z.boolean(),
});

export const regionalSettingsSchema = z.object({
  language: z.object({
    id: z.string(),
    label: z.string(),
  }),
  timezone: z.string(),
  dateFormat: z.string(),
  moneyFormat: z.string(),
  currency: z.string(),
});

export const companySettingsSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slogan: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(8).max(20).optional(),
  website: z.string().url().or(z.literal('')).optional(),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  gpsLat: z.string().optional(),
  gpsLng: z.string().optional(),
  hours: z.object({
    weekdayOpen: z.string(),
    weekdayClose: z.string(),
    weekendOpen: z.string(),
    weekendClose: z.string(),
  }).optional(),
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  role: z.string().max(100).optional(),
  photo: z.nullable(z.unknown()).optional(),
  signature: z.nullable(z.unknown()).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur primaire invalide').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur secondaire invalide').optional(),
  logoLight: z.nullable(z.unknown()).optional(),
  logoDark: z.nullable(z.unknown()).optional(),
  favicon: z.nullable(z.unknown()).optional(),
  coverImage: z.nullable(z.unknown()).optional(),
  methods: z.array(paymentMethodSchema).min(1).optional(),
  currency: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
  maxSeatsPerBooking: z.number().int().min(1).max(60).optional(),
  autoExpiryMinutes: z.number().int().min(5).max(1440).optional(),
  allowCancellation: z.boolean().optional(),
  refundPolicy: z.enum(['strict', 'flexible', 'non-refundable']).optional(),
  instantBooking: z.boolean().optional(),
  manualValidation: z.boolean().optional(),
  autoNumbering: z.boolean().optional(),
  numberPrefix: z.string().max(10).optional(),
  cancellationDeadlineHours: z.number().int().min(0).max(168).optional(),
  refundPercentage: z.number().min(0).max(100).optional(),
  notifications: z.object({
    email: notificationChannelSchema.optional(),
    sms: notificationChannelSchema.optional(),
    push: notificationChannelSchema.optional(),
    whatsapp: notificationChannelSchema.optional(),
    internal: notificationChannelSchema.optional(),
  }).optional(),
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string().min(8).optional(),
  confirmPassword: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
  language: z.object({
    id: z.string(),
    label: z.string(),
  }).optional(),
  timezone: z.string().optional(),
  dateFormat: z.string().optional(),
  moneyFormat: z.string().optional(),
});
