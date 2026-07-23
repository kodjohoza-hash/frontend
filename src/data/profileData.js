/**
 * BUS TIX CONNECT — Profile Mock Data
 * Stats, preferences defaults, security info
 * All data derived from user shape + supplementary mock fields
 */

export const profileStats = {
  totalTrips: 18,
  activeTickets: 2,
  totalBookings: 23,
  companiesUsed: 5,
};

export const defaultPreferences = {
  language: 'fr',
  currency: 'XAF',
  timezone: 'Africa/Douala',
  dateFormat: 'DD/MM/YYYY',
  notifications: {
    email: true,
    sms: true,
    push: true,
    promotions: false,
  },
};

export const securityInfo = {
  twoFactorEnabled: false,
  lastLogin: '2026-07-23T08:15:00',
  lastLoginDevice: 'Chrome sur Windows 11',
  lastLoginIp: '196.216.XXX.XXX',
  connectedDevices: [
    {
      id: 'dev_001',
      name: 'Chrome sur Windows 11',
      lastActive: '2026-07-23T08:15:00',
      current: true,
    },
    {
      id: 'dev_002',
      name: 'Safari sur iPhone 15',
      lastActive: '2026-07-22T18:30:00',
      current: false,
    },
  ],
};

export const genderOptions = [
  { value: '', label: 'Sélectionnez...' },
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
  { value: 'other', label: 'Autre' },
];

export const languageOptions = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

export const currencyOptions = [
  { value: 'XAF', label: 'FCFA (XAF)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar (USD)' },
];

export const timezoneOptions = [
  { value: 'Africa/Douala', label: 'Douala (GMT+1)' },
  { value: 'Africa/Lagos', label: 'Lagos (GMT+1)' },
  { value: 'Africa/Nairobi', label: 'Nairobi (GMT+3)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (GMT+2)' },
];

export const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'JJ/MM/AAAA' },
  { value: 'MM/DD/YYYY', label: 'MM/JJ/AAAA' },
  { value: 'YYYY-MM-DD', label: 'AAAA-MM-JJ' },
];
