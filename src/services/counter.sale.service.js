import counterService from './counter.service';
import tripService from './trip.service';
import bookingService from './booking.service';
import { mapCounterClient } from './counter.client.service';

/**
 * BUS TIX CONNECT — Counter Sale Service (API réelle)
 * Orchestration de la vente au guichet :
 *   1. GET  /guichets/mine          → contexte de l'agent (agence + guichet)
 *   2. GET  /trips/available        → voyages réservables (filtrés sur l'agence)
 *   3. GET  /bookings/availability  → plan de sièges d'un voyage
 *   4. GET  /guichets/clients/search (+ POST /guichets/clients) → clientId
 *   5. POST /bookings               → réservation guichet (clientId requis)
 *   6. POST /bookings/:id/payments  → paiement (montant calculé côté serveur)
 *   7. GET  /tickets?reservationId= → billet réel émis
 */

/** Traduction des modes de paiement UI → valeurs API (enum `paiement.methode`). */
export const PAYMENT_METHOD_MAP = {
  orange: 'orange_money',
  mtn: 'mtn_money',
  card: 'carte_bancaire',
  cash: 'especes',
  transfer: 'virement_bancaire',
};

const toHhMm = (t) => String(t || '').slice(0, 5);

/** Calcule la durée « Xh Ymin » à partir des heures (gère le passage minuit). */
const computeDuration = (departure, arrival, arrivalDate, date) => {
  const dep = toHhMm(departure);
  const arr = toHhMm(arrival);
  if (!dep || !arr) return '—';
  const [dh, dm] = dep.split(':').map(Number);
  const [ah, am] = arr.split(':').map(Number);
  let minutes = ah * 60 + am - (dh * 60 + dm);
  const overnight = arrivalDate && date && String(arrivalDate).slice(0, 10) > String(date).slice(0, 10);
  if (overnight || minutes <= 0) minutes += 24 * 60;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}min` : `${m}min`;
};

/** Met en forme un voyage (sortie de tripService.searchPublic / mapTrip) → carte du wizard. */
export const mapCounterTrip = (t = {}) => ({
  id: t.id,
  company: t.company || '',
  companyColor: t.companyColor || null,
  bus: t.bus?.name || t.bus?.internalNumber || t.bus?.plate || t.bus?.model || '—',
  busClass: t.bus?.classe || 'standard',
  from: t.from || '',
  to: t.to || '',
  date: t.date || '',
  departure: toHhMm(t.departure),
  arrival: toHhMm(t.arrival),
  duration: computeDuration(t.departure, t.arrival, t.arrivalDate, t.date),
  basePrice: Number(t.price) || 0,
  seats: {
    total: Number(t.totalSeats) || 0,
    available: Number(t.availableSeats) || 0,
  },
  status: t.status || 'disponible',
  agencyId: t.agencyId || null,
});

/** Construit le plan de sièges du wizard à partir de GET /bookings/availability.
 *  Rendu 2D : rangées left/right ; chaque siège porte `id` = numéro (utilisé
 *  pour la sélection ET pour le payload POST /bookings → `siege`). */
export const buildSeatMap = (availability, layout = { leftCols: 2, rightCols: 3 }) => {
  const flat = availability?.seats || [];
  const cols = layout.leftCols + layout.rightCols;
  const rows = Math.max(1, Math.ceil(flat.length / cols) || 1);
  const map = [];
  for (let r = 0; r < rows; r += 1) {
    const rowSeats = [];
    for (let c = 0; c < cols; c += 1) {
      const idx = r * cols + c;
      const seat = flat[idx];
      if (!seat) continue;
      const number = String(seat.number);
      rowSeats.push({
        id: number,
        number,
        row: r + 1,
        col: c + 1,
        side: c < layout.leftCols ? 'left' : 'right',
        isReserved: seat.state !== 'libre',
        isVip: !!seat.vip,
      });
    }
    if (rowSeats.length) map.push(rowSeats);
  }
  return map;
};

/** Contexte de l'agent de guichet : agence (pour le périmètre) + guichet. */
export const getAgentContext = async () => {
  try {
    const data = await counterService.getMine();
    const guichet = data.guichet || null;
    const agent = data.agent || {};
    return {
      agenceId: guichet?.agenceId || agent.agenceId || null,
      guichetId: guichet?.id || agent.guichetId || null,
    };
  } catch {
    return { agenceId: null, guichetId: null };
  }
};

/** Recherche publique des voyages, restreinte à l'agence de l'agent. */
export const searchAgentTrips = async ({ from, to, date, agenceId, limit = 50 }) => {
  const params = { limit };
  if (from) params.from = from;
  if (to) params.to = to;
  if (date) params.date = date;
  const data = await tripService.searchPublic(params);
  let items = (data.items || []).map(mapCounterTrip);
  if (agenceId) items = items.filter((t) => t.agencyId === agenceId);
  return { items, total: items.length };
};

/** Crée la réservation au guichet (clientId obligatoire, sièges = numéros). */
export const createCounterBooking = async (payload) => {
  const data = await bookingService.createBooking(payload);
  return data;
};

/** Paye la réservation : le montant est calculé côté serveur (reste à payer). */
export const payCounterBooking = async (bookingId, methode, note = null) => {
  const data = await bookingService.payBooking(bookingId, {
    methode,
    note: note || 'Paiement au guichet',
  });
  return data;
};

/** Récupère le premier billet émis pour une réservation. */
export const getTicketsForReservation = async (reservationId) => {
  const data = await bookingService.listTickets({ reservationId });
  return (data.items || [])[0] || null;
};

/** Télécharge le PDF d'un billet (Blob). */
export const downloadTicketPdf = async (ticketId) => {
  const blob = await bookingService.getTicketPdf(ticketId);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `billet-${ticketId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export { mapCounterClient };
