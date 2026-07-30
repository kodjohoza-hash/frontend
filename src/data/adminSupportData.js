/* ══════════════════════════════════════════════════════════════
   SUPPORT CENTER — Bus Tix Connect Super Admin
   Fully mock data, ready for Express.js + WebSocket + Integrations
   ══════════════════════════════════════════════════════════════ */

/* ─── Ticket Types / Categories ─── */
export const supportCategories = [
  { id: 'claim', label: 'Réclamation', icon: 'fa-circle-exclamation', color: '#EF4444' },
  { id: 'question', label: 'Question', icon: 'fa-question-circle', color: '#3B82F6' },
  { id: 'bug', label: 'Bug', icon: 'fa-bug', color: '#F59E0B' },
  { id: 'payment', label: 'Paiement', icon: 'fa-credit-card', color: '#10B981' },
  { id: 'booking', label: 'Réservation', icon: 'fa-ticket', color: '#8B5CF6' },
  { id: 'trip', label: 'Voyage', icon: 'fa-bus', color: '#3B82F6' },
  { id: 'account', label: 'Compte', icon: 'fa-user', color: '#EC4899' },
  { id: 'connection', label: 'Connexion', icon: 'fa-wifi', color: '#14B8A6' },
  { id: 'technical', label: 'Technique', icon: 'fa-gear', color: '#94A3B8' },
  { id: 'suggestion', label: 'Suggestion', icon: 'fa-lightbulb', color: '#FBBF24' },
  { id: 'other', label: 'Autre', icon: 'fa-ellipsis', color: '#6B7280' },
];

