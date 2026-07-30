/* ══════════════════════════════════════════════════════════════
   RBAC DATA — Fully dynamic, no hardcoded roles
   All data is mock, ready for Express.js
   ══════════════════════════════════════════════════════════════ */

/* ── Global permission actions (capabilities) ── */
export const PERMISSION_ACTIONS = [
  { id: 'view', label: 'Voir', icon: 'bi-eye' },
  { id: 'create', label: 'Créer', icon: 'bi-plus-circle' },
  { id: 'edit', label: 'Modifier', icon: 'bi-pencil' },
  { id: 'delete', label: 'Supprimer', icon: 'bi-trash' },
  { id: 'validate', label: 'Valider', icon: 'bi-check-circle' },
  { id: 'export', label: 'Exporter', icon: 'bi-download' },
  { id: 'share', label: 'Partager', icon: 'bi-share' },
  { id: 'configure', label: 'Configurer', icon: 'bi-gear' },
];

/* ── System modules ── */
export const MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2', color: 'primary' },
  { id: 'bookings', label: 'Réservations', icon: 'bi-ticket-perforated', color: 'info' },
  { id: 'trips', label: 'Voyages', icon: 'bi-bus-front', color: 'success' },
  { id: 'buses', label: 'Bus', icon: 'bi-truck', color: 'warning' },
  { id: 'payments', label: 'Paiements', icon: 'bi-cash-coin', color: 'success' },
  { id: 'clients', label: 'Clients', icon: 'bi-people', color: 'info' },
  { id: 'messaging', label: 'Messagerie', icon: 'bi-chat-dots', color: 'accent' },
  { id: 'notifications', label: 'Notifications', icon: 'bi-bell', color: 'warning' },
  { id: 'reports', label: 'Rapports', icon: 'bi-bar-chart-line', color: 'primary' },
  { id: 'companies', label: 'Compagnies', icon: 'bi-building', color: 'purple' },
  { id: 'users', label: 'Utilisateurs', icon: 'bi-people-fill', color: 'info' },
  { id: 'roles', label: 'Rôles & Permissions', icon: 'bi-shield-lock', color: 'accent' },
  { id: 'settings', label: 'Paramètres', icon: 'bi-gear-wide', color: 'secondary' },
  { id: 'audit', label: 'Audit', icon: 'bi-journal-text', color: 'danger' },
  { id: 'api', label: 'API', icon: 'bi-code-slash', color: 'primary' },
  { id: 'support', label: 'Support', icon: 'bi-headset', color: 'info' },
];

/* ── Role types ── */
export const ROLE_TYPES = [
  { id: 'system', label: 'Système', color: 'accent', badge: 'admr-badge--accent' },
  { id: 'custom', label: 'Personnalisé', color: 'info', badge: 'admr-badge--info' },
];

/* ── Role statuses ── */
export const ROLE_STATUSES = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actif' },
  { value: 'archived', label: 'Archivé' },
];

export const roleStatusConfig = {
  active: { label: 'Actif', class: 'admr-status--active' },
  archived: { label: 'Archivé', class: 'admr-status--archived' },
};

