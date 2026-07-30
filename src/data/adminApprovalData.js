/* ══════════════════════════════════════════════════════════════
   COMPANY APPROVAL / VERIFICATION WORKFLOW — Bus Tix Connect
   Fully mock data, ready for Express.js
   ══════════════════════════════════════════════════════════════ */

export const approvalStats = [
  { id: 'received', label: 'Demandes reçues', value: 128, icon: 'bi-inbox', color: 'primary', trend: 15, trendUp: true },
  { id: 'pending', label: 'En attente', value: 18, icon: 'bi-hourglass-split', color: 'warning', trend: 8, trendUp: true },
  { id: 'approved', label: 'Approuvées', value: 98, icon: 'bi-check-circle', color: 'success', trend: 22, trendUp: true },
  { id: 'refused', label: 'Refusées', value: 12, icon: 'bi-x-circle', color: 'danger', trend: -5, trendUp: false },
  { id: 'incomplete', label: 'Documents incomplets', value: 6, icon: 'bi-file-earmark-x', color: 'danger-light', trend: 2, trendUp: true },
  { id: 'expired', label: 'Documents expirés', value: 3, icon: 'bi-clock-fill', color: 'danger', trend: -1, trendUp: false },
  { id: 'avg_time', label: 'Temps moyen (heures)', value: 24, icon: 'bi-stopwatch', color: 'info', trend: -12, trendUp: false },
];

export const approvalStatuses = [
  { value: 'all', label: 'Tous' },
  { value: 'pending_review', label: 'En attente' },
  { value: 'under_review', label: 'En cours' },
  { value: 'info_requested', label: 'Infos demandées' },
  { value: 'approved', label: 'Approuvé' },
  { value: 'refused', label: 'Refusé' },
  { value: 'suspended', label: 'Suspendu' },
];

export const statusConfig = {
  pending_review: { label: 'En attente', class: 'adma-badge--warning', icon: 'bi-hourglass-split' },
  under_review: { label: 'En cours', class: 'adma-badge--info', icon: 'bi-search' },
  info_requested: { label: 'Infos demandées', class: 'adma-badge--accent', icon: 'bi-question-circle' },
  approved: { label: 'Approuvé', class: 'adma-badge--success', icon: 'bi-check-circle' },
  refused: { label: 'Refusé', class: 'adma-badge--danger', icon: 'bi-x-circle' },
  suspended: { label: 'Suspendu', class: 'adma-badge--danger-light', icon: 'bi-pause-circle' },
};

export const subscriptionOptions = [
  { value: 'premium', label: 'Premium' },
  { value: 'standard', label: 'Standard' },
];

export const refusalReasons = [
  { id: 1, label: 'Documents incomplets', icon: 'bi-file-earmark-x' },
  { id: 2, label: 'Documents expirés', icon: 'bi-clock-fill' },
  { id: 3, label: 'Informations incorrectes', icon: 'bi-exclamation-triangle' },
  { id: 4, label: 'Licence de transport invalide', icon: 'bi-file-earmark-excel' },
  { id: 5, label: 'Entreprise inexistante au RCCM', icon: 'bi-building-slash' },
  { id: 6, label: 'Informations insuffisantes', icon: 'bi-question-circle' },
  { id: 7, label: 'Non-conformité aux conditions générales', icon: 'bi-file-earmark-text' },
  { id: 8, label: 'Autre motif', icon: 'bi-three-dots' },
];

