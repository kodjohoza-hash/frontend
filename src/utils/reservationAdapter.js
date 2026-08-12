import { mockBusImages } from '@data/reservationsData';
import { PLACEHOLDERS } from '@utils/images';

const STATUT_MAP = {
  brouillon: 'pending',
  en_attente: 'pending',
  confirmee: 'confirmed',
  payee: 'confirmed',
  partiellement_payee: 'confirmed',
  annulee: 'cancelled',
  expiree: 'cancelled',
  remboursee: 'cancelled',
};

const METHOD_LABELS = {
  mobile_money: 'Mobile Money',
  mtn: 'Mobile Money (MTN)',
  orange: 'Mobile Money (Orange)',
  carte_bancaire: 'Carte bancaire',
  especes: 'Espèces',
};

const isPast = (dateDepart, heureDepart) => {
  if (!dateDepart) return false;
  const d = new Date(`${dateDepart}T${heureDepart || '00:00'}`);
  return !Number.isNaN(d.getTime()) && d < new Date();
};

const pickBusImage = (id) => {
  let hash = 0;
  for (let i = 0; i < String(id || '').length; i += 1) {
    hash = (hash * 31 + String(id).charCodeAt(i)) >>> 0;
  }
  return mockBusImages[hash % mockBusImages.length];
};

const serializeStatus = (r) => {
  const base = STATUT_MAP[r.statut] || 'pending';
  if (base === 'confirmed' && isPast(r.depart?.dateDepart, r.depart?.heureDepart)) return 'completed';
  return base;
};

const serializeTimeline = (r) => {
  const items = [];
  if (r.dateCreation) items.push({ label: 'Réservation créée', date: r.dateCreation, done: true });
  (r.paiements || [])
    .filter((p) => p.statut === 'paye' && p.datePaiement)
    .forEach((p) => items.push({ label: `Paiement effectué (${p.methode || ''})`.trim(), date: p.datePaiement, done: true }));
  if (r.statut === 'payee' && (r.dateConfirmation || r.dateCreation)) {
    items.push({ label: 'Billet généré', date: r.dateConfirmation || r.dateCreation, done: true });
  }
  if (r.statut === 'annulee' || r.statut === 'remboursee') {
    items.push({ label: 'Réservation annulée', date: r.dateAnnulation || r.dateCreation, done: true });
    items.push({ label: 'Remboursement traité', date: r.dateAnnulation || r.dateCreation, done: true });
  }
  const departDate = r.depart?.dateDepart && r.depart?.heureDepart
    ? `${r.depart.dateDepart}T${r.depart.heureDepart}`
    : null;
  if (departDate && new Date(departDate) < new Date()) {
    items.push({ label: 'Voyage terminé', date: departDate, done: true });
  }
  return items;
};

/** Adapte une réservation API (serializeReservation) vers les props des composants Reservation*. */
export const serializeReservation = (r) => {
  if (!r) return null;
  const compagnie = r.depart?.compagnie;
  const paiement = (r.paiements || []).find((p) => p.statut === 'paye') || null;
  return {
    id: r.reference || r.id,
    apiId: r.id,
    companyId: compagnie?.id,
    company: compagnie?.nom || 'Compagnie',
    companyLogo: compagnie?.logo || PLACEHOLDERS.company,
    busImage: pickBusImage(r.id),
    departureCity: r.depart?.trajet?.departureCity || '—',
    arrivalCity: r.depart?.trajet?.arrivalCity || '—',
    departureDate: r.depart?.dateDepart || '',
    departureTime: r.depart?.heureDepart || '',
    arrivalTime: r.depart?.heureArrivee || '',
    seatNumber: r.places?.[0]?.siege ?? '—',
    classType: r.depart?.bus?.classe || 'Standard',
    price: r.montant,
    currency: 'XAF',
    status: serializeStatus(r),
    rawStatus: r.statut,
    passengers: (r.passengers || []).map((p) => ({
      name: p.fullName || [p.firstName, p.lastName].filter(Boolean).join(' ').trim(),
      email: p.email || '',
      phone: p.phone || '',
    })),
    payment: {
      method: paiement ? (METHOD_LABELS[paiement.methode] || paiement.methode) : 'En attente',
      reference: paiement?.reference || null,
      amount: paiement?.montant ?? r.montant,
      paidAt: paiement?.datePaiement || null,
    },
    baggage: { checked: 0, carryOn: 1 },
    hasTicket: r.statut === 'payee',
    createdAt: r.dateCreation,
    timeline: serializeTimeline(r),
    resteAPayer: r.resteAPayer,
    nbPlaces: r.nbPlaces,
  };
};

/** Adapte la réponse GET /bookings/stats (client) vers le format ReservationStats. */
export const serializeBookingStats = (stats) => {
  const by = stats?.byStatus || {};
  return [
    { id: 'pending', label: 'En attente', value: by.en_attente || 0, icon: 'bi-hourglass-split', color: 'warning', delta: '', deltaDir: 'flat' },
    { id: 'confirmed', label: 'Confirmées', value: (by.confirmee || 0) + (by.payee || 0) + (by.partiellement_payee || 0), icon: 'bi-check-circle-fill', color: 'success', delta: '', deltaDir: 'flat' },
    { id: 'cancelled', label: 'Annulées', value: (by.annulee || 0) + (by.expiree || 0) + (by.remboursee || 0), icon: 'bi-x-circle-fill', color: 'danger', delta: '', deltaDir: 'flat' },
    { id: 'total', label: 'Total', value: stats?.total || 0, icon: 'bi-receipt', color: 'primary', delta: '', deltaDir: 'flat' },
  ];
};

/** Compagnies distinctes dérivées des réservations (filtre de la page). */
export const deriveCompanies = (reservations) => {
  const map = new Map();
  reservations.forEach((r) => {
    const c = r.depart?.compagnie;
    if (c) map.set(c.id, { id: c.id, name: c.nom, logo: c.logo, color: c.couleur || '#0B1D51' });
  });
  return Array.from(map.values());
};