/* ── Roles (fully dynamic, add as many as needed) ── */
export const roles = [
  {
    id: 'ROLE-001', name: 'Super Administrateur', icon: 'bi-shield-lock', color: '#8B5CF6',
    description: 'Accès complet à toutes les fonctionnalités du système', type: 'system', status: 'active',
    createdAt: '2024-01-01', createdBy: 'Système', userCount: 4, permissionCount: 128,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: PERMISSION_ACTIONS.map((a) => a.id),
    })),
  },
  {
    id: 'ROLE-002', name: 'Administrateur Compagnie', icon: 'bi-building-gear', color: '#1E1B4B',
    description: 'Gère les opérations de sa compagnie de transport', type: 'system', status: 'active',
    createdAt: '2024-01-01', createdBy: 'Système', userCount: 48, permissionCount: 80,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: ['companies', 'users', 'roles', 'settings', 'audit', 'api'].includes(m.id)
        ? []
        : ['dashboard', 'bookings', 'trips', 'buses', 'payments', 'clients', 'messaging', 'notifications', 'reports', 'support'].includes(m.id)
          ? PERMISSION_ACTIONS.map((a) => a.id)
          : ['view'],
    })),
  },
  {
    id: 'ROLE-003', name: 'Agent de Guichet', icon: 'bi-shop', color: '#F59E0B',
    description: 'Gère les ventes, réservations et encaissements au guichet', type: 'system', status: 'active',
    createdAt: '2024-01-01', createdBy: 'Système', userCount: 320, permissionCount: 32,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: ['bookings', 'trips', 'payments', 'clients'].includes(m.id)
        ? ['view', 'create', 'edit']
        : m.id === 'dashboard' ? ['view']
          : [],
    })),
  },
  {
    id: 'ROLE-004', name: 'Client', icon: 'bi-person', color: '#3B82F6',
    description: 'Accès à son espace client pour réserver et gérer ses voyages', type: 'system', status: 'active',
    createdAt: '2024-01-01', createdBy: 'Système', userCount: 2120, permissionCount: 12,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: ['bookings', 'payments', 'messaging', 'notifications', 'support'].includes(m.id)
        ? ['view', 'create']
        : m.id === 'dashboard' ? ['view']
          : [],
    })),
  },
  {
    id: 'ROLE-005', name: 'Contrôleur', icon: 'bi-clipboard-check', color: '#10B981',
    description: 'Vérifie les billets et contrôle les voyageurs', type: 'custom', status: 'active',
    createdAt: '2025-06-15', createdBy: 'Kodjo Hoza', userCount: 12, permissionCount: 18,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: ['bookings', 'trips'].includes(m.id)
        ? ['view', 'validate']
        : m.id === 'dashboard' ? ['view']
          : [],
    })),
  },
  {
    id: 'ROLE-006', name: 'Comptable', icon: 'bi-calculator', color: '#EC4899',
    description: 'Gère la comptabilité, les commissions et les rapports financiers', type: 'custom', status: 'active',
    createdAt: '2025-08-01', createdBy: 'Kodjo Hoza', userCount: 6, permissionCount: 42,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: ['payments', 'reports', 'companies'].includes(m.id)
        ? PERMISSION_ACTIONS.map((a) => a.id)
        : ['bookings', 'trip', 'clients'].includes(m.id)
          ? ['view', 'export']
          : m.id === 'dashboard' ? ['view']
            : [],
    })),
  },
  {
    id: 'ROLE-007', name: 'Responsable Régional', icon: 'bi-globe2', color: '#14B8A6',
    description: 'Supervise les opérations dans une région', type: 'custom', status: 'active',
    createdAt: '2025-09-10', createdBy: 'Admin Super', userCount: 4, permissionCount: 56,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: ['dashboard', 'bookings', 'trips', 'payments', 'clients', 'companies', 'reports'].includes(m.id)
        ? ['view', 'create', 'edit', 'export', 'validate']
        : ['messaging', 'notifications'].includes(m.id)
          ? PERMISSION_ACTIONS.map((a) => a.id)
          : [],
    })),
  },
  {
    id: 'ROLE-008', name: 'Support Technique', icon: 'bi-headset', color: '#F97316',
    description: 'Assiste les utilisateurs et résout les problèmes techniques', type: 'custom', status: 'active',
    createdAt: '2025-10-05', createdBy: 'Admin Super', userCount: 8, permissionCount: 24,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: ['support', 'users', 'bookings'].includes(m.id)
        ? ['view', 'edit']
        : m.id === 'dashboard' ? ['view']
          : [],
    })),
  },
  {
    id: 'ROLE-009', name: 'Auditeur', icon: 'bi-search', color: '#6366F1',
    description: 'Consulte l\'intégralité du système en lecture seule pour audit', type: 'custom', status: 'active',
    createdAt: '2025-11-20', createdBy: 'Kodjo Hoza', userCount: 3, permissionCount: 112,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: m.id === 'settings' ? [] : ['view', 'export'],
    })),
  },
  {
    id: 'ROLE-010', name: 'Gestionnaire RH', icon: 'bi-person-badge', color: '#A855F7',
    description: 'Gère les comptes utilisateurs et les affectations', type: 'custom', status: 'archived',
    createdAt: '2025-04-01', createdBy: 'Kodjo Hoza', userCount: 0, permissionCount: 18,
    permissions: MODULES.map((m) => ({
      moduleId: m.id,
      actions: ['users', 'roles'].includes(m.id)
        ? ['view', 'create', 'edit']
        : m.id === 'dashboard' ? ['view']
          : [],
    })),
  },
];

/* ── Role KPI stats ── */
export const roleStats = [
  { id: 'total', label: 'Total rôles', value: 10, icon: 'bi-shield-check', color: 'primary', trend: 25, trendUp: true },
  { id: 'permissions', label: 'Permissions', value: 128, icon: 'bi-key', color: 'accent', trend: 0, trendUp: false },
  { id: 'active', label: 'Rôles actifs', value: 9, icon: 'bi-check-circle', color: 'success', trend: 12, trendUp: true },
  { id: 'system', label: 'Rôles système', value: 4, icon: 'bi-gear-wide-connected', color: 'info', trend: 0, trendUp: false },
  { id: 'custom', label: 'Rôles personnalisés', value: 6, icon: 'bi-plus-circle', color: 'warning', trend: 50, trendUp: true },
  { id: 'assigned', label: 'Permissions attribuées', value: 522, icon: 'bi-check-all', color: 'success', trend: 15, trendUp: true },
  { id: 'unused', label: 'Permissions non utilisées', value: 12, icon: 'bi-x-circle', color: 'danger', trend: -8, trendUp: false },
];