export const requests = [
  {
    id: 'REQ-001', companyName: 'Intercity Express', manager: 'Alain Tchinda', email: 'alain@intercity.cm', phone: '+237 670 101 010',
    city: 'Yaoundé', country: 'Cameroun', subscription: 'premium', status: 'pending_review',
    createdAt: '2026-07-25', updatedAt: '2026-07-25',
    rccm: 'RC/YAO/2026/011', taxpayerId: 'P11111111111', licenseNumber: 'LT-2026-011',
    address: '123 Rue Principale', description: 'Transport interurbain de luxe',
    documents: [
      { id: 1, name: 'RCCM', ref: 'RC/YAO/2026/011', type: 'pdf', status: 'pending', date: '25 jul 2026', size: '1.1 MB' },
      { id: 2, name: 'Carte de Contribuable', ref: 'P11111111111', type: 'pdf', status: 'pending', date: '25 jul 2026', size: '0.7 MB' },
      { id: 3, name: 'Licence de Transport', ref: 'LT-2026-011', type: 'pdf', status: 'pending', date: '25 jul 2026', size: '1.3 MB' },
    ],
    comments: [],
  },
  {
    id: 'REQ-002', companyName: 'Star Bus SA', manager: 'Éric Nga', email: 'eric@starbus.cm', phone: '+237 670 202 020',
    city: 'Douala', country: 'Cameroun', subscription: 'standard', status: 'under_review',
    createdAt: '2026-07-23', updatedAt: '2026-07-28',
    rccm: 'RC/DLA/2026/012', taxpayerId: 'P22222222222', licenseNumber: 'LT-2026-012',
    address: '45 Rue de l\'Océan', description: 'Transport urbain et périurbain',
    documents: [
      { id: 1, name: 'RCCM', ref: 'RC/DLA/2026/012', type: 'pdf', status: 'verified', date: '23 jul 2026', size: '0.9 MB' },
      { id: 2, name: 'Carte de Contribuable', ref: 'P22222222222', type: 'pdf', status: 'verified', date: '23 jul 2026', size: '0.5 MB' },
      { id: 3, name: 'Licence de Transport', ref: 'LT-2026-012', type: 'pdf', status: 'pending', date: '23 jul 2026', size: '1.0 MB' },
      { id: 4, name: 'Attestation Fiscale', ref: 'AF-2026-012', type: 'pdf', status: 'pending', date: '24 jul 2026', size: '0.6 MB' },
      { id: 5, name: 'Pièce d\'Identité', ref: 'CNI-EN-001', type: 'pdf', status: 'verified', date: '23 jul 2026', size: '0.4 MB' },
    ],
    comments: [
      { id: 1, author: 'Kodjo Hoza', role: 'Super Admin', date: '28 jul 2026', time: '14:30', text: 'Vérification en cours. La licence semble expirée, confirmation en attente.', attachment: false },
    ],
  },
  {
    id: 'REQ-003', companyName: 'Comfort Lines', manager: 'Nathalie Mbah', email: 'nathalie@comfortlines.cm', phone: '+237 670 303 030',
    city: 'Bafoussam', country: 'Cameroun', subscription: 'premium', status: 'info_requested',
    createdAt: '2026-07-20', updatedAt: '2026-07-29',
    rccm: 'RC/BFS/2026/013', taxpayerId: 'P33333333333', licenseNumber: 'LT-2026-013',
    address: '12 Avenue de la Liberté', description: 'Voyages confort vers toutes les régions',
    documents: [
      { id: 1, name: 'RCCM', ref: 'RC/BFS/2026/013', type: 'pdf', status: 'verified', date: '20 jul 2026', size: '1.0 MB' },
      { id: 2, name: 'Carte de Contribuable', ref: 'P33333333333', type: 'pdf', status: 'rejected', date: '20 jul 2026', size: '0.6 MB' },
      { id: 3, name: 'Licence de Transport', ref: 'LT-2026-013', type: 'pdf', status: 'verified', date: '20 jul 2026', size: '1.2 MB' },
    ],
    comments: [
      { id: 1, author: 'Admin Super', role: 'Super Admin', date: '29 jul 2026', time: '09:15', text: 'La carte de contribuable est illisible. Veuillez fournir une copie plus claire.', attachment: false },
      { id: 2, author: 'Nathalie Mbah', role: 'Responsable', date: '29 jul 2026', time: '11:30', text: 'Je joins une nouvelle copie plus nette.', attachment: true },
    ],
  },
  {
    id: 'REQ-004', companyName: 'Green Travel', manager: 'Pierre Kemajou', email: 'pierre@greentravel.cm', phone: '+237 670 404 040',
    city: 'Yaoundé', country: 'Cameroun', subscription: 'standard', status: 'approved',
    createdAt: '2026-07-15', updatedAt: '2026-07-27',
    rccm: 'RC/YAO/2026/014', taxpayerId: 'P44444444444', licenseNumber: 'LT-2026-014',
    address: '88 Green Street', description: 'Transport écologique',
    documents: [
      { id: 1, name: 'RCCM', ref: 'RC/YAO/2026/014', type: 'pdf', status: 'verified', date: '15 jul 2026', size: '0.8 MB' },
      { id: 2, name: 'Carte de Contribuable', ref: 'P44444444444', type: 'pdf', status: 'verified', date: '15 jul 2026', size: '0.5 MB' },
      { id: 3, name: 'Licence de Transport', ref: 'LT-2026-014', type: 'pdf', status: 'verified', date: '15 jul 2026', size: '1.1 MB' },
      { id: 4, name: 'Attestation Fiscale', ref: 'AF-2026-014', type: 'pdf', status: 'verified', date: '16 jul 2026', size: '0.7 MB' },
      { id: 5, name: 'Logo', ref: 'greentravel-logo.png', type: 'image', status: 'verified', date: '15 jul 2026', size: '0.2 MB' },
    ],
    comments: [
      { id: 1, author: 'Kodjo Hoza', role: 'Super Admin', date: '27 jul 2026', time: '10:00', text: 'Tous les documents sont conformes. Compagnie approuvée.', attachment: false },
    ],
  },
  {
    id: 'REQ-005', companyName: 'Flash Express', manager: 'Benoît Simo', email: 'benoit@flashexpress.cm', phone: '+237 670 505 050',
    city: 'Douala', country: 'Cameroun', subscription: 'premium', status: 'refused',
    createdAt: '2026-07-10', updatedAt: '2026-07-26',
    rccm: 'RC/DLA/2026/015', taxpayerId: 'P55555555555', licenseNumber: 'LT-2026-015',
    address: '200 Speed Avenue', description: 'Livraison express de voyageurs',
    documents: [
      { id: 1, name: 'RCCM', ref: 'RC/DLA/2026/015', type: 'pdf', status: 'rejected', date: '10 jul 2026', size: '0.5 MB' },
      { id: 2, name: 'Carte de Contribuable', ref: 'P55555555555', type: 'pdf', status: 'rejected', date: '10 jul 2026', size: '0.3 MB' },
    ],
    comments: [
      { id: 1, author: 'Admin Super', role: 'Super Admin', date: '26 jul 2026', time: '16:45', text: 'Documents non conformes. RCCM et carte contribuable invalides.', attachment: false },
    ],
    refusalReason: 'Documents invalides — RCCM et carte contribuable non conformes.',
  },
  {
    id: 'REQ-006', companyName: 'City Movers', manager: 'Christine Eyenga', email: 'christine@citymovers.cm', phone: '+237 670 606 060',
    city: 'Buea', country: 'Cameroun', subscription: 'standard', status: 'pending_review',
    createdAt: '2026-07-28', updatedAt: '2026-07-28',
    rccm: 'RC/BUE/2026/016', taxpayerId: 'P66666666666', licenseNumber: 'LT-2026-016',
    address: '5 Mountain Road', description: 'Transport urbain',
    documents: [
      { id: 1, name: 'RCCM', ref: 'RC/BUE/2026/016', type: 'pdf', status: 'pending', date: '28 jul 2026', size: '0.7 MB' },
    ],
    comments: [],
  },
  {
    id: 'REQ-007', companyName: 'Premium Coach', manager: 'Samuel Fotso', email: 'samuel@premiumcoach.cm', phone: '+237 670 707 070',
    city: 'Yaoundé', country: 'Cameroun', subscription: 'premium', status: 'suspended',
    createdAt: '2026-06-01', updatedAt: '2026-07-30',
    rccm: 'RC/YAO/2026/017', taxpayerId: 'P77777777777', licenseNumber: 'LT-2026-017',
    address: '50 VIP Boulevard', description: 'Transport de luxe et VIP',
    documents: [
      { id: 1, name: 'RCCM', ref: 'RC/YAO/2026/017', type: 'pdf', status: 'verified', date: '01 jun 2026', size: '1.0 MB' },
      { id: 2, name: 'Carte de Contribuable', ref: 'P77777777777', type: 'pdf', status: 'verified', date: '01 jun 2026', size: '0.8 MB' },
      { id: 3, name: 'Licence de Transport', ref: 'LT-2026-017', type: 'pdf', status: 'expired', date: '01 jun 2026', size: '1.4 MB' },
    ],
    comments: [
      { id: 1, author: 'Kodjo Hoza', role: 'Super Admin', date: '30 jul 2026', time: '08:00', text: 'Licence de transport expirée depuis le 15 juin. Suspendu en attendant le renouvellement.', attachment: false },
    ],
  },
  {
    id: 'REQ-008', companyName: 'EcoTrans Cameroon', manager: 'Martine Biya', email: 'martine@ecotrans.cm', phone: '+237 670 808 080',
    city: 'Limbe', country: 'Cameroun', subscription: 'standard', status: 'pending_review',
    createdAt: '2026-07-29', updatedAt: '2026-07-29',
    rccm: 'RC/LIM/2026/018', taxpayerId: 'P88888888888', licenseNumber: 'LT-2026-018',
    address: '15 Beach Road', description: 'Transport écologique côtier',
    documents: [
      { id: 1, name: 'RCCM', ref: 'RC/LIM/2026/018', type: 'pdf', status: 'pending', date: '29 jul 2026', size: '0.9 MB' },
      { id: 2, name: 'Carte de Contribuable', ref: 'P88888888888', type: 'pdf', status: 'pending', date: '29 jul 2026', size: '0.6 MB' },
    ],
    comments: [],
  },
];

