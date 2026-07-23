/**
 * BUS TIX CONNECT — Support / Help Center Mock Data
 */

export const categories = [
  { id: 'reservations', label: 'Réservations', icon: 'bi-ticket-perforated', color: 'primary', desc: 'Réserver, modifier ou annuler un voyage' },
  { id: 'payments', label: 'Paiements', icon: 'bi-credit-card', color: 'accent', desc: 'Mobile Money, carte bancaire, remboursements' },
  { id: 'tickets', label: 'Billets', icon: 'bi-postcard', color: 'success', desc: 'Billets électroniques, téléchargement, validation' },
  { id: 'companies', label: 'Compagnies', icon: 'bi-building', color: 'info', desc: 'Informations, horaires, contacts des compagnies' },
  { id: 'travel', label: 'Voyages', icon: 'bi-bus-front', color: 'warning', desc: 'Trajets, gares, bagages, confort' },
  { id: 'account', label: 'Compte', icon: 'bi-person-gear', color: 'primary', desc: 'Profil, préférences, paramètres' },
  { id: 'security', label: 'Sécurité', icon: 'bi-shield-lock', color: 'danger', desc: 'Mot de passe, confidentialité, signalement' },
  { id: 'technical', label: 'Problèmes techniques', icon: 'bi-tools', color: 'muted', desc: 'Bugs, erreurs, performances' },
];

export const faqItems = [
  {
    id: 'faq-1',
    question: 'Comment réserver un voyage ?',
    answer: 'Pour réserver un voyage, sélectionnez votre ville de départ et d\'arrivée sur la page d\'accueil, choisissez la date souhaitée, puis parcourez les voyages disponibles. Sélectionnez un siège, complétez vos informations de passager et procédez au paiement. Vous recevrez votre billet électronique par email et dans votre espace client.',
    category: 'reservations',
  },
  {
    id: 'faq-2',
    question: 'Comment modifier une réservation ?',
    answer: 'Vous pouvez modifier votre réservation depuis votre espace client dans la section "Mes réservations". Les modifications possibles incluent le changement de date, l\'upgrade de siège, et l\'ajout de bagages. Des frais de modification peuvent s\'appliquer selon la compagnie. Les modifications sont possibles jusqu\'à 24h avant le départ.',
    category: 'reservations',
  },
  {
    id: 'faq-3',
    question: 'Comment annuler une réservation ?',
    answer: 'Pour annuler une réservation, accédez à "Mes réservations" et cliquez sur "Annuler" pour la réservation concernée. Le remboursement dépend de la politique d\'annulation de la compagnie : annulation gratuite jusqu\'à 48h avant le départ, 50% de remboursement entre 24h et 48h, et aucun remboursement moins de 24h avant le départ.',
    category: 'reservations',
  },
  {
    id: 'faq-4',
    question: 'Comment télécharger un billet ?',
    answer: 'Rendez-vous dans "Mes billets" depuis votre espace client. Cliquez sur le billet souhaité puis sur "Télécharger" pour obtenir une version PDF. Vous pouvez également imprimer votre billet directement depuis l\'application. Votre billet électronique contient un QR code qui sera vérifié lors de l\'embarquement.',
    category: 'tickets',
  },
  {
    id: 'faq-5',
    question: 'Comment contacter une compagnie ?',
    answer: 'Chaque compagnie dispose d\'une fiche détaillée accessible depuis les résultats de recherche. Vous trouverez leurs coordonnées (téléphone, email, horaires). Vous pouvez également les contacter directement via le centre d\'aide en sélectionnant la catégorie "Compagnies" et en détaillant votre demande.',
    category: 'companies',
  },
  {
    id: 'faq-6',
    question: 'Comment demander un remboursement ?',
    answer: 'Les remboursements sont automatiques pour les annulations de voyage par la compagnie. Pour les annulations personnelles, le remboursement est effectué selon la politique d\'annulation. Vous pouvez suivre l\'état de votre remboursement dans "Mes réservations". Le délai de remboursement est de 5 à 10 jours ouvrés.',
    category: 'payments',
  },
  {
    id: 'faq-7',
    question: 'Comment changer mon mot de passe ?',
    answer: 'Allez dans Paramètres > Sécurité > Modifier le mot de passe. Vous devez d\'abord saisir votre mot de passe actuel, puis votre nouveau mot de passe (minimum 8 caractères) et le confirmer. Un email de confirmation vous sera envoyé. Si vous avez oublié votre mot de passe, utilisez la page "Mot de passe oublié" depuis la page de connexion.',
    category: 'account',
  },
  {
    id: 'faq-8',
    question: 'Comment mettre à jour mon profil ?',
    answer: 'Accédez à "Mon profil" depuis le menu latéral. Vous pouvez modifier vos informations personnelles (nom, prénom, téléphone), vos coordonnées (email, téléphone), votre adresse, et vos préférences (langue, devise, fuseau horaire). N\'oubliez pas de cliquer sur "Enregistrer" pour sauvegarder vos modifications.',
    category: 'account',
  },
];