/* ── Activity timeline ── */
export const roleActivityTimeline = [
  { id: 1, type: 'created', icon: 'bi-plus-circle', color: 'success', action: 'Rôle créé', detail: 'Super Administrateur — Rôle système initial', time: '01 jan 2024' },
  { id: 2, type: 'created', icon: 'bi-plus-circle', color: 'success', action: 'Rôle créé', detail: 'Administrateur Compagnie — Rôle système', time: '01 jan 2024' },
  { id: 3, type: 'created', icon: 'bi-plus-circle', color: 'success', action: 'Rôle créé', detail: 'Agent de Guichet — Rôle système', time: '01 jan 2024' },
  { id: 4, type: 'created', icon: 'bi-plus-circle', color: 'success', action: 'Rôle créé', detail: 'Client — Rôle système', time: '01 jan 2024' },
  { id: 5, type: 'modified', icon: 'bi-pencil', color: 'warning', action: 'Permissions modifiées', detail: 'Agent de Guichet — Ajout module Paiements', time: '15 mar 2024' },
  { id: 6, type: 'permission_added', icon: 'bi-plus-lg', color: 'info', action: 'Permission ajoutée', detail: 'Admin Compagnie — Export des rapports', time: '20 jun 2024' },
  { id: 7, type: 'created', icon: 'bi-plus-circle', color: 'success', action: 'Rôle personnalisé créé', detail: 'Contrôleur — Créé par Kodjo Hoza', time: '15 jun 2025' },
  { id: 8, type: 'created', icon: 'bi-plus-circle', color: 'success', action: 'Rôle personnalisé créé', detail: 'Comptable — Créé par Kodjo Hoza', time: '01 aoû 2025' },
  { id: 9, type: 'created', icon: 'bi-plus-circle', color: 'success', action: 'Rôle personnalisé créé', detail: 'Responsable Régional — Créé par Admin Super', time: '10 sep 2025' },
  { id: 10, type: 'archived', icon: 'bi-archive', color: 'danger', action: 'Rôle archivé', detail: 'Gestionnaire RH — Archivé par Kodjo Hoza', time: '20 nov 2025' },
  { id: 11, type: 'permission_removed', icon: 'bi-dash-lg', color: 'danger', action: 'Permission retirée', detail: 'Client — Retrait module Paramètres', time: '05 jan 2026' },
  { id: 12, type: 'user_assigned', icon: 'bi-person-plus', color: 'success', action: 'Utilisateur assigné', detail: 'Paul Biya → Administrateur Compagnie', time: '30 jul 2026' },
];

/* ── Filter defaults ── */
export const defaultRoleFilters = {
  search: '', type: 'all', status: 'all',
};

export const filterRoles = (list, filters) => {
  return list.filter((r) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.createdBy.toLowerCase().includes(q)) return false;
    }
    if (filters.type && filters.type !== 'all' && r.type !== filters.type) return false;
    if (filters.status && filters.status !== 'all' && r.status !== filters.status) return false;
    return true;
  });
};

export const sortRoles = (list, sortBy) => {
  const sorted = [...list];
  switch (sortBy) {
    case 'newest': return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'name_asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'users_desc': return sorted.sort((a, b) => b.userCount - a.userCount);
    case 'permissions_desc': return sorted.sort((a, b) => b.permissionCount - a.permissionCount);
    default: return sorted;
  }
};

/* ── Helper: get permissions for a role ── */
export const getModulePermissions = (role, moduleId) => {
  const found = role.permissions.find((p) => p.moduleId === moduleId);
  return found ? found.actions : [];
};

/* ── Helper: check if role has a specific permission ── */
export const hasPermission = (role, moduleId, actionId) => {
  const perms = getModulePermissions(role, moduleId);
  return perms.includes(actionId);
};

/* ── Toggle permission helper (immutable update mock) ── */
export const togglePermission = (role, moduleId, actionId) => {
  const perms = role.permissions.map((p) => {
    if (p.moduleId === moduleId) {
      const has = p.actions.includes(actionId);
      return { ...p, actions: has ? p.actions.filter((a) => a !== actionId) : [...p.actions, actionId] };
    }
    return p;
  });
  return { ...role, permissions: perms, permissionCount: perms.reduce((sum, p) => sum + p.actions.length, 0) };
};

/* ── Set all permissions for a module ── */
export const setModulePermissions = (role, moduleId, actionIds) => {
  const perms = role.permissions.map((p) =>
    p.moduleId === moduleId ? { ...p, actions: actionIds } : p
  );
  return { ...role, permissions: perms, permissionCount: perms.reduce((sum, p) => sum + p.actions.length, 0) };
};

/* ── Copy permissions from one role to another ── */
export const copyPermissions = (sourceRole, targetRole) => {
  return { ...targetRole, permissions: JSON.parse(JSON.stringify(sourceRole.permissions)), permissionCount: sourceRole.permissionCount };
};

/* ── Get all unique permission action IDs used across all roles ── */
export const getUsedPermissionCount = () => {
  return roles.reduce((sum, r) => sum + r.permissionCount, 0);
};

/* ── Get unused permission count (total possible - used) ── */
export const getUnusedPermissionCount = () => {
  const totalPossible = MODULES.length * PERMISSION_ACTIONS.length * roles.length;
  const used = getUsedPermissionCount();
  return totalPossible - used;
};