export const approvalTimeline = [
  { id: 1, type: 'received', icon: 'bi-inbox', color: 'info', action: 'Demande reçue', detail: 'Intercity Express — Demande d\'inscription soumise', time: '25 jul 2026' },
  { id: 2, type: 'review', icon: 'bi-search', color: 'warning', action: 'Analyse en cours', detail: 'Star Bus SA — Vérification des documents', time: '28 jul 2026' },
  { id: 3, type: 'info_requested', icon: 'bi-question-circle', color: 'accent', action: 'Informations demandées', detail: 'Comfort Lines — Carte contribuable illisible', time: '29 jul 2026' },
  { id: 4, type: 'approved', icon: 'bi-check-circle', color: 'success', action: 'Demande approuvée', detail: 'Green Travel — Compagnie activée sur la plateforme', time: '27 jul 2026' },
  { id: 5, type: 'refused', icon: 'bi-x-circle', color: 'danger', action: 'Demande refusée', detail: 'Flash Express — Documents non conformes', time: '26 jul 2026' },
  { id: 6, type: 'suspended', icon: 'bi-pause-circle', color: 'danger', action: 'Compagnie suspendue', detail: 'Premium Coach — Licence expirée', time: '30 jul 2026' },
  { id: 7, type: 'received', icon: 'bi-inbox', color: 'info', action: 'Demande reçue', detail: 'EcoTrans Cameroon — Demande d\'inscription soumise', time: '29 jul 2026' },
];

