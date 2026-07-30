export const formatCurrency = (val) => {
  if (!val) return '0 FCFA';
  return val.toLocaleString('fr-FR') + ' FCFA';
};
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};
const logoBgs = [
  'admc-table-logo-bg--0', 'admc-table-logo-bg--1', 'admc-table-logo-bg--2',
  'admc-table-logo-bg--3', 'admc-table-logo-bg--4', 'admc-table-logo-bg--5',
  'admc-table-logo-bg--6', 'admc-table-logo-bg--7', 'admc-table-logo-bg--8', 'admc-table-logo-bg--9',
];
export const getLogoBgClass = (idx) => logoBgs[idx % logoBgs.length];
