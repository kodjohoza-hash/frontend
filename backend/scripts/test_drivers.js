/* =====================================================================
   Tests d'intégration du module DRIVERS (backend local http://localhost:5000)
   Exécution : node scripts/test_drivers.js
   Nécessite : serveur démarré (module drivers chargé) + migration appliquée.
   Couvre : CRUD, statuts, disponibilité, voyages, affectations, incidents,
            documents, photos, KPIs, pagination, filtres, recherche,
            permissions, sécurité.
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

/* Upload multipart (photo ou document de chauffeur) */
const callUpload = async (path, { field = 'photo', buffer, filename = 'photo.png', mimetype = 'image/png', token } = {}) => {
  const fd = new FormData();
  fd.append(field, new Blob([buffer], { type: mimetype }), filename);
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

/* Mini PDF valide */
const PDF_1PG = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\nxref\n0 4\ntrailer<</Size 4/Root 1 0 R>>\n%%EOF\n'
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

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  let companyId = null;
  let agenceId = null;
  let busId = null;
  let driverId = null;
  let driver2Id = null;
  let incidentId = null;
  let documentId = null;

  /* ── 1. Connexion admin (super_admin) ───────────────────────────── */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login super admin', login.status, 200, login.data?.data?.user?.role || '');
  const adminToken = login.data?.data?.token;

  /* ── 2. Compagnie + agence + bus de test (isolés) ───────────────── */
  const company = await call('/companies', {
    method: 'POST', token: adminToken,
    body: { nom: `Drivers Test ${UNIQUE}`, email: `drivers_${UNIQUE}@example.com`, plan: 'standard' },
  });
  ok('POST /companies (compagnie de test)', company.status, 201);
  companyId = company.data?.data?.id;

  const agence = await call('/agencies', {
    method: 'POST', token: adminToken,
    body: { nom: `Agence Drivers ${UNIQUE}`, villeId: 'DLA', compagnieId: companyId, adresse: 'Test' },
  });
  ok('POST /agencies (agence de test)', agence.status, 201);
  agenceId = agence.data?.data?.id;

  const bus = await call('/buses', {
    method: 'POST', token: adminToken,
    body: {
      plate: `DR-${UNIQUE.slice(-4)}-AZ`, internalNumber: `DRV-${UNIQUE.slice(-4)}`,
      model: 'Tourismo', seats: 45, type: 'vip', class: 'first', compagnieId: companyId,
    },
  });
  ok('POST /buses (bus de test)', bus.status, 201);
  busId = bus.data?.data?.id;

  /* ── 3. Liste + auth + validation ───────────────────────────────── */
  const noAuth = await call('/drivers');
  ok('GET /drivers sans token -> 401', noAuth.status, 401);

  const invalidLimit = await call('/drivers?limit=999', { token: adminToken });
  ok('GET /drivers limit invalide -> 400', invalidLimit.status, 400);

  /* ── 4. Création ────────────────────────────────────────────────── */
  const NEW_DRIVER = {
    firstName: `Alpha ${UNIQUE.slice(-4)}`,
    lastName: 'Test',
    phone: `6${UNIQUE.slice(-7)}`,
    email: `driver1_${UNIQUE}@example.com`,
    dateOfBirth: '1992-04-15',
    gender: 'M',
    address: '12 Rue des Tests',
    nationality: 'Camerounaise',
    city: 'Douala',
    country: 'Cameroun',
    licenseNumber: `PER-${UNIQUE.slice(-6)}`,
    licenseCategory: 'D',
    licenseObtained: '2015-01-10',
    licenseExpiry: '2029-01-10',
    experience: 9,
    hireDate: '2023-03-01',
    status: 'available',
    observations: 'Chauffeur de test.',
    agenceId,
    assignedBusId: busId,
  };

  const created = await call('/drivers', { method: 'POST', token: adminToken, body: NEW_DRIVER });
  ok('POST /drivers (création)', created.status, 201, created.data?.data?.id || '');
  ok('Chauffeur sans secret', hasSensitive(created.data?.data) ? 500 : 200, 200);
  driverId = created.data?.data?.id;
  ok('ID chauffeur format DRV########', /^DRV\d{7}$/.test(driverId || '') ? 200 : 500, 200, driverId || '');
  ok('Matricule généré', /^CHF-[A-F0-9]{8}$/.test(created.data?.data?.matricule || '') ? 200 : 500, 200, created.data?.data?.matricule || '');
  ok('Agence/compagnie résolues', created.data?.data?.agenceId === agenceId && created.data?.data?.companyName ? 200 : 500, 200);
  ok('Bus affecté', created.data?.data?.assignedBus === busId ? 200 : 500, 200);
  ok('Profil permis stocké', created.data?.data?.licenseCategory === 'D' && created.data?.data?.licenseNumber === NEW_DRIVER.licenseNumber ? 200 : 500, 200);
  ok('Performance initiale', created.data?.data?.performance?.yearsService >= 2 && created.data?.data?.performance?.totalTrips === 0 ? 200 : 500, 200);

  const createdDb = await db.Agent.findByPk(driverId);
  ok('Agent en base (role chauffeur)', createdDb?.role === 'chauffeur' ? 200 : 500, 200);
  const profileDb = await db.Chauffeur.findOne({ where: { agent_id: driverId } });
  ok('Profil chauffeur en base', profileDb?.statut === 'available' ? 200 : 500, 200);
  const affDb = await db.ChauffeurAffectation.findOne({ where: { chauffeur_id: driverId, date_fin: null } });
  ok('Affectation bus ouverte en base', affDb?.bus_id === busId ? 200 : 500, 200);
  const busDb = await db.Bus.findByPk(busId);
  ok('Bus lié au chauffeur', busDb?.chauffeur_id === driverId ? 200 : 500, 200);

  const duplicate = await call('/drivers', { method: 'POST', token: adminToken, body: NEW_DRIVER });
  ok('POST /drivers email dupliqué -> 409', duplicate.status, 409);

  const dupPermis = await call('/drivers', {
    method: 'POST', token: adminToken,
    body: { ...NEW_DRIVER, email: `driver1b_${UNIQUE}@example.com` },
  });
  ok('POST /drivers permis dupliqué -> 409', dupPermis.status, 409);

  const badCreate = await call('/drivers', { method: 'POST', token: adminToken, body: { firstName: '', lastName: '' } });
  ok('POST /drivers données invalides -> 400', badCreate.status, 400);

  const badAgence = await call('/drivers', {
    method: 'POST', token: adminToken,
    body: { ...NEW_DRIVER, email: `driver1c_${UNIQUE}@example.com`, agenceId: 'AG00000000' },
  });
  ok('POST /drivers agence inconnue -> 400', badAgence.status, 400);

  const second = await call('/drivers', {
    method: 'POST', token: adminToken,
    body: {
      ...NEW_DRIVER,
      email: `driver2_${UNIQUE}@example.com`,
      licenseNumber: `PER-${UNIQUE.slice(-6)}-B`,
      licenseCategory: 'B',
      experience: 3,
      status: 'on_leave',
      assignedBusId: '',
      phone: `6${UNIQUE.slice(-8)}`,
    },
  });
  ok('POST /drivers (2e)', second.status, 201);
  driver2Id = second.data?.data?.id;

  /* ── 5. Recherche + filtres ─────────────────────────────────────── */
  const search = await call(`/drivers?recherche=${encodeURIComponent(UNIQUE.slice(-4))}`, { token: adminToken });
  ok('GET /drivers recherche', search.status, 200, `trouvé=${search.data?.data?.total}`);

  const statutFilter = await call('/drivers?statut=on_leave', { token: adminToken });
  ok('GET /drivers filtre statut', statutFilter.status, 200, `total=${statutFilter.data?.data?.total}`);
  ok('Filtre statut respecté', statutFilter.data?.data?.items?.every((d) => d.status === 'on_leave') ? 200 : 500, 200);

  const permisFilter = await call('/drivers?permisCategorie=D', { token: adminToken });
  ok('GET /drivers filtre permis D', permisFilter.status, 200, `total=${permisFilter.data?.data?.total}`);

  const availableFilter = await call('/drivers?available=yes', { token: adminToken });
  ok('GET /drivers filtre available', availableFilter.status, 200, `total=${availableFilter.data?.data?.total}`);

  const assignedFilter = await call('/drivers?assignedBus=yes', { token: adminToken });
  ok('GET /drivers filtre assignedBus', assignedFilter.status, 200, `total=${assignedFilter.data?.data?.total}`);
  ok('Filtre assignedBus respecté', assignedFilter.data?.data?.items?.every((d) => d.assignedBus) ? 200 : 500, 200);

  const expFilter = await call('/drivers?experienceMin=5', { token: adminToken });
  ok('GET /drivers filtre expérience', expFilter.status, 200, `total=${expFilter.data?.data?.total}`);

  const agenceFilter = await call(`/drivers?agenceId=${agenceId}`, { token: adminToken });
  ok('GET /drivers filtre agence', agenceFilter.status, 200, `total=${agenceFilter.data?.data?.total}`);

  const sorted = await call('/drivers?sort=experience_desc&limit=2', { token: adminToken });
  ok('GET /drivers tri expérience desc', sorted.status, 200,
    sorted.data?.data?.items?.[0]?.experience >= sorted.data?.data?.items?.[1]?.experience ? 'OK' : 'tri?' );

  const paginated = await call('/drivers?page=1&limit=1', { token: adminToken });
  ok('GET /drivers pagination (limit=1)', paginated.status, 200, `total=${paginated.data?.data?.total}`);
  ok('GET /drivers limit respecté', paginated.data?.data?.items?.length <= 1 ? 200 : 500, 200);

  /* ── 6. Détail + édition ────────────────────────────────────────── */
  const detail = await call(`/drivers/${driverId}`, { token: adminToken });
  ok('GET /drivers/:id', detail.status, 200, detail.data?.data?.matricule || '');
  ok('Détail avec arrays', Array.isArray(detail.data?.data?.voyages) && Array.isArray(detail.data?.data?.incidents) && Array.isArray(detail.data?.data?.documents) && Array.isArray(detail.data?.data?.affectations) ? 200 : 500, 200);
  ok('Affectation historique présente', detail.data?.data?.affectations?.length >= 1 ? 200 : 500, 200);

  const notFound = await call('/drivers/DRV0000000', { token: adminToken });
  ok('GET /drivers/:id inconnu -> 404', notFound.status, 404);

  const updated = await call(`/drivers/${driverId}`, {
    method: 'PATCH', token: adminToken,
    body: { observations: 'Observations éditées.', experience: 10, city: 'Yaoundé' },
  });
  ok('PATCH /drivers/:id', updated.status, 200, updated.data?.data?.city || '');
  ok('PATCH persiste en base', updated.data?.data?.observations === 'Observations éditées.' && updated.data?.data?.city === 'Yaoundé' ? 200 : 500, 200);

  const emailConflict = await call(`/drivers/${driverId}`, {
    method: 'PATCH', token: adminToken, body: { email: `driver2_${UNIQUE}@example.com` },
  });
  ok('PATCH /drivers/:id email pris -> 409', emailConflict.status, 409);

  const reassign = await call(`/drivers/${driver2Id}`, {
    method: 'PATCH', token: adminToken, body: { assignedBusId: busId },
  });
  ok('PATCH /drivers/:id affectation bus (transfert)', reassign.status, 200,
    reassign.data?.data?.assignedBus === busId ? 'OK' : '');
  ok('Chauffeur 1 libéré du bus', (await call(`/drivers/${driverId}`, { token: adminToken })).data?.data?.assignedBus === null ? 200 : 500, 200);

  /* ── 7. Statuts ─────────────────────────────────────────────────── */
  const setLeave = await call(`/drivers/${driverId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'on_leave', raison: 'test' },
  });
  ok('PATCH /drivers/:id/status on_leave', setLeave.status, 200);

  const badStatus = await call(`/drivers/${driverId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'inconnu' },
  });
  ok('PATCH /drivers/:id/status invalide -> 400', badStatus.status, 400);

  await call(`/drivers/${driverId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'available' },
  });

  /* ── 8. Disponibilité ───────────────────────────────────────────── */
  const avail = await call(`/drivers/${driverId}/availability`, { token: adminToken });
  ok('GET /drivers/:id/availability', avail.status, 200,
    `status=${avail.data?.data?.status}`);
  ok('Chauffeur disponible', avail.data?.data?.available === true && avail.data?.data?.status === 'available' ? 200 : 500, 200);

  /* ── 9. Voyages / affectations ──────────────────────────────────── */
  const voyages = await call(`/drivers/${driverId}/voyages`, { token: adminToken });
  ok('GET /drivers/:id/voyages (vide)', voyages.status, 200, `count=${voyages.data?.data?.length}`);

  const affectations = await call(`/drivers/${driverId}/affectations`, { token: adminToken });
  ok('GET /drivers/:id/affectations', affectations.status, 200, `count=${affectations.data?.data?.length}`);

  /* ── 10. Affectation voyage ─────────────────────────────────────── */
  const assignFake = await call(`/drivers/${driverId}/trip`, {
    method: 'PATCH', token: adminToken, body: { departId: 'DEP0000000' },
  });
  ok('PATCH /drivers/:id/trip voyage inconnu -> 404', assignFake.status, 404);

  const releaseTrip = await call(`/drivers/${driverId}/trip`, {
    method: 'PATCH', token: adminToken, body: { departId: null },
  });
  ok('PATCH /drivers/:id/trip libération', releaseTrip.status, 200);

  /* ── 11. Incidents ──────────────────────────────────────────────── */
  const incident = await call(`/drivers/${driverId}/incidents`, {
    method: 'POST', token: adminToken,
    body: { type: 'retard', date: '2026-07-20', description: 'Retard de 20 min.', severite: 'medium' },
  });
  ok('POST /drivers/:id/incidents', incident.status, 201, incident.data?.data?.id || '');
  incidentId = incident.data?.data?.id;

  const badIncident = await call(`/drivers/${driverId}/incidents`, {
    method: 'POST', token: adminToken, body: { type: 'x', date: 'bad' },
  });
  ok('POST incident invalide -> 400', badIncident.status, 400);

  const updateInc = await call(`/drivers/incidents/${incidentId}`, {
    method: 'PATCH', token: adminToken, body: { resolu: true, severite: 'high' },
  });
  ok('PATCH /drivers/incidents/:id', updateInc.status, 200,
    updateInc.data?.data?.resolved === true ? 'resolu' : '');

  const incidentList = await call(`/drivers/${driverId}/incidents`, { token: adminToken });
  ok('GET /drivers/:id/incidents', incidentList.status, 200, `count=${incidentList.data?.data?.length}`);

  const delIncident = await call(`/drivers/incidents/${incidentId}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /drivers/incidents/:id', delIncident.status, 200);

  /* ── 12. Documents ──────────────────────────────────────────────── */
  const doc = await callUpload(`/drivers/${driverId}/documents`, {
    field: 'document', buffer: PDF_1PG, filename: 'contrat.pdf', mimetype: 'application/pdf', token: adminToken,
  });
  ok('POST /drivers/:id/documents (upload PDF)', doc.status, 201, doc.data?.data?.url || '');
  documentId = doc.data?.data?.id;
  ok('Document URL valide', /^\/uploads\/drivers\/docs\/.+/.test(doc.data?.data?.url || '') ? 200 : 500, 200);
  ok('Document type stocké', doc.data?.data?.type === 'autre' ? 200 : 500, 200);

  const docList = await call(`/drivers/${driverId}/documents`, { token: adminToken });
  ok('GET /drivers/:id/documents', docList.status, 200, `count=${docList.data?.data?.length}`);

  const badDoc = await callUpload(`/drivers/${driverId}/documents`, {
    field: 'document', buffer: Buffer.from('not a pdf'), filename: 'note.txt', mimetype: 'text/plain', token: adminToken,
  });
  ok('POST document type non autorisé -> 400', badDoc.status, 400);

  const delDoc = await call(`/drivers/documents/${documentId}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /drivers/documents/:id', delDoc.status, 200);
  const docGone = await db.ChauffeurDocument.findByPk(documentId);
  ok('Document supprimé de la base', !docGone ? 200 : 500, 200);

  /* ── 13. Photo ──────────────────────────────────────────────────── */
  const photo = await callUpload(`/drivers/${driverId}/photo`, { buffer: PNG_1PX, token: adminToken });
  ok('POST /drivers/:id/photo (upload)', photo.status, 201, photo.data?.data?.photoUrl || '');
  ok('Photo URL valide', /^\/uploads\/drivers\/.+\.webp$/.test(photo.data?.data?.photoUrl || '') ? 200 : 500, 200);

  const badPhoto = await callUpload(`/drivers/${driverId}/photo`, {
    buffer: Buffer.from('not an image'), filename: 'bad.bmp', mimetype: 'image/bmp', token: adminToken,
  });
  ok('POST photo type non autorisé -> 400', badPhoto.status, 400);

  const delPhoto = await call(`/drivers/${driverId}/photo`, { method: 'DELETE', token: adminToken });
  ok('DELETE /drivers/:id/photo', delPhoto.status, 200);
  const driverNoPhoto = await db.Agent.findByPk(driverId);
  ok('Chauffeur photo nettoyée', driverNoPhoto?.photo == null ? 200 : 500, 200);

  /* ── 14. KPIs ───────────────────────────────────────────────────── */
  const stats = await call('/drivers/stats', { token: adminToken });
  ok('GET /drivers/stats', stats.status, 200, `total=${stats.data?.data?.total}`);
  ok('Stats par statut', stats.data?.data?.parStatut?.on_leave >= 1 ? 200 : 500, 200);
  ok('Stats expérience moyenne', typeof stats.data?.data?.avgExperience === 'number' ? 200 : 500, 200);

  /* ── 15. Permissions : counter_agent -> 403 ─────────────────────── */
  const cLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'counter@bustixconnect.com', motDePasse: 'Counter@123' },
  });
  ok('Login counter_agent', cLogin.status, 200);
  const counterToken = cLogin.data?.data?.token;
  const forbidden = await call('/drivers', { token: counterToken });
  ok('Counter : GET /drivers -> 403', forbidden.status, 403);

  /* ── 16. Permissions : company_admin (périmètre compagnie) ──────── */
  const caLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'company@bustixconnect.com', motDePasse: 'Company@123' },
  });
  ok('Login company_admin', caLogin.status, 200);
  const companyToken = caLogin.data?.data?.token;

  const caList = await call('/drivers', { token: companyToken });
  ok('Company : GET /drivers (périmètre)', caList.status, 200, `total=${caList.data?.data?.total}`);

  const caSeeOther = await call(`/drivers/${driverId}`, { token: companyToken });
  ok('Company : voir un chauffeur hors périmètre -> 403', caSeeOther.status, 403);

  const caCreate = await call('/drivers', {
    method: 'POST', token: companyToken,
    body: {
      firstName: `CA ${UNIQUE.slice(-4)}`, lastName: 'Admin', phone: `6${UNIQUE.slice(-9)}`,
      email: `ca_driver_${UNIQUE}@example.com`, licenseNumber: `PER-CA-${UNIQUE.slice(-4)}`,
      licenseCategory: 'C', agenceId: 'AG00000001',
    },
  });
  ok('Company : POST /drivers (lié à sa compagnie)', caCreate.status, 201,
    `compagnieId=${caCreate.data?.data?.compagnieId}`);
  ok('Company : chauffeur auto-lié à sa compagnie (C001)', caCreate.data?.data?.compagnieId === 'C001' ? 200 : 500, 200);
  const caDriverId = caCreate.data?.data?.id;

  const caBadAgence = await call('/drivers', {
    method: 'POST', token: companyToken,
    body: {
      firstName: 'CA2', lastName: 'Admin', phone: `6${UNIQUE.slice(-10)}`,
      email: `ca2_driver_${UNIQUE}@example.com`, agenceId,
    },
  });
  ok('Company : agence hors compagnie -> 400', caBadAgence.status, 400);

  const caStatus = await call(`/drivers/${driverId}/status`, {
    method: 'PATCH', token: companyToken, body: { statut: 'suspended' },
  });
  ok('Company : statut hors périmètre -> 403', caStatus.status, 403);

  /* ── 17. Suppression (soft) ─────────────────────────────────────── */
  const del = await call(`/drivers/${driver2Id}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /drivers/:id', del.status, 200);
  const deletedDb = await db.Chauffeur.findOne({ where: { agent_id: driver2Id } });
  ok('Chauffeur en statut inactive (soft)', deletedDb?.statut === 'inactive' ? 200 : 500, 200);

  /* ── Nettoyage direct (hard delete des données de test) ─────────── */
  const testDriverIds = [driverId, driver2Id, caDriverId].filter(Boolean);
  if (testDriverIds.length) {
    await db.ChauffeurDocument.destroy({ where: { chauffeur_id: testDriverIds } });
    await db.ChauffeurIncident.destroy({ where: { chauffeur_id: testDriverIds } });
    await db.ChauffeurAffectation.destroy({ where: { chauffeur_id: testDriverIds } });
    await db.Chauffeur.destroy({ where: { agent_id: testDriverIds } });
    await db.Depart.destroy({ where: { chauffeur_id: testDriverIds } });
    await db.Agent.destroy({ where: { id: testDriverIds } });
  }
  if (busId) {
    await db.BusMaintenance.destroy({ where: { bus_id: busId } });
    await db.BusSeatLayout.destroy({ where: { bus_id: busId } });
    await db.BusImage.destroy({ where: { bus_id: busId } });
    await db.Bus.destroy({ where: { id: busId } });
  }
  if (agenceId) await db.Agence.destroy({ where: { id: agenceId } });
  if (companyId) {
    await db.Agence.destroy({ where: { compagnie_id: companyId } });
    await db.AbonnementCompagnie.destroy({ where: { compagnie_id: companyId } });
    await db.Compagnie.destroy({ where: { id: companyId } });
  }

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS DRIVERS ═══════');
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