export const workflowSteps = [
  { id: 1, label: 'Demande reçue', icon: 'bi-inbox', color: 'info' },
  { id: 2, label: 'Analyse automatique', icon: 'bi-gear-wide-connected', color: 'info' },
  { id: 3, label: 'Contrôle manuel', icon: 'bi-search', color: 'warning' },
  { id: 4, label: 'Décision', icon: 'bi-chat-square-text', color: 'accent' },
  { id: 5, label: 'Validation / Refus', icon: 'bi-check2-circle', color: 'success' },
  { id: 6, label: 'Notification', icon: 'bi-bell', color: 'info' },
  { id: 7, label: 'Activation', icon: 'bi-rocket-takeoff', color: 'success' },
];

export const defaultFilters = {
  search: '', status: 'all', city: 'all', country: 'all', subscription: 'all',
};

export const filterRequests = (list, filters) => {
  return list.filter((r) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!r.companyName.toLowerCase().includes(q) && !r.manager.toLowerCase().includes(q) && !r.email.toLowerCase().includes(q)) return false;
    }
    if (filters.status && filters.status !== 'all' && r.status !== filters.status) return false;
    if (filters.city && filters.city !== 'all' && r.city !== filters.city) return false;
    if (filters.country && filters.country !== 'all' && r.country !== filters.country) return false;
    if (filters.subscription && filters.subscription !== 'all' && r.subscription !== filters.subscription) return false;
    return true;
  });
};

export const sortRequests = (list, sortBy) => {
  const sorted = [...list];
  switch (sortBy) {
    case 'newest': return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'name_asc': return sorted.sort((a, b) => a.companyName.localeCompare(b.companyName));
    case 'name_desc': return sorted.sort((a, b) => b.companyName.localeCompare(a.companyName));
    default: return sorted;
  }
};