export const contactMethods = [
  {
    id: 'phone',
    icon: 'bi-telephone-fill',
    label: 'Téléphone',
    value: '+237 691 234 567',
    hours: 'Lun-Sam : 7h - 20h',
    responseTime: 'Réponse immédiate',
    color: 'success',
    available: true,
  },
  {
    id: 'email',
    icon: 'bi-envelope-fill',
    label: 'Email',
    value: 'support@bustixconnect.com',
    hours: '24h/7j',
    responseTime: 'Réponse sous 24h',
    color: 'info',
    available: true,
  },
  {
    id: 'whatsapp',
    icon: 'bi-whatsapp',
    label: 'WhatsApp',
    value: '+237 691 234 567',
    hours: 'Lun-Sam : 8h - 18h',
    responseTime: 'Réponse sous 1h',
    color: 'success',
    available: false,
  },
  {
    id: 'chat',
    icon: 'bi-chat-dots-fill',
    label: 'Chat en direct',
    value: 'Disponible maintenant',
    hours: 'Lun-Ven : 8h - 18h',
    responseTime: 'Réponse sous 5min',
    color: 'accent',
    available: false,
  },
];

export const ticketCategories = [
  { value: '', label: 'Sélectionnez une catégorie...' },
  { value: 'reservation', label: 'Problème de réservation' },
  { value: 'payment', label: 'Problème de paiement' },
  { value: 'ticket', label: 'Problème de billet' },
  { value: 'refund', label: 'Demande de remboursement' },
  { value: 'company', label: 'Réclamation compagnie' },
  { value: 'account', label: 'Problème de compte' },
  { value: 'technical', label: 'Problème technique' },
  { value: 'other', label: 'Autre' },
];

export const priorityOptions = [
  { value: '', label: 'Sélectionnez...' },
  { value: 'low', label: 'Basse — Question générale' },
  { value: 'medium', label: 'Moyenne — Problème modéré' },
  { value: 'high', label: 'Haute — Problème urgent' },
];

export const myTickets = [
  {
    id: 'ASS-2026-001',
    subject: 'Paiement non confirmé pour BK-2026-4521',
    date: '2026-07-20T10:30:00',
    status: 'resolved',
    priority: 'high',
    category: 'payment',
  },
  {
    id: 'ASS-2026-002',
    subject: 'Demande de remboursement BK-2026-4215',
    date: '2026-07-18T14:15:00',
    status: 'in_progress',
    priority: 'medium',
    category: 'refund',
  },
  {
    id: 'ASS-2026-003',
    subject: 'Erreur lors de la connexion',
    date: '2026-07-15T09:00:00',
    status: 'open',
    priority: 'low',
    category: 'technical',
  },
  {
    id: 'ASS-2026-004',
    subject: 'Modification d\'horaire non notifiée',
    date: '2026-07-12T16:45:00',
    status: 'resolved',
    priority: 'medium',
    category: 'reservation',
  },
];

export const resources = [
  { id: 'r1', label: 'Guide de réservation', icon: 'bi-journal-text', desc: 'Apprenez à réserver votre voyage en quelques étapes' },
  { id: 'r2', label: 'Tutoriels vidéo', icon: 'bi-play-circle', desc: 'Guides vidéo pour utiliser la plateforme' },
  { id: 'r3', label: 'Conditions d\'utilisation', icon: 'bi-file-earmark-text', desc: 'Nos conditions générales d\'utilisation' },
  { id: 'r4', label: 'Politique de confidentialité', icon: 'bi-shield-check', desc: 'Comment nous protégeons vos données' },
  { id: 'r5', label: 'FAQ complète', icon: 'bi-question-circle', desc: 'Toutes les réponses à vos questions' },
];