/* ─── Priorities ─── */
export const supportPriorities = [
  { id: 'verylow', label: 'Très faible', color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', icon: 'fa-arrow-down', order: 1 },
  { id: 'low', label: 'Faible', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: 'fa-arrow-down', order: 2 },
  { id: 'normal', label: 'Normale', color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: 'fa-minus', order: 3 },
  { id: 'high', label: 'Élevée', color: '#F59E0B', bg: 'rgba(251,191,36,0.12)', icon: 'fa-arrow-up', order: 4 },
  { id: 'critical', label: 'Critique', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: 'fa-exclamation', order: 5 },
];

/* ─── Statuses ─── */
export const supportStatuses = [
  { id: 'open', label: 'Ouvert', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: 'fa-circle', type: 'active' },
  { id: 'in_progress', label: 'En cours', color: '#F59E0B', bg: 'rgba(251,191,36,0.12)', icon: 'fa-spinner', type: 'active' },
  { id: 'pending', label: 'En attente', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', icon: 'fa-hourglass', type: 'active' },
  { id: 'waiting_client', label: 'En attente du client', color: '#EC4899', bg: 'rgba(236,72,153,0.12)', icon: 'fa-user-clock', type: 'active' },
  { id: 'resolved', label: 'Résolu', color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: 'fa-check-circle', type: 'closed' },
  { id: 'closed', label: 'Fermé', color: '#6B7280', bg: 'rgba(107,114,128,0.12)', icon: 'fa-circle-check', type: 'closed' },
  { id: 'archived', label: 'Archivé', color: '#475569', bg: 'rgba(71,85,105,0.12)', icon: 'fa-box-archive', type: 'closed' },
];

/* ─── Agents ─── */
export const supportAgents = [
  { id: 'agent_001', name: 'Admin Guillaume', email: 'guillaume@bustixconnect.com', role: 'Super Admin', avatar: 'AG', ticketsActive: 12, ticketsResolved: 342, satisfaction: 98, online: true },
  { id: 'agent_002', name: 'Admin Douala', email: 'douala@bustixconnect.com', role: 'Super Admin', avatar: 'AD', ticketsActive: 8, ticketsResolved: 215, satisfaction: 95, online: true },
  { id: 'agent_003', name: 'Admin Yaoundé', email: 'yaounde@bustixconnect.com', role: 'Super Admin', avatar: 'AY', ticketsActive: 5, ticketsResolved: 178, satisfaction: 97, online: false },
  { id: 'agent_004', name: 'Support Ligne 1', email: 'support1@bustixconnect.com', role: 'Support Agent', avatar: 'S1', ticketsActive: 15, ticketsResolved: 520, satisfaction: 92, online: true },
  { id: 'agent_005', name: 'Support Ligne 2', email: 'support2@bustixconnect.com', role: 'Support Agent', avatar: 'S2', ticketsActive: 10, ticketsResolved: 410, satisfaction: 94, online: false },
];

/* ─── Users (clients who open tickets) ─── */
export const supportUsers = [
  { id: 'usr_001', name: 'Marie Kamga', email: 'marie.kamga@email.com', company: 'Express Bus Cameroun', role: 'Agent', avatar: 'MK' },
  { id: 'usr_002', name: 'Jean-Paul Biya', email: 'jp.biya@email.com', company: 'Finex Voyages', role: 'Client', avatar: 'JB' },
  { id: 'usr_003', name: 'Esther Nkoulou', email: 'esther.nkoulou@email.com', company: '—', role: 'Client', avatar: 'EN' },
  { id: 'usr_004', name: 'Paul Essomba', email: 'paul.essomba@email.com', company: 'Buca Voyages', role: 'Admin Compagnie', avatar: 'PE' },
  { id: 'usr_005', name: 'Christine Mbarga', email: 'christine.mbarga@email.com', company: '—', role: 'Client', avatar: 'CM' },
  { id: 'usr_006', name: 'David Tagne', email: 'david.tagne@email.com', company: 'Capitaine Voyages', role: 'Agent', avatar: 'DT' },
  { id: 'usr_007', name: 'Fatima Abdou', email: 'fatima.abdou@email.com', company: '—', role: 'Client', avatar: 'FA' },
  { id: 'usr_008', name: 'Serge Mvondo', email: 'serge.mvondo@email.com', company: 'Touristique Express', role: 'Admin Compagnie', avatar: 'SM' },
  { id: 'usr_009', name: 'Alice Ndongo', email: 'alice.ndongo@email.com', company: '—', role: 'Client', avatar: 'AN' },
  { id: 'usr_010', name: 'Hervé Tchinda', email: 'herve.tchinda@email.com', company: 'Express Bus Cameroun', role: 'Agent', avatar: 'HT' },
];

/* ─── Tickets ─── */
export const tickets = [
  {
    id: 'TKT-2026-0001', subject: 'Problème de paiement — réservation non confirmée', description: "Bonjour, j'ai effectué un paiement par carte bancaire pour ma réservation Douala → Yaoundé du 15 juillet mais le statut reste \"en attente\". Mon compte a été débité. Merci de vérifier.",
    category: 'payment', priority: 'critical', status: 'in_progress', user: 'usr_003', company: '—', assignedTo: 'agent_001',
    createdAt: '2026-07-28 09:15', updatedAt: '2026-07-29 14:30', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: ['capture_ecran_paiement.png', 'releve_bancaire.pdf'], tags: ['paiement', 'carte', 'urgence'], source: 'email',
    messages: [
      { id: 'msg_001', ticketId: 'TKT-2026-0001', author: 'usr_003', content: "Bonjour, j'ai effectué un paiement par carte bancaire pour ma réservation Douala → Yaoundé du 15 juillet mais le statut reste \"en attente\". Mon compte a été débité. Merci de vérifier.", createdAt: '2026-07-28 09:15', type: 'public', attachments: ['capture_ecran_paiement.png'] },
      { id: 'msg_002', ticketId: 'TKT-2026-0001', author: 'agent_001', content: 'Bonjour Esther, je comprends votre inquiétude. Je vérifie immédiatement le statut de votre transaction auprès de notre service financier. Je vous tiens informée sous 30 minutes.', createdAt: '2026-07-28 10:00', type: 'public', attachments: [] },
      { id: 'msg_003', ticketId: 'TKT-2026-0001', author: 'agent_001', content: "【Interne】 Vérifier auprès de la banque — transaction #TXN-2026-4582. Le statut côté API est \"completed\" mais le webhook n'a pas été reçu. Contacter le développeur backend.", createdAt: '2026-07-28 10:05', type: 'private', attachments: [] },
      { id: 'msg_004', ticketId: 'TKT-2026-0001', author: 'usr_003', content: 'Merci pour la rapidité de votre réponse. J\'attends votre retour.', createdAt: '2026-07-28 11:00', type: 'public', attachments: [] },
      { id: 'msg_005', ticketId: 'TKT-2026-0001', author: 'agent_001', content: "Bonjour Esther, bonne nouvelle ! Nous avons bien reçu votre paiement. Il s'agissait d'un délai de synchronisation. Votre réservation est maintenant confirmée. Veuillez nous excuser pour ce désagrément. Voici votre confirmation : BK-2026-1950.", createdAt: '2026-07-29 14:30', type: 'public', attachments: ['confirmation_BK-2026-1950.pdf'] },
    ],
    timeline: [
      { id: 'tl_001', action: 'created', label: 'Ticket créé', user: 'Esther Nkoulou', date: '2026-07-28 09:15', icon: 'fa-plus-circle', color: '#3B82F6' },
      { id: 'tl_002', action: 'assigned', label: 'Assigné à Admin Guillaume', user: 'Système', date: '2026-07-28 09:20', icon: 'fa-user-check', color: '#8B5CF6' },
      { id: 'tl_003', action: 'priority_changed', label: 'Priorité changée à Critique', user: 'Admin Guillaume', date: '2026-07-28 09:25', icon: 'fa-arrow-up', color: '#EF4444' },
      { id: 'tl_004', action: 'status_changed', label: 'Statut → En cours', user: 'Admin Guillaume', date: '2026-07-28 10:00', icon: 'fa-spinner', color: '#F59E0B' },
      { id: 'tl_005', action: 'replied', label: 'Réponse publique envoyée', user: 'Admin Guillaume', date: '2026-07-28 10:00', icon: 'fa-reply', color: '#10B981' },
      { id: 'tl_006', action: 'note_added', label: 'Note interne ajoutée', user: 'Admin Guillaume', date: '2026-07-28 10:05', icon: 'fa-sticky-note', color: '#F59E0B' },
      { id: 'tl_007', action: 'replied', label: 'Réponse publique envoyée', user: 'Admin Guillaume', date: '2026-07-29 14:30', icon: 'fa-reply', color: '#10B981' },
    ],
    internalNotes: ['Vérifier le webhook de confirmation — le développeur backend a confirmé le correctif. Transaction bien reçue côté bancaire.'],
  },
  {
    id: 'TKT-2026-0002', subject: 'Demande de remboursement — voyage annulé', description: 'Mon voyage Yaoundé → Douala du 25 juillet a été annulé par la compagnie. Je souhaite obtenir un remboursement complet de mon billet (12 500 FCFA).',
    category: 'claim', priority: 'high', status: 'open', user: 'usr_005', company: 'Finex Voyages', assignedTo: null,
    createdAt: '2026-07-29 08:00', updatedAt: '2026-07-29 08:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['remboursement', 'annulation'], source: 'web',
    messages: [
      { id: 'msg_006', ticketId: 'TKT-2026-0002', author: 'usr_005', content: 'Mon voyage Yaoundé → Douala du 25 juillet a été annulé par la compagnie. Je souhaite obtenir un remboursement complet de mon billet (12 500 FCFA).', createdAt: '2026-07-29 08:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_008', action: 'created', label: 'Ticket créé', user: 'Christine Mbarga', date: '2026-07-29 08:00', icon: 'fa-plus-circle', color: '#3B82F6' },
    ],
    internalNotes: [],
  },
  {
    id: 'TKT-2026-0003', subject: "Bug — Impossible de sélectionner un siège", description: "Depuis la mise à jour de cette semaine, lorsque je clique sur un siège disponible sur la carte, rien ne se passe. Testé sur Chrome et Firefox. Le problème semble généralisé.",
    category: 'bug', priority: 'critical', status: 'in_progress', user: 'usr_002', company: '—', assignedTo: 'agent_004',
    createdAt: '2026-07-27 16:45', updatedAt: '2026-07-29 10:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: ['console_errors.png'], tags: ['bug', 'interface', 'sièges'], source: 'web',
    messages: [
      { id: 'msg_007', ticketId: 'TKT-2026-0003', author: 'usr_002', content: "Depuis la mise à jour de cette semaine, lorsque je clique sur un siège disponible sur la carte, rien ne se passe. Testé sur Chrome et Firefox. Le problème semble généralisé.", createdAt: '2026-07-27 16:45', type: 'public', attachments: ['console_errors.png'] },
      { id: 'msg_008', ticketId: 'TKT-2026-0003', author: 'agent_004', content: 'Merci pour le signalement. Nous avons reproduit le bug et une équipe technique travaille sur un correctif. Je vous tiens au courant.', createdAt: '2026-07-28 09:00', type: 'public', attachments: [] },
      { id: 'msg_009', ticketId: 'TKT-2026-0003', author: 'agent_004', content: "【Interne】 Bug identifié : la fonction handleSeatClick dans SeatMap.jsx n'est plus appelée après le dernier déploiement. Ticket JIRA créé. Correctif prévu dans la version 3.2.2.", createdAt: '2026-07-28 09:05', type: 'private', attachments: [] },
      { id: 'msg_010', ticketId: 'TKT-2026-0003', author: 'usr_002', content: 'Avez-vous une estimation pour le correctif ? J\'ai besoin de réserver pour ce week-end.', createdAt: '2026-07-29 10:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_009', action: 'created', label: 'Ticket créé', user: 'Jean-Paul Biya', date: '2026-07-27 16:45', icon: 'fa-plus-circle', color: '#3B82F6' },
      { id: 'tl_010', action: 'assigned', label: 'Assigné à Support Ligne 1', user: 'Système', date: '2026-07-27 17:00', icon: 'fa-user-check', color: '#8B5CF6' },
      { id: 'tl_011', action: 'status_changed', label: 'Statut → En cours', user: 'Support Ligne 1', date: '2026-07-28 09:00', icon: 'fa-spinner', color: '#F59E0B' },
      { id: 'tl_012', action: 'replied', label: 'Réponse publique envoyée', user: 'Support Ligne 1', date: '2026-07-28 09:00', icon: 'fa-reply', color: '#10B981' },
    ],
    internalNotes: ['Ticket JIRA #JIRA-458 créé. Correctif en cours de review. Déploiement prévu vendredi.'],
  },
  {
    id: 'TKT-2026-0004', subject: "Question sur les horaires de Noël", description: "Bonjour, est-ce que les horaires de bus seront modifiés pendant la période de Noël ? Je prévois un voyage Douala → Yaoundé le 24 décembre.",
    category: 'question', priority: 'low', status: 'resolved', user: 'usr_009', company: '—', assignedTo: 'agent_002',
    createdAt: '2026-07-25 14:00', updatedAt: '2026-07-26 10:30', closedAt: '2026-07-26 10:30', satisfaction: 5, satisfactionComment: 'Réponse très claire et rapide. Merci !',
    attachments: [], tags: ['horaires', 'noël'], source: 'email',
    messages: [
      { id: 'msg_011', ticketId: 'TKT-2026-0004', author: 'usr_009', content: 'Bonjour, est-ce que les horaires de bus seront modifiés pendant la période de Noël ? Je prévois un voyage Douala → Yaoundé le 24 décembre.', createdAt: '2026-07-25 14:00', type: 'public', attachments: [] },
      { id: 'msg_012', ticketId: 'TKT-2026-0004', author: 'agent_002', content: 'Bonjour Alice, merci pour votre question. Les horaires spéciaux pour les fêtes de fin d\'année seront publiés début décembre. Les horaires réguliers seront maintenus avec des départs supplémentaires. Je vous recommande de réserver à l\'avance. N\'hésitez pas si vous avez d\'autres questions !', createdAt: '2026-07-25 15:30', type: 'public', attachments: [] },
      { id: 'msg_013', ticketId: 'TKT-2026-0004', author: 'usr_009', content: 'Merci beaucoup pour cette réponse rapide et complète ! Je vais surveiller les annonces.', createdAt: '2026-07-26 09:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_013', action: 'created', label: 'Ticket créé', user: 'Alice Ndongo', date: '2026-07-25 14:00', icon: 'fa-plus-circle', color: '#3B82F6' },
      { id: 'tl_014', action: 'assigned', label: 'Assigné à Admin Douala', user: 'Système', date: '2026-07-25 14:05', icon: 'fa-user-check', color: '#8B5CF6' },
      { id: 'tl_015', action: 'replied', label: 'Réponse publique envoyée', user: 'Admin Douala', date: '2026-07-25 15:30', icon: 'fa-reply', color: '#10B981' },
      { id: 'tl_016', action: 'status_changed', label: 'Statut → Résolu', user: 'Admin Douala', date: '2026-07-26 10:30', icon: 'fa-check-circle', color: '#10B981' },
    ],
    internalNotes: [],
  },
  {
    id: 'TKT-2026-0005', subject: 'Problème de connexion — compte bloqué', description: "Bonjour, je n'arrive plus à me connecter à mon compte. Après plusieurs tentatives, mon compte a été bloqué. Je peux réinitialiser mon mot de passe mais le lien de réinitialisation ne fonctionne pas.",
    category: 'connection', priority: 'high', status: 'pending', user: 'usr_007', company: '—', assignedTo: 'agent_004',
    createdAt: '2026-07-28 18:30', updatedAt: '2026-07-29 09:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['connexion', 'blocage', 'mot de passe'], source: 'web',
    messages: [
      { id: 'msg_014', ticketId: 'TKT-2026-0005', author: 'usr_007', content: "Bonjour, je n'arrive plus à me connecter à mon compte. Après plusieurs tentatives, mon compte a été bloqué. Je peux réinitialiser mon mot de passe mais le lien de réinitialisation ne fonctionne pas.", createdAt: '2026-07-28 18:30', type: 'public', attachments: [] },
      { id: 'msg_015', ticketId: 'TKT-2026-0005', author: 'agent_004', content: "Bonjour Fatima, je suis désolé pour ce désagrément. Je vais débloquer votre compte manuellement. Pour le lien de réinitialisation, il expire après 30 minutes. Je vous envoie un nouveau lien par email. Pouvez-vous vérifier vos spams également ?", createdAt: '2026-07-29 09:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_017', action: 'created', label: 'Ticket créé', user: 'Fatima Abdou', date: '2026-07-28 18:30', icon: 'fa-plus-circle', color: '#3B82F6' },
      { id: 'tl_018', action: 'assigned', label: 'Assigné à Support Ligne 1', user: 'Système', date: '2026-07-28 18:35', icon: 'fa-user-check', color: '#8B5CF6' },
      { id: 'tl_019', action: 'replied', label: 'Réponse publique envoyée', user: 'Support Ligne 1', date: '2026-07-29 09:00', icon: 'fa-reply', color: '#10B981' },
    ],
    internalNotes: ['Déblocage effectué. Nouveau lien de réinitialisation envoyé. Surveiller si le client confirme.'],
  },
  {
    id: 'TKT-2026-0006', subject: 'Suggestion — application mobile', description: "Bonjour, j'aimerais suggérer la création d'une application mobile pour faciliter la réservation et le suivi des voyages. Une application native serait très utile pour les clients réguliers.",
    category: 'suggestion', priority: 'low', status: 'open', user: 'usr_006', company: 'Capitaine Voyages', assignedTo: null,
    createdAt: '2026-07-29 11:00', updatedAt: '2026-07-29 11:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['suggestion', 'mobile', 'app'], source: 'web',
    messages: [
      { id: 'msg_016', ticketId: 'TKT-2026-0006', author: 'usr_006', content: "Bonjour, j'aimerais suggérer la création d'une application mobile pour faciliter la réservation et le suivi des voyages. Une application native serait très utile pour les clients réguliers.", createdAt: '2026-07-29 11:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_020', action: 'created', label: 'Ticket créé', user: 'David Tagne', date: '2026-07-29 11:00', icon: 'fa-plus-circle', color: '#3B82F6' },
    ],
    internalNotes: ['Transmettre à l\'équipe produit pour étude de faisabilité.'],
  },
  {
    id: 'TKT-2026-0007', subject: 'Modification de réservation — changement de date', description: "J'ai réservé un voyage pour le 5 août mais je dois le décaler au 7 août. Est-ce possible ? Ma réservation est BK-2026-2010.",
    category: 'booking', priority: 'normal', status: 'open', user: 'usr_010', company: 'Express Bus Cameroun', assignedTo: null,
    createdAt: '2026-07-30 07:30', updatedAt: '2026-07-30 07:30', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['modification', 'date'], source: 'email',
    messages: [
      { id: 'msg_017', ticketId: 'TKT-2026-0007', author: 'usr_010', content: "J'ai réservé un voyage pour le 5 août mais je dois le décaler au 7 août. Est-ce possible ? Ma réservation est BK-2026-2010.", createdAt: '2026-07-30 07:30', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_021', action: 'created', label: 'Ticket créé', user: 'Hervé Tchinda', date: '2026-07-30 07:30', icon: 'fa-plus-circle', color: '#3B82F6' },
    ],
    internalNotes: [],
  },
  {
    id: 'TKT-2026-0008', subject: 'Problème technique — API de paiement', description: "L'API de paiement mobile ne répond plus depuis 15h. Les transactions sont en échec. Nous avons plusieurs clients qui ne peuvent pas finaliser leurs réservations. Urgent.",
    category: 'technical', priority: 'critical', status: 'in_progress', user: 'usr_001', company: 'Express Bus Cameroun', assignedTo: 'agent_001',
    createdAt: '2026-07-28 15:10', updatedAt: '2026-07-29 18:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: ['logs_api.txt', 'capture_erreur.png'], tags: ['api', 'paiement', 'panne'], source: 'phone',
    messages: [
      { id: 'msg_018', ticketId: 'TKT-2026-0008', author: 'usr_001', content: "L'API de paiement mobile ne répond plus depuis 15h. Les transactions sont en échec. Nous avons plusieurs clients qui ne peuvent pas finaliser leurs réservations. Urgent.", createdAt: '2026-07-28 15:10', type: 'public', attachments: ['logs_api.txt'] },
      { id: 'msg_019', ticketId: 'TKT-2026-0008', author: 'agent_001', content: 'Nous avons identifié le problème : le prestataire de services de paiement mobile a une panne générale sur la zone CEMAC. Nous suivons l\'évolution avec eux. Je vous tiens informé.', createdAt: '2026-07-28 15:45', type: 'public', attachments: [] },
      { id: 'msg_020', ticketId: 'TKT-2026-0008', author: 'agent_001', content: "【Interne】 Contact établi avec le support technique du prestataire. Incident #INC-2026-089 ouvert chez eux. ETA de résolution : 4-6 heures.", createdAt: '2026-07-28 16:00', type: 'private', attachments: [] },
      { id: 'msg_021', ticketId: 'TKT-2026-0008', author: 'usr_001', content: "Merci pour l'information. Nous allons informer nos clients.", createdAt: '2026-07-28 16:30', type: 'public', attachments: [] },
      { id: 'msg_022', ticketId: 'TKT-2026-0008', author: 'agent_001', content: "Le prestataire a résolu l'incident. L'API de paiement est de nouveau opérationnelle. Veuillez vérifier de votre côté et nous confirmer.", createdAt: '2026-07-29 18:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_022', action: 'created', label: 'Ticket créé', user: 'Marie Kamga', date: '2026-07-28 15:10', icon: 'fa-plus-circle', color: '#3B82F6' },
      { id: 'tl_023', action: 'assigned', label: 'Assigné à Admin Guillaume', user: 'Système', date: '2026-07-28 15:15', icon: 'fa-user-check', color: '#8B5CF6' },
      { id: 'tl_024', action: 'status_changed', label: 'Statut → En cours', user: 'Admin Guillaume', date: '2026-07-28 15:45', icon: 'fa-spinner', color: '#F59E0B' },
      { id: 'tl_025', action: 'replied', label: 'Réponse publique envoyée', user: 'Admin Guillaume', date: '2026-07-28 15:45', icon: 'fa-reply', color: '#10B981' },
      { id: 'tl_026', action: 'note_added', label: 'Note interne ajoutée', user: 'Admin Guillaume', date: '2026-07-28 16:00', icon: 'fa-sticky-note', color: '#F59E0B' },
      { id: 'tl_027', action: 'replied', label: 'Réponse publique envoyée', user: 'Admin Guillaume', date: '2026-07-29 18:00', icon: 'fa-reply', color: '#10B981' },
    ],
    internalNotes: ['Contacter le prestataire de paiement pour un rapport d\'incident. Envisager un fournisseur de secours.'],
  },
  {
    id: 'TKT-2026-0009', subject: "Demande d'information — partenariat", description: "Bonjour, je suis intéressé par un partenariat avec BUS TIX CONNECT pour ma compagnie de transport. Quelles sont les démarches ?",
    category: 'question', priority: 'normal', status: 'open', user: 'usr_008', company: 'Touristique Express', assignedTo: null,
    createdAt: '2026-07-30 06:00', updatedAt: '2026-07-30 06:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['partenariat', 'information'], source: 'email',
    messages: [
      { id: 'msg_023', ticketId: 'TKT-2026-0009', author: 'usr_008', content: "Bonjour, je suis intéressé par un partenariat avec BUS TIX CONNECT pour ma compagnie de transport. Quelles sont les démarches ?", createdAt: '2026-07-30 06:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_028', action: 'created', label: 'Ticket créé', user: 'Serge Mvondo', date: '2026-07-30 06:00', icon: 'fa-plus-circle', color: '#3B82F6' },
    ],
    internalNotes: ['Transmettre la brochure de partenariat et les conditions.'],
  },
  {
    id: 'TKT-2026-0010', subject: 'Réclamation — service client médiocre', description: "Je voyage régulièrement avec votre service et cette fois-ci l'accueil à la gare était déplorable. Le personnel était impoli et désorganisé. Je demande des excuses.",
    category: 'claim', priority: 'high', status: 'open', user: 'usr_004', company: 'Buca Voyages', assignedTo: null,
    createdAt: '2026-07-29 20:00', updatedAt: '2026-07-29 20:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['réclamation', 'service', 'accueil'], source: 'email',
    messages: [
      { id: 'msg_024', ticketId: 'TKT-2026-0010', author: 'usr_004', content: "Je voyage régulièrement avec votre service et cette fois-ci l'accueil à la gare était déplorable. Le personnel était impoli et désorganisé. Je demande des excuses.", createdAt: '2026-07-29 20:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_029', action: 'created', label: 'Ticket créé', user: 'Paul Essomba', date: '2026-07-29 20:00', icon: 'fa-plus-circle', color: '#3B82F6' },
    ],
    internalNotes: ['Contacter le responsable de la gare concernée pour vérification.'],
  },
  {
    id: 'TKT-2026-0011', subject: 'Problème de double réservation', description: "J'ai réservé deux fois le même voyage par erreur. Je souhaite annuler l'une des deux réservations et être remboursé. Réservations : BK-2026-2100 et BK-2026-2101.",
    category: 'booking', priority: 'high', status: 'waiting_client', user: 'usr_005', company: '—', assignedTo: 'agent_002',
    createdAt: '2026-07-27 10:00', updatedAt: '2026-07-28 15:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['double', 'réservation', 'annulation'], source: 'web',
    messages: [
      { id: 'msg_025', ticketId: 'TKT-2026-0011', author: 'usr_005', content: "J'ai réservé deux fois le même voyage par erreur. Je souhaite annuler l'une des deux réservations et être remboursé. Réservations : BK-2026-2100 et BK-2026-2101.", createdAt: '2026-07-27 10:00', type: 'public', attachments: [] },
      { id: 'msg_026', ticketId: 'TKT-2026-0011', author: 'agent_002', content: 'Bonjour Christine, je vois les deux réservations. Je peux annuler la réservation BK-2026-2101 et procéder au remboursement. Pouvez-vous me confirmer que c\'est bien celle que vous souhaitez annuler ?', createdAt: '2026-07-27 11:00', type: 'public', attachments: [] },
      { id: 'msg_027', ticketId: 'TKT-2026-0011', author: 'agent_002', content: '【Interne】 En attente de confirmation du client pour procéder à l\'annulation. Relancer sous 48h.', createdAt: '2026-07-27 11:05', type: 'private', attachments: [] },
      { id: 'msg_028', ticketId: 'TKT-2026-0011', author: 'agent_002', content: 'Bonjour Christine, je reviens vers vous concernant votre demande. Avez-vous pu voir ma précédente réponse ?', createdAt: '2026-07-28 15:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_030', action: 'created', label: 'Ticket créé', user: 'Christine Mbarga', date: '2026-07-27 10:00', icon: 'fa-plus-circle', color: '#3B82F6' },
      { id: 'tl_031', action: 'assigned', label: 'Assigné à Admin Douala', user: 'Système', date: '2026-07-27 10:05', icon: 'fa-user-check', color: '#8B5CF6' },
      { id: 'tl_032', action: 'replied', label: 'Réponse publique envoyée', user: 'Admin Douala', date: '2026-07-27 11:00', icon: 'fa-reply', color: '#10B981' },
      { id: 'tl_033', action: 'status_changed', label: 'Statut → En attente du client', user: 'Admin Douala', date: '2026-07-27 11:00', icon: 'fa-user-clock', color: '#EC4899' },
      { id: 'tl_034', action: 'replied', label: 'Réponse publique envoyée (relance)', user: 'Admin Douala', date: '2026-07-28 15:00', icon: 'fa-reply', color: '#10B981' },
    ],
    internalNotes: ['Client relancée le 28/07. Attendre réponse avant de procéder.'],
  },
  {
    id: 'TKT-2026-0012', subject: 'Problème technique — impression de billet', description: "Je n'arrive pas à imprimer mon billet pour le voyage de demain. Le PDF ne se charge pas. Pouvez-vous me l'envoyer par email ?",
    category: 'technical', priority: 'normal', status: 'in_progress', user: 'usr_009', company: '—', assignedTo: 'agent_005',
    createdAt: '2026-07-29 19:00', updatedAt: '2026-07-30 08:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['impression', 'pdf', 'billet'], source: 'web',
    messages: [
      { id: 'msg_029', ticketId: 'TKT-2026-0012', author: 'usr_009', content: "Je n'arrive pas à imprimer mon billet pour le voyage de demain. Le PDF ne se charge pas. Pouvez-vous me l'envoyer par email ?", createdAt: '2026-07-29 19:00', type: 'public', attachments: [] },
      { id: 'msg_030', ticketId: 'TKT-2026-0012', author: 'agent_005', content: "Bonjour Alice, je vous ai envoyé le PDF de votre billet par email. Vérifiez votre boîte de réception. Pour information, le problème de génération de PDF est en cours de résolution technique.", createdAt: '2026-07-30 08:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_035', action: 'created', label: 'Ticket créé', user: 'Alice Ndongo', date: '2026-07-29 19:00', icon: 'fa-plus-circle', color: '#3B82F6' },
      { id: 'tl_036', action: 'assigned', label: 'Assigné à Support Ligne 2', user: 'Système', date: '2026-07-29 19:05', icon: 'fa-user-check', color: '#8B5CF6' },
      { id: 'tl_037', action: 'replied', label: 'Réponse publique envoyée', user: 'Support Ligne 2', date: '2026-07-30 08:00', icon: 'fa-reply', color: '#10B981' },
    ],
    internalNotes: [],
  },
  {
    id: 'TKT-2026-0013', subject: 'Problème de création de compte compagnie', description: "Bonjour, j'essaie de créer un compte pour ma compagnie de transport mais le formulaire refuse ma pièce d'identité. Le format est pourtant correct (PDF, 2 Mo).",
    category: 'account', priority: 'normal', status: 'open', user: 'usr_008', company: 'Touristique Express', assignedTo: null,
    createdAt: '2026-07-30 05:30', updatedAt: '2026-07-30 05:30', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['compte', 'création', 'pièce d\'identité'], source: 'web',
    messages: [
      { id: 'msg_031', ticketId: 'TKT-2026-0013', author: 'usr_008', content: "Bonjour, j'essaie de créer un compte pour ma compagnie de transport mais le formulaire refuse ma pièce d'identité. Le format est pourtant correct (PDF, 2 Mo).", createdAt: '2026-07-30 05:30', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_038', action: 'created', label: 'Ticket créé', user: 'Serge Mvondo', date: '2026-07-30 05:30', icon: 'fa-plus-circle', color: '#3B82F6' },
    ],
    internalNotes: [],
  },
  {
    id: 'TKT-2026-0014', subject: 'Voyage retardé — information', description: "Le voyage Douala → Yaoundé de 14h a plus de 2 heures de retard. Aucune information n'a été communiquée aux passagers. C'est inacceptable.",
    category: 'trip', priority: 'high', status: 'open', user: 'usr_003', company: '—', assignedTo: null,
    createdAt: '2026-07-29 16:00', updatedAt: '2026-07-29 16:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['retard', 'information', 'voyage'], source: 'web',
    messages: [
      { id: 'msg_032', ticketId: 'TKT-2026-0014', author: 'usr_003', content: 'Le voyage Douala → Yaoundé de 14h a plus de 2 heures de retard. Aucune information na été communiquée aux passagers. C\'est inacceptable.', createdAt: '2026-07-29 16:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_039', action: 'created', label: 'Ticket créé', user: 'Esther Nkoulou', date: '2026-07-29 16:00', icon: 'fa-plus-circle', color: '#3B82F6' },
    ],
    internalNotes: ['Contacter la compagnie concernée pour comprendre les raisons du retard et améliorer la communication.'],
  },
  {
    id: 'TKT-2026-0015', subject: 'Félicitations — Excellent service', description: "Je tiens à féliciter toute l'équipe pour le service exceptionnel reçu lors de mon voyage Yaoundé → Douala. Conducteur professionnel, bus confortable, ponctualité. Bravo !",
    category: 'other', priority: 'verylow', status: 'closed', user: 'usr_006', company: 'Capitaine Voyages', assignedTo: 'agent_005',
    createdAt: '2026-07-20 12:00', updatedAt: '2026-07-21 09:00', closedAt: '2026-07-21 09:00', satisfaction: 5, satisfactionComment: 'Merci pour votre réponse chaleureuse !',
    attachments: [], tags: ['félicitations', 'satisfaction'], source: 'email',
    messages: [
      { id: 'msg_033', ticketId: 'TKT-2026-0015', author: 'usr_006', content: "Je tiens à féliciter toute l'équipe pour le service exceptionnel reçu lors de mon voyage Yaoundé → Douala. Conducteur professionnel, bus confortable, ponctualité. Bravo !", createdAt: '2026-07-20 12:00', type: 'public', attachments: [] },
      { id: 'msg_034', ticketId: 'TKT-2026-0015', author: 'agent_005', content: "Bonjour David, un immense merci pour votre message ! C'est un encouragement énorme pour toute l'équipe. Nous transmettons vos félicitations au conducteur. Au plaisir de vous revoir à bord !", createdAt: '2026-07-21 09:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_040', action: 'created', label: 'Ticket créé', user: 'David Tagne', date: '2026-07-20 12:00', icon: 'fa-plus-circle', color: '#3B82F6' },
      { id: 'tl_041', action: 'assigned', label: 'Assigné à Support Ligne 2', user: 'Système', date: '2026-07-20 12:05', icon: 'fa-user-check', color: '#8B5CF6' },
      { id: 'tl_042', action: 'replied', label: 'Réponse publique envoyée', user: 'Support Ligne 2', date: '2026-07-21 09:00', icon: 'fa-reply', color: '#10B981' },
      { id: 'tl_043', action: 'status_changed', label: 'Statut → Fermé', user: 'Support Ligne 2', date: '2026-07-21 09:00', icon: 'fa-circle-check', color: '#6B7280' },
    ],
    internalNotes: [],
  },
  {
    id: 'TKT-2026-0016', subject: 'Problème de notifications push', description: "Je ne reçois plus les notifications push sur mon téléphone depuis une semaine. J'ai vérifié les paramètres de l'application et les permissions sont activées.",
    category: 'technical', priority: 'normal', status: 'in_progress', user: 'usr_002', company: '—', assignedTo: 'agent_005',
    createdAt: '2026-07-26 14:00', updatedAt: '2026-07-28 11:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['notification', 'push', 'mobile'], source: 'web',
    messages: [
      { id: 'msg_035', ticketId: 'TKT-2026-0016', author: 'usr_002', content: "Je ne reçois plus les notifications push sur mon téléphone depuis une semaine. J'ai vérifié les paramètres de l'application et les permissions sont activées.", createdAt: '2026-07-26 14:00', type: 'public', attachments: [] },
      { id: 'msg_036', ticketId: 'TKT-2026-0016', author: 'agent_005', content: 'Bonjour Jean-Paul, merci pour votre message. Nous avons eu un incident avec notre service de notifications push la semaine dernière. Le correctif a été déployé. Pouvez-vous vérifier si vous recevez maintenant les notifications ?', createdAt: '2026-07-27 10:00', type: 'public', attachments: [] },
      { id: 'msg_037', ticketId: 'TKT-2026-0016', author: 'usr_002', content: "Toujours rien de mon côté. J'ai même réinstallé l'application.", createdAt: '2026-07-28 11:00', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_044', action: 'created', label: 'Ticket créé', user: 'Jean-Paul Biya', date: '2026-07-26 14:00', icon: 'fa-plus-circle', color: '#3B82F6' },
      { id: 'tl_045', action: 'assigned', label: 'Assigné à Support Ligne 2', user: 'Système', date: '2026-07-26 14:05', icon: 'fa-user-check', color: '#8B5CF6' },
      { id: 'tl_046', action: 'replied', label: 'Réponse publique envoyée', user: 'Support Ligne 2', date: '2026-07-27 10:00', icon: 'fa-reply', color: '#10B981' },
      { id: 'tl_047', action: 'replied', label: 'Réponse client reçue', user: 'Jean-Paul Biya', date: '2026-07-28 11:00', icon: 'fa-reply', color: '#3B82F6' },
    ],
    internalNotes: ['Vérifier le token FCM du client. Contacter l\'équipe mobile pour investigation.'],
  },
  {
    id: 'TKT-2026-0017', subject: 'Paiement par Mobile Money', description: "Est-ce que le paiement par Orange Money est disponible sur la plateforme ? Je ne vois pas cette option dans la liste des moyens de paiement.",
    category: 'payment', priority: 'low', status: 'open', user: 'usr_007', company: '—', assignedTo: null,
    createdAt: '2026-07-30 08:15', updatedAt: '2026-07-30 08:15', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: [], tags: ['paiement', 'orange money', 'mobile'], source: 'web',
    messages: [
      { id: 'msg_038', ticketId: 'TKT-2026-0017', author: 'usr_007', content: "Est-ce que le paiement par Orange Money est disponible sur la plateforme ? Je ne vois pas cette option dans la liste des moyens de paiement.", createdAt: '2026-07-30 08:15', type: 'public', attachments: [] },
    ],
    timeline: [
      { id: 'tl_048', action: 'created', label: 'Ticket créé', user: 'Fatima Abdou', date: '2026-07-30 08:15', icon: 'fa-plus-circle', color: '#3B82F6' },
    ],
    internalNotes: [],
  },
  {
    id: 'TKT-2026-0018', subject: 'Bug — Calendrier de réservation', description: "Le calendrier pour choisir la date de voyage n'affiche que l'année 2025. Impossible de réserver pour juillet 2026.",
    category: 'bug', priority: 'high', status: 'open', user: 'usr_009', company: '—', assignedTo: null,
    createdAt: '2026-07-30 09:00', updatedAt: '2026-07-30 09:00', closedAt: null, satisfaction: null, satisfactionComment: null,
    attachments: ['capture_calendrier.png'], tags: ['bug', 'calendrier', 'date'], source: 'web',
    messages: [
      { id: 'msg_039', ticketId: 'TKT-2026-0018', author: 'usr_009', content: "Le calendrier pour choisir la date de voyage n'affiche que l'année 2025. Impossible de réserver pour juillet 2026.", createdAt: '2026-07-30 09:00', type: 'public', attachments: ['capture_calendrier.png'] },
    ],
    timeline: [
      { id: 'tl_049', action: 'created', label: 'Ticket créé', user: 'Alice Ndongo', date: '2026-07-30 09:00', icon: 'fa-plus-circle', color: '#3B82F6' },
    ],
    internalNotes: ['Bug affectant les dates après le passage à 2026. Correction prioritaire.'],
  },
];

/* ─── Knowledge Base ─── */
export const knowledgeArticles = [
  { id: 'kb_001', title: 'Comment réserver un billet de bus ?', category: 'guide', summary: 'Guide pas à pas pour effectuer une réservation sur BUS TIX CONNECT.', content: 'Pour réserver un billet : 1) Connectez-vous à votre compte. 2) Saisissez votre ville de départ et d\'arrivée. 3) Sélectionnez votre date de voyage. 4) Choisissez votre voyage. 5) Sélectionnez votre siège. 6) Payez et confirmez.', tags: ['réservation', 'guide', 'débutant'], views: 1520, helpful: 1420, createdAt: '2026-01-15', updatedAt: '2026-06-10', author: 'Admin Guillaume', favorites: 245 },
  { id: 'kb_002', title: 'Annuler ou modifier une réservation', category: 'faq', summary: 'Comment annuler ou modifier votre réservation et les conditions applicables.', content: 'Les réservations peuvent être annulées jusqu\'à 24h avant le départ. Les modifications sont possibles sous réserve de disponibilité. Des frais peuvent s\'appliquer selon les conditions de la compagnie.', tags: ['annulation', 'modification', 'remboursement'], views: 980, helpful: 890, createdAt: '2026-02-01', updatedAt: '2026-05-20', author: 'Admin Douala', favorites: 180 },
  { id: 'kb_003', title: 'Moyens de paiement acceptés', category: 'faq', summary: 'Liste des moyens de paiement disponibles sur la plateforme.', content: 'Nous acceptons : cartes bancaires (Visa, Mastercard), Mobile Money (MTN, Orange), espèces en agence, et virement bancaire pour les compagnies.', tags: ['paiement', 'moyens', 'carte', 'mobile'], views: 2100, helpful: 1980, createdAt: '2026-01-20', updatedAt: '2026-07-01', author: 'Admin Guillaume', favorites: 310 },
  { id: 'kb_004', title: 'Que faire en cas de retard ?', category: 'faq', summary: 'Procédure à suivre en cas de retard de votre bus.', content: 'En cas de retard, veuillez contacter le service client via le chat en ligne ou par téléphone. Les compagnies s\'engagent à vous informer de tout changement. Une indemnisation peut être demandée selon le règlement.', tags: ['retard', 'incident', 'compensation'], views: 780, helpful: 650, createdAt: '2026-03-10', updatedAt: '2026-04-15', author: 'Admin Yaoundé', favorites: 90 },
  { id: 'kb_005', title: 'Comment créer un compte compagnie ?', category: 'tutorial', summary: 'Guide pour les compagnies de transport souhaitant rejoindre BUS TIX CONNECT.', content: 'Pour créer un compte compagnie : 1) Rendez-vous sur la page d\'inscription. 2) Sélectionnez "Compagnie". 3) Remplissez le formulaire avec vos informations légales. 4) Téléchargez les documents requis. 5) Attendez la validation par notre équipe.', tags: ['compagnie', 'inscription', 'partenariat'], views: 450, helpful: 420, createdAt: '2026-02-15', updatedAt: '2026-06-20', author: 'Admin Guillaume', favorites: 120 },
  { id: 'kb_006', title: 'Problèmes de connexion fréquents', category: 'article', summary: 'Solutions aux problèmes de connexion les plus courants.', content: 'Si vous ne pouvez pas vous connecter : 1) Vérifiez vos identifiants. 2) Utilisez la fonction "Mot de passe oublié". 3) Videz le cache de votre navigateur. 4) Essayez un autre navigateur. 5) Contactez le support si le problème persiste.', tags: ['connexion', 'mot de passe', 'compte'], views: 3200, helpful: 2900, createdAt: '2026-01-10', updatedAt: '2026-06-25', author: 'Support Ligne 1', favorites: 420 },
  { id: 'kb_007', title: 'Politique de remboursement', category: 'article', summary: 'Conditions générales de remboursement des billets.', content: 'Les remboursements sont traités sous 5 à 10 jours ouvrés. Le montant remboursé dépend du délai d\'annulation : 100% avant 48h, 75% entre 24h et 48h, 50% moins de 24h. Aucun remboursement après le départ.', tags: ['remboursement', 'politique', 'conditions'], views: 1650, helpful: 1480, createdAt: '2026-04-01', updatedAt: '2026-07-05', author: 'Admin Guillaume', favorites: 280 },
  { id: 'kb_008', title: 'Comment laisser un avis ?', category: 'guide', summary: 'Guide pour évaluer votre expérience de voyage.', content: 'Après votre voyage, vous recevrez un email vous invitant à noter votre expérience. Vous pouvez également laisser un avis directement depuis votre espace client dans la section "Mes voyages".', tags: ['avis', 'évaluation', 'satisfaction'], views: 620, helpful: 580, createdAt: '2026-05-01', updatedAt: '2026-05-15', author: 'Support Ligne 2', favorites: 75 },
  { id: 'kb_009', title: 'Programme de fidélité', category: 'article', summary: 'Tout savoir sur le programme de fidélité BUS TIX CONNECT.', content: 'Notre programme de fidélité vous permet de cumuler des points à chaque réservation. 1 FCFA dépensé = 1 point. 1000 points = 5 000 FCFA de réduction. Les points sont valables 12 mois.', tags: ['fidélité', 'points', 'réduction'], views: 3400, helpful: 3100, createdAt: '2026-06-01', updatedAt: '2026-07-10', author: 'Admin Guillaume', favorites: 520 },
  { id: 'kb_010', title: 'Sécurité et confidentialité', category: 'article', summary: 'Comment vos données sont protégées sur BUS TIX CONNECT.', content: 'Nous utilisons un cryptage SSL/TLS pour toutes les transactions. Vos données personnelles sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers sans votre consentement. Conforme RGPD.', tags: ['sécurité', 'confidentialité', 'données'], views: 890, helpful: 820, createdAt: '2026-03-01', updatedAt: '2026-06-30', author: 'Admin Yaoundé', favorites: 150 },
];

/* ─── KPI ─── */
export const supportKPI = {
  openTickets: { label: 'Tickets ouverts', value: 10, trend: 15, icon: 'fa-inbox', color: '#3B82F6' },
  closedTickets: { label: 'Tickets fermés', value: 6, trend: 8, icon: 'fa-check-circle', color: '#10B981' },
  pendingTickets: { label: 'En attente', value: 3, trend: -5, icon: 'fa-hourglass', color: '#F59E0B' },
  criticalTickets: { label: 'Tickets critiques', value: 2, trend: -20, icon: 'fa-exclamation-triangle', color: '#EF4444' },
  avgResponseTime: { label: 'Temps moyen de réponse', value: 45, suffix: 'min', trend: -12, icon: 'fa-clock', color: '#8B5CF6' },
  avgResolutionTime: { label: 'Temps moyen de résolution', value: 4, suffix: 'h', trend: -8, icon: 'fa-hourglass-end', color: '#EC4899' },
  satisfactionRate: { label: 'Clients satisfaits', value: 94, suffix: '%', trend: 3, icon: 'fa-star', color: '#FBBF24' },
  todayTickets: { label: 'Tickets aujourd\'hui', value: 7, trend: 40, icon: 'fa-calendar-day', color: '#14B8A6' },
};

/* ─── Satisfaction Data ─── */
export const satisfactionData = [
  { rating: 5, count: 1240, percentage: 62, color: '#10B981' },
  { rating: 4, count: 520, percentage: 26, color: '#3B82F6' },
  { rating: 3, count: 160, percentage: 8, color: '#F59E0B' },
  { rating: 2, count: 60, percentage: 3, color: '#F97316' },
  { rating: 1, count: 20, percentage: 1, color: '#EF4444' },
];

export const satisfactionComments = [
  { id: 'sat_001', ticketId: 'TKT-2026-0004', user: 'Alice Ndongo', rating: 5, comment: 'Réponse très claire et rapide. Merci !', date: '2026-07-26' },
  { id: 'sat_002', ticketId: 'TKT-2026-0015', user: 'David Tagne', rating: 5, comment: 'Merci pour votre réponse chaleureuse !', date: '2026-07-21' },
  { id: 'sat_003', ticketId: 'TKT-0000', user: 'Marie Kamga', rating: 4, comment: 'Problème résolu rapidement.', date: '2026-07-20' },
  { id: 'sat_004', ticketId: 'TKT-0000', user: 'Jean-Paul Biya', rating: 5, comment: 'Excellent support technique !', date: '2026-07-18' },
  { id: 'sat_005', ticketId: 'TKT-0000', user: 'Fatima Abdou', rating: 3, comment: 'Correct mais pourrait être plus rapide.', date: '2026-07-15' },
  { id: 'sat_006', ticketId: 'TKT-0000', user: 'Paul Essomba', rating: 2, comment: 'Problème résolu mais le délai était trop long.', date: '2026-07-10' },
  { id: 'sat_007', ticketId: 'TKT-0000', user: 'Serge Mvondo', rating: 5, comment: 'Service impeccable, merci !', date: '2026-07-08' },
  { id: 'sat_008', ticketId: 'TKT-0000', user: 'Christine Mbarga', rating: 4, comment: 'Bon accompagnement tout au long du processus.', date: '2026-07-05' },
];

/* ─── Charts Data ─── */
export const supportChartData = {
  ticketsOverTime: [
    { month: 'Jan', ouverts: 45, résolus: 38 },
    { month: 'Fév', ouverts: 52, résolus: 48 },
    { month: 'Mar', ouverts: 48, résolus: 52 },
    { month: 'Avr', ouverts: 62, résolus: 55 },
    { month: 'Mai', ouverts: 58, résolus: 60 },
    { month: 'Juin', ouverts: 72, résolus: 65 },
    { month: 'Juil', ouverts: 68, résolus: 58 },
  ],
  ticketsByCategory: [
    { name: 'Paiement', value: 85, color: '#10B981' },
    { name: 'Réclamation', value: 62, color: '#EF4444' },
    { name: 'Bug', value: 48, color: '#F59E0B' },
    { name: 'Question', value: 120, color: '#3B82F6' },
    { name: 'Réservation', value: 55, color: '#8B5CF6' },
    { name: 'Technique', value: 38, color: '#94A3B8' },
    { name: 'Autres', value: 42, color: '#6B7280' },
  ],
  satisfactionTrend: [
    { month: 'Jan', rate: 88 },
    { month: 'Fév', rate: 90 },
    { month: 'Mar', rate: 87 },
    { month: 'Avr', rate: 91 },
    { month: 'Mai', rate: 93 },
    { month: 'Juin', rate: 92 },
    { month: 'Juil', rate: 94 },
  ],
  ticketsByPriority: [
    { name: 'Critique', value: 8, color: '#EF4444' },
    { name: 'Élevée', value: 15, color: '#F59E0B' },
    { name: 'Normale', value: 25, color: '#10B981' },
    { name: 'Faible', value: 12, color: '#3B82F6' },
    { name: 'Très faible', value: 5, color: '#94A3B8' },
  ],
};

/* ─── Default Filters ─── */
export const defaultSupportFilters = {
  search: '', ticketNumber: '', user: '', company: '', category: '', priority: '', status: '', assignedTo: '', dateFrom: '', dateTo: '',
};

/* ─── Filter Helper ─── */
export const filterTickets = (tickets, filters) => {
  return tickets.filter(t => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!t.subject?.toLowerCase().includes(s) && !t.id?.toLowerCase().includes(s) && !t.description?.toLowerCase().includes(s)) return false;
    }
    if (filters.ticketNumber && !t.id?.toLowerCase().includes(filters.ticketNumber.toLowerCase())) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.assignedTo === 'unassigned' && t.assignedTo) return false;
    if (filters.assignedTo === 'assigned' && !t.assignedTo) return false;
    if (filters.assignedTo && filters.assignedTo !== 'unassigned' && filters.assignedTo !== 'assigned' && t.assignedTo !== filters.assignedTo) return false;
    if (filters.dateFrom && t.createdAt < filters.dateFrom) return false;
    if (filters.dateTo && t.createdAt > filters.dateTo) return false;
    if (filters.user) {
      const u = supportUsers.find(u => u.id === t.user);
      if (u && !u.name?.toLowerCase().includes(filters.user.toLowerCase())) return false;
    }
    if (filters.company) {
      if (filters.company === 'none' && t.company !== '—') return false;
      if (filters.company !== 'none' && !t.company?.toLowerCase().includes(filters.company.toLowerCase())) return false;
    }
    return true;
  });
};
