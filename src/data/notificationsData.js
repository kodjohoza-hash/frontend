/**
 * BUS TIX CONNECT — Notifications Configuration
 * Les notifications viennent du backend réel (Module 16) : plus aucun mock ici.
 */

export const filterCategories = [
  { id: 'all', label: 'Toutes', icon: 'bi-inbox' },
  { id: 'unread', label: 'Non lues', icon: 'bi-envelope-fill' },
  { id: 'reservation', label: 'Réservations', icon: 'bi-ticket-perforated' },
  { id: 'booking', label: 'Commandes', icon: 'bi-journal-check' },
  { id: 'payment', label: 'Paiements', icon: 'bi-credit-card' },
  { id: 'ticket', label: 'Billets', icon: 'bi-credit-card-2-front' },
  { id: 'trip', label: 'Voyages', icon: 'bi-bus-front' },
  { id: 'subscription', label: 'Abonnements', icon: 'bi-hourglass-split' },
  { id: 'company', label: 'Compagnies', icon: 'bi-buildings' },
  { id: 'system', label: 'Système', icon: 'bi-gear' },
];

/** Configuration d'affichage par type (alignée sur le TYPE_CONFIG backend). */
export const typeConfig = {
  reservation_created: { color: 'success', icon: 'bi-check-circle-fill', label: 'Réservation créée', category: 'reservation', priority: 'medium', actionPath: '/client/bookings' },
  payment_confirmed: { color: 'success', icon: 'bi-credit-card-fill', label: 'Paiement confirmé', category: 'payment', priority: 'high', actionPath: '/client/bookings' },
  payment_failed: { color: 'danger', icon: 'bi-x-circle-fill', label: 'Paiement échoué', category: 'payment', priority: 'high', actionPath: '/client/bookings' },
  ticket_available: { color: 'info', icon: 'bi-ticket-perforated-fill', label: 'Billet disponible', category: 'ticket', priority: 'high', actionPath: '/client/tickets' },
  trip_reminder: { color: 'warning', icon: 'bi-bell-fill', label: 'Rappel avant voyage', category: 'trip', priority: 'high', actionPath: '/client/bookings' },
  voyage_annule: { color: 'danger', icon: 'bi-x-octagon-fill', label: 'Voyage annulé', category: 'trip', priority: 'high', actionPath: '/client/bookings' },
  voyage_modifie: { color: 'warning', icon: 'bi-clock-fill', label: 'Voyage modifié', category: 'trip', priority: 'medium', actionPath: '/client/bookings' },
  remboursement: { color: 'info', icon: 'bi-arrow-counterclockwise', label: 'Remboursement', category: 'payment', priority: 'medium', actionPath: '/client/bookings' },
  nouvelle_reservation: { color: 'info', icon: 'bi-ticket-perforated', label: 'Nouvelle réservation', category: 'booking', priority: 'medium', actionPath: '/agency/bookings' },
  nouveau_paiement: { color: 'success', icon: 'bi-cash-stack', label: 'Nouveau paiement', category: 'payment', priority: 'medium', actionPath: '/agency/payments' },
  voyage_proche: { color: 'warning', icon: 'bi-bus-front', label: 'Voyage proche', category: 'trip', priority: 'medium', actionPath: '/agency/trips' },
  abonnement_bientot_expire: { color: 'warning', icon: 'bi-hourglass-split', label: 'Abonnement bientôt expiré', category: 'subscription', priority: 'high', actionPath: '/agency/subscription' },
  abonnement_expire: { color: 'danger', icon: 'bi-x-circle-fill', label: 'Abonnement expiré', category: 'subscription', priority: 'critical', actionPath: '/agency/subscription' },
  paiement_abonnement_confirme: { color: 'success', icon: 'bi-check2-circle', label: "Paiement d'abonnement confirmé", category: 'subscription', priority: 'medium', actionPath: '/agency/subscription' },
  paiement_abonnement_echoue: { color: 'danger', icon: 'bi-exclamation-triangle', label: "Paiement d'abonnement échoué", category: 'subscription', priority: 'high', actionPath: '/agency/subscription' },
  nouveau_voyage: { color: 'info', icon: 'bi-bus-front-fill', label: 'Nouveau voyage', category: 'trip', priority: 'low', actionPath: '/agency/trips' },
  modification_voyage: { color: 'warning', icon: 'bi-clock-fill', label: 'Voyage modifié', category: 'trip', priority: 'medium', actionPath: '/agency/trips' },
  annulation_voyage: { color: 'danger', icon: 'bi-x-octagon-fill', label: 'Voyage annulé', category: 'trip', priority: 'high', actionPath: '/agency/trips' },
  information_compagnie: { color: 'info', icon: 'bi-megaphone', label: 'Information compagnie', category: 'system', priority: 'low', actionPath: '/agency/dashboard' },
  nouvelle_compagnie: { color: 'info', icon: 'bi-buildings', label: 'Nouvelle compagnie', category: 'company', priority: 'medium', actionPath: '/super-admin/companies' },
  nouvel_abonnement: { color: 'accent', icon: 'bi-star', label: 'Nouvel abonnement', category: 'subscription', priority: 'medium', actionPath: '/super-admin/subscriptions' },
  paiement_abonnement: { color: 'success', icon: 'bi-credit-card', label: "Paiement d'abonnement", category: 'subscription', priority: 'medium', actionPath: '/super-admin/subscriptions' },
  abonnement_expirant: { color: 'warning', icon: 'bi-hourglass-split', label: 'Abonnement expirant', category: 'subscription', priority: 'high', actionPath: '/super-admin/subscriptions' },
  abonnement_expire_admin: { color: 'danger', icon: 'bi-x-circle-fill', label: 'Abonnement expiré', category: 'subscription', priority: 'critical', actionPath: '/super-admin/subscriptions' },
  evenement_plateforme: { color: 'muted', icon: 'bi-bell', label: 'Événement plateforme', category: 'system', priority: 'low', actionPath: '/super-admin/dashboard' },
};
