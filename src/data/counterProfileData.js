export const agentProfile = {
  id: 'AGT-001',
  photo: null,
  firstName: 'Marie',
  lastName: 'Ngo',
  fullName: 'Marie Ngo',
  role: 'Agent de Guichet',
  employeeId: 'MAT-2024-0042',
  company: 'Express Bus Cameroun',
  branch: 'Douala Central',
  city: 'Douala',
  country: 'Cameroun',
  hireDate: '2024-06-15',
  verified: true,
  status: 'actif',
  dateOfBirth: '1992-04-15',
  gender: 'Féminin',
  phone: '+237691234567',
  email: 'marie.ngo@bustixconnect.cm',
  address: "123 Rue de l'Indépendance, Bonanjo",
  language: 'Français, Anglais',
  supervisor: 'Jean-Jacques Mvondo (Responsable de point de vente)',
  schedule: 'Lun-Ven 07:00-15:00 | Sam 08:00-12:00',
  satisfactionRate: 94,
  totalTicketsSoldToday: 12,
  totalTicketsSoldMonth: 184,
  totalBookingsCreated: 312,
  totalClientsServed: 567,
  totalPaymentsCollected: '2,450,000',
  monthlyData: [
    { month: 'Janvier', ticketsSold: 72, bookingsCreated: 68, revenue: 612000, target: 600000, targetAchieved: 102 },
    { month: 'Février', ticketsSold: 78, bookingsCreated: 74, revenue: 663000, target: 650000, targetAchieved: 102 },
    { month: 'Mars', ticketsSold: 85, bookingsCreated: 81, revenue: 722500, target: 700000, targetAchieved: 103.2 },
    { month: 'Avril', ticketsSold: 91, bookingsCreated: 87, revenue: 773500, target: 750000, targetAchieved: 103.1 },
    { month: 'Mai', ticketsSold: 98, bookingsCreated: 94, revenue: 833000, target: 800000, targetAchieved: 104.1 },
    { month: 'Juin', ticketsSold: 106, bookingsCreated: 102, revenue: 901000, target: 850000, targetAchieved: 106 },
    { month: 'Juillet', ticketsSold: 115, bookingsCreated: 110, revenue: 977500, target: 920000, targetAchieved: 106.3 },
    { month: 'Août', ticketsSold: 124, bookingsCreated: 119, revenue: 1054000, target: 980000, targetAchieved: 107.6 },
    { month: 'Septembre', ticketsSold: 132, bookingsCreated: 127, revenue: 1122000, target: 1050000, targetAchieved: 106.9 },
    { month: 'Octobre', ticketsSold: 141, bookingsCreated: 136, revenue: 1198500, target: 1120000, targetAchieved: 107 },
    { month: 'Novembre', ticketsSold: 152, bookingsCreated: 147, revenue: 1292000, target: 1200000, targetAchieved: 107.7 },
    { month: 'Décembre', ticketsSold: 165, bookingsCreated: 158, revenue: 1402500, target: 1280000, targetAchieved: 109.6 },
  ],
  recentActivity: [
    { id: 1, type: 'login', title: 'Connexion matinale', description: 'Connexion au poste de travail — Guichet #3', date: '2026-07-29T06:55:00' },
    { id: 2, type: 'sale', title: 'Vente de billet', description: 'Douala → Yaoundé — 8 500 FCFA — Siège 12', date: '2026-07-29T07:30:00' },
    { id: 3, type: 'booking', title: 'Réservation client', description: 'Réservation BK-2026-2310 pour Fatima Souleymane', date: '2026-07-29T09:15:00' },
    { id: 4, type: 'payment', title: 'Encaissement', description: 'Paiement OM BK-2026-2308 — 12 500 FCFA', date: '2026-07-28T11:45:00' },
    { id: 5, type: 'sale', title: 'Vente de billet', description: 'Douala → Bafoussam — 6 500 FCFA — Siège 8', date: '2026-07-28T10:20:00' },
    { id: 6, type: 'logout', title: 'Fin de service', description: 'Déconnexion — fin de poste 15:00', date: '2026-07-27T15:05:00' },
    { id: 7, type: 'profile_update', title: 'Mise à jour profil', description: 'Modification des informations de contact', date: '2026-07-26T14:30:00' },
    { id: 8, type: 'sale', title: 'Vente de billet', description: 'Douala → Garoua — 12 000 FCFA — Siège 22', date: '2026-07-26T09:40:00' },
    { id: 9, type: 'booking', title: 'Réservation groupe', description: 'Réservation BK-2026-2285 pour 5 passagers', date: '2026-07-25T16:10:00' },
    { id: 10, type: 'payment', title: 'Encaissement espèces', description: 'Paiement comptant BK-2026-2279 — 25 000 FCFA', date: '2026-07-24T13:25:00' },
    { id: 11, type: 'sale', title: 'Vente de billet', description: 'Douala → Limbé — 4 500 FCFA — Siège 5', date: '2026-07-23T11:50:00' },
    { id: 12, type: 'login', title: 'Connexion matinale', description: 'Connexion au poste de travail — Guichet #3', date: '2026-07-23T06:50:00' },
    { id: 13, type: 'booking', title: 'Réservation client', description: 'Réservation BK-2026-2250 pour Paul Atangana', date: '2026-07-22T10:05:00' },
    { id: 14, type: 'sale', title: 'Vente de billet', description: 'Douala → Kribi — 7 000 FCFA — Siège 15', date: '2026-07-21T08:30:00' },
    { id: 15, type: 'payment', title: 'Encaissement Mobile Money', description: 'Paiement MTN BK-2026-2234 — 8 500 FCFA', date: '2026-07-20T15:40:00' },
  ],
  documents: [
    { id: 'doc-001', name: 'Contrat_de_travail_Marie_Ngo.pdf', type: 'pdf', category: 'contrat', url: '/documents/contrats/contrat-marie-ngo.pdf', size: '1.2 Mo', uploadedAt: '2024-06-10' },
    { id: 'doc-002', name: 'CNI_Marie_Ngo_recto.jpg', type: 'image', category: 'identite', url: '/documents/identites/cni-ngo-recto.jpg', size: '340 Ko', uploadedAt: '2024-06-10' },
    { id: 'doc-003', name: 'Photo_profil_Marie_Ngo.jpg', type: 'image', category: 'photo', url: '/documents/photos/marie-ngo.jpg', size: '520 Ko', uploadedAt: '2024-06-12' },
    { id: 'doc-004', name: 'Attestation_formation_2025.pdf', type: 'pdf', category: 'attestation', url: '/documents/attestations/formation-2025.pdf', size: '890 Ko', uploadedAt: '2025-03-20' },
  ],
  loginHistory: [
    { id: 'log-001', date: '2026-07-29', time: '06:55:23', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-002', date: '2026-07-28', time: '06:50:11', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-003', date: '2026-07-26', time: '14:25:44', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-004', date: '2026-07-25', time: '06:48:02', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-005', date: '2026-07-24', time: '06:52:36', ip: '192.168.1.48', browser: 'Firefox 128', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-006', date: '2026-07-23', time: '06:47:19', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-007', date: '2026-07-22', time: '06:55:58', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-008', date: '2026-07-20', time: '17:30:12', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-009', date: '2026-07-19', time: '06:50:07', ip: '192.168.1.50', browser: 'Edge 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-010', date: '2026-07-18', time: '06:53:41', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-011', date: '2026-07-17', time: '06:49:33', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
    { id: 'log-012', date: '2026-07-16', time: '06:46:55', ip: '192.168.1.42', browser: 'Chrome 130', device: 'HP ProBook 450', location: 'Douala, Cameroun' },
  ],
};

export const quickActions = [
  { id: 'edit_profile', label: 'Modifier le profil', icon: 'bi-pencil-square', action: 'edit_profile', color: '#0B1D51', description: 'Mettez à jour vos informations personnelles et professionnelles' },
  { id: 'change_password', label: 'Changer le mot de passe', icon: 'bi-shield-lock', action: 'change_password', color: '#FF6B35', description: 'Modifiez votre mot de passe de connexion' },
  { id: 'view_notifications', label: 'Voir les notifications', icon: 'bi-bell', action: 'view_notifications', color: '#22c55e', description: 'Consultez vos alertes et notifications récentes' },
  { id: 'open_messages', label: 'Messagerie interne', icon: 'bi-chat-dots', action: 'open_messages', color: '#8b5cf6', description: 'Accédez à vos messages avec l\'équipe et la hiérarchie' },
  { id: 'contact_supervisor', label: 'Contacter le superviseur', icon: 'bi-person-up', action: 'contact_supervisor', color: '#06b6d4', description: 'Envoyez un message à Jean-Jacques Mvondo' },
  { id: 'download_documents', label: 'Télécharger les documents', icon: 'bi-download', action: 'download_documents', color: '#f59e0b', description: 'Accédez à vos contrats et justificatifs' },
];

export function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount).replace('XAF', 'FCFA').trim();
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

export function formatTime(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date);
}

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export function formatMonth(monthIndex) {
  return MONTHS_FR[monthIndex] || '';
}
