/* =====================================================================
   Tests d'intégration du module AGENCIES (backend local http://localhost:5000)
   Exécution : node scripts/test_agencies.js
   Nécessite : serveur démarré (module agencies chargé) + migration appliquée.
   Couvre : CRUD, statuts, GPS/agences proches, villes, KPIs, pagination,
            filtres, recherche, permissions, sécurité (aucun secret).
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
const COMPANY = {
  nom: `Agences Test ${UNIQUE}`,
  email: `agences_${UNIQUE}@example.com`,
  plan: 'standard',
};
const NEW_AGENCY = {
  nom: `Agence Douala Test ${UNIQUE}`,
  villeId: 'DLA',
  region: 'Littoral',
  adresse: '15 Boulevard de la Liberté',
  quartier: 'Akwa',
  telephone: '+237699100001',
  email: `agence_${UNIQUE}@example.com`,
  description: 'Agence de test du module Agencies',
  type: 'gare',
  statut: 'actif',
  latitude: 4.0435,
  longitude: 9.6966,
  heureOuverture: '05:00',
  heureFermeture: '22:00',
  joursOuverture: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  services: ['vente_billets', 'reservation', 'wifi'],
};

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  let companyId = null;
  let agenceId = null;
  let agence2Id = null;

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

  /* ── 3. Liste + pagination + filtres + tri ──────────────────────── */
  const list = await call('/agencies?page=1&limit=2&sort=newest', { token: adminToken });
  ok('GET /agencies paginé (limit=2)', list.status, 200, `total=${list.data?.data?.total}`);
  ok('GET /agencies limit respecté', list.data?.data?.items?.length <= 2 ? 200 : 500, 200);
  ok('GET /agencies totalPages >= 1', list.data?.data?.totalPages >= 1 ? 200 : 500, 200);

  const noAuth = await call('/agencies');
  ok('GET /agencies sans token -> 401', noAuth.status, 401);

  const invalidLimit = await call('/agencies?limit=999', { token: adminToken });
  ok('GET /agencies limit invalide -> 400', invalidLimit.status, 400);

  /* ── 4. Création d'agences ──────────────────────────────────────── */
  const created = await call('/agencies', { method: 'POST', token: adminToken, body: { ...NEW_AGENCY, compagnieId: companyId } });
  ok('POST /agencies (création)', created.status, 201, created.data?.data?.name || '');
  ok('Agence créée sans secret', hasSensitive(created.data?.data) ? 500 : 200, 200);
  agenceId = created.data?.data?.id;
  ok('ID agence format AG########', /^AG\d{8}$/.test(agenceId || '') ? 200 : 500, 200, agenceId || '');
  ok('Agence avec GPS + horaires', created.data?.data?.lat === 4.0435 && created.data?.data?.openTime === '05:00' ? 200 : 500, 200);
  ok('Agence ville résolue', created.data?.data?.city === 'Douala' ? 200 : 500, 200, created.data?.data?.city || '');
  ok('Agence services stockés', created.data?.data?.services?.length === 3 ? 200 : 500, 200);

  const createdDb = await db.Agence.findByPk(agenceId);
  ok('Agence en base (statut actif)', createdDb?.statut === 'actif' ? 200 : 500, 200);

  const duplicate = await call('/agencies', { method: 'POST', token: adminToken, body: { ...NEW_AGENCY, compagnieId: companyId } });
  ok('POST /agencies nom dupliqué -> 409', duplicate.status, 409);

  const badCreate = await call('/agencies', {
    method: 'POST', token: adminToken,
    body: { nom: '', villeId: 'XX' },
  });
  ok('POST /agencies données invalides -> 400', badCreate.status, 400);

  const second = await call('/agencies', {
    method: 'POST', token: adminToken,
    body: { ...NEW_AGENCY, compagnieId: companyId, nom: `Agence Bafoussam Test ${UNIQUE}`, villeId: 'BFS', statut: 'inactif', type: 'agence' },
  });
  ok('POST /agencies (2e)', second.status, 201);
  agence2Id = second.data?.data?.id;

  /* ── 5. Recherche + filtres ─────────────────────────────────────── */
  const search = await call(`/agencies?recherche=${encodeURIComponent(UNIQUE)}`, { token: adminToken });
  ok('GET /agencies recherche', search.status, 200, `trouvé=${search.data?.data?.total}`);

  const typeFilter = await call('/agencies?type=gare', { token: adminToken });
  ok('GET /agencies filtre type', typeFilter.status, 200, `total=${typeFilter.data?.data?.total}`);

  const statutFilter = await call('/agencies?statut=inactif', { token: adminToken });
  ok('GET /agencies filtre statut', statutFilter.status, 200, `total=${statutFilter.data?.data?.total}`);

  const villeFilter = await call('/agencies?villeId=DLA', { token: adminToken });
  ok('GET /agencies filtre ville', villeFilter.status, 200, `total=${villeFilter.data?.data?.total}`);

  const sortName = await call('/agencies?sort=name_asc', { token: adminToken });
  ok('GET /agencies tri name_asc', sortName.status, 200);

  /* ── 6. Détail + édition ────────────────────────────────────────── */
  const detail = await call(`/agencies/${agenceId}`, { token: adminToken });
  ok('GET /agencies/:id', detail.status, 200, detail.data?.data?.companyName || '');
  ok('Détail rattaché à la bonne compagnie', detail.data?.data?.compagnieId === companyId ? 200 : 500, 200);

  const updated = await call(`/agencies/${agenceId}`, {
    method: 'PATCH', token: adminToken,
    body: { description: 'Description éditée', quartier: 'Bonanjo' },
  });
  ok('PATCH /agencies/:id', updated.status, 200, updated.data?.data?.quartier || '');
  ok('PATCH persiste en base', updated.data?.data?.quartier === 'Bonanjo' ? 200 : 500, 200);

  const notFound = await call('/agencies/AG00000000', { token: adminToken });
  ok('GET /agencies/:id inconnu -> 404', notFound.status, 404);

  /* ── 7. Statuts ─────────────────────────────────────────────────── */
  const suspend = await call(`/agencies/${agenceId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'suspendu', raison: 'test' },
  });
  ok('PATCH /agencies/:id/status suspendre', suspend.status, 200);
  const suspendedDb = await db.Agence.findByPk(agenceId);
  ok('Statut suspendu en base', suspendedDb?.statut === 'suspendu' ? 200 : 500, 200);

  const reactivate = await call(`/agencies/${agenceId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'actif' },
  });
  ok('PATCH /agencies/:id/status réactiver', reactivate.status, 200);

  const badStatus = await call(`/agencies/${agenceId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'inconnu' },
  });
  ok('PATCH /agencies/:id/status invalide -> 400', badStatus.status, 400);

  /* ── 8. Villes + KPIs + agences proches ─────────────────────────── */
  const villes = await call('/agencies/villes', { token: adminToken });
  ok('GET /agencies/villes', villes.status, 200, `villes=${villes.data?.data?.length}`);
  ok('Villes contiennent Douala', villes.data?.data?.some((v) => v.nom === 'Douala') ? 200 : 500, 200);

  const stats = await call('/agencies/stats', { token: adminToken });
  ok('GET /agencies/stats', stats.status, 200, `total=${stats.data?.data?.total}`);
  ok('Stats par statut', stats.data?.data?.parStatut?.actif >= 1 ? 200 : 500, 200);
  ok('Stats par type', stats.data?.data?.parType?.gare >= 1 ? 200 : 500, 200);

  const nearby = await call('/agencies/nearby?lat=4.05&lng=9.7&radiusKm=50', { token: adminToken });
  ok('GET /agencies/nearby', nearby.status, 200, `trouvé=${nearby.data?.data?.length}`);
  ok('Nearby avec distance_km', Array.isArray(nearby.data?.data) && nearby.data?.data?.[0]?.distanceKm != null ? 200 : 500, 200);

  const badNearby = await call('/agencies/nearby?lng=9.7', { token: adminToken });
  ok('GET /agencies/nearby sans lat -> 400', badNearby.status, 400);

  /* ── 9. Permissions : counter_agent -> 403 ──────────────────────── */
  const cLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'counter@bustixconnect.com', motDePasse: 'Counter@123' },
  });
  ok('Login counter_agent', cLogin.status, 200);
  const counterToken = cLogin.data?.data?.token;
  const forbidden = await call('/agencies', { token: counterToken });
  ok('Counter : GET /agencies -> 403', forbidden.status, 403);

  /* ── 10. Permissions : company_admin (périmètre compagnie) ──────── */
  const caLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'company@bustixconnect.com', motDePasse: 'Company@123' },
  });
  ok('Login company_admin', caLogin.status, 200);
  const companyToken = caLogin.data?.data?.token;

  const caList = await call('/agencies', { token: companyToken });
  ok('Company : GET /agencies (périmètre)', caList.status, 200, `total=${caList.data?.data?.total}`);
  ok('Company : ne voit que ses agences', caList.data?.data?.total === 1 ? 200 : 500, 200);

  const caSeeOther = await call(`/agencies/${agenceId}`, { token: companyToken });
  ok('Company : voir une agence hors périmètre -> 403', caSeeOther.status, 403);

  const caCreate = await call('/agencies', {
    method: 'POST', token: companyToken,
    body: { nom: `Agence Company ${UNIQUE}`, villeId: 'YDE', type: 'bouette' },
  });
  ok('Company : POST /agencies (liée à sa compagnie)', caCreate.status, 201,
    `compagnieId=${caCreate.data?.data?.compagnieId}`);
  ok('Company : agence auto-liée à sa compagnie', caCreate.data?.data?.compagnieId === 'C001' ? 200 : 500, 200);
  const caAgencyId = caCreate.data?.data?.id;

  const caOtherCompany = await call('/agencies', {
    method: 'POST', token: companyToken,
    body: { nom: `Agence Forbidden ${UNIQUE}`, villeId: 'DLA', compagnieId: companyId },
  });
  ok('Company : compagnieId client ignoré (liée à sa compagnie)', caOtherCompany.status, 201);
  ok('Company : agence liée à sa compagnie (C001)', caOtherCompany.data?.data?.compagnieId === 'C001' ? 200 : 500, 200);
  const caForbiddenId = caOtherCompany.data?.data?.id;

  const caStatus = await call(`/agencies/${agenceId}/status`, {
    method: 'PATCH', token: companyToken, body: { statut: 'suspendu' },
  });
  ok('Company : statut hors périmètre -> 403', caStatus.status, 403);

  /* ── 11. Suppression (soft) ─────────────────────────────────────── */
  const del = await call(`/agencies/${agenceId}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /agencies/:id', del.status, 200);
  const deletedDb = await db.Agence.findByPk(agenceId);
  ok('Agence en statut inactif (soft)', deletedDb?.statut === 'inactif' ? 200 : 500, 200);

  /* ── Nettoyage direct (hard delete des données de test) ─────────── */
  const testAgencyIds = [agenceId, agence2Id, caAgencyId, caForbiddenId].filter(Boolean);
  const testAgences = await db.Agence.findAll({ where: { id: testAgencyIds } });
  const testAgentIds = (await db.Agent.findAll({ where: { agence_id: testAgencyIds } })).map((a) => a.id);
  if (testAgentIds.length) {
    await db.RefreshToken.destroy({ where: { agent_id: testAgentIds } });
    await db.SessionConnexion.destroy({ where: { agent_id: testAgentIds } });
    await db.EmailVerificationToken.destroy({ where: { agent_id: testAgentIds } });
    await db.PasswordResetToken.destroy({ where: { agent_id: testAgentIds } });
    await db.CompteAgent.destroy({ where: { agent_id: testAgentIds } });
    await db.Agent.destroy({ where: { id: testAgentIds } });
  }
  if (testAgences.length) {
    const ids = testAgences.map((a) => a.id);
    await db.Guichet.destroy({ where: { agence_id: ids } });
    await db.Agence.destroy({ where: { id: ids } });
  }
  if (companyId) {
    await db.Agence.destroy({ where: { compagnie_id: companyId } });
    await db.AbonnementCompagnie.destroy({ where: { compagnie_id: companyId } });
    await db.Compagnie.destroy({ where: { id: companyId } });
  }

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS AGENCIES ═══════');
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
