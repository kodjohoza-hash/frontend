/* =====================================================================
   Tests d'intégration du MODULE 14 — CHECKOUT RÉEL (paiements & billets)
   Exécution : node scripts/test_checkout.js
   Nécessite : serveur démarré sur le port 5001 (modules bookings,
               tickets, trips chargés).
   Couvre : auth obligatoire, montant calculé serveur (payment sans
            montant), le scénario critique 1 siège + 1 passager + 1
            contact d'urgence → 1 réservation / 1 passager / 1 siège /
            1 paiement / 1 billet / 1 QR, agent_id NULL en ligne vs
            renseigné au guichet, anti-double-paiement, refus de
            surpaiement, paiement partiel, remboursement total,
            disponibilité réelle des sièges, nettoyage.
   ===================================================================== */
const BASE = 'http://localhost:5001/api/v1';

/* Accès DB direct pour préparation et nettoyage */
const db = require('../src/models');

const call = async (path, { method = 'GET', body, token } = {}) => {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (_) { /* no body */ }
  return { status: res.status, data };
};

const hasSensitive = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  for (const key of Object.keys(obj)) {
    if (/password|passwd|hash|secret|refreshToken/i.test(key)) return true;
    if (typeof obj[key] === 'object' && hasSensitive(obj[key])) return true;
  }
  return false;
};

const UNIQUE = Date.now().toString(36).toUpperCase();
const BUS_ID = `BS${UNIQUE.slice(-8)}`;
const PRICE = 5500;

