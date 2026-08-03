/* =====================================================================
   Tests d'intégration du module ROUTES (backend local http://localhost:5000)
   Exécution : node scripts/test_routes.js
   Nécessite : serveur démarré (module routes chargé) + migration appliquée.
   Couvre : villes (CRUD), itinéraires (CRUD, statuts), escales, calculs,
            recherche, filtres, tri, pagination, KPIs, permissions, sécurité.
   ===================================================================== */
const BASE = 'http://localhost:5000/api/v1';

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
const CITY_ID = `T${UNIQUE.slice(-2)}`;

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  let companyId = null;
  let routeId = null;
  let route2Id = null;
  let stopId = null;
  let testVilleId = null;

  /* ── 1. Connexion admin (super_admin) ───────────────────────────── */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login super admin', login.status, 200, login.data?.data?.user?.role || '');
  const adminToken = login.data?.data?.token;

  /* ── 2. Compagnie de test (isolée) ──────────────────────────────── */
  const company = await call('/companies', {
    method: 'POST', token: adminToken,
    body: { nom: `Routes Test ${UNIQUE}`, email: `routes_${UNIQUE}@example.com`, plan: 'standard' },
  });
  ok('POST /companies (compagnie de test)', company.status, 201);
  companyId = company.data?.data?.id;

  /* ── 3. Auth + validation ───────────────────────────────────────── */
  const noAuth = await call('/routes');
  ok('GET /routes sans token -> 401', noAuth.status, 401);

  const invalidLimit = await call('/routes?limit=999', { token: adminToken });
  ok('GET /routes limit invalide -> 400', invalidLimit.status, 400);

  const badStatusFilter = await call('/routes?statut=nimporte', { token: adminToken });
  ok('GET /routes statut invalide -> 400', badStatusFilter.status, 400);

  /* ── 4. Villes ──────────────────────────────────────────────────── */
  const villes = await call('/routes/villes', { token: adminToken });
  ok('GET /routes/villes', villes.status, 200, `total=${villes.data?.data?.length}`);
  ok('Villes seed présentes (DLA, YDE, BFS)', ['DLA', 'YDE', 'BFS'].every((c) => villes.data?.data?.some((v) => v.id === c)) ? 200 : 500, 200);
  ok('Ville avec profil complet', villes.data?.data?.[0]?.region && villes.data?.data?.[0]?.country ? 200 : 500, 200);

  const villesActive = await call('/routes/villes?statut=active', { token: adminToken });
  ok('GET /routes/villes?statut=active', villesActive.status, 200);
  ok('Filtre statut villes respecté', villesActive.data?.data?.every((v) => v.status === 'active') ? 200 : 500, 200);

  const createVille = await call('/routes/villes', {
    method: 'POST', token: adminToken,
    body: { id: CITY_ID, name: `Ville Test ${UNIQUE.slice(-3)}`, region: 'Test', country: 'Cameroun', latitude: 3.5, longitude: 11.2, status: 'active' },
  });
  ok('POST /routes/villes (création)', createVille.status, 201, createVille.data?.data?.id || '');
  testVilleId = createVille.data?.data?.id;
  ok('Ville sans secret', hasSensitive(createVille.data?.data) ? 500 : 200, 200);
  ok('Ville ID uppercasé', createVille.data?.data?.id === CITY_ID ? 200 : 500, 200);

  const duplicateVille = await call('/routes/villes', {
    method: 'POST', token: adminToken, body: { id: CITY_ID, name: 'Doublon' },
  });
  ok('POST /routes/villes doublon -> 409', duplicateVille.status, 409);

  const badVille = await call('/routes/villes', {
    method: 'POST', token: adminToken, body: { id: 'X', name: 'X' },
  });
  ok('POST /routes/villes code invalide -> 400', badVille.status, 400);

  const updateVille = await call(`/routes/villes/${CITY_ID}`, {
    method: 'PATCH', token: adminToken, body: { region: 'Littoral', latitude: 3.9 },
  });
  ok('PATCH /routes/villes/:id', updateVille.status, 200, updateVille.data?.data?.region || '');
  ok('PATCH ville persiste', updateVille.data?.data?.region === 'Littoral' && Number(updateVille.data?.data?.latitude) === 3.9 ? 200 : 500, 200);

  const getVille = await call(`/routes/villes/${CITY_ID}`, { token: adminToken });
  ok('GET /routes/villes/:id', getVille.status, 200, getVille.data?.data?.name || '');

  const delUnused = await call(`/routes/villes/${CITY_ID}`, { method: 'DELETE', token: adminToken });
  ok('DELETE ville non utilisée (archivage) -> 200', delUnused.status, 200);
  ok('Ville archivée (soft)', /archiv/i.test(delUnused.data?.data?.message || '') ? 200 : 500, 200);
  const restoreVille = await call(`/routes/villes/${CITY_ID}`, {
    method: 'PATCH', token: adminToken, body: { status: 'active' },
  });
  ok('Ville réactivée', restoreVille.status, 200);

  /* ── 5. Création d'itinéraires ──────────────────────────────────── */
  const NEW_ROUTE = {
    name: `Douala → Yaoundé ${UNIQUE.slice(-4)}`,
    code: `RT-${UNIQUE.slice(-4)}`,
    departureCityId: 'DLA',
    arrivalCityId: 'YDE',
    companyId,
    distanceKm: 260,
    duration: '4h30',
    priceMin: 4500,
    priceMax: 6000,
    status: 'active',
    description: 'Itinéraire de test.',
  };

  const created = await call('/routes', { method: 'POST', token: adminToken, body: NEW_ROUTE });
  ok('POST /routes (création)', created.status, 201, created.data?.data?.id || '');
  ok('Itinéraire sans secret', hasSensitive(created.data?.data) ? 500 : 200, 200);
  routeId = created.data?.data?.id;
  ok('ID itinéraire format RT########', /^RT\d{8}$/.test(routeId || '') ? 200 : 500, 200, routeId || '');
  ok('Villes résolues', created.data?.data?.departureCity?.name === 'Douala' && created.data?.data?.arrivalCity?.name?.includes('Yaound') ? 200 : 500, 200);
  ok('Compagnie résolue', created.data?.data?.company?.id === companyId ? 200 : 500, 200);
  ok('Prix et distance stockés', created.data?.data?.distanceKm === 260 && created.data?.data?.priceMin === 4500 ? 200 : 500, 200);

  const createdDb = await db.Trajet.findByPk(routeId);
  ok('Trajet en base', createdDb?.nom === NEW_ROUTE.name && createdDb?.statut === 'active' ? 200 : 500, 200);

  const duplicateCode = await call('/routes', { method: 'POST', token: adminToken, body: NEW_ROUTE });
  ok('POST /routes code dupliqué -> 409', duplicateCode.status, 409);

  const sameCity = await call('/routes', {
    method: 'POST', token: adminToken,
    body: { ...NEW_ROUTE, code: `RT-${UNIQUE.slice(-4)}-B`, departureCityId: 'DLA', arrivalCityId: 'DLA' },
  });
  ok('POST /routes même ville -> 400', sameCity.status, 400);

  const unknownCity = await call('/routes', {
    method: 'POST', token: adminToken,
    body: { ...NEW_ROUTE, code: `RT-${UNIQUE.slice(-4)}-C`, departureCityId: 'ZZZ', arrivalCityId: 'YDE' },
  });
  ok('POST /routes ville inconnue -> 400', unknownCity.status, 400);

  const badPrices = await call('/routes', {
    method: 'POST', token: adminToken,
    body: { ...NEW_ROUTE, code: `RT-${UNIQUE.slice(-4)}-D`, priceMin: 9000, priceMax: 5000 },
  });
  ok('POST /routes prix incohérents -> 400', badPrices.status, 400);

  const badCreate = await call('/routes', { method: 'POST', token: adminToken, body: { name: 'X' } });
  ok('POST /routes données invalides -> 400', badCreate.status, 400);

  const second = await call('/routes', {
    method: 'POST', token: adminToken,
    body: {
      name: `Yaoundé → Bafoussam ${UNIQUE.slice(-4)}`,
      code: `RT-${UNIQUE.slice(-4)}-2`,
      departureCityId: 'YDE',
      arrivalCityId: 'BFS',
      distanceKm: 230,
      duration: '4h00',
      priceMin: 4000,
      status: 'inactive',
    },
  });
  ok('POST /routes (2e, inactive)', second.status, 201);
  route2Id = second.data?.data?.id;

  const delInUse = await call('/routes/villes/YDE', { method: 'DELETE', token: adminToken });
  ok('DELETE ville utilisée (YDE) -> 409', delInUse.status, 409);

  /* ── 6. Recherche + filtres + tri + pagination ──────────────────── */
  const search = await call(`/routes?recherche=${encodeURIComponent(UNIQUE.slice(-4))}`, { token: adminToken });
  ok('GET /routes recherche', search.status, 200, `trouvé=${search.data?.data?.total}`);
  ok('Recherche trouve les 2', search.data?.data?.total === 2 ? 200 : 500, 200);

  const statutFilter = await call('/routes?statut=inactive', { token: adminToken });
  ok('GET /routes filtre statut', statutFilter.status, 200, `total=${statutFilter.data?.data?.total}`);
  ok('Filtre statut respecté', statutFilter.data?.data?.items?.every((r) => r.status === 'inactive') ? 200 : 500, 200);

  const villeDepartFilter = await call('/routes?villeDepart=YDE', { token: adminToken });
  ok('GET /routes filtre ville départ', villeDepartFilter.status, 200, `total=${villeDepartFilter.data?.data?.total}`);
  ok('Filtre ville départ respecté', villeDepartFilter.data?.data?.items?.every((r) => r.departureCityId === 'YDE') ? 200 : 500, 200);

  const villeArriveeFilter = await call('/routes?villeArrivee=YDE', { token: adminToken });
  ok('GET /routes filtre ville arrivée', villeArriveeFilter.status, 200, `total=${villeArriveeFilter.data?.data?.total}`);
  ok('Filtre ville arrivée respecté', villeArriveeFilter.data?.data?.items?.every((r) => r.arrivalCityId === 'YDE') ? 200 : 500, 200);

  const companyFilter = await call(`/routes?compagnieId=${companyId}`, { token: adminToken });
  ok('GET /routes filtre compagnie', companyFilter.status, 200, `total=${companyFilter.data?.data?.total}`);

  const sorted = await call('/routes?sort=name_asc&limit=2', { token: adminToken });
  ok('GET /routes tri name_asc', sorted.status, 200,
    sorted.data?.data?.items?.[0]?.name?.localeCompare(sorted.data?.data?.items?.[1]?.name) <= 0 ? 'OK' : 'tri?');

  const paginated = await call('/routes?page=1&limit=1', { token: adminToken });
  ok('GET /routes pagination (limit=1)', paginated.status, 200, `total=${paginated.data?.data?.total}`);
  ok('GET /routes limit respecté', paginated.data?.data?.items?.length <= 1 ? 200 : 500, 200);

  /* ── 7. Détail + édition ────────────────────────────────────────── */
  const detail = await call(`/routes/${routeId}`, { token: adminToken });
  ok('GET /routes/:id', detail.status, 200, detail.data?.data?.code || '');
  ok('Détail avec stops + départ/villes', Array.isArray(detail.data?.data?.stops) && detail.data?.data?.departureCity && detail.data?.data?.arrivalCity ? 200 : 500, 200);

  const notFound = await call('/routes/RT00000000', { token: adminToken });
  ok('GET /routes/:id inconnu -> 404', notFound.status, 404);

  const updated = await call(`/routes/${routeId}`, {
    method: 'PATCH', token: adminToken,
    body: { priceMin: 4800, distanceKm: 250, description: 'Modifié.' },
  });
  ok('PATCH /routes/:id', updated.status, 200, updated.data?.data?.priceMin || '');
  ok('PATCH persiste', updated.data?.data?.priceMin === 4800 && updated.data?.data?.distanceKm === 250 ? 200 : 500, 200);

  const codeConflict = await call(`/routes/${routeId}`, {
    method: 'PATCH', token: adminToken, body: { code: `RT-${UNIQUE.slice(-4)}-2` },
  });
  ok('PATCH /routes/:id code pris -> 409', codeConflict.status, 409);

  /* ── 8. Statuts ─────────────────────────────────────────────────── */
  const setInactive = await call(`/routes/${routeId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'inactive', raison: 'test' },
  });
  ok('PATCH /routes/:id/status inactive', setInactive.status, 200);

  const badStatus = await call(`/routes/${routeId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'inconnu' },
  });
  ok('PATCH /routes/:id/status invalide -> 400', badStatus.status, 400);

  await call(`/routes/${routeId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'active' },
  });

  /* ── 9. Escales ─────────────────────────────────────────────────── */
  const addStop = await call(`/routes/${routeId}/stops`, {
    method: 'POST', token: adminToken,
    body: { villeId: 'EDE', ordre: 1, heureEstimee: '10:00', dureeArret: 15, description: 'Halte Edéa' },
  });
  ok('POST /routes/:id/stops', addStop.status, 201, `count=${addStop.data?.data?.length}`);
  stopId = addStop.data?.data?.[0]?.id;
  ok('Escale ville résolue', addStop.data?.data?.[0]?.city?.id === 'EDE' ? 200 : 500, 200);

  const addStop2 = await call(`/routes/${routeId}/stops`, {
    method: 'POST', token: adminToken,
    body: { villeId: 'NKO', ordre: 2, dureeArret: 10 },
  });
  ok('POST /routes/:id/stops (2e)', addStop2.status, 201);

  const stopAsDepart = await call(`/routes/${routeId}/stops`, {
    method: 'POST', token: adminToken, body: { villeId: 'DLA' },
  });
  ok('POST /routes/:id/stops ville = départ -> 400', stopAsDepart.status, 400);

  const dupOrder = await call(`/routes/${routeId}/stops`, {
    method: 'POST', token: adminToken, body: { villeId: 'BFS', ordre: 1 },
  });
  ok('POST /routes/:id/stops ordre dupliqué -> 409', dupOrder.status, 409);

  const autoOrder = await call(`/routes/${routeId}/stops`, {
    method: 'POST', token: adminToken, body: { villeId: 'KRI' },
  });
  ok('POST /routes/:id/stops ordre auto (3)', autoOrder.status, 201,
    autoOrder.data?.data?.find((s) => s.villeId === 'KRI')?.ordre === 3 ? 'OK' : 'ordre?');

  const stopList = await call(`/routes/${routeId}/stops`, { token: adminToken });
  ok('GET /routes/:id/stops', stopList.status, 200, `count=${stopList.data?.data?.length}`);
  ok('Escales triées par ordre', stopList.data?.data?.every((s, i) => i === 0 || stopList.data?.data?.[i - 1]?.ordre <= s.ordre) ? 200 : 500, 200);

  const updateStop = await call(`/routes/${routeId}/stops/${stopId}`, {
    method: 'PATCH', token: adminToken, body: { dureeArret: 20, description: 'Halte longue' },
  });
  ok('PATCH /routes/:id/stops/:stopId', updateStop.status, 200,
    updateStop.data?.data?.find((s) => s.id === stopId)?.dureeArret === 20 ? 'OK' : '');

  const badStopRoute = await call(`/routes/${route2Id}/stops/${stopId}`, {
    method: 'PATCH', token: adminToken, body: { description: 'x' },
  });
  ok('PATCH escale sur autre itinéraire -> 404', badStopRoute.status, 404);

  const delStop = await call(`/routes/${routeId}/stops/${stopId}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /routes/:id/stops/:stopId', delStop.status, 200);
  const remaining = await call(`/routes/${routeId}/stops`, { token: adminToken });
  ok('Escales renumérotées après suppression', remaining.data?.data?.map((s) => s.ordre).join(',') === '1,2' ? 200 : 500, 200);

  /* ── 10. Calculs ────────────────────────────────────────────────── */
  const calculs = await call(`/routes/${routeId}/calculs`, { token: adminToken });
  ok('GET /routes/:id/calculs', calculs.status, 200);
  ok('Calculs : nombre d\'escales', calculs.data?.data?.stopCount === 2 && calculs.data?.data?.stops?.length === 2 ? 200 : 500, 200);
  ok('Calculs : distance', calculs.data?.data?.distanceKm === 250 ? 200 : 500, 200);
  ok('Calculs : durée base (270 min)', calculs.data?.data?.durationBaseMinutes === 270 ? 200 : 500, 200);
  ok('Calculs : durée arrêts (10 min)', calculs.data?.data?.stopsMinutes === 10 ? 200 : 500, 200);
  ok('Calculs : durée totale (280 min)', calculs.data?.data?.totalMinutes === 280 ? 200 : 500, 200);
  ok('Calculs : durée estimée formatée', calculs.data?.data?.estimatedDuration === '04:40' ? 200 : 500, 200);

  const calculsDepart = await call(`/routes/${routeId}/calculs?heureDepart=08:00`, { token: adminToken });
  ok('GET /routes/:id/calculs avec heure départ', calculsDepart.status, 200);
  ok('Heure arrivée estimée 12:40', calculsDepart.data?.data?.estimatedArrival === '12:40' ? 200 : 500, 200, calculsDepart.data?.data?.estimatedArrival || '');

  const badHeure = await call(`/routes/${routeId}/calculs?heureDepart=25:00`, { token: adminToken });
  ok('GET /routes/:id/calculs heure invalide -> 400', badHeure.status, 400);

  /* ── 11. KPIs ───────────────────────────────────────────────────── */
  const stats = await call('/routes/stats', { token: adminToken });
  ok('GET /routes/stats', stats.status, 200, `total=${stats.data?.data?.total}`);
  ok('Stats total >= 2', stats.data?.data?.total >= 2 ? 200 : 500, 200);
  ok('Stats actifs >= 1', stats.data?.data?.actifs >= 1 ? 200 : 500, 200);
  ok('Stats distance totale', typeof stats.data?.data?.totalDistanceKm === 'number' ? 200 : 500, 200);
  ok('Stats villes desservies', stats.data?.data?.villesDesservies >= 3 ? 200 : 500, 200);

  /* ── 12. Permissions : counter_agent -> 403 ─────────────────────── */
  const cLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'counter@bustixconnect.com', motDePasse: 'Counter@123' },
  });
  ok('Login counter_agent', cLogin.status, 200);
  const counterToken = cLogin.data?.data?.token;
  const forbidden = await call('/routes', { token: counterToken });
  ok('Counter : GET /routes -> 403', forbidden.status, 403);

  /* ── 13. Permissions : company_admin (périmètre compagnie) ──────── */
  const caLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'company@bustixconnect.com', motDePasse: 'Company@123' },
  });
  ok('Login company_admin', caLogin.status, 200);
  const companyToken = caLogin.data?.data?.token;

  const caCreate = await call('/routes', {
    method: 'POST', token: companyToken,
    body: {
      name: `Douala → Bafoussam CA ${UNIQUE.slice(-4)}`,
      code: `RT-CA-${UNIQUE.slice(-4)}`,
      departureCityId: 'DLA',
      arrivalCityId: 'BFS',
      distanceKm: 270,
      duration: '4h00',
      priceMin: 5000,
      priceMax: 6500,
    },
  });
  ok('Company : POST /routes', caCreate.status, 201, caCreate.data?.data?.id || '');
  const caRouteId = caCreate.data?.data?.id;
  ok('Company : itinéraire auto-lié à C001', caCreate.data?.data?.companyId === 'C001' ? 200 : 500, 200);
  ok('Company : ne peut pas imposer une autre compagnie', caCreate.data?.data?.company?.id === 'C001' ? 200 : 500, 200);

  const caSeeOther = await call(`/routes/${routeId}`, { token: companyToken });
  ok('Company : voir itinéraire hors périmètre -> 403', caSeeOther.status, 403);

  const caEditOther = await call(`/routes/${routeId}`, {
    method: 'PATCH', token: companyToken, body: { priceMin: 1 },
  });
  ok('Company : éditer itinéraire hors périmètre -> 403', caEditOther.status, 403);

  const caList = await call('/routes', { token: companyToken });
  ok('Company : GET /routes (périmètre C001)', caList.status, 200, `total=${caList.data?.data?.total}`);
  ok('Company : ne voit que ses itinéraires', caList.data?.data?.items?.every((r) => r.companyId === 'C001') ? 200 : 500, 200);

  const caStats = await call('/routes/stats', { token: companyToken });
  ok('Company : GET /routes/stats (périmètre)', caStats.status, 200, `total=${caStats.data?.data?.total}`);

  const caAddStop = await call(`/routes/${caRouteId}/stops`, {
    method: 'POST', token: companyToken, body: { villeId: 'EDE' },
  });
  ok('Company : POST /routes/:id/stops (son itinéraire)', caAddStop.status, 201);

  /* ── 14. Suppression (archivage) ────────────────────────────────── */
  const del = await call(`/routes/${route2Id}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /routes/:id', del.status, 200);
  const deletedDb = await db.Trajet.findByPk(route2Id);
  ok('Itinéraire archivé (soft)', deletedDb?.statut === 'archived' ? 200 : 500, 200);

  /* ── Nettoyage direct (hard delete des données de test) ─────────── */
  const testRouteIds = [routeId, route2Id, caRouteId].filter(Boolean);
  if (testRouteIds.length) {
    await db.Escale.destroy({ where: { trajet_id: testRouteIds } });
    await db.Depart.destroy({ where: { trajet_id: testRouteIds } });
    await db.Trajet.destroy({ where: { id: testRouteIds } });
  }
  if (testVilleId) await db.Ville.destroy({ where: { id: testVilleId } });
  await db.Ville.update({ statut: 'active' }, { where: { id: ['YDE', 'BFS', 'DLA'] } });
  if (companyId) {
    await db.Agence.destroy({ where: { compagnie_id: companyId } });
    await db.AbonnementCompagnie.destroy({ where: { compagnie_id: companyId } });
    await db.Compagnie.destroy({ where: { id: companyId } });
  }

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS ROUTES ═══════');
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
