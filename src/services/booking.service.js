import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Booking Service (API réelle)
 * Endpoints backend (module bookings) :
 *   GET    /bookings/availability?departId=   (plan de sièges public)
 *   POST   /bookings                          (création, auth client requise)
 *   GET    /bookings/:id                      (détail, auth requise)
 *   POST   /bookings/:id/payments             (paiement, auth requise)
 * Module tickets (pour la confirmation) :
 *   GET    /tickets?reservationId=            (billets émis pour une réservation)
 *   GET    /tickets/:id/qrcode                (QR code PNG)
 */

const bookingService = {
  /** GET /bookings/availability?departId= — plan de sièges d'un voyage. */
  getAvailability: async (departId) => {
    const data = await apiClient.get('/bookings/availability', { params: { departId } });
    return data;
  },

  /** POST /bookings — crée la réservation (client authentifié requis). */
  createBooking: async (payload) => {
    const data = await apiClient.post('/bookings', payload);
    return data;
  },

  /** POST /bookings/:id/payments — enregistre un paiement.
   *  Le montant est optionnel : s'il est omis, le serveur calcule le reste à payer. */
  payBooking: async (id, payload) => {
    const data = await apiClient.post(`/bookings/${id}/payments`, payload);
    return data;
  },

  /** GET /bookings/:id — détail complet d'une réservation. */
  getBooking: async (id) => {
    const data = await apiClient.get(`/bookings/${id}`);
    return data;
  },

  /** GET /tickets — billets émis (filtré par reservationId). */
  listTickets: async (params = {}) => {
    const data = await apiClient.get('/tickets', { params });
    return data;
  },

  /** GET /tickets/:id/qrcode — QR code PNG (Blob). */
  getTicketQr: async (id) => {
    const blob = await apiClient.get(`/tickets/${id}/qrcode`, { responseType: 'blob' });
    return blob;
  },

  /** GET /bookings — liste paginée (scope par rôle, client = ses réservations). */
  listBookings: async (params = {}) => {
    const data = await apiClient.get('/bookings', { params });
    return data;
  },

  /** GET /bookings/stats — KPIs du portail client. */
  getBookingStats: async () => {
    const data = await apiClient.get('/bookings/stats');
    return data;
  },

  /** PATCH /bookings/:id/cancel — annulation (libère les sièges). */
  cancelBooking: async (id, payload = {}) => {
    const data = await apiClient.patch(`/bookings/${id}/cancel`, payload);
    return data;
  },

  /** GET /tickets — billets émis pour le client connecté (liste paginée). */
  listMyTickets: async (params = {}) => {
    const data = await apiClient.get('/tickets', { params });
    return data;
  },

  /** GET /tickets/stats — KPIs des billets du client connecté. */
  getMyTicketStats: async () => {
    const data = await apiClient.get('/tickets/stats');
    return data;
  },

  /** GET /tickets/:id/pdf — billet PDF (Blob). */
  getTicketPdf: async (id) => {
    const blob = await apiClient.get(`/tickets/${id}/pdf`, { responseType: 'blob' });
    return blob;
  },
};

export default bookingService;
