/* =====================================================================
   Tests d'intégration du module BUSES (backend local http://localhost:5000)
   Exécution : node scripts/test_buses.js
   Nécessite : serveur démarré (module buses chargé) + migration appliquée.
   Couvre : CRUD, statuts, plan de sièges, maintenances, photos, KPIs,
            pagination, filtres, recherche, permissions, sécurité.
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

/* Upload multipart (photo de bus) */
const callUpload = async (path, { buffer, filename = 'bus.png', mimetype = 'image/png', token } = {}) => {
  const fd = new FormData();
  fd.append('photo', new Blob([buffer], { type: mimetype }), filename);
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  let data = null;
  try { data = await res.json(); } catch (_) { /* no body */ }
  return { status: res.status, data };
};

/* Mini PNG 1x1 valide (base64) */
const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

const hasSensitive = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  for (const key of Object.keys(obj)) {
    if (/password|passwd|hash|secret|refreshToken/i.test(key)) return true;
    if (typeof obj[key] === 'object' && hasSensitive(obj[key])) return true;
  }
  return false;
};

const UNIQUE = Date.now().toString(36).toUpperCase();
const COMPANY = {
  nom: `Buses Test ${UNIQUE}`,
  email: `buses_${UNIQUE}@example.com`,
  plan: 'standard',
};
const NEW_BUS = {
  plate: `LT-${UNIQUE.slice(-4)}-AZ`,
  internalNumber: `GE-${UNIQUE.slice(-4)}`,
  brand: 'mercedes',
  model: 'Tourismo',
  year: 2024,
  seats: 45,
  type: 'vip',
  class: 'first',
  status: 'available',
  fuelType: 'diesel',
  color: '#0B1D51',
  notes: 'Bus de test du module Buses.',
  serviceDate: '2025-01-10',
  mileage: 12000,
  amenities: { climatisation: true, wifi: true, usb: true, toilette: false, tv: true },
};

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  let companyId = null;
  let busId = null;
  let bus2Id = null;
  let maintenanceId = null;
  let imageId = null;

  /* ── 1. Connexion admin (super_admin) ───────────────────────────── */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login super admin', login.status, 200, login.data?.data?.user?.role || '');
  const adminToken = login.data?.data?.token;

  /* ── 2. Compagnie de test (isolée) ──────────────────────────────── */
  const company = await call('/companies', { method: 'POST', token: adminToken, body: COMPANY });
  ok('POST /companies (compagnie de test)', company.status, 201);
  companyId = company.data?.data?.id;

  /* ── 3. Liste + pagination + auth ───────────────────────────────── */
  const list = await call('/buses?page=1&limit=2&sort=newest', { token: adminToken });
  ok('GET /buses paginé (limit=2)', list.status, 200, `total=${list.data?.data?.total}`);
  ok('GET /buses limit respecté', list.data?.data?.items?.length <= 2 ? 200 : 500, 200);

  const noAuth = await call('/buses');
  ok('GET /buses sans token -> 401', noAuth.status, 401);

  const invalidLimit = await call('/buses?limit=999', { token: adminToken });
  ok('GET /buses limit invalide -> 400', invalidLimit.status, 400);

  /* ── 4. Création d'un bus ───────────────────────────────────────── */
  const created = await call('/buses', {
    method: 'POST', token: adminToken, body: { ...NEW_BUS, compagnieId: companyId },
  });
  ok('POST /buses (création)', created.status, 201, created.data?.data?.plate || '');
  ok('Bus créé sans secret', hasSensitive(created.data?.data) ? 500 : 200, 200);
  busId = created.data?.data?.id;
  ok('ID bus format BS########', /^BS\d{8}$/.test(busId || '') ? 200 : 500, 200, busId || '');
  ok('Bus rattaché à la bonne compagnie', created.data?.data?.compagnieId === companyId ? 200 : 500, 200);
  ok('Plan de sièges auto-généré', created.data?.data?.seatLayout?.rows >= 1 ? 200 : 500, 200,
    JSON.stringify(created.data?.data?.seatLayout) || '');
  ok('Bus équipements stockés', created.data?.data?.amenities?.climatisation === true ? 200 : 500, 200);
  ok('Bus chauffeur null par défaut', created.data?.data?.currentDriver === null ? 200 : 500, 200);
  ok('Bus stats initiaux', created.data?.data?.stats?.tripCount === 0 && created.data?.data?.stats?.totalKm === 12000 ? 200 : 500, 200);

  const createdDb = await db.Bus.findByPk(busId);
  ok('Bus en base (statut available)', createdDb?.statut === 'available' ? 200 : 500, 200);
  const layoutDb = await db.BusSeatLayout.findOne({ where: { bus_id: busId } });
  ok('BusSeatLayout en base', layoutDb ? 200 : 500, 200);

  const duplicate = await call('/buses', {
    method: 'POST', token: adminToken, body: { ...NEW_BUS, compagnieId: companyId },
  });
  ok('POST /buses immatriculation dupliquée -> 409', duplicate.status, 409);

  const badCreate = await call('/buses', {
    method: 'POST', token: adminToken, body: { plate: '', seats: 2 },
  });
  ok('POST /buses données invalides -> 400', badCreate.status, 400);

  const second = await call('/buses', {
    method: 'POST', token: adminToken,
    body: {
      ...NEW_BUS, compagnieId: companyId, plate: `LT-${UNIQUE.slice(-4)}-BY`,
      internalNumber: `GE-${UNIQUE.slice(-4)}-B`, type: 'standard', class: 'economy',
      seats: 50, status: 'maintenance', amenities: { climatisation: true, wifi: false },
    },
  });
  ok('POST /buses (2e)', second.status, 201);
  bus2Id = second.data?.data?.id;

  /* ── 5. Recherche + filtres ─────────────────────────────────────── */
  const search = await call(`/buses?recherche=${encodeURIComponent(UNIQUE)}`, { token: adminToken });
  ok('GET /buses recherche', search.status, 200, `trouvé=${search.data?.data?.total}`);

  const typeFilter = await call('/buses?type=vip', { token: adminToken });
  ok('GET /buses filtre type', typeFilter.status, 200, `total=${typeFilter.data?.data?.total}`);

  const statutFilter = await call('/buses?statut=maintenance', { token: adminToken });
  ok('GET /buses filtre statut', statutFilter.status, 200, `total=${statutFilter.data?.data?.total}`);

  const classFilter = await call('/buses?classe=first', { token: adminToken });
  ok('GET /buses filtre classe', classFilter.status, 200, `total=${classFilter.data?.data?.total}`);

  const seatsFilter = await call('/buses?seatsMin=46&seatsMax=55', { token: adminToken });
  ok('GET /buses filtre places', seatsFilter.status, 200, `total=${seatsFilter.data?.data?.total}`);

  const climFilter = await call('/buses?climatisation=true', { token: adminToken });
  ok('GET /buses filtre clim', climFilter.status, 200, `total=${climFilter.data?.data?.total}`);

  /* ── 6. Détail + édition ────────────────────────────────────────── */
  const detail = await call(`/buses/${busId}`, { token: adminToken });
  ok('GET /buses/:id', detail.status, 200, detail.data?.data?.companyName || '');
  ok('Détail avec maintenances/images', Array.isArray(detail.data?.data?.maintenances) && Array.isArray(detail.data?.data?.images) ? 200 : 500, 200);

  const updated = await call(`/buses/${busId}`, {
    method: 'PATCH', token: adminToken,
    body: { notes: 'Notes éditées', status: 'on_trip' },
  });
  ok('PATCH /buses/:id', updated.status, 200, updated.data?.data?.status || '');
  ok('PATCH persiste en base', updated.data?.data?.notes === 'Notes éditées' && updated.data?.data?.status === 'on_trip' ? 200 : 500, 200);

  const notFound = await call('/buses/BS00000000', { token: adminToken });
  ok('GET /buses/:id inconnu -> 404', notFound.status, 404);

  /* ── 7. Statuts ─────────────────────────────────────────────────── */
  const setMaint = await call(`/buses/${busId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'maintenance', raison: 'test' },
  });
  ok('PATCH /buses/:id/status maintenance', setMaint.status, 200);
  const maintDb = await db.Bus.findByPk(busId);
  ok('Statut maintenance en base', maintDb?.statut === 'maintenance' ? 200 : 500, 200);

  const badStatus = await call(`/buses/${busId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'inconnu' },
  });
  ok('PATCH /buses/:id/status invalide -> 400', badStatus.status, 400);

  /* ── 8. Plan de sièges ──────────────────────────────────────────── */
  const layout = await call(`/buses/${busId}/seat-layout`, { token: adminToken });
  ok('GET /buses/:id/seat-layout', layout.status, 200, `rows=${layout.data?.data?.rows}`);

  const saveLayout = await call(`/buses/${busId}/seat-layout`, {
    method: 'PUT', token: adminToken,
    body: { rows: 12, seatsPerSide: 2, aisleAfter: [6], vipRows: [1, 2], pmrSeats: [24] },
  });
  ok('PUT /buses/:id/seat-layout', saveLayout.status, 200);
  ok('Plan de sièges sauvegardé', saveLayout.data?.data?.rows === 12 && saveLayout.data?.data?.vipRows?.length === 2 ? 200 : 500, 200);

  const badLayout = await call(`/buses/${busId}/seat-layout`, {
    method: 'PUT', token: adminToken, body: { rows: 0, seatsPerSide: 2 },
  });
  ok('PUT /buses/:id/seat-layout invalide -> 400', badLayout.status, 400);

  /* ── 9. Maintenances ────────────────────────────────────────────── */
  const maintList = await call(`/buses/${busId}/maintenance`, { token: adminToken });
  ok('GET /buses/:id/maintenance (vide)', maintList.status, 200, `count=${maintList.data?.data?.length}`);

  const createMaint = await call(`/buses/${busId}/maintenance`, {
    method: 'POST', token: adminToken,
    body: { type: 'revision', date: '2026-08-10', mileage: 12500, cost: 350000, provider: 'Garage Central', status: 'planifiee', notes: 'Révision complète.' },
  });
  ok('POST /buses/:id/maintenance', createMaint.status, 201, createMaint.data?.data?.id || '');
  maintenanceId = createMaint.data?.data?.id;
  ok('Maintenance sans secret', hasSensitive(createMaint.data?.data) ? 500 : 200, 200);

  const createMaintBad = await call(`/buses/${busId}/maintenance`, {
    method: 'POST', token: adminToken, body: { type: 'x', date: 'bad' },
  });
  ok('POST maintenance invalide -> 400', createMaintBad.status, 400);

  const completeMaint = await call(`/buses/maintenance/${maintenanceId}`, {
    method: 'PATCH', token: adminToken,
    body: { status: 'terminee', completedDate: '2026-08-12' },
  });
  ok('PATCH /buses/maintenance/:id terminer', completeMaint.status, 200);
  const maintDone = await db.BusMaintenance.findByPk(maintenanceId);
  ok('Maintenance terminée en base', maintDone?.status === 'terminee' ? 200 : 500, 200);
  const busAfterMaint = await db.Bus.findByPk(busId);
  ok('Dates maintenance mises à jour sur le bus', busAfterMaint?.dernier_maintenance === '2026-08-12' ? 200 : 500, 200);
  ok('Bus passé en maintenance', busAfterMaint?.statut === 'maintenance' ? 200 : 500, 200);

  const delMaint = await call(`/buses/maintenance/${maintenanceId}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /buses/maintenance/:id', delMaint.status, 200);
  const maintGone = await db.BusMaintenance.findByPk(maintenanceId);
  ok('Maintenance supprimée de la base', !maintGone ? 200 : 500, 200);

  /* ── 10. Photos ─────────────────────────────────────────────────── */
  const photo = await callUpload(`/buses/${busId}/photo`, { buffer: PNG_1PX, token: adminToken });
  ok('POST /buses/:id/photo (upload)', photo.status, 201, photo.data?.data?.url || '');
  ok('Photo URL valide', /^\/uploads\/buses\/.+\.webp$/.test(photo.data?.data?.url || '') ? 200 : 500, 200);
  imageId = photo.data?.data?.id;
  ok('Bus photoUrl mis à jour', photo.data?.data?.photoUrl === photo.data?.data?.url ? 200 : 500, 200);

  const delPhoto = await call(`/buses/${busId}/photo`, { method: 'DELETE', token: adminToken });
  ok('DELETE /buses/:id/photo', delPhoto.status, 200);
  const busNoPhoto = await db.Bus.findByPk(busId);
  ok('Bus photoUrl nettoyé', busNoPhoto?.photo_url == null ? 200 : 500, 200);

  /* ── 11. KPIs ───────────────────────────────────────────────────── */
  const stats = await call('/buses/stats', { token: adminToken });
  ok('GET /buses/stats', stats.status, 200, `total=${stats.data?.data?.total}`);
  ok('Stats par statut', stats.data?.data?.parStatut?.maintenance >= 1 ? 200 : 500, 200);
  ok('Stats par type', stats.data?.data?.parType?.vip >= 1 ? 200 : 500, 200);
  ok('Stats totaux', stats.data?.data?.totaux?.totalSeats >= 95 ? 200 : 500, 200);

  /* ── 12. Permissions : counter_agent -> 403 ─────────────────────── */
  const cLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'counter@bustixconnect.com', motDePasse: 'Counter@123' },
  });
  ok('Login counter_agent', cLogin.status, 200);
  const counterToken = cLogin.data?.data?.token;
  const forbidden = await call('/buses', { token: counterToken });
  ok('Counter : GET /buses -> 403', forbidden.status, 403);

  /* ── 13. Permissions : company_admin (périmètre compagnie) ──────── */
  const caLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'company@bustixconnect.com', motDePasse: 'Company@123' },
  });
  ok('Login company_admin', caLogin.status, 200);
  const companyToken = caLogin.data?.data?.token;

  const caList = await call('/buses', { token: companyToken });
  ok('Company : GET /buses (périmètre)', caList.status, 200, `total=${caList.data?.data?.total}`);

  const caSeeOther = await call(`/buses/${busId}`, { token: companyToken });
  ok('Company : voir un bus hors périmètre -> 403', caSeeOther.status, 403);

  const caCreate = await call('/buses', {
    method: 'POST', token: companyToken,
    body: { plate: `LT-${UNIQUE.slice(-4)}-CA`, internalNumber: `GE-${UNIQUE.slice(-4)}-CA`, model: 'Coaster', seats: 18, type: 'minibus', class: 'mixed' },
  });
  ok('Company : POST /buses (lié à sa compagnie)', caCreate.status, 201,
    `compagnieId=${caCreate.data?.data?.compagnieId}`);
  ok('Company : bus auto-lié à sa compagnie (C001)', caCreate.data?.data?.compagnieId === 'C001' ? 200 : 500, 200);
  const caBusId = caCreate.data?.data?.id;

  const caForbiddenCreate = await call('/buses', {
    method: 'POST', token: companyToken,
    body: { plate: `LT-${UNIQUE.slice(-4)}-ZZ`, model: 'Bus', seats: 30, compagnieId: companyId },
  });
  ok('Company : compagnieId client ignoré (lié à sa compagnie)', caForbiddenCreate.status, 201);
  ok('Company : bus lié à sa compagnie (C001)', caForbiddenCreate.data?.data?.compagnieId === 'C001' ? 200 : 500, 200);
  const caForbiddenId = caForbiddenCreate.data?.data?.id;

  const caStatus = await call(`/buses/${busId}/status`, {
    method: 'PATCH', token: companyToken, body: { statut: 'out_of_service' },
  });
  ok('Company : statut hors périmètre -> 403', caStatus.status, 403);

  /* ── 14. Suppression (soft) ─────────────────────────────────────── */
  const del = await call(`/buses/${busId}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /buses/:id', del.status, 200);
  const deletedDb = await db.Bus.findByPk(busId);
  ok('Bus en statut inactive (soft)', deletedDb?.statut === 'inactive' ? 200 : 500, 200);

  /* ── Nettoyage direct (hard delete des données de test) ─────────── */
  const testBusIds = [busId, bus2Id, caBusId, caForbiddenId].filter(Boolean);
  if (testBusIds.length) {
    await db.BusMaintenance.destroy({ where: { bus_id: testBusIds } });
    await db.BusSeatLayout.destroy({ where: { bus_id: testBusIds } });
    await db.BusImage.destroy({ where: { bus_id: testBusIds } });
    await db.Bus.destroy({ where: { id: testBusIds } });
  }
  if (companyId) {
    await db.Agence.destroy({ where: { compagnie_id: companyId } });
    await db.AbonnementCompagnie.destroy({ where: { compagnie_id: companyId } });
    await db.Compagnie.destroy({ where: { id: companyId } });
  }

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS BUSES ═══════');
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
