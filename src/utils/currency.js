const DEFAULT_CURRENCY = 'XOF';
const DEFAULT_LOCALE = 'fr-SN';

export const formatCurrency = (amount, currency = DEFAULT_CURRENCY, locale = DEFAULT_LOCALE) => {
  if (amount === null || amount === undefined) return '';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

export const formatNumber = (number, locale = DEFAULT_LOCALE) => {
  if (number === null || number === undefined) return '';
  return new Intl.NumberFormat(locale).format(number);
};

export const formatPercent = (value, locale = DEFAULT_LOCALE) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export const parseCurrency = (str) => {
  if (!str) return 0;
  const cleaned = str.replace(/[^\d.,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

export const convertCurrency = (amount, fromRate, toRate) => {
  if (!amount || !fromRate || !toRate) return 0;
  return (amount / fromRate) * toRate;
};

export const CURRENCIES = {
  XOF: { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  USD: { code: 'USD', symbol: '$', name: 'Dollar US' },
};

export const getCurrencies = () => Object.values(CURRENCIES);

export const getCurrencyByCode = (code) => CURRENCIES[code] || null;
