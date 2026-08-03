/* =====================================================================
   Tests d'intégration du module USERS (backend local http://localhost:5000)
   Exécution : node scripts/test_users.js
   Nécessite : serveur démarré + seed effectué + migration users appliquée.
   Couvre : CRUD, profil, photo, statuts, mot de passe, permissions,
            pagination, recherche, filtres, sécurité (aucun secret en réponse).
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

const uploadPhoto = async (token, buffer, filename, type) => {
  const fd = new FormData();
  fd.append('photo', new Blob([buffer], { type }), filename);
  const res = await fetch(BASE + '/users/profile/photo', {
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
const NEW_USER = {
  prenom: 'Test',
  nom: `User${UNIQUE}`,
  email: `users_${UNIQUE}@example.com`,
  telephone: '+237699000000',
  role: 'counter_agent',
  genre: 'M',
  adresse: '1 Test Avenue',
  nationalite: 'Camerounaise',
  langue: 'fr',
  motDePasse: 'Nouveau@123',
  agence_id: 'AG00000001',
};

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  /* ── 1. Connexion admin (super_admin) ───────────────────────────── */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login super admin', login.status, 200, login.data?.data?.user?.role || '');
  const adminToken = login.data?.data?.token;

  /* ── 2. Liste + pagination + filtres ────────────────────────────── */
  const list = await call(`/users?page=1&limit=2&sort=newest`, { token: adminToken });
  ok('GET /users paginé (limit=2)', list.status, 200, `total=${list.data?.data?.total}`);
  ok('GET /users limit respecté', list.data?.data?.items?.length <= 2 ? 200 : 500, 200);
  ok('GET /users totalPages >= 1', list.data?.data?.totalPages >= 1 ? 200 : 500, 200);

  const noAuth = await call('/users');
  ok('GET /users sans token -> 401', noAuth.status, 401);

  const search = await call('/users?recherche=Atangana', { token: adminToken });
  ok('GET /users recherche', search.status, 200,
    `trouvé=${search.data?.data?.total}`);

  const roleFilter = await call('/users?role=counter_agent', { token: adminToken });
  ok('GET /users filtre rôle', roleFilter.status, 200,
    `total=${roleFilter.data?.data?.total}`);

  const statusFilter = await call('/users?statut=actif', { token: adminToken });
  ok('GET /users filtre statut', statusFilter.status, 200);

  const sortName = await call('/users?sort=name_asc', { token: adminToken });
  ok('GET /users tri name_asc', sortName.status, 200);

  const invalidLimit = await call('/users?limit=999', { token: adminToken });
  ok('GET /users limit invalide -> 400', invalidLimit.status, 400);

  const stats = await call('/users/stats', { token: adminToken });
  ok('GET /users/stats', stats.status, 200,
    `total=${stats.data?.data?.total}`);

  /* ── 3. Profil (soi-même) ───────────────────────────────────────── */
  const profile = await call('/users/profile', { token: adminToken });
  ok('GET /users/profile', profile.status, 200, profile.data?.data?.email || '');
  ok('Profil sans secret', hasSensitive(profile.data?.data) ? 500 : 200, 200);

  const updProfile = await call('/users/profile', {
    method: 'PATCH',
    token: adminToken,
    body: { prenom: 'Super', nationalite: 'Camerounaise', adresse: 'Akwa Douala' },
  });
  ok('PATCH /users/profile', updProfile.status, 200, updProfile.data?.data?.nationalite || '');

  const badProfile = await call('/users/profile', {
    method: 'PATCH', token: adminToken, body: { genre: 'XX' },
  });
  ok('PATCH /users/profile invalide -> 400', badProfile.status, 400);

  /* ── 4. Création utilisateur ────────────────────────────────────── */
  const created = await call('/users', {
    method: 'POST', token: adminToken, body: NEW_USER,
  });
  ok('POST /users (création)', created.status, 201,
    `${created.data?.data?.email} [${created.data?.data?.role}]`);
  ok('Utilisateur créé sans secret', hasSensitive(created.data?.data) ? 500 : 200, 200);
  const newId = created.data?.data?.id;

  const duplicate = await call('/users', {
    method: 'POST', token: adminToken, body: NEW_USER,
  });
  ok('POST /users email dupliqué -> 409', duplicate.status, 409);

  const badCreate = await call('/users', {
    method: 'POST', token: adminToken,
    body: { ...NEW_USER, email: 'pas-un-email', motDePasse: 'x' },
  });
  ok('POST /users données invalides -> 400', badCreate.status, 400);

  /* ── 5. Détail + édition ────────────────────────────────────────── */
  const detail = await call(`/users/${newId}`, { token: adminToken });
  ok('GET /users/:id', detail.status, 200, detail.data?.data?.matricule || '');

  const updated = await call(`/users/${newId}`, {
    method: 'PATCH', token: adminToken, body: { prenom: 'TestEdité', adresse: '2 Edit Street' },
  });
  ok('PATCH /users/:id', updated.status, 200, updated.data?.data?.prenom || '');

  const notFound = await call('/users/USRZZZ9999', { token: adminToken });
  ok('GET /users/:id inconnu -> 404', notFound.status, 404);

  /* ── 6. Statut (suspendre / réactiver) ──────────────────────────── */
  const suspend = await call('/users/status', {
    method: 'PATCH', token: adminToken, body: { id: newId, statut: 'suspendu', raison: 'test' },
  });
  ok('PATCH /users/status suspendre', suspend.status, 200);
  const suspendedDb = await db.Agent.findByPk(newId);
  ok('Statut suspendu en base', suspendedDb?.statut === 'suspendu' ? 200 : 500, 200);

  const reactivate = await call('/users/status', {
    method: 'PATCH', token: adminToken, body: { id: newId, statut: 'actif' },
  });
  ok('PATCH /users/status réactiver', reactivate.status, 200);

  const badStatus = await call('/users/status', {
    method: 'PATCH', token: adminToken, body: { id: newId, statut: 'inconnu' },
  });
  ok('PATCH /users/status invalide -> 400', badStatus.status, 400);

  /* ── 7. Mot de passe (soi-même) ─────────────────────────────────── */
  const changePwd = await call('/users/password', {
    method: 'PATCH', token: adminToken,
    body: { motDePasseActuel: 'Admin@123', nouveauMotDePasse: 'Admin@456' },
  });
  ok('PATCH /users/password', changePwd.status, 200);

  const reloginNew = await call('/auth/login', {
    method: 'POST', body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@456' },
  });
  ok('Login avec nouveau mot de passe', reloginNew.status, 200);
  const adminToken2 = reloginNew.data?.data?.token;

  /* Remise à l'ancien mot de passe pour ne pas casser les autres tests */
  await call('/users/password', {
    method: 'PATCH', token: adminToken2,
    body: { motDePasseActuel: 'Admin@456', nouveauMotDePasse: 'Admin@123' },
  });

  const badPwd = await call('/users/password', {
    method: 'PATCH', token: adminToken,
    body: { motDePasseActuel: 'Mauvais', nouveauMotDePasse: 'Admin@123' },
  });
  ok('PATCH /users/password mauvais actuel -> 401', badPwd.status, 401);

  /* ── 8. Photo de profil (upload + remplacement + suppression) ───── */
  const photo = await uploadPhoto(adminToken2, PNG_1PX, 'avatar.png', 'image/png');
  ok('PATCH /users/profile/photo upload', photo.status, 200, photo.data?.data?.photo || '');

  const photo2 = await uploadPhoto(adminToken2, PNG_1PX, 'avatar2.png', 'image/png');
  ok('PATCH /users/profile/photo remplacement', photo2.status, 200,
    `nouvelle=${photo2.data?.data?.photo !== photo.data?.data?.photo}`);

  const badFile = await uploadPhoto(adminToken2, Buffer.from('not an image'), 'f.txt', 'text/plain');
  ok('Upload non-image -> 400', badFile.status, 400);

  const delPhoto = await call('/users/profile/photo', { method: 'DELETE', token: adminToken2 });
  ok('DELETE /users/profile/photo', delPhoto.status, 200);

  /* ── 9. Permissions : company_admin ─────────────────────────────── */
  const cLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'company@bustixconnect.com', motDePasse: 'Company@123' },
  });
  ok('Login company admin', cLogin.status, 200);
  const companyToken = cLogin.data?.data?.token;

  const cList = await call('/users', { token: companyToken });
  ok('Company : liste (périmètre compagnie)', cList.status, 200,
    `total=${cList.data?.data?.total}`);

  const cCreateAdmin = await call('/users', {
    method: 'POST', token: companyToken,
    body: { ...NEW_USER, email: `forb_${UNIQUE}@example.com`, role: 'super_admin' },
  });
  ok('Company : création super_admin refusée -> 403', cCreateAdmin.status, 403);

  const cSeeSuperAdmin = await call('/users/AGT0000001', { token: companyToken });
  ok('Company : voir un super_admin -> 403', cSeeSuperAdmin.status, 403);

  const cChangeRole = await call(`/users/${newId}`, {
    method: 'PATCH', token: companyToken, body: { role: 'super_admin' },
  });
  ok('Company : changement de rôle -> 403', cChangeRole.status, 403);

  const cStats = await call('/users/stats', { token: companyToken });
  ok('Company : GET /users/stats', cStats.status, 200);

  /* ── 10. Permissions : counter_agent (profil seul) ──────────────── */
  const kLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'counter@bustixconnect.com', motDePasse: 'Counter@123' },
  });
  ok('Login counter agent', kLogin.status, 200);
  const counterToken = kLogin.data?.data?.token;

  const kList = await call('/users', { token: counterToken });
  ok('Counter : liste limitée à soi-même', kList.status, 200,
    `total=${kList.data?.data?.total}`);
  ok('Counter : total == 1', kList.data?.data?.total === 1 ? 200 : 500, 200);

  const kSeeOther = await call(`/users/${newId}`, { token: counterToken });
  ok('Counter : voir un autre utilisateur -> 403', kSeeOther.status, 403);

  const kCreate = await call('/users', {
    method: 'POST', token: counterToken,
    body: { ...NEW_USER, email: `forb2_${UNIQUE}@example.com` },
  });
  ok('Counter : création -> 403', kCreate.status, 403);

  /* ── 11. Suppression (soft) + utilisateur supprimé ne se connecte pas ── */
  const del = await call(`/users/${newId}`, { method: 'DELETE', token: adminToken2 });
  ok('DELETE /users/:id', del.status, 200);

  const deletedDb = await db.Agent.findByPk(newId);
  ok('Utilisateur en statut supprime (soft)', deletedDb?.statut === 'supprime' ? 200 : 500, 200);

  const deletedLogin = await call('/auth/login', {
    method: 'POST', body: { email: NEW_USER.email, motDePasse: 'Nouveau@123' },
  });
  ok('Login utilisateur supprimé refusé', deletedLogin.status, 403, deletedLogin.status);

  /* ── Nettoyage direct (hard delete des données de test, enfants d'abord) ── */
  await db.EmailVerificationToken.destroy({ where: { agent_id: newId } });
  await db.RefreshToken.destroy({ where: { agent_id: newId } });
  await db.SessionConnexion.destroy({ where: { agent_id: newId } });
  await db.PasswordResetToken.destroy({ where: { agent_id: newId } });
  await db.CompteAgent.destroy({ where: { agent_id: newId } });
  await db.Agent.destroy({ where: { id: newId } });

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS USERS ═══════');
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