/* Dates locales (+N jours, format YYYY-MM-DD) */
const toIso = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const dayPlus = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return toIso(d); };
const D = dayPlus(5);

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  let adminToken = null;
  let clientToken = null;
  let counterToken = null;
  let clientId = null;
  let tripId = null;
  let bookingA = null; // 1 siège + 1 passager + 1 contact d'urgence (critique)
  let bookingB = null; // surpaiement refusé puis paiement partiel
  let bookingC = null; // guichet (agent_id renseigné) + remboursement

  /* Nettoyage FK-safe (si un run précédent a échoué, on repart propre). */
  const cleanup = async (ids) => {
    const list = (ids || []).filter(Boolean);
    if (!list.length) return;
    try {
      await db.Billet.destroy({ where: { reservation_id: list } });
      await db.Paiement.destroy({ where: { reservation_id: list } });
      const pass = await db.Passenger.findAll({ where: { reservation_id: list } });
      const pids = pass.map((p) => p.id);
      if (pids.length) await db.EmergencyContact.destroy({ where: { passenger_id: pids } });
      await db.Passenger.destroy({ where: { reservation_id: list } });
      await db.PlaceReservee.destroy({ where: { reservation_id: list } });
      await db.HistoriqueReservation.destroy({ where: { reservation_id: list } });
      await db.Reservation.destroy({ where: { id: list } });
    } catch (e) { console.warn(`[cleanup] ${e.message}`); }
  };

  /* ── 1. Connexion admin (super_admin) ───────────────────────────── */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login super admin', login.status, 200, login.data?.data?.user?.role || '');
  adminToken = login.data?.data?.token;

  /* ── 2. Bus de test (available, compagnie C001) — préparation DB ── */
  await db.Bus.create({
    id: BUS_ID,
    immatriculation: `TEST-${UNIQUE.slice(-6)}`,
    interne: `TI-${UNIQUE.slice(-6)}`,
    modele: 'Bus Test Checkout',
    marque: 'Test',
    capacite: 45,
    compagnie_id: 'C001',
    statut: 'available',
    type_bus: 'standard',
    classe: 'economy',
  });

  /* ── 3. Voyage réservable (via l'API, comme le ferait l'admin) ──── */
  const created = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: PRICE, companyId: 'C001', agencyId: 'AG00000001' },
  });
  ok('POST /trips (voyage de test)', created.status, 201, created.data?.data?.id || '');
  if (created.status !== 201) console.error('[diag] POST /trips →', created.status, JSON.stringify(created.data));
  ok('Voyage réservable (statut programme)', created.data?.data?.status === 'programme' ? 200 : 500, 200);
  tripId = created.data?.data?.id;

  /* ── 4. Inscription d'un client en ligne (flux public) ──────────── */
  const reg = await call('/auth/register-client', {
    method: 'POST',
    body: {
      prenom: 'Test', nom: 'Checkout',
      telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      email: `checkout.${UNIQUE.toLowerCase()}@test.com`,
      motDePasse: 'Client@123',
      pays: 'Cameroun', ville: 'Douala',
    },
  });
  ok('POST /auth/register-client', reg.status, 201, reg.data?.data?.user?.role || '');
  if (reg.status !== 201) console.error('[diag] POST /auth/register-client →', reg.status, JSON.stringify(reg.data));
  ok('Client sérialisé sans secret', hasSensitive(reg.data?.data?.user) ? 500 : 200, 200);
  clientId = reg.data?.data?.user?.id;
  clientToken = reg.data?.data?.token;

  /* ── 5. Authentification obligatoire ────────────────────────────── */
  const noAuth = await call('/bookings', { method: 'POST', body: { tripId, seats: [{ siege: '1' }] } });
  ok('POST /bookings sans token -> 401', noAuth.status, 401);

  /* ── 6. Validation des requêtes ─────────────────────────────────── */
  const noSeats = await call('/bookings', { method: 'POST', token: clientToken, body: { tripId } });
  ok('POST /bookings sans sièges -> 400', noSeats.status, 400);

  const noTrip = await call('/bookings', { method: 'POST', token: clientToken, body: { seats: [{ siege: '1' }] } });
  ok('POST /bookings sans voyage -> 400', noTrip.status, 400);

  const mismatch = await call('/bookings', {
    method: 'POST', token: clientToken,
    body: { tripId, seats: [{ siege: '1' }], passengers: [{ firstName: 'A' }, { firstName: 'B' }] },
  });
  ok('POST /bookings passagers != sièges -> 400', mismatch.status, 400);

  const dupSeats = await call('/bookings', {
    method: 'POST', token: clientToken,
    body: { tripId, seats: [{ siege: '1' }, { siege: '1' }] },
  });
  ok('POST /bookings sièges en double -> 400', dupSeats.status, 400);

  const seatOut = await call('/bookings', {
    method: 'POST', token: clientToken,
    body: { tripId, seats: [{ siege: '99' }] },
  });
  ok('POST /bookings siège hors capacité (99/45) -> 400', seatOut.status, 400);

  const payNoMethode = await call('/bookings/RES000000000001/payments', {
    method: 'POST', token: clientToken, body: { montant: PRICE },
  });
  ok('POST /bookings/:id/payments sans methode -> 400', payNoMethode.status, 400);

  /* ── 7. SCÉNARIO CRITIQUE : 1 siège + 1 passager + 1 contact d'urgence ── */
  const bA = await call('/bookings', {
    method: 'POST', token: clientToken,
    body: {
      tripId,
      seats: [{ siege: '1' }],
      passengers: [{
        firstName: 'Passager', lastName: 'Principal', gender: 'M',
        birthDate: '1990-05-10', phone: '+237699000001', email: 'pax1@test.com',
        documentType: 'cni', documentNumber: 'CNI-TEST-0001', nationality: 'Camerounaise',
        emergencyContact: {
          fullName: 'Contact Urgence', phone: '+237699000002',
          relationship: 'Soeur', address: 'Douala, Cameroun',
        },
      }],
      modeReservation: 'en_ligne',
    },
  });
  ok('POST /bookings 1 siège + 1 passager + 1 contact (création)', bA.status, 201, bA.data?.data?.id || '');
  if (bA.status !== 201) { console.error('[diag] CRITICAL POST /bookings →', bA.status, JSON.stringify(bA.data)); throw new Error('ARRET: création critique en échec'); }
  bookingA = bA.data?.data?.id;
  ok('ID réservation format RES#############', /^RES[A-Z0-9]{12}$/.test(bookingA || '') ? 200 : 500, 200, bookingA || '');
  ok('Référence RES-YYYYMMDD-XXXXXX', /^RES-\d{8}-[A-Z0-9]{6}$/.test(bA.data?.data?.reference || '') ? 200 : 500, 200, bA.data?.data?.reference || '');
  ok('nbPlaces = 1 (contact d\'urgence jamais compté)', bA.data?.data?.nbPlaces === 1 ? 200 : 500, 200, `nb=${bA.data?.data?.nbPlaces}`);
  ok('1 siège (place) dans la réponse', bA.data?.data?.places?.length === 1 ? 200 : 500, 200, `places=${bA.data?.data?.places?.length}`);
  ok('1 seul passager dans la réponse', bA.data?.data?.passengers?.length === 1 ? 200 : 500, 200, `passagers=${bA.data?.data?.passengers?.length}`);
  ok('Contact d\'urgence rattaché au passager', bA.data?.data?.passengers?.[0]?.emergencyContact?.fullName === 'Contact Urgence' ? 200 : 500, 200);
  ok('Montant serveur = prix du siège (5500 XAF)', bA.data?.data?.montant === PRICE ? 200 : 500, 200, `montant=${bA.data?.data?.montant}`);
  ok('Statut initial en_attente', bA.data?.data?.statut === 'en_attente' ? 200 : 500, 200);
  ok('resteAPayer initial = 5500', bA.data?.data?.resteAPayer === PRICE ? 200 : 500, 200);
  ok('agent_id NULL en ligne', bA.data?.data?.agentId === null ? 200 : 500, 200);
  ok('Réservation sans secret', hasSensitive(bA.data?.data) ? 500 : 200, 200);

  /* Vérification en base : exactement 1 réservation / 1 place / 1 passager / 1 contact */
  const dbResA = await db.Reservation.findByPk(bookingA);
  ok('DB : réservation nb_places = 1', dbResA?.nb_places === 1 ? 200 : 500, 200, `nb=${dbResA?.nb_places}`);
  const dbPlacesA = await db.PlaceReservee.count({ where: { reservation_id: bookingA } });
  ok('DB : 1 place réservée (jamais 2)', dbPlacesA === 1 ? 200 : 500, 200, `places=${dbPlacesA}`);
  const dbPassengersA = await db.Passenger.findAll({ where: { reservation_id: bookingA } });
  ok('DB : 1 passager (jamais 2)', dbPassengersA.length === 1 ? 200 : 500, 200, `passagers=${dbPassengersA.length}`);
  const dbEcA = await db.EmergencyContact.count({ where: { passenger_id: dbPassengersA.map((p) => p.id) } });
  ok('DB : 1 contact d\'urgence (passenger_id unique)', dbEcA === 1 ? 200 : 500, 200, `contacts=${dbEcA}`);
  const dbPayA0 = await db.Paiement.count({ where: { reservation_id: bookingA } });
  ok('DB : 0 paiement avant paiement', dbPayA0 === 0 ? 200 : 500, 200, `paiements=${dbPayA0}`);

  /* ── 8. Disponibilité publique (sans session) ───────────────────── */
  const avail = await call(`/bookings/availability?departId=${tripId}`);
  ok('GET /bookings/availability (public)', avail.status, 200, `dispo=${avail.data?.data?.placesDispo}`);
  ok('Siège 1 bloqué (en_attente) dans la disponibilité', avail.data?.data?.seats?.find((s) => s.number === '1')?.state === 'bloque' ? 200 : 500, 200);
  ok('Places dispo = 45 - 1', avail.data?.data?.placesDispo === 44 ? 200 : 500, 200, `dispo=${avail.data?.data?.placesDispo}`);

  /* ── 9. PAIEMENT SANS MONTANT (montant calculé côté serveur) ────── */
  const payA = await call(`/bookings/${bookingA}/payments`, {
    method: 'POST', token: clientToken, body: { methode: 'orange_money' },
  });
  ok('POST /bookings/:id/payments sans montant', payA.status, 200, payA.data?.data?.message || '');
  const payABooking = payA.data?.data;
  ok('Statut payee après paiement intégral', payABooking?.statut === 'payee' ? 200 : 500, 200, payABooking?.statut || '');
  ok('montantPaye = 5500 (montant serveur)', payABooking?.montantPaye === PRICE ? 200 : 500, 200, `paye=${payABooking?.montantPaye}`);
  ok('resteAPayer = 0', payABooking?.resteAPayer === 0 ? 200 : 500, 200, `reste=${payABooking?.resteAPayer}`);
  ok('1 paiement dans la réponse', payABooking?.paiements?.length === 1 ? 200 : 500, 200, `paiements=${payABooking?.paiements?.length}`);

  const dbPayA = await db.Paiement.findOne({ where: { reservation_id: bookingA } });
  ok('DB : 1 paiement statut paye', dbPayA?.statut === 'paye' ? 200 : 500, 200, dbPayA?.statut || '');
  ok('DB : montant payé = montant serveur (5500)', Number(dbPayA?.montant) === PRICE ? 200 : 500, 200, `montant=${dbPayA?.montant}`);
  ok('DB : agent_id NULL (client en ligne)', dbPayA?.agent_id === null ? 200 : 500, 200, `agent=${dbPayA?.agent_id}`);

  /* ── 10. BILLET + QR ÉMIS APRÈS PAIEMENT CONFIRMÉ ──────────────── */
  const dbBilletA = await db.Billet.findOne({ where: { reservation_id: bookingA } });
  ok('DB : 1 billet émis (jamais 2)', dbBilletA ? 200 : 500, 200, dbBilletA?.id || '');
  ok('Billet valide', dbBilletA?.statut === 'valide' ? 200 : 500, 200, dbBilletA?.statut || '');
  ok('QR code généré (qr_code non vide)', dbBilletA?.qr_code ? 200 : 500, 200, dbBilletA?.qr_code || '');
  ok('Jeton QR présent + hash', dbBilletA?.token && dbBilletA?.token_hash ? 200 : 500, 200);
  ok('Billet lié au passager (1:1)', dbBilletA?.passenger_id === dbPassengersA[0]?.id ? 200 : 500, 200);
  ok('Billet lié au siège 1', dbBilletA?.siege === '1' ? 200 : 500, 200, dbBilletA?.siege || '');
  ok('Prix du billet = 5500 XAF', Number(dbBilletA?.prix) === PRICE ? 200 : 500, 200);

  const ticketsList = await call(`/tickets?reservationId=${bookingA}`, { token: clientToken });
  ok('GET /tickets?reservationId (client)', ticketsList.status, 200, `total=${ticketsList.data?.data?.pagination?.total}`);
  ok('Liste tickets = 1 pour la réservation', ticketsList.data?.data?.pagination?.total === 1 ? 200 : 500, 200, `total=${ticketsList.data?.data?.pagination?.total}`);
  const ticketId = ticketsList.data?.data?.items?.[0]?.id;
  const qr = await call(`/tickets/${ticketId}/qrcode`, { token: clientToken });
  ok('GET /tickets/:id/qrcode', qr.status, 200);

  /* ── 11. Anti-double-paiement ───────────────────────────────────── */
  const payAgain = await call(`/bookings/${bookingA}/payments`, {
    method: 'POST', token: clientToken, body: { methode: 'mtn_money' },
  });
  ok('Double paiement réservation payee -> 400', payAgain.status, 400, payAgain.data?.data?.message || '');

  /* ── 12. Surpaiement refusé (montant client jamais fiable) ──────── */
  const bB = await call('/bookings', {
    method: 'POST', token: clientToken,
    body: { tripId, seats: [{ siege: '2' }], passengers: [{ firstName: 'Deux', lastName: 'Passagers' }] },
  });
  ok('POST /bookings réservation B', bB.status, 201, bB.data?.data?.id || '');
  bookingB = bB.data?.data?.id;

  const overpay = await call(`/bookings/${bookingB}/payments`, {
    method: 'POST', token: clientToken, body: { methode: 'especes', montant: 999999 },
  });
  ok('Paiement > reste à payer -> 400', overpay.status, 400, overpay.data?.data?.message || '');

  /* ── 13. Paiement partiel puis solde ────────────────────────────── */
  const partial = await call(`/bookings/${bookingB}/payments`, {
    method: 'POST', token: clientToken, body: { methode: 'mtn_money', montant: 2000 },
  });
  ok('Paiement partiel 2000/5500', partial.status, 200);
  ok('Réservation confirmée après acompte', partial.data?.data?.statut === 'confirmee' ? 200 : 500, 200, partial.data?.data?.statut || '');
  ok('resteAPayer = 3500', partial.data?.data?.resteAPayer === 3500 ? 200 : 500, 200, `reste=${partial.data?.data?.resteAPayer}`);
  const dbPayB = await db.Paiement.count({ where: { reservation_id: bookingB } });
  ok('DB : 1 paiement partiel', dbPayB === 1 ? 200 : 500, 200);

  const balance = await call(`/bookings/${bookingB}/payments`, {
    method: 'POST', token: clientToken, body: { methode: 'mtn_money', montant: 3500 },
  });
  ok('Solde 3500', balance.status, 200);
  ok('Statut payee après solde', balance.data?.data?.statut === 'payee' ? 200 : 500, 200, balance.data?.data?.statut || '');
  const dbBilletB = await db.Billet.findOne({ where: { reservation_id: bookingB } });
  ok('Billet émis pour la réservation B (paiement total)', dbBilletB?.statut === 'valide' ? 200 : 500, 200);

  /* ── 14. Guichet : agent_id renseigné + paiement especes ────────── */
  const cLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'counter@bustixconnect.com', motDePasse: 'Counter@123' },
  });
  ok('Login counter_agent', cLogin.status, 200);
  counterToken = cLogin.data?.data?.token;

  const bC = await call('/bookings', {
    method: 'POST', token: counterToken,
    body: {
      tripId, clientId,
      seats: [{ siege: '3' }],
      passengers: [{ firstName: 'Guichet', lastName: 'Test' }],
      modeReservation: 'guichet',
    },
  });
  ok('POST /bookings au guichet', bC.status, 201, bC.data?.data?.id || '');
  bookingC = bC.data?.data?.id;
  ok('Guichet : agent_id renseigné à la création', bC.data?.data?.agentId ? 200 : 500, 200, bC.data?.data?.agentId || '');

  const payC = await call(`/bookings/${bookingC}/payments`, {
    method: 'POST', token: counterToken, body: { methode: 'especes', montant: PRICE },
  });
  ok('Paiement guichet (montant explicite 5500)', payC.status, 200, payC.data?.data?.message || '');
  ok('Guichet : statut payee', payC.data?.data?.statut === 'payee' ? 200 : 500, 200, payC.data?.data?.statut || '');
  const dbPayC = await db.Paiement.findOne({ where: { reservation_id: bookingC } });
  ok('DB : paiement guichet agent_id renseigné (≠ NULL)', dbPayC?.agent_id ? 200 : 500, 200, `agent=${dbPayC?.agent_id}`);

  /* ── 15. Remboursement total ────────────────────────────────────── */
  const refund = await call(`/bookings/${bookingC}/refund`, {
    method: 'POST', token: counterToken, body: { motif: 'Test remboursement total' },
  });
  ok('POST /bookings/:id/refund total', refund.status, 200, refund.data?.data?.message || '');
  ok('Statut remboursee après remboursement total', refund.data?.data?.statut === 'remboursee' ? 200 : 500, 200, refund.data?.data?.statut || '');
  const dbBilletC = await db.Billet.findOne({ where: { reservation_id: bookingC } });
  ok('Billet remboursé/annulé', ['rembourse', 'annule'].includes(dbBilletC?.statut) ? 200 : 500, 200, dbBilletC?.statut || '');
  const refundOkAvail = await call(`/bookings/availability?departId=${tripId}`);
  ok('Siège 3 libre après remboursement', refundOkAvail.data?.data?.seats?.find((s) => s.number === '3')?.state === 'libre' ? 200 : 500, 200);

  /* ── 16. Remboursement au-delà du net payé refusé ───────────────── */
  const overRefund = await call(`/bookings/${bookingA}/refund`, {
    method: 'POST', token: clientToken, body: { montant: 999999, motif: 'trop' },
  });
  ok('Remboursement > net payé -> 400', overRefund.status, 400, overRefund.data?.data?.message || '');

  /* ── Nettoyage des données de test ──────────────────────────────── */
  await cleanup([bookingA, bookingB, bookingC]);
  await db.Depart.destroy({ where: { id: tripId } }).catch(() => {});
  await db.Bus.destroy({ where: { id: BUS_ID } }).catch(() => {});
  if (clientId) await db.Client.destroy({ where: { id: clientId } }).catch(() => {});

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS CHECKOUT ═══════');
  let failures = 0;
  for (const [name, status, expected, extra = ''] of steps) {
    const pass = status === expected;
    if (!pass) failures += 1;
    console.log(`${pass ? '✔' : '✘'} ${name} -> ${status} (attendu ${expected}) ${extra}`.trim());
  }
  console.log(`\n${steps.length - failures}/${steps.length} tests passés.`);
  await db.sequelize.close();
  process.exitCode = failures ? 1 : 0;
  setTimeout(() => process.exit(process.exitCode), 3000).unref();
})().catch(async (e) => {
  console.error('Erreur réseau/test :', e.message);
  console.error(e.stack);
  await db.sequelize.close().catch(() => {});
  process.exitCode = 1;
  setTimeout(() => process.exit(1), 3000).unref();
});
