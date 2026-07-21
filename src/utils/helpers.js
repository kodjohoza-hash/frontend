import clsx from 'clsx';

export const cn = (...inputs) => clsx(inputs);

export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  const first = firstName ? firstName.charAt(0) : '';
  const last = lastName ? lastName.charAt(0) : '';
  return `${first}${last}`.toUpperCase();
};

export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
  return phone;
};

export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    pending: 'bg-warning',
    confirmed: 'bg-success',
    cancelled: 'bg-danger',
    completed: 'bg-info',
    active: 'bg-success',
    inactive: 'bg-secondary',
  };
  return statusClasses[status] || 'bg-secondary';
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé',
    active: 'Actif',
    inactive: 'Inactif',
  };
  return labels[status] || status;
};
