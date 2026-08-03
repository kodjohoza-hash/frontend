import { permissionList } from '../data/agencyCounterAgentData';

/**
 * BUS TIX CONNECT — Counter agents mappers (API réelle)
 * Traduit un utilisateur API (voir usersService.mapUser) vers la structure
 * attendue par les composants AgencyCounterAgent* (page « Agents de guichet »).
 */

export const API_TO_UI_ROLE = {
  counter_agent: 'agent_vente',
  company_admin: 'manager',
  super_admin: 'superviseur',
};

export const UI_TO_API_ROLE = {
  agent_vente: 'counter_agent',
  agent_comptoir: 'counter_agent',
  superviseur: 'counter_agent',
  manager: 'company_admin',
};

/* Statuts UI de la page Admin utilisateurs → statuts de la page Agents de guichet. */
export const ADMIN_STATUS_TO_AGENT = {
  active: 'actif',
  pending: 'hors_ligne',
  suspended: 'suspendu',
  blocked: 'desactive',
  deleted: 'desactive',
};

/* Statuts UI Agents de guichet → statuts API (/users/status). */
export const AGENT_STATUS_TO_API = {
  actif: 'actif',
  hors_ligne: 'inactif',
  en_service: 'actif',
  conge: 'actif',
  suspendu: 'suspendu',
  desactive: 'inactif',
};

const ROLE_POSITION = {
  agent_vente: 'Agent de guichet',
  agent_comptoir: 'Agent comptoir',
  superviseur: 'Superviseur',
  manager: 'Manager',
};

const ROLE_PERMS = {
  agent_vente: ['create_booking', 'edit_booking', 'cancel_booking', 'collect_payment', 'print_ticket', 'view_stats', 'manage_clients'],
  agent_comptoir: ['create_booking', 'print_ticket', 'view_stats'],
  superviseur: ['create_booking', 'edit_booking', 'cancel_booking', 'collect_payment', 'print_ticket', 'view_stats', 'manage_clients', 'manage_agents', 'access_reports', 'view_trips', 'view_buses'],
  manager: permissionList.map((p) => p.key),
};

/** Met en forme un utilisateur API → structure attendue par l'UI Agents de guichet. */
export const mapCounterAgent = (u, branches = [], guichets = []) => {
  const branch = branches.find((b) => b.id === u.agenceId);
  const guichet = guichets.find((g) => g.id === u.guichetId);
  const role = API_TO_UI_ROLE[u.role] || 'agent_vente';
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    gender: u.gender || 'M',
    phone: u.phone,
    email: u.email,
    address: u.address || branch?.fullAddress || '',
    city: branch?.city || u.city || '',
    country: 'Cameroun',
    dateOfBirth: u.dob || '',
    agency: u.agenceId || '',
    pointDeVente: u.guichetId || guichet?.id || '',
    position: ROLE_POSITION[role] || 'Agent de guichet',
    role,
    hireDate: u.createdAt ? String(u.createdAt).slice(0, 10) : '',
    username: (u.email || '').split('@')[0] || u.id,
    tempPassword: '',
    status: ADMIN_STATUS_TO_AGENT[u.status] || 'actif',
    observations: '',
    photoUrl: u.avatar,
    lastLogin: u.lastLogin,
    permissions: ROLE_PERMS[role] || ROLE_PERMS.agent_vente,
    stats: { totalSales: 0, totalRevenue: 0, ticketsPrinted: 0, bookingsCreated: 0, cancellations: 0, avgDailySales: 0 },
    history: [],
  };
};

/** Construit le payload PATCH /users/:id à partir du formulaire de la modal. */
export const buildUpdatePayload = (formData) => ({
  prenom: formData.firstName,
  nom: formData.lastName,
  telephone: formData.phone,
  genre: formData.gender,
  date_naissance: formData.dateOfBirth || null,
  adresse: formData.address,
  role: UI_TO_API_ROLE[formData.role] || 'counter_agent',
  agence_id: formData.agency,
});
