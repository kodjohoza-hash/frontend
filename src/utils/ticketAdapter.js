const STATUT_MAP = {
  valide: 'active',
  utilise: 'used',
  expire: 'expired',
  annule: 'expired',
  rembourse: 'expired',
  impaye: 'active',
  inconnu: 'expired',
};

const priceLabel = (value) => Number(value || 0).toLocaleString('fr-FR');

/** Adapte un billet API (serializeTicket) vers les props des composants Tk*. */
export const serializeTicket = (t) => {
  if (!t) return null;
  const d = t.depart || {};
  return {
    id: t.reference || t.id,
    apiId: t.id,
    bookingRef: t.reservation?.reference || '—',
    from: t.tripFrom || d.villeDepart || '—',
    to: t.tripTo || d.villeArrivee || '—',
    date: t.tripDate || d.dateDepart || '',
    departure: d.heureDepart || '',
    arrival: d.heureArrivee || '',
    company: t.compagnie?.nom || t.depart?.compagnie?.nom || 'Compagnie',
    companyLogo: t.depart?.compagnie?.logo || null,
    busType: d.bus?.typeBus || '—',
    seat: t.siege || '—',
    price: priceLabel(t.prix),
    passenger: t.passengerName || '—',
    status: STATUT_MAP[t.statut] || 'expired',
    rawStatus: t.statut,
    gate: d.quai || '—',
    platform: '—',
    purchasedAt: t.creeLe,
    qrCode: null,
    validiteJusqua: t.validiteJusqua,
  };
};

/** Adapte GET /tickets/stats (résumé client) vers le format TkTicketStats. */
export const serializeTicketStats = (stats) => {
  const s = stats || {};
  return {
    active: s.valides || 0,
    used: s.utilises || 0,
    expired: (s.expires || 0) + (s.annules || 0) + (s.rembourses || 0),
    totalTrips: s.utilises || 0,
  };
};
