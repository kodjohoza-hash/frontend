/* =====================================================================
   Tests d'intégration — MODULE CLIENTS AU GUICHET (API métier dédiée)
   Exécution : node scripts/test_counter_clients.js
   Nécessite : serveur démarré (port 5000) + seed (counter@bustixconnect.com
   sur la compagnie C001 / agence AG00000001, route RT81586700).
   Couvre : recherche de clients au guichet (scope compagnie), création
   d'un client SANS compte, doublons email/téléphone, garde-fou 403 sur
   POST /users pour counter_agent, réservation complète au guichet avec
   le clientId créé + contact d'urgence, paiement, billet émis, billet
   listé via GET /tickets?reservationId=, visibilité du client après
   réservation, permissions (401/403).
   ===================================================================== */
const BASE = 'http://localhost:5000/api/v1';

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
const PHONE = `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;
const EMAIL = `guichet.${UNIQUE.toLowerCase()}@test.com`;

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
  let counterToken = null;
  let clientToken = null;
  let clientId = null;
  let registeredClientId = null;
  let tripId = null;
  let bookingId = null;

  const cleanupBooking = async (id) => {
    if (!id) return;
    try {
      await db.Billet.destroy({ where: { reservation_id: id } });
      await db.Paiement.destroy({ where: { reservation_id: id } });
      const pass = await db.Passenger.findAll({ where: { reservation_id: id } });
      const pids = pass.map((p) => p.id);
      if (pids.length) await db.EmergencyContact.destroy({ where: { passenger_id: pids } });
      await db.Passenger.destroy({ where: { reservation_id: id } });
      await db.PlaceReservee.destroy({ where: { reservation_id: id } });
      await db.HistoriqueReservation.destroy({ where: { reservation_id: id } });
      await db.Reservation.destroy({ where: { id } });
    } catch (e) { console.warn(`[cleanup] ${e.message}`); }
  };

  /* ── 1. Connexions ─────────────────────────────────────────────── */
  const login = await call('/auth/login', {
    method: 'POST', body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login super admin', login.status, 200, login.data?.data?.user?.role || '');
  adminToken = login.data?.data?.token;

  const cLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'counter@bustixconnect.com', motDePasse: 'Counter@123' },
  });
  ok('Login counter_agent (seed)', cLogin.status, 200, cLogin.data?.data?.user?.role || '');
  counterToken = cLogin.data?.data?.token;

  /* ── 2. Garde-fou : counter_agent n'a PAS POST /users ──────────── */
  const usersDenied = await call('/users', {
    method: 'POST', token: counterToken,
    body: {
      prenom: 'X', nom: 'Y', email: `x.${UNIQUE.toLowerCase()}@test.com`,
      telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      role: 'client', agence_id: 'AG00000001', motDePasse: 'GardeFou@123',
    },
  });
  ok('Counter : POST /users générique -> 403 (garde-fou)', usersDenied.status, 403);

  /* ── 3. Client enregistré en ligne (sans réservation) ──────────── */
  const reg = await call('/auth/register-client', {
    method: 'POST',
    body: {
      prenom: 'Sans', nom: `Reservation ${UNIQUE.slice(0, 6)}`,
      telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      email: `sans.${UNIQUE.toLowerCase()}@test.com`,
      motDePasse: 'Client@123',
      pays: 'Cameroun', ville: 'Douala',
    },
  });
  ok('POST /auth/register-client (témoin sans réservation)', reg.status, 201);
  registeredClientId = reg.data?.data?.user?.id;
  clientToken = reg.data?.data?.token;

  /* ── 4. Création d'un client au guichet (sans compte) ──────────── */
  const created = await call('/guichets/clients', {
    method: 'POST', token: counterToken,
    body: {
      prenom: 'Guichet', nom: `Client ${UNIQUE.slice(0, 6)}`,
      telephone: PHONE, email: EMAIL,
      adresse: 'Rue 123, Akwa', villeId: 'DLA', pays: 'Cameroun',
      typePiece: 'cni', numeroPiece: `CN-${UNIQUE.slice(0, 8)}`,
    },
  });
  ok('POST /guichets/clients (création au guichet)', created.status, 201, created.data?.data?.id || '');
  ok('Réponse client sans secret', hasSensitive(created.data?.data) ? 500 : 200, 200);
  clientId = created.data?.data?.id;
  ok('ID client format CLT+9', /^CLT[A-Z0-9]{9}$/.test(clientId || '') ? 200 : 500, 200, clientId || '');
  ok('Statut nouveau', created.data?.data?.statut === 'nouveau' ? 200 : 500, 200);
  ok('Pièce d\'identité résolue', created.data?.data?.typePiece === 'cni' ? 200 : 500, 200);
  ok('Ville résolue (Douala)', created.data?.data?.ville === 'Douala' ? 200 : 500, 200, created.data?.data?.ville || '');

  const createdDb = await db.Client.findByPk(clientId);
  ok('Client en base (statut nouveau, sans hash)', createdDb?.statut === 'nouveau' && !createdDb?.mot_de_passe_hash ? 200 : 500, 200);

  const dupEmail = await call('/guichets/clients', {
    method: 'POST', token: counterToken,
    body: { prenom: 'Double', nom: 'Email', telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`, email: EMAIL },
  });
  ok('POST /guichets/clients email dupliqué -> 409', dupEmail.status, 409, dupEmail.data?.data?.message || '');

  const dupPhone = await call('/guichets/clients', {
    method: 'POST', token: counterToken,
    body: { prenom: 'Double', nom: 'Téléphone', telephone: PHONE },
  });
  ok('POST /guichets/clients téléphone dupliqué -> 409', dupPhone.status, 409, dupPhone.data?.data?.message || '');

  const missingPrenom = await call('/guichets/clients', {
    method: 'POST', token: counterToken,
    body: { nom: 'Sans Prénom', telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}` },
  });
  ok('POST /guichets/clients sans prénom -> 400', missingPrenom.status, 400);

  /* ── 5. Recherche avant réservation (scope réservations) ───────── */
  const searchEmpty = await call(`/guichets/clients/search?recherche=${PHONE}`, { token: counterToken });
  ok('GET /guichets/clients/search (client sans réservation absent)', searchEmpty.status, 200, `total=${searchEmpty.data?.data?.total}`);
  ok('Avant réservation : 0 résultat', searchEmpty.data?.data?.total === 0 ? 200 : 500, 200);

  const searchNoAuth = await call('/guichets/clients/search');
  ok('GET /guichets/clients/search sans token -> 401', searchNoAuth.status, 401);

  const searchAsClient = await call('/guichets/clients/search', { token: clientToken });
  ok('GET /guichets/clients/search en client -> 403', searchAsClient.status, 403);

  /* ── 6. Réservation complète au guichet avec le clientId créé ──── */
  await db.Bus.create({
    id: BUS_ID,
    immatriculation: `TEST-${UNIQUE.slice(-6)}`,
    interne: `TI-${UNIQUE.slice(-6)}`,
    modele: 'Bus Test Guichet',
    marque: 'Test',
    capacite: 45,
    compagnie_id: 'C001',
    statut: 'available',
    type_bus: 'standard',
    classe: 'economy',
  });

  const createdTrip = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: PRICE, companyId: 'C001', agencyId: 'AG00000001' },
  });
  ok('POST /trips (voyage de test)', createdTrip.status, 201, createdTrip.data?.data?.id || '');
  tripId = createdTrip.data?.data?.id;
  if (createdTrip.status !== 201) console.error('[diag] POST /trips →', createdTrip.status, JSON.stringify(createdTrip.data));

  const booking = await call('/bookings', {
    method: 'POST', token: counterToken,
    body: {
      tripId,
      clientId,
      seats: [{ siege: '1' }],
      passengers: [{
        firstName: 'Guichet', lastName: `Client ${UNIQUE.slice(0, 6)}`,
        phone: PHONE, email: EMAIL, documentType: 'cni', documentNumber: `CN-${UNIQUE.slice(0, 8)}`,
        emergencyContact: { fullName: 'Urgence Test', phone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`, relationship: 'Parent', address: 'Akwa' },
      }],
      modeReservation: 'guichet',
    },
  });
  ok('POST /bookings au guichet avec clientId créé', booking.status, 201, booking.data?.data?.id || '');
  bookingId = booking.data?.data?.id;
  if (booking.status !== 201) console.error('[diag] POST /bookings →', booking.status, JSON.stringify(booking.data));
  ok('Guichet : agent_id renseigné', bookingId && booking.data?.data?.agentId ? 200 : 500, 200);
  ok('Client de la réservation = client créé', bookingId && booking.data?.data?.client?.id === clientId ? 200 : 500, 200);
  ok('Montant serveur = prix brut', bookingId && booking.data?.data?.montant === PRICE ? 200 : 500, 200, `montant=${booking.data?.data?.montant}`);

  if (bookingId) {
    const dbPass = await db.Passenger.findOne({ where: { reservation_id: bookingId } });
    ok('Passager lié au client créé', dbPass?.client_id === clientId ? 200 : 500, 200);
    const dbContact = await db.EmergencyContact.findOne({ where: { passenger_id: dbPass?.id } });
    ok('Contact d\'urgence créé (1, pas une 2e réservation)', dbContact && dbContact.full_name === 'Urgence Test' ? 200 : 500, 200, dbContact?.full_name || '');

    /* ── 7. Paiement + billet ─────────────────────────────────────── */
    const pay = await call(`/bookings/${bookingId}/payments`, {
      method: 'POST', token: counterToken, body: { methode: 'especes' },
    });
    ok('Paiement guichet (montant calculé serveur)', pay.status, 200, pay.data?.data?.message || '');
    ok('Statut payee', pay.data?.data?.statut === 'payee' ? 200 : 500, 200);

    const dbBillet = await db.Billet.findOne({ where: { reservation_id: bookingId } });
    ok('Billet émis en base (statut valide)', dbBillet?.statut === 'valide' ? 200 : 500, 200);

    const tickets = await call(`/tickets?reservationId=${bookingId}`, { token: counterToken });
    ok('GET /tickets?reservationId= (counter)', tickets.status, 200, `count=${tickets.data?.data?.items?.length}`);

    /* ── 8. Le client est désormais visible dans la recherche ─────── */
    const searchAfter = await call(`/guichets/clients/search?recherche=${PHONE}`, { token: counterToken });
    ok('GET /guichets/clients/search après réservation', searchAfter.status, 200, `total=${searchAfter.data?.data?.total}`);
    ok('Client trouvé après réservation', searchAfter.data?.data?.items?.some((c) => c.id === clientId) ? 200 : 500, 200);
  }

  const searchGeneral = await call('/guichets/clients/search?recherche=Guichet', { token: counterToken });
  ok('Recherche par nom (répertoire compagnie)', searchGeneral.status, 200, `total=${searchGeneral.data?.data?.total}`);

  /* ── Nettoyage ─────────────────────────────────────────────────── */
  await cleanupBooking(bookingId);
  await db.Depart.destroy({ where: { id: tripId } }).catch(() => {});
  await db.Bus.destroy({ where: { id: BUS_ID } }).catch(() => {});
  if (clientId) await db.Client.destroy({ where: { id: clientId } }).catch(() => {});
  if (registeredClientId) {
    await db.RefreshToken.destroy({ where: { client_id: registeredClientId } }).catch(() => {});
    await db.SessionConnexion.destroy({ where: { client_id: registeredClientId } }).catch(() => {});
    await db.EmailVerificationToken.destroy({ where: { client_id: registeredClientId } }).catch(() => {});
    await db.Client.destroy({ where: { id: registeredClientId } }).catch(() => {});
  }

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS CLIENTS AU GUICHET ═══════');
  let failures = 0;
  for (const [name, status, expected, extra = ''] of steps) {
    const pass = status === expected;
    if (!pass) failures += 1;
    console.log(`${pass ? '✔' : '✘'} ${name} -> ${status} (attendu ${expected}) ${extra}`.trim());
  }
  console.log(`\n${steps.length - failures}/${steps.length} tests passés.`);
  await db.sequelize.close();
  process.exit(failures ? 1 : 0);
})().catch(async (e) => {
  console.error('Erreur réseau/test :', e.message);
  await db.sequelize.close().catch(() => {});
  process.exit(1);
});
