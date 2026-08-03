/* =====================================================================
   Tests d'intégration du module COMPANIES (backend local http://localhost:5000)
   Exécution : node scripts/test_companies.js
   Nécessite : serveur démarré (module companies chargé) + migration appliquée.
   Couvre : CRUD, profil, logo, documents, statuts, permissions,
            création compagnie + admin principal, pagination, filtres,
            recherche, KPIs, sécurité (aucun secret en réponse).
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

/* Petit PNG 1x1 valide (base64) */
const PNG_1PX = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

/* Petit PDF valide */
const PDF_1PAGE = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF');

const uploadFile = async (token, path, field, buffer, filename, mime, extra = {}) => {
  const fd = new FormData();
  fd.append(field, new Blob([buffer], { type: mime }), filename);
  Object.entries(extra).forEach(([k, v]) => fd.append(k, v));
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  let data = null;
  try { data = await res.json(); } catch (_) {}
  return { status: res.status, data };
};

const patchFile = async (token, path, field, buffer, filename, mime) => {
  const fd = new FormData();
  fd.append(field, new Blob([buffer], { type: mime }), filename);
  const res = await fetch(BASE + path, {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  let data = null;
  try { data = await res.json(); } catch (_) {}
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
const NEW_COMPANY = {
  nom: `Transport Test ${UNIQUE}`,
  description: 'Compagnie de test pour le module Companies',
  telephone: '+237699000001',
  email: `compagnie_${UNIQUE}@example.com`,
  site_web: 'https://test-transport.example',
  adresse: '12 Avenue Test',
  ville: 'Douala',
  pays: 'Cameroun',
  rccm: `RC/TST/${UNIQUE.slice(0, 4)}/001`,
  numero_contribuable: `P${UNIQUE.slice(0, 10)}`,
  couleur: '#FF6600',
  plan: 'standard',
  agence: { nom: 'Agence Principale Test', villeId: 'DLA', adresse: '12 Avenue Test', telephone: '+237699000002' },
  admin: {
    prenom: 'Admin',
    nom: `Test${UNIQUE}`,
    email: `admin_compagnie_${UNIQUE}@example.com`,
    telephone: '+237699000003',
    motDePasse: 'Compagnie@123',
  },
};

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  let newId = null;

  /* ── 1. Connexion admin (super_admin) ───────────────────────────── */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login super admin', login.status, 200, login.data?.data?.user?.role || '');
  const adminToken = login.data?.data?.token;

  /* ── 2. Liste + pagination + filtres + tri ──────────────────────── */
  const list = await call('/companies?page=1&limit=2&sort=newest', { token: adminToken });
  ok('GET /companies paginé (limit=2)', list.status, 200, `total=${list.data?.data?.total}`);
  ok('GET /companies limit respecté', list.data?.data?.items?.length <= 2 ? 200 : 500, 200);
  ok('GET /companies totalPages >= 1', list.data?.data?.totalPages >= 1 ? 200 : 500, 200);

  const noAuth = await call('/companies');
  ok('GET /companies sans token -> 401', noAuth.status, 401);

  const search = await call('/companies?recherche=Bus%20Tix', { token: adminToken });
  ok('GET /companies recherche', search.status, 200, `trouvé=${search.data?.data?.total}`);

  const statusFilter = await call('/companies?statut=actif', { token: adminToken });
  ok('GET /companies filtre statut', statusFilter.status, 200, `total=${statusFilter.data?.data?.total}`);

  const planFilter = await call('/companies?plan=standard', { token: adminToken });
  ok('GET /companies filtre plan', planFilter.status, 200, `total=${planFilter.data?.data?.total}`);

  const cityFilter = await call('/companies?ville=Douala', { token: adminToken });
  ok('GET /companies filtre ville', cityFilter.status, 200);

  const sortName = await call('/companies?sort=name_asc', { token: adminToken });
  ok('GET /companies tri name_asc', sortName.status, 200);

  const invalidLimit = await call('/companies?limit=999', { token: adminToken });
  ok('GET /companies limit invalide -> 400', invalidLimit.status, 400);

  const stats = await call('/companies/stats', { token: adminToken });
  ok('GET /companies/stats', stats.status, 200,
    `total=${stats.data?.data?.total} actifs=${stats.data?.data?.parStatut?.actif}`);

  /* ── 3. Profil : super_admin sans compagnie rattachée -> 403 ────── */
  const prof = await call('/companies/profile', { token: adminToken });
  ok('GET /companies/profile (super admin) -> 403', prof.status, 403);

  /* ── 4. Création compagnie + abonnement + admin principal ───────── */
  const created = await call('/companies', { method: 'POST', token: adminToken, body: NEW_COMPANY });
  ok('POST /companies (création)', created.status, 201,
    `${created.data?.data?.name} [${created.data?.data?.subscription}]`);
  ok('Compagnie créée sans secret', hasSensitive(created.data?.data) ? 500 : 200, 200);
  newId = created.data?.data?.id;
  ok('ID compagnie format CXXX', /^C[A-Z0-9]{3}$/.test(newId || '') ? 200 : 500, 200, newId || '');

  const createdDb = await db.Compagnie.findByPk(newId);
  ok('Compagnie en base (statut actif)', createdDb?.statut === 'actif' ? 200 : 500, 200);

  const duplicate = await call('/companies', {
    method: 'POST', token: adminToken, body: NEW_COMPANY,
  });
  ok('POST /companies email dupliqué -> 409', duplicate.status, 409);

  const badCreate = await call('/companies', {
    method: 'POST', token: adminToken,
    body: { ...NEW_COMPANY, email: 'pas-un-email', nom: '' },
  });
  ok('POST /companies données invalides -> 400', badCreate.status, 400);

  /* ── 5. Détail + édition ────────────────────────────────────────── */
  const detail = await call(`/companies/${newId}`, { token: adminToken });
  ok('GET /companies/:id', detail.status, 200, detail.data?.data?.taxpayerId || '');
  ok('Détail avec agences + documents', (detail.data?.data?.agences?.length >= 1) ? 200 : 500, 200);

  const updated = await call(`/companies/${newId}`, {
    method: 'PATCH', token: adminToken,
    body: { description: 'Description éditée', ville: 'Yaoundé' },
  });
  ok('PATCH /companies/:id', updated.status, 200, updated.data?.data?.ville || '');

  const notFound = await call('/companies/CZZZ', { token: adminToken });
  ok('GET /companies/:id inconnu -> 404', notFound.status, 404);

  /* ── 6. Statuts (suspendre / réactiver) ─────────────────────────── */
  const suspend = await call(`/companies/${newId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'suspendu', raison: 'test' },
  });
  ok('PATCH /companies/:id/status suspendre', suspend.status, 200);
  const suspendedDb = await db.Compagnie.findByPk(newId);
  ok('Statut suspendu + actif=false en base',
    suspendedDb?.statut === 'suspendu' && suspendedDb?.actif === false ? 200 : 500, 200);

  const reactivate = await call(`/companies/${newId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'actif' },
  });
  ok('PATCH /companies/:id/status réactiver', reactivate.status, 200);
  const reactivatedDb = await db.Compagnie.findByPk(newId);
  ok('Réactivé : actif=true', reactivatedDb?.actif === true ? 200 : 500, 200);

  const badStatus = await call(`/companies/${newId}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'inconnu' },
  });
  ok('PATCH /companies/:id/status invalide -> 400', badStatus.status, 400);

  /* ── 7. Logo (upload / remplacement / invalide / suppression) ───── */
  const logo = await patchFile(adminToken, `/companies/${newId}/logo`, 'logo', PNG_1PX, 'logo.png', 'image/png');
  ok('PATCH /companies/:id/logo upload', logo.status, 200, logo.data?.data?.logo || '');
  ok('Logo enregistré en WebP', /\.webp$/.test(logo.data?.data?.logo || '') ? 200 : 500, 200);

  const logo2 = await patchFile(adminToken, `/companies/${newId}/logo`, 'logo', PNG_1PX, 'logo2.png', 'image/png');
  ok('PATCH /companies/:id/logo remplacement', logo2.status, 200,
    `nouveau=${logo2.data?.data?.logo !== logo.data?.data?.logo}`);

  const badLogo = await patchFile(adminToken, `/companies/${newId}/logo`, 'logo', Buffer.from('not an image'), 'f.txt', 'text/plain');
  ok('Upload logo non-image -> 400', badLogo.status, 400);

  const delLogo = await call(`/companies/${newId}/logo`, { method: 'DELETE', token: adminToken });
  ok('DELETE /companies/:id/logo', delLogo.status, 200);

  /* ── 8. Documents (upload / liste / suppression) ────────────────── */
  const doc = await uploadFile(adminToken, `/companies/${newId}/documents`, 'document', PDF_1PAGE, 'rccm.pdf', 'application/pdf', { categorie: 'rccm' });
  ok('POST /companies/:id/documents upload', doc.status, 201, doc.data?.data?.categorie || '');
  const docId = doc.data?.data?.id;

  const docList = await call(`/companies/${newId}/documents`, { token: adminToken });
  ok('GET /companies/:id/documents', docList.status, 200, `count=${docList.data?.data?.length}`);

  const docFilter = await call(`/companies/${newId}/documents?categorie=rccm`, { token: adminToken });
  ok('GET /companies/:id/documents filtre catégorie', docFilter.status, 200,
    `count=${docFilter.data?.data?.length}`);

  const badDoc = await uploadFile(adminToken, `/companies/${newId}/documents`, 'document', Buffer.from('x'), 'x.exe', 'application/x-msdownload', { categorie: 'rccm' });
  ok('Upload document non autorisé -> 400', badDoc.status, 400);

  const delDoc = await call(`/companies/${newId}/documents/${docId}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /companies/:id/documents/:id', delDoc.status, 200);

  /* ── 9. Permissions : admin de la nouvelle compagnie ────────────── */
  const cLogin = await call('/auth/login', {
    method: 'POST', body: { email: NEW_COMPANY.admin.email, motDePasse: 'Compagnie@123' },
  });
  ok('Login admin de la nouvelle compagnie', cLogin.status, 200);
  const companyToken = cLogin.data?.data?.token;

  const cList = await call('/companies', { token: companyToken });
  ok('Company : liste (périmètre compagnie)', cList.status, 200, `total=${cList.data?.data?.total}`);
  ok('Company : ne voit que sa compagnie', cList.data?.data?.total === 1 ? 200 : 500, 200);

  const cProfile = await call('/companies/profile', { token: companyToken });
  ok('Company : GET /companies/profile', cProfile.status, 200, cProfile.data?.data?.name || '');

  const cSeeOther = await call('/companies/C001', { token: companyToken });
  ok('Company : voir une autre compagnie -> 403', cSeeOther.status, 403);

  const cUpdateOwn = await call('/companies/profile', {
    method: 'PATCH', token: companyToken, body: { description: 'Modifié par l\'admin compagnie' },
  });
  ok('Company : PATCH /companies/profile', cUpdateOwn.status, 200);

  const cCreate = await call('/companies', {
    method: 'POST', token: companyToken,
    body: { nom: 'Forbidden', email: `forb_${UNIQUE}@example.com` },
  });
  ok('Company : création -> 403', cCreate.status, 403);

  const cStatus = await call(`/companies/${newId}/status`, {
    method: 'PATCH', token: companyToken, body: { statut: 'suspendu' },
  });
  ok('Company : changement de statut -> 403', cStatus.status, 403);

  const cDelete = await call(`/companies/C001`, { method: 'DELETE', token: companyToken });
  ok('Company : suppression -> 403', cDelete.status, 403);

  const cStats = await call('/companies/stats', { token: companyToken });
  ok('Company : GET /companies/stats', cStats.status, 200);

  const cLogo = await patchFile(companyToken, '/companies/profile/logo', 'logo', PNG_1PX, 'logo.png', 'image/png');
  ok('Company : PATCH /companies/profile/logo', cLogo.status, 200);

  const cDoc = await uploadFile(companyToken, '/companies/profile/documents', 'document', PDF_1PAGE, 'licence.pdf', 'application/pdf', { categorie: 'licence' });
  ok('Company : POST /companies/profile/documents', cDoc.status, 201);
  const cDocId = cDoc.data?.data?.id;

  const cDocList = await call('/companies/profile/documents', { token: companyToken });
  ok('Company : GET /companies/profile/documents', cDocList.status, 200);

  const cDelDoc = await call(`/companies/profile/documents/${cDocId}`, { method: 'DELETE', token: companyToken });
  ok('Company : DELETE document', cDelDoc.status, 200);

  const cDelLogo = await call('/companies/profile/logo', { method: 'DELETE', token: companyToken });
  ok('Company : DELETE /companies/profile/logo', cDelLogo.status, 200);

  /* ── 10. Suppression (soft) ─────────────────────────────────────── */
  const del = await call(`/companies/${newId}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /companies/:id', del.status, 200);

  const deletedDb = await db.Compagnie.findByPk(newId);
  ok('Compagnie en statut banni (soft)', deletedDb?.statut === 'banni' && deletedDb?.actif === false ? 200 : 500, 200);

  /* ── Nettoyage direct (hard delete des données de test, enfants d'abord) ── */
  await db.DocumentCompagnie.destroy({ where: { compagnie_id: newId } });
  const agenceIds = (await db.Agence.findAll({ where: { compagnie_id: newId } })).map((a) => a.id);
  const agentIds = (await db.Agent.findAll({ where: { agence_id: agenceIds } })).map((a) => a.id);
  if (agentIds.length) {
    await db.RefreshToken.destroy({ where: { agent_id: agentIds } });
    await db.SessionConnexion.destroy({ where: { agent_id: agentIds } });
    await db.EmailVerificationToken.destroy({ where: { agent_id: agentIds } });
    await db.PasswordResetToken.destroy({ where: { agent_id: agentIds } });
    await db.CompteAgent.destroy({ where: { agent_id: agentIds } });
    await db.Agent.destroy({ where: { id: agentIds } });
  }
  await db.Agence.destroy({ where: { id: agenceIds } });
  await db.AbonnementCompagnie.destroy({ where: { compagnie_id: newId } });
  await db.Compagnie.destroy({ where: { id: newId } });

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS COMPANIES ═══════');
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
