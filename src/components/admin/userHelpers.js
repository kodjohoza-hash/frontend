import { userRoles } from '../../data/adminUserData';

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const avatarBgs = Array.from({ length: 10 }, (_, i) => `admu-avatar--${i}`);
export const getAvatarClass = (id) => {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarBgs[hash % avatarBgs.length];
};

export const getRoleConfig = (roleId) => userRoles.find((r) => r.id === roleId) || { label: roleId, icon: 'bi-person', color: 'secondary' };

export const formatDateTime = (dt) => {
  if (!dt) return '—';
  return dt;
};
