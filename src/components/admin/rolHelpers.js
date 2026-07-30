export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const iconBgs = [
  '#1E1B4B', '#065F46', '#92400E', '#991B1B', '#1E40AF',
  '#6D28D9', '#0F766E', '#7C2D12', '#831843', '#1E3A5F',
  '#4C1D95', '#047857', '#B45309', '#B91C1C', '#2563EB',
  '#7C3AED', '#0D9488', '#C2410C', '#BE185D', '#1E40AF',
];
export const getRoleIconBg = (color) => color || iconBgs[Math.floor(Math.random() * iconBgs.length)];
