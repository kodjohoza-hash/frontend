/* ══════════════════════════════════════════════════════════════
   AGENCY SUBSCRIPTIONS — Bus Tix Connect Super Admin
   Abonnement mensuel par agence + revenu par compagnie
   Fully mock data, ready for Express.js
   ══════════════════════════════════════════════════════════════ */

export const TODAY = '2026-07-25';

/* ──────────────────────────────────────────────────────────────
   STATUTS D'ABONNEMENT
   ────────────────────────────────────────────────────────────── */
export const subscriptionStatusConfig = {
  paye: { label: 'Payé', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  en_retard: { label: 'En retard', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  impaye: { label: 'Impayé', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  suspendu: { label: 'Suspendu', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

export const reminderTypeConfig = {
  avant_echeance_j7: { label: 'Rappel J-7', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  avant_echeance_j1: { label: 'Rappel J-1', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  retard_paiement: { label: 'Retard de paiement', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  derniere_relance: { label: 'Dernière relance', color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
  suspension: { label: 'Suspension', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

/* ──────────────────────────────────────────────────────────────
   COMPAGNIES
   ────────────────────────────────────────────────────────────── */
export const subscriptionCompanies = [
  { id: 'EB', name: 'Express Bus Cameroun', city: 'Douala', color: '#0B1D51', phone: '+237 677 000 001', email: 'contact@expressbus.cm' },
  { id: 'GE', name: 'Guillaume Express', city: 'Yaoundé', color: '#1E3A5F', phone: '+237 677 000 002', email: 'contact@guillaume-express.cm' },
  { id: 'ST', name: 'Sécurité Transport', city: 'Douala', color: '#166534', phone: '+237 677 000 003', email: 'contact@securite-transport.cm' },
  { id: 'RC', name: 'Royal Coach', city: 'Bafoussam', color: '#7C3AED', phone: '+237 677 000 004', email: 'contact@royal-coach.cm' },
  { id: 'FV', name: 'Finex Voyages', city: 'Douala', color: '#B45309', phone: '+237 677 000 005', email: 'contact@finex-voyages.cm' },
  { id: 'BV', name: 'Buca Voyages', city: 'Yaoundé', color: '#FF6B35', phone: '+237 677 000 006', email: 'contact@buca-voyages.cm' },
  { id: 'TE', name: 'Touristique Express', city: 'Douala', color: '#2E7D32', phone: '+237 677 000 007', email: 'contact@touristique-express.cm' },
  { id: 'GV', name: 'Garantie Voyages', city: 'Yaoundé', color: '#1565C0', phone: '+237 677 000 008', email: 'contact@garantie-voyages.cm' },
  { id: 'VV', name: 'Va-et-Vient', city: 'Douala', color: '#6A1B9A', phone: '+237 677 000 009', email: 'contact@va-et-vient.cm' },
];

/* ──────────────────────────────────────────────────────────────
   AGENCES
   ────────────────────────────────────────────────────────────── */
export const agencies = [
  { id: 'AG-001', companyId: 'EB', name: 'Douala Central', city: 'Douala', address: 'Akwa, Bd de la Liberté', agents: 6, phone: '+237 699 111 001' },
  { id: 'AG-002', companyId: 'EB', name: 'Yaoundé Mvan', city: 'Yaoundé', address: 'Mvan, Route de l\'Ouest', agents: 5, phone: '+237 699 111 002' },
  { id: 'AG-003', companyId: 'EB', name: 'Bafoussam', city: 'Bafoussam', address: 'Marché B', agents: 3, phone: '+237 699 111 003' },
  { id: 'AG-004', companyId: 'EB', name: 'Garoua', city: 'Garoua', address: 'Grand Marché', agents: 2, phone: '+237 699 111 004' },
  { id: 'AG-005', companyId: 'GE', name: 'Yaoundé Centre', city: 'Yaoundé', address: 'Avenue Kennedy', agents: 5, phone: '+237 699 222 001' },
  { id: 'AG-006', companyId: 'GE', name: 'Douala Akwa', city: 'Douala', address: 'Rue Joffre', agents: 4, phone: '+237 699 222 002' },
  { id: 'AG-007', companyId: 'GE', name: 'Bertoua', city: 'Bertoua', address: 'Carrefour du Lycée', agents: 2, phone: '+237 699 222 003' },
  { id: 'AG-008', companyId: 'ST', name: 'Douala Bonabéri', city: 'Douala', address: 'Bonabéri, Entrée ville', agents: 4, phone: '+237 699 333 001' },
  { id: 'AG-009', companyId: 'ST', name: 'Kribi', city: 'Kribi', address: 'Plage, Rd-point', agents: 2, phone: '+237 699 333 002' },
  { id: 'AG-010', companyId: 'RC', name: 'Bafoussam Marché', city: 'Bafoussam', address: 'Marché A', agents: 3, phone: '+237 699 444 001' },
  { id: 'AG-011', companyId: 'FV', name: 'Douala PK 10', city: 'Douala', address: 'PK 10, Gare routière', agents: 4, phone: '+237 699 555 001' },
  { id: 'AG-012', companyId: 'FV', name: 'Ngaoundéré', city: 'Ngaoundéré', address: 'Gare ferroviaire', agents: 2, phone: '+237 699 555 002' },
  { id: 'AG-013', companyId: 'BV', name: 'Yaoundé Obili', city: 'Yaoundé', address: 'Obili, Av. de l\'UCAC', agents: 3, phone: '+237 699 666 001' },
  { id: 'AG-014', companyId: 'TE', name: 'Douala Gare', city: 'Douala', address: 'Gare routière centrale', agents: 3, phone: '+237 699 777 001' },
  { id: 'AG-015', companyId: 'GV', name: 'Yaoundé Ngousso', city: 'Yaoundé', address: 'Ngousso, Carrefour', agents: 2, phone: '+237 699 888 001' },
  { id: 'AG-016', companyId: 'VV', name: 'Douala Centre', city: 'Douala', address: 'Deïdo, Rue du Port', agents: 2, phone: '+237 699 999 001' },
];

/* ──────────────────────────────────────────────────────────────
   ABONNEMENTS — mois courant (Juillet 2026)
   ────────────────────────────────────────────────────────────── */
export const agencySubscriptions = [
  { id: 'SUB-001', agencyId: 'AG-001', month: 7, year: 2026, amount: 75000, status: 'paye', dueDate: '2026-07-05', paidAt: '2026-06-29T10:12:00', method: 'Virement bancaire', reference: 'PAY-SUB-0001', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-002', agencyId: 'AG-002', month: 7, year: 2026, amount: 50000, status: 'paye', dueDate: '2026-07-05', paidAt: '2026-07-01T09:30:00', method: 'Orange Money', reference: 'PAY-SUB-0002', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-003', agencyId: 'AG-003', month: 7, year: 2026, amount: 40000, status: 'paye', dueDate: '2026-07-05', paidAt: '2026-07-02T14:05:00', method: 'Orange Money', reference: 'PAY-SUB-0003', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-004', agencyId: 'AG-004', month: 7, year: 2026, amount: 40000, status: 'en_retard', dueDate: '2026-07-05', paidAt: null, method: null, reference: null, autoDisconnect: true, renewedAt: '2026-07-31' },
  { id: 'SUB-005', agencyId: 'AG-005', month: 7, year: 2026, amount: 75000, status: 'paye', dueDate: '2026-07-08', paidAt: '2026-06-30T16:40:00', method: 'MTN Mobile Money', reference: 'PAY-SUB-0005', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-006', agencyId: 'AG-006', month: 7, year: 2026, amount: 50000, status: 'paye', dueDate: '2026-07-08', paidAt: '2026-07-05T11:20:00', method: 'Virement bancaire', reference: 'PAY-SUB-0006', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-007', agencyId: 'AG-007', month: 7, year: 2026, amount: 40000, status: 'paye', dueDate: '2026-07-08', paidAt: '2026-07-01T08:15:00', method: 'Orange Money', reference: 'PAY-SUB-0007', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-008', agencyId: 'AG-008', month: 7, year: 2026, amount: 50000, status: 'paye', dueDate: '2026-07-10', paidAt: '2026-07-03T10:45:00', method: 'MTN Mobile Money', reference: 'PAY-SUB-0008', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-009', agencyId: 'AG-009', month: 7, year: 2026, amount: 40000, status: 'impaye', dueDate: '2026-07-10', paidAt: null, method: null, reference: null, autoDisconnect: true, renewedAt: '2026-07-31' },
  { id: 'SUB-010', agencyId: 'AG-010', month: 7, year: 2026, amount: 50000, status: 'paye', dueDate: '2026-07-12', paidAt: '2026-06-28T09:00:00', method: 'Carte bancaire', reference: 'PAY-SUB-0010', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-011', agencyId: 'AG-011', month: 7, year: 2026, amount: 50000, status: 'paye', dueDate: '2026-07-12', paidAt: '2026-07-06T13:35:00', method: 'Orange Money', reference: 'PAY-SUB-0011', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-012', agencyId: 'AG-012', month: 7, year: 2026, amount: 40000, status: 'en_retard', dueDate: '2026-07-12', paidAt: null, method: null, reference: null, autoDisconnect: true, renewedAt: '2026-07-31' },
  { id: 'SUB-013', agencyId: 'AG-013', month: 7, year: 2026, amount: 50000, status: 'paye', dueDate: '2026-07-15', paidAt: '2026-07-04T15:10:00', method: 'Virement bancaire', reference: 'PAY-SUB-0013', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-014', agencyId: 'AG-014', month: 7, year: 2026, amount: 50000, status: 'suspendu', dueDate: '2026-07-01', paidAt: null, method: null, reference: null, autoDisconnect: true, renewedAt: '2026-07-31' },
  { id: 'SUB-015', agencyId: 'AG-015', month: 7, year: 2026, amount: 40000, status: 'paye', dueDate: '2026-07-15', paidAt: '2026-07-08T09:55:00', method: 'Orange Money', reference: 'PAY-SUB-0015', autoDisconnect: false, renewedAt: '2026-07-31' },
  { id: 'SUB-016', agencyId: 'AG-016', month: 7, year: 2026, amount: 40000, status: 'paye', dueDate: '2026-07-15', paidAt: '2026-07-07T17:25:00', method: 'MTN Mobile Money', reference: 'PAY-SUB-0016', autoDisconnect: false, renewedAt: '2026-07-31' },
];

/* ──────────────────────────────────────────────────────────────
   PAIEMENTS D'ABONNEMENT — historique
   ────────────────────────────────────────────────────────────── */
export const subscriptionPayments = [
  { id: 'PAY-SUB-0001', companyId: 'EB', agencyId: 'AG-001', amount: 75000, month: 7, year: 2026, period: 'Juillet 2026', method: 'Virement bancaire', reference: 'VIR-2026-0729-001', date: '2026-06-29T10:12:00', status: 'paye' },
  { id: 'PAY-SUB-0002', companyId: 'EB', agencyId: 'AG-002', amount: 50000, month: 7, year: 2026, period: 'Juillet 2026', method: 'Orange Money', reference: 'OM-2026-0701-002', date: '2026-07-01T09:30:00', status: 'paye' },
  { id: 'PAY-SUB-0003', companyId: 'EB', agencyId: 'AG-003', amount: 40000, month: 7, year: 2026, period: 'Juillet 2026', method: 'Orange Money', reference: 'OM-2026-0702-003', date: '2026-07-02T14:05:00', status: 'paye' },
  { id: 'PAY-SUB-0005', companyId: 'GE', agencyId: 'AG-005', amount: 75000, month: 7, year: 2026, period: 'Juillet 2026', method: 'MTN Mobile Money', reference: 'MOM-2026-0630-005', date: '2026-06-30T16:40:00', status: 'paye' },
  { id: 'PAY-SUB-0006', companyId: 'GE', agencyId: 'AG-006', amount: 50000, month: 7, year: 2026, period: 'Juillet 2026', method: 'Virement bancaire', reference: 'VIR-2026-0705-006', date: '2026-07-05T11:20:00', status: 'paye' },
  { id: 'PAY-SUB-0007', companyId: 'GE', agencyId: 'AG-007', amount: 40000, month: 7, year: 2026, period: 'Juillet 2026', method: 'Orange Money', reference: 'OM-2026-0701-007', date: '2026-07-01T08:15:00', status: 'paye' },
  { id: 'PAY-SUB-0008', companyId: 'ST', agencyId: 'AG-008', amount: 50000, month: 7, year: 2026, period: 'Juillet 2026', method: 'MTN Mobile Money', reference: 'MOM-2026-0703-008', date: '2026-07-03T10:45:00', status: 'paye' },
  { id: 'PAY-SUB-0010', companyId: 'RC', agencyId: 'AG-010', amount: 50000, month: 7, year: 2026, period: 'Juillet 2026', method: 'Carte bancaire', reference: 'CB-2026-0628-010', date: '2026-06-28T09:00:00', status: 'paye' },
  { id: 'PAY-SUB-0011', companyId: 'FV', agencyId: 'AG-011', amount: 50000, month: 7, year: 2026, period: 'Juillet 2026', method: 'Orange Money', reference: 'OM-2026-0706-011', date: '2026-07-06T13:35:00', status: 'paye' },
  { id: 'PAY-SUB-0013', companyId: 'BV', agencyId: 'AG-013', amount: 50000, month: 7, year: 2026, period: 'Juillet 2026', method: 'Virement bancaire', reference: 'VIR-2026-0704-013', date: '2026-07-04T15:10:00', status: 'paye' },
  { id: 'PAY-SUB-0015', companyId: 'GV', agencyId: 'AG-015', amount: 40000, month: 7, year: 2026, period: 'Juillet 2026', method: 'Orange Money', reference: 'OM-2026-0708-015', date: '2026-07-08T09:55:00', status: 'paye' },
  { id: 'PAY-SUB-0016', companyId: 'VV', agencyId: 'AG-016', amount: 40000, month: 7, year: 2026, period: 'Juillet 2026', method: 'MTN Mobile Money', reference: 'MOM-2026-0707-016', date: '2026-07-07T17:25:00', status: 'paye' },
  { id: 'PAY-JUN-001', companyId: 'EB', agencyId: 'AG-001', amount: 75000, month: 6, year: 2026, period: 'Juin 2026', method: 'Virement bancaire', reference: 'VIR-2026-0529-001', date: '2026-05-29T10:00:00', status: 'paye' },
  { id: 'PAY-JUN-002', companyId: 'EB', agencyId: 'AG-002', amount: 50000, month: 6, year: 2026, period: 'Juin 2026', method: 'Orange Money', reference: 'OM-2026-0601-002', date: '2026-06-01T09:15:00', status: 'paye' },
  { id: 'PAY-JUN-003', companyId: 'EB', agencyId: 'AG-003', amount: 40000, month: 6, year: 2026, period: 'Juin 2026', method: 'Orange Money', reference: 'OM-2026-0602-003', date: '2026-06-02T13:55:00', status: 'paye' },
  { id: 'PAY-JUN-004', companyId: 'EB', agencyId: 'AG-004', amount: 40000, month: 6, year: 2026, period: 'Juin 2026', method: 'MTN Mobile Money', reference: 'MOM-2026-0603-004', date: '2026-06-03T11:10:00', status: 'paye' },
  { id: 'PAY-JUN-005', companyId: 'GE', agencyId: 'AG-005', amount: 75000, month: 6, year: 2026, period: 'Juin 2026', method: 'MTN Mobile Money', reference: 'MOM-2026-0530-005', date: '2026-05-30T16:30:00', status: 'paye' },
  { id: 'PAY-JUN-006', companyId: 'GE', agencyId: 'AG-006', amount: 50000, month: 6, year: 2026, period: 'Juin 2026', method: 'Virement bancaire', reference: 'VIR-2026-0605-006', date: '2026-06-05T11:25:00', status: 'paye' },
  { id: 'PAY-JUN-007', companyId: 'GE', agencyId: 'AG-007', amount: 40000, month: 6, year: 2026, period: 'Juin 2026', method: 'Orange Money', reference: 'OM-2026-0601-007', date: '2026-06-01T08:20:00', status: 'paye' },
  { id: 'PAY-JUN-008', companyId: 'ST', agencyId: 'AG-008', amount: 50000, month: 6, year: 2026, period: 'Juin 2026', method: 'MTN Mobile Money', reference: 'MOM-2026-0603-008', date: '2026-06-03T10:50:00', status: 'paye' },
  { id: 'PAY-JUN-009', companyId: 'ST', agencyId: 'AG-009', amount: 40000, month: 6, year: 2026, period: 'Juin 2026', method: 'Orange Money', reference: 'OM-2026-0608-009', date: '2026-06-08T12:05:00', status: 'paye' },
  { id: 'PAY-JUN-010', companyId: 'RC', agencyId: 'AG-010', amount: 50000, month: 6, year: 2026, period: 'Juin 2026', method: 'Carte bancaire', reference: 'CB-2026-0528-010', date: '2026-05-28T09:05:00', status: 'paye' },
  { id: 'PAY-JUN-011', companyId: 'FV', agencyId: 'AG-011', amount: 50000, month: 6, year: 2026, period: 'Juin 2026', method: 'Orange Money', reference: 'OM-2026-0606-011', date: '2026-06-06T13:40:00', status: 'paye' },
  { id: 'PAY-JUN-012', companyId: 'FV', agencyId: 'AG-012', amount: 40000, month: 6, year: 2026, period: 'Juin 2026', method: 'MTN Mobile Money', reference: 'MOM-2026-0609-012', date: '2026-06-09T10:30:00', status: 'paye' },
  { id: 'PAY-JUN-013', companyId: 'BV', agencyId: 'AG-013', amount: 50000, month: 6, year: 2026, period: 'Juin 2026', method: 'Virement bancaire', reference: 'VIR-2026-0604-013', date: '2026-06-04T15:15:00', status: 'paye' },
  { id: 'PAY-JUN-014', companyId: 'TE', agencyId: 'AG-014', amount: 50000, month: 6, year: 2026, period: 'Juin 2026', method: 'Orange Money', reference: 'OM-2026-0601-014', date: '2026-06-01T09:40:00', status: 'paye' },
  { id: 'PAY-JUN-015', companyId: 'GV', agencyId: 'AG-015', amount: 40000, month: 6, year: 2026, period: 'Juin 2026', method: 'Orange Money', reference: 'OM-2026-0608-015', date: '2026-06-08T09:50:00', status: 'paye' },
  { id: 'PAY-JUN-016', companyId: 'VV', agencyId: 'AG-016', amount: 40000, month: 6, year: 2026, period: 'Juin 2026', method: 'MTN Mobile Money', reference: 'MOM-2026-0607-016', date: '2026-06-07T17:30:00', status: 'paye' },
  { id: 'PAY-MAY-001', companyId: 'EB', agencyId: 'AG-001', amount: 75000, month: 5, year: 2026, period: 'Mai 2026', method: 'Virement bancaire', reference: 'VIR-2026-0429-001', date: '2026-04-29T10:05:00', status: 'paye' },
  { id: 'PAY-MAY-002', companyId: 'EB', agencyId: 'AG-002', amount: 50000, month: 5, year: 2026, period: 'Mai 2026', method: 'Orange Money', reference: 'OM-2026-0501-002', date: '2026-05-01T09:10:00', status: 'paye' },
  { id: 'PAY-MAY-003', companyId: 'GE', agencyId: 'AG-005', amount: 75000, month: 5, year: 2026, period: 'Mai 2026', method: 'MTN Mobile Money', reference: 'MOM-2026-0430-005', date: '2026-04-30T16:35:00', status: 'paye' },
  { id: 'PAY-MAY-004', companyId: 'TE', agencyId: 'AG-014', amount: 50000, month: 5, year: 2026, period: 'Mai 2026', method: 'Orange Money', reference: 'OM-2026-0501-014', date: '2026-05-01T09:45:00', status: 'paye' },
];

/* ──────────────────────────────────────────────────────────────
   RELANCES / MESSAGES DE RENOUVELLEMENT envoyés aux compagnies
   ────────────────────────────────────────────────────────────── */
export const subscriptionReminders = [
  { id: 'REL-001', companyId: 'EB', agencyId: 'AG-004', type: 'retard_paiement', channel: 'email', sentAt: '2026-07-18T08:00:00', subject: 'Paiement abonnement en retard — Garoua', message: 'Bonjour Express Bus Cameroun, l\'abonnement de l\'agence Garoua (40 000 XAF) est impayé depuis le 05/07/2026. Un paiement automatique sera effectué sous 24h.', status: 'lu' },
  { id: 'REL-002', companyId: 'FV', agencyId: 'AG-012', type: 'retard_paiement', channel: 'email', sentAt: '2026-07-20T08:00:00', subject: 'Paiement abonnement en retard — Ngaoundéré', message: 'Bonjour Finex Voyages, l\'abonnement de l\'agence Ngaoundéré (40 000 XAF) est impayé depuis le 12/07/2026.', status: 'envoye' },
  { id: 'REL-003', companyId: 'ST', agencyId: 'AG-009', type: 'derniere_relance', channel: 'sms', sentAt: '2026-07-27T09:00:00', subject: 'Dernière relance avant suspension — Kribi', message: 'Sécurité Transport, sous 24h votre agence Kribi sera suspendue si le règlement de 40 000 XAF n\'est pas reçu.', status: 'envoye' },
  { id: 'REL-004', companyId: 'TE', agencyId: 'AG-014', type: 'suspension', channel: 'email', sentAt: '2026-07-15T10:30:00', subject: 'Agence Douala Gare suspendue', message: 'Touristique Express, l\'agence Douala Gare a été suspendue. Les 3 agents ont été déconnectés automatiquement.', status: 'lu' },
  { id: 'REL-005', companyId: 'EB', agencyId: 'AG-001', type: 'avant_echeance_j7', channel: 'email', sentAt: '2026-07-24T08:00:00', subject: 'Renouvellement abonnement dans 7 jours — Douala Central', message: 'Express Bus Cameroun, l\'abonnement de Douala Central expire le 31/07/2026. Pensez à renouveler pour 75 000 XAF.', status: 'envoye' },
  { id: 'REL-006', companyId: 'GE', agencyId: 'AG-005', type: 'avant_echeance_j7', channel: 'email', sentAt: '2026-07-24T08:05:00', subject: 'Renouvellement abonnement dans 7 jours — Yaoundé Centre', message: 'Guillaume Express, l\'abonnement de Yaoundé Centre expire le 31/07/2026. Renouvellement : 75 000 XAF.', status: 'lu' },
  { id: 'REL-007', companyId: 'ST', agencyId: 'AG-008', type: 'avant_echeance_j7', channel: 'sms', sentAt: '2026-07-24T08:10:00', subject: 'Renouvellement abonnement dans 7 jours — Bonabéri', message: 'Sécurité Transport, l\'abonnement de Douala Bonabéri expire le 31/07/2026.', status: 'envoye' },
  { id: 'REL-008', companyId: 'BV', agencyId: 'AG-013', type: 'avant_echeance_j7', channel: 'email', sentAt: '2026-07-24T08:15:00', subject: 'Renouvellement abonnement dans 7 jours — Yaoundé Obili', message: 'Buca Voyages, l\'abonnement de Yaoundé Obili expire le 31/07/2026. Renouvellement : 50 000 XAF.', status: 'envoye' },
  { id: 'REL-009', companyId: 'RC', agencyId: 'AG-010', type: 'avant_echeance_j7', channel: 'email', sentAt: '2026-07-24T08:15:00', subject: 'Renouvellement abonnement dans 7 jours — Bafoussam', message: 'Royal Coach, l\'abonnement de Bafoussam Marché expire le 31/07/2026.', status: 'lu' },
];

/* ──────────────────────────────────────────────────────────────
   HELPERS — ready for Express.js swap
   ────────────────────────────────────────────────────────────── */
export const getCompanyById = (id) => subscriptionCompanies.find(c => c.id === id);

export const getAgencyById = (id) => agencies.find(a => a.id === id);

export const getSubscriptionsByCompany = (companyId) =>
  agencySubscriptions.filter(s => getAgencyById(s.agencyId)?.companyId === companyId);

export const getPaymentsByAgency = (agencyId) =>
  subscriptionPayments.filter(p => p.agencyId === agencyId);

export const getPaymentsByCompany = (companyId) =>
  subscriptionPayments.filter(p => p.companyId === companyId);

export const getRemindersByAgency = (agencyId) =>
  subscriptionReminders.filter(r => r.agencyId === agencyId);

export const getRemindersByCompany = (companyId) =>
  subscriptionReminders.filter(r => r.companyId === companyId);

/* Revenu par compagnie (juillet 2026) — ce que rapporte chaque compagnie */
export const getRevenueByCompany = (list = agencySubscriptions) =>
  subscriptionCompanies
    .map(company => {
      const agencyList = agencies.filter(a => a.companyId === company.id);
      const monthSubs = list.filter(s => agencyList.some(a => a.id === s.agencyId));
      const revenue = monthSubs.filter(s => s.status === 'paye').reduce((sum, s) => sum + s.amount, 0);
      const expectedRevenue = monthSubs.reduce((sum, s) => sum + s.amount, 0);
      const pendingRevenue = Math.max(expectedRevenue - revenue, 0);
      const subscribedCount = monthSubs.filter(s => s.status === 'paye').length;
      const overdueCount = monthSubs.filter(s => ['en_retard', 'impaye'].includes(s.status)).length;
      const suspendedCount = monthSubs.filter(s => s.status === 'suspendu').length;
      const rate = expectedRevenue ? Math.round((revenue / expectedRevenue) * 100) : 0;
      return {
        ...company, revenue, expectedRevenue, pendingRevenue, agenciesCount: agencyList.length,
        subscribedCount, overdueCount, suspendedCount, rate,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

export const getSubscriptionSummary = (list = agencySubscriptions) => {
  const paid = list.filter(s => s.status === 'paye');
  const totalRevenue = paid.reduce((sum, s) => sum + s.amount, 0);
  return {
    total: list.length,
    paid: paid.length,
    late: list.filter(s => s.status === 'en_retard').length,
    unpaid: list.filter(s => s.status === 'impaye').length,
    suspended: list.filter(s => s.status === 'suspendu').length,
    expectedRevenue: list.reduce((sum, s) => sum + s.amount, 0),
    totalRevenue,
    collectedRate: list.length ? Math.round((paid.length / list.length) * 100) : 0,
  };
};

export const formatCurrency = (amount) => `${amount.toLocaleString()} XAF`;

export const monthLabel = (month, year) => {
  const names = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${names[month - 1]} ${year}`;
};
