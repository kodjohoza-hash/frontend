/* =====================================================================
   Tests d'intégration du module TRIPS (voyages, backend local :5001)
   Exécution : node scripts/test_trips.js
   Nécessite : serveur démarré sur le port 5001 (module trips chargé).
   Couvre : auth, création, capacité/prix XAF, récupération, filtres
            from/to/date, recherche publique, disponibilité réelle,
            mise à jour, transitions de statut, chevauchement bus,
            bus indisponible, compagnie inactive, suppression protégée,
            KPIs, nettoyage.
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
  let tripA = null; // voyage principal (transitions de statut)
  let tripB = null; // statut via alias 'scheduled'
  let tripC = null; // suppression propre
  let tripD = null; // code explicite (test doublon)

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
    modele: 'Bus Test Trips',
    marque: 'Test',
    capacite: 45,
    compagnie_id: 'C001',
    statut: 'available',
    type_bus: 'standard',
    classe: 'economy',
  });

  /* ── 3. Authentification obligatoire ────────────────────────────── */
  const noAuth = await call('/trips');
  ok('GET /trips sans token -> 401', noAuth.status, 401);

  /* ── 4. Validation des requêtes ─────────────────────────────────── */
  const badLimit = await call('/trips?limit=999', { token: adminToken });
  ok('GET /trips limit invalide -> 400', badLimit.status, 400);

  const badStatus = await call('/trips?statut=nimporte', { token: adminToken });
  ok('GET /trips statut invalide -> 400', badStatus.status, 400);

  const badSort = await call('/trips?sort=alphabetique', { token: adminToken });
  ok('GET /trips sort invalide -> 400', badSort.status, 400);

  const missingCreate = await call('/trips', { method: 'POST', token: adminToken, body: { routeId: 'RT81586700' } });
  ok('POST /trips champs requis manquants -> 400', missingCreate.status, 400);

  const badPrice0 = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: 0 },
  });
  ok('POST /trips prix 0 (XAF positif requis) -> 400', badPrice0.status, 400);

  const badPriceFloat = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: 4500.5 },
  });
  ok('POST /trips prix décimal (XAF entier) -> 400', badPriceFloat.status, 400);

  const badArrival = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '11:30', arrivalTime: '08:00', price: 5000 },
  });
  ok('POST /trips arrivée <= départ -> 400', badArrival.status, 400);

  /* ── 5. Règles métier : bus / compagnie ─────────────────────────── */
  const inactiveBus = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: 'BS41761623', date: D, departureTime: '08:00', arrivalTime: '11:30', price: 5000, companyId: 'C001' },
  });
  ok('POST /trips bus inactif (BS41761623) -> 409', inactiveBus.status, 409);

  const inactiveCompany = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: 5000, companyId: 'CU44' },
  });
  ok('POST /trips compagnie non active (CU44) -> 409', inactiveCompany.status, 409);

  const unknownRoute = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT00000000', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: 5000, companyId: 'C001' },
  });
  ok('POST /trips itinéraire inconnu -> 400', unknownRoute.status, 400);

  /* ── 6. Création ────────────────────────────────────────────────── */
  const created = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: 5500, companyId: 'C001', agencyId: 'AG00000001' },
  });
  ok('POST /trips (création)', created.status, 201, created.data?.data?.id || '');
  tripA = created.data?.data?.id;
  ok('Voyage sans secret', hasSensitive(created.data?.data) ? 500 : 200, 200);
  ok('ID voyage format VYG########', /^VYG\d{7}$/.test(tripA || '') ? 200 : 500, 200, tripA || '');
  ok('Code généré VYG-YYYYMMDD-XXXX', /^VYG-\d{8}-[A-Z0-9]{4}$/.test(created.data?.data?.code || '') ? 200 : 500, 200, created.data?.data?.code || '');
  ok('Devise XAF (jamais XOF)', created.data?.data?.currency === 'XAF' ? 200 : 500, 200);
  ok('Capacité = capacité du bus (45)', created.data?.data?.totalSeats === 45 ? 200 : 500, 200);
  ok('Places disponibles initiales = capacité', created.data?.data?.availableSeats === 45 ? 200 : 500, 200);
  ok('Statut initial programme', created.data?.data?.status === 'programme' ? 200 : 500, 200);
  ok('Villes résolues (DLA → YDE)', created.data?.data?.route?.departureCity === 'Douala' && created.data?.data?.route?.arrivalCity?.includes('Yaound') ? 200 : 500, 200);
  ok('Compagnie rattachée C001', created.data?.data?.companyId === 'C001' ? 200 : 500, 200);
  ok('Agence rattachée', created.data?.data?.agencyId === 'AG00000001' ? 200 : 500, 200);

  const createdDb = await db.Depart.findByPk(tripA);
  ok('Voyage en base (statut programme)', createdDb?.statut === 'programme' && createdDb?.places_total === 45 ? 200 : 500, 200);

  /* Code explicite + doublon */
  const withCode = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '06:00', arrivalTime: '07:30', price: 4000, companyId: 'C001', code: `TEST-${UNIQUE.slice(-6)}` },
  });
  ok('POST /trips code explicite', withCode.status, 201, withCode.data?.data?.code || '');
  tripD = withCode.data?.data?.id;

  const dupCode = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '06:30', arrivalTime: '07:45', price: 4000, companyId: 'C001', code: `TEST-${UNIQUE.slice(-6)}` },
  });
  ok('POST /trips code dupliqué -> 409', dupCode.status, 409);

  /* Statut via alias 'scheduled' → programme */
  const createdB = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '14:00', arrivalTime: '17:30', price: 6000, companyId: 'C001', status: 'scheduled' },
  });
  ok('POST /trips statut alias scheduled -> programme', createdB.status, 201, createdB.data?.data?.status || '');
  tripB = createdB.data?.data?.id;
  ok('Alias scheduled mappé sur programme', createdB.data?.data?.status === 'programme' ? 200 : 500, 200);

  /* ── 7. Chevauchement de bus ────────────────────────────────────── */
  const overlap = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '15:00', arrivalTime: '18:00', price: 6200, companyId: 'C001' },
  });
  ok('POST /trips chevauchement bus (14:00-17:30) -> 409', overlap.status, 409);

  const nonOverlap = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '20:00', arrivalTime: '22:30', price: 5000, companyId: 'C001' },
  });
  ok('POST /trips horaire sans chevauchement', nonOverlap.status, 201);
  tripC = nonOverlap.data?.data?.id;

  /* ── 8. Détail (public + admin) ─────────────────────────────────── */
  const detail = await call(`/trips/${tripA}`, { token: adminToken });
  ok('GET /trips/:id (admin)', detail.status, 200, detail.data?.data?.code || '');
  ok('Détail avec itinéraire + villes', detail.data?.data?.route?.id === 'RT81586700' && detail.data?.data?.route?.departureCity ? 200 : 500, 200);

  const detailPublic = await call(`/trips/${tripA}`);
  ok('GET /trips/:id sans token (réservable) -> 200', detailPublic.status, 200);

  const notFound = await call('/trips/RT00000000', { token: adminToken });
  ok('GET /trips/:id inconnu -> 404', notFound.status, 404);

  /* ── 9. Liste + filtres + tri ───────────────────────────────────── */
  const list = await call('/trips', { token: adminToken });
  ok('GET /trips', list.status, 200, `total=${list.data?.data?.total}`);
  ok('Liste contient le voyage créé', list.data?.data?.items?.some((t) => t.id === tripA) ? 200 : 500, 200);

  const fromTo = await call('/trips?from=DLA&to=YDE', { token: adminToken });
  ok('GET /trips?from=DLA&to=YDE', fromTo.status, 200, `total=${fromTo.data?.data?.total}`);
  ok('Filtre from/to respecté', fromTo.data?.data?.items?.every((t) => t.route?.departureCityId === 'DLA' && t.route?.arrivalCityId === 'YDE') ? 200 : 500, 200);

  const byDate = await call(`/trips?date=${D}`, { token: adminToken });
  ok('GET /trips?date=…', byDate.status, 200, `total=${byDate.data?.data?.total}`);
  ok('Filtre date respecté', byDate.data?.data?.items?.every((t) => t.date === D) ? 200 : 500, 200);

  const priceMin = await call('/trips?priceMin=5000', { token: adminToken });
  ok('GET /trips?priceMin=5000', priceMin.status, 200, `total=${priceMin.data?.data?.total}`);
  ok('Filtre prix min respecté', priceMin.data?.data?.items?.every((t) => t.price >= 5000) ? 200 : 500, 200);

  const sorted = await call('/trips?sort=price_asc&limit=100', { token: adminToken });
  ok('GET /trips sort price_asc', sorted.status, 200,
    sorted.data?.data?.items?.every((t, i, arr) => i === 0 || arr[i - 1].price <= t.price) ? 'OK' : 'tri?');

  const recherché = await call(`/trips?recherche=${encodeURIComponent(UNIQUE.slice(-6))}`, { token: adminToken });
  ok('GET /trips recherche code', recherché.status, 200, `total=${recherché.data?.data?.total}`);
  ok('Recherche trouve le voyage à code explicite', recherché.data?.data?.total >= 1 ? 200 : 500, 200);

  /* ── 10. Recherche publique (sans auth) ─────────────────────────── */
  const pubSearch = await call('/trips/available');
  ok('GET /trips/available (public)', pubSearch.status, 200, `total=${pubSearch.data?.data?.total}`);
  ok('Recherche publique : voyages réservables uniquement', pubSearch.data?.data?.items?.every((t) => ['programme', 'embarquement'].includes(t.status) && t.availableSeats > 0) ? 200 : 500, 200);
  ok('Ligne publique avec villes + prix XAF', pubSearch.data?.data?.items?.[0]?.route?.departureCity && pubSearch.data?.data?.items?.[0]?.currency === 'XAF' ? 200 : 500, 200);

  const pubFromTo = await call(`/trips/available?from=DLA&to=YDE&date=${D}`);
  ok('GET /trips/available?from&to&date', pubFromTo.status, 200, `total=${pubFromTo.data?.data?.total}`);
  ok('Filtre public from/to/date', pubFromTo.data?.data?.items?.every((t) => t.route?.departureCityId === 'DLA' && t.route?.arrivalCityId === 'YDE' && t.date === D) ? 200 : 500, 200);

  /* ── 11. Disponibilité réelle (réservations) ────────────────────── */
  const availReal = await call('/trips/DPTEST0002', { token: adminToken });
  ok('GET /trips/DPTEST0002 (admin)', availReal.status, 200);
  ok('Disponibilité réelle = capacité - sièges réservés (45-4=41)', availReal.data?.data?.occupiedSeats === 4 && availReal.data?.data?.availableSeats === 41 ? 200 : 500, 200, `occ=${availReal.data?.data?.occupiedSeats} dispo=${availReal.data?.data?.availableSeats}`);
  ok('places_dispo stocké inchangé (9) vs réel (41)', availReal.data?.data?.storedAvailableSeats === 9 && availReal.data?.data?.availableSeats === 41 ? 200 : 500, 200);

  /* ── 12. Mise à jour ────────────────────────────────────────────── */
  const updated = await call(`/trips/${tripA}`, {
    method: 'PATCH', token: adminToken,
    body: { price: 6000, quai: 'Quai 3', observations: 'Test mise à jour.' },
  });
  ok('PATCH /trips/:id', updated.status, 200, updated.data?.data?.price || '');
  ok('PATCH persiste (prix/quai)', updated.data?.data?.price === 6000 && updated.data?.data?.quai === 'Quai 3' ? 200 : 500, 200);

  const patchFloat = await call(`/trips/${tripA}`, {
    method: 'PATCH', token: adminToken, body: { price: 6000.75 },
  });
  ok('PATCH /trips/:id prix décimal -> 400', patchFloat.status, 400);

  const changeBusWithResa = await call('/trips/DPTEST0002', {
    method: 'PATCH', token: adminToken, body: { busId: BUS_ID },
  });
  ok('PATCH /trips/:id changement bus avec réservations -> 409', changeBusWithResa.status, 409);

  /* ── 13. Transitions de statut ──────────────────────────────────── */
  const st1 = await call(`/trips/${tripA}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'embarquement', raison: 'test' },
  });
  ok('PATCH /trips/:id/status programme -> embarquement', st1.status, 200, st1.data?.data?.status || '');

  const st2 = await call(`/trips/${tripA}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'en_cours' },
  });
  ok('PATCH /trips/:id/status embarquement -> en_cours', st2.status, 200);

  const st3 = await call(`/trips/${tripA}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'completed' },
  });
  ok('PATCH /trips/:id/status alias completed -> termine', st3.status, 200, st3.data?.data?.status || '');
  ok('Alias completed mappé sur termine', st3.data?.data?.status === 'termine' ? 200 : 500, 200);

  const stBad = await call(`/trips/${tripA}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'annule' },
  });
  ok('PATCH /trips/:id/status termine -> annule -> 409', stBad.status, 409);

  const stInvalid = await call(`/trips/${tripA}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'inconnu' },
  });
  ok('PATCH /trips/:id/status statut invalide -> 400', stInvalid.status, 400);

  const detailTerminePublic = await call(`/trips/${tripA}`);
  ok('GET /trips/:id termine sans token -> 404', detailTerminePublic.status, 404);
  const detailTermineAdmin = await call(`/trips/${tripA}`, { token: adminToken });
  ok('GET /trips/:id termine admin -> 200', detailTermineAdmin.status, 200);

  const pubAfterTermine = await call(`/trips/available?recherche=${encodeURIComponent(tripA)}`);
  ok('Voyage termine exclu de la recherche publique', !pubAfterTermine.data?.data?.items?.some((t) => t.id === tripA) ? 200 : 500, 200);

  /* ── 14. Suppression protégée ───────────────────────────────────── */
  const delWithResa = await call('/trips/DPTEST0002', { method: 'DELETE', token: adminToken });
  ok('DELETE /trips avec réservations -> 409', delWithResa.status, 409, delWithResa.data?.data?.message || '');

  const delClean = await call(`/trips/${tripC}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /trips sans réservation', delClean.status, 200, delClean.data?.data?.message || '');
  const delCleanDb = await db.Depart.findByPk(tripC);
  ok('Voyage sans réservation supprimé en base', !delCleanDb ? 200 : 500, 200);

  const delTermine = await call(`/trips/${tripA}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /trips déjà termine -> 200 (annulé/reporté)', delTermine.status, 200);

  /* ── 15. KPIs ───────────────────────────────────────────────────── */
  const stats = await call('/trips/stats', { token: adminToken });
  ok('GET /trips/stats', stats.status, 200, `total=${stats.data?.data?.total}`);
  ok('Stats total >= 1', stats.data?.data?.total >= 1 ? 200 : 500, 200);
  ok('Stats occupancy nombre', typeof stats.data?.data?.occupancy === 'number' ? 200 : 500, 200);

  /* ── 16. Company admin : périmètre ──────────────────────────────── */
  const caLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'company@bustixconnect.com', motDePasse: 'Company@123' },
  });
  ok('Login company_admin', caLogin.status, 200);
  const companyToken = caLogin.data?.data?.token;

  const caCreate = await call('/trips', {
    method: 'POST', token: companyToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '05:00', arrivalTime: '05:45', price: 4800 },
  });
  ok('Company : POST /trips', caCreate.status, 201, caCreate.data?.data?.id || '');
  ok('Company : voyage auto-lié à C001', caCreate.data?.data?.companyId === 'C001' ? 200 : 500, 200);
  const caTripId = caCreate.data?.data?.id;

  const caList = await call('/trips', { token: companyToken });
  ok('Company : GET /trips (périmètre C001)', caList.status, 200, `total=${caList.data?.data?.total}`);
  ok('Company : ne voit que ses voyages', caList.data?.data?.items?.every((t) => t.companyId === 'C001') ? 200 : 500, 200);

  /* ── Nettoyage direct des données de test ───────────────────────── */
  const testTripIds = [tripA, tripB, tripC, tripD, caTripId].filter(Boolean);
  if (testTripIds.length) {
    await db.Depart.destroy({ where: { id: testTripIds } });
  }
  await db.Depart.destroy({ where: { bus_id: BUS_ID, id: { [db.Sequelize.Op.notIn]: ['DPTEST0001', 'DPTEST0002'] } } });
  await db.Bus.destroy({ where: { id: BUS_ID } });

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS TRIPS ═══════');
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
