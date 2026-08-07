const DEFAULT_CURRENCY = 'XAF';
const DEFAULT_LOCALE = 'fr-CM';

export const formatCurrency = (amount, currency = DEFAULT_CURRENCY, locale = DEFAULT_LOCALE) => {
  if (amount === null || amount === undefined) return '';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '';

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);

  return `${formatted} ${currency}`;
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
  XAF: { code: 'XAF', symbol: 'XAF', name: 'Franc CFA BEAC' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  USD: { code: 'USD', symbol: '$', name: 'Dollar US' },
};

export const getCurrencies = () => Object.values(CURRENCIES);

export const getCurrencyByCode = (code) => CURRENCIES[code] || null;
