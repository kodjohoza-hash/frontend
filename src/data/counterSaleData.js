export const companies = [
  { id: 'EB', name: 'Express Bus Cameroun', logo: null, color: '#0B1D51' },
  { id: 'GE', name: 'Guillaume Express', logo: null, color: '#1E3A5F' },
  { id: 'ST', name: 'Sécurité Transport', logo: null, color: '#166534' },
  { id: 'RC', name: 'Royal Coach', logo: null, color: '#7C3AED' },
];

export const cities = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua',
  'Maroua', 'Ngaoundéré', 'Kribi', 'Ebolowa', 'Bertoua',
  'Limbe', 'Buea', 'Kumba', 'Nkongsamba', 'Foumban',
];

export const busClasses = [
  { id: 'standard', label: 'Standard', multiplier: 1 },
  { id: 'confort', label: 'Confort', multiplier: 1.3 },
  { id: 'vip', label: 'VIP', multiplier: 1.6 },
  { id: 'premium', label: 'Premium', multiplier: 2.0 },
];

export const passengerCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const paymentMethods = [
  { id: 'orange', label: 'Orange Money', icon: 'bi-phone', color: '#FF7900' },
  { id: 'mtn', label: 'MTN Mobile Money', icon: 'bi-phone', color: '#FFC300' },
  { id: 'card', label: 'Carte bancaire', icon: 'bi-credit-card', color: '#1E3A5F' },
  { id: 'cash', label: 'Espèces', icon: 'bi-cash', color: '#10B981' },
  { id: 'transfer', label: 'Virement bancaire', icon: 'bi-bank', color: '#8B5CF6' },
];

export const fees = {
  serviceFee: 500,
  taxRate: 0.05,
  discountRate: 0.10,
};

export const TAX_RATE = 0.05;
export const SERVICE_FEE = 500;

export default {
  companies,
  cities,
  busClasses,
  passengerCounts,
  paymentMethods,
  fees,
};
