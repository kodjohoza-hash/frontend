/* =====================================================================
   Tests d'intégration du module AUTH (backend local http://localhost:5000)
   Exécution : node scripts/test_auth.js
   Nécessite : serveur démarré + seed effectué + migration auth appliquée.
   ===================================================================== */
const BASE = 'http://localhost:5000/api/v1';

/* Accès DB direct pour préparer jetons (reset / verify) et comptes de test */
const db = require('../src/models');
const { hashToken } = require('../src/utils/token');
const { hashPassword } = require('../src/utils/password');
const crypto = require('crypto');

const call = async (path, { method = 'GET', body, token } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (_) { /* no body */ }
  return { status: res.status, data };
};

const now = new Date();
const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000);

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  /* ── 1. Connexion admin ─────────────────────────────────────────── */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login admin', login.status, 200, login.data?.data?.user?.role || '');
  const adminToken = login.data?.data?.token;
  const adminRefresh = login.data?.data?.refreshToken;

  /* ── 2. GET /auth/me ────────────────────────────────────────────── */
  const me = await call('/auth/me', { token: adminToken });
  ok('GET /auth/me', me.status, 200, me.data?.data?.email || '');
  const noToken = await call('/auth/me');
  ok('GET /auth/me sans token -> 401', noToken.status, 401);

  /* ── 3. Connexion échouée + verrouillage (compte jetable) ───────── */
  const tmpId = 'AGT0000999';
  await db.Agent.create({
    id: tmpId,
    matricule: 'TMP-0001',
    prenom: 'Test',
    nom: 'Lockout',
    email: 'tmp@example.com',
    telephone: '+237600000000',
    role: 'company_admin',
    date_embauche: now,
    agence_id: 'AG00000001',
    verifie: true,
  });
  await db.CompteAgent.create({
    agent_id: tmpId,
    email: 'tmp@example.com',
    telephone: '+237600000000',
    mot_de_passe_hash: await hashPassword('Temp@123'),
  });

  const badLogin = await call('/auth/login', {
    method: 'POST',
    body: { email: 'tmp@example.com', motDePasse: 'WrongPass' },
  });
  ok('Login mauvais mot de passe -> 401', badLogin.status, 401);

  const unknownLogin = await call('/auth/login', {
    method: 'POST',
    body: { email: 'nobody@example.com', motDePasse: 'WrongPass' },
  });
  ok('Login email inconnu -> 401 (pas d\'énumération)', unknownLogin.status, 401);

  let lockStatus = 200;
  for (let i = 0; i < 5; i += 1) {
    lockStatus = (await call('/auth/login', {
      method: 'POST',
      body: { email: 'tmp@example.com', motDePasse: 'WrongPass' },
    })).status;
  }
  const locked = await call('/auth/login', {
    method: 'POST',
    body: { email: 'tmp@example.com', motDePasse: 'Temp@123' },
  });
  ok('Verrouillage après 5 échecs -> 423', locked.status, 423);
  /* cleanup compte jetable */
  await db.RefreshToken.destroy({ where: { agent_id: tmpId } });
  await db.SessionConnexion.destroy({ where: { agent_id: tmpId } });
  await db.CompteAgent.destroy({ where: { agent_id: tmpId } });
  await db.Agent.destroy({ where: { id: tmpId } });

  /* ── 4. Rotation du refresh token + détection de réutilisation ───── */
  const refresh1 = await call('/auth/refresh-token', {
    method: 'POST',
    body: { refreshToken: adminRefresh },
  });
  ok('POST /auth/refresh-token (rotation)', refresh1.status, 200);
  const newRefresh = refresh1.data?.data?.refreshToken;
  const reuse = await call('/auth/refresh-token', {
    method: 'POST',
    body: { refreshToken: adminRefresh },
  });
  ok('Réutilisation ancien refresh -> 401', reuse.status, 401);

  /* ── 5. Déconnexion : refresh révoqué ───────────────────────────── */
  const counterLogin = await call('/auth/login', {
    method: 'POST',
    body: { email: 'counter@bustixconnect.com', motDePasse: 'Counter@123' },
  });
  ok('Login counter', counterLogin.status, 200);
  const counterRefresh = counterLogin.data?.data?.refreshToken;

  const logout = await call('/auth/logout', {
    method: 'POST',
    body: { refreshToken: counterRefresh },
  });
  ok('POST /auth/logout', logout.status, 200);
  const refreshAfterLogout = await call('/auth/refresh-token', {
    method: 'POST',
    body: { refreshToken: counterRefresh },
  });
  ok('Refresh après logout -> 401', refreshAfterLogout.status, 401);

  /* ── 6. Mot de passe oublié (pas d'énumération) ─────────────────── */
  const forgot = await call('/auth/forgot-password', {
    method: 'POST',
    body: { email: 'company@bustixconnect.com' },
  });
  ok('POST /auth/forgot-password', forgot.status, 200);
  const forgotUnknown = await call('/auth/forgot-password', {
    method: 'POST',
    body: { email: 'missing@example.com' },
  });
  ok('Forgot email inconnu -> 200', forgotUnknown.status, 200);

  /* ── 7. Réinitialisation du mot de passe ────────────────────────── */
  const companyAgent = await db.Agent.findOne({ where: { email: 'company@bustixconnect.com' } });
  const resetRaw = crypto.randomBytes(32).toString('hex');
  await db.PasswordResetToken.create({
    agent_id: companyAgent.id,
    token_hash: hashToken(resetRaw),
    expires_at: new Date(Date.now() + 60 * 60 * 1000),
  });
  const reset = await call('/auth/reset-password', {
    method: 'POST',
    body: { token: resetRaw, motDePasse: 'Temp@456' },
  });
  ok('POST /auth/reset-password', reset.status, 200);

  const relogin = await call('/auth/login', {
    method: 'POST',
    body: { email: 'company@bustixconnect.com', motDePasse: 'Temp@456' },
  });
  ok('Login avec nouveau mot de passe', relogin.status, 200);
  const companyToken = relogin.data?.data?.token;

  const resetUsedAgain = await call('/auth/reset-password', {
    method: 'POST',
    body: { token: resetRaw, motDePasse: 'Temp@789' },
  });
  ok('Réutilisation jeton reset -> 400', resetUsedAgain.status, 400);

  /* ── 8. Profil + changement de mot de passe ─────────────────────── */
  const patchProfile = await call('/auth/profile', {
    method: 'PATCH',
    token: companyToken,
    body: { prenom: 'Marie-Claire', langue: 'fr' },
  });
  ok('PATCH /auth/profile', patchProfile.status, 200, patchProfile.data?.data?.firstName || '');

  const changePwd = await call('/auth/change-password', {
    method: 'PATCH',
    token: companyToken,
    body: { motDePasseActuel: 'Temp@456', nouveauMotDePasse: 'Company@123' },
  });
  ok('PATCH /auth/change-password', changePwd.status, 200);

  const wrongCurrent = await call('/auth/change-password', {
    method: 'PATCH',
    token: companyToken,
    body: { motDePasseActuel: 'Nope@000', nouveauMotDePasse: 'Company@123' },
  });
  ok('Change-password mauvais actuel -> 401', wrongCurrent.status, 401);

  /* ── 9. Vérification d'email ────────────────────────────────────── */
  const verifyRaw = crypto.randomBytes(32).toString('hex');
  await db.EmailVerificationToken.create({
    agent_id: companyAgent.id,
    token_hash: hashToken(verifyRaw),
    email: 'company@bustixconnect.com',
    expires_at: new Date(Date.now() + 24 * 3600 * 1000),
  });
  const verify = await call('/auth/verify-email', { method: 'POST', body: { token: verifyRaw } });
  ok('POST /auth/verify-email', verify.status, 200);
  const verifiedNow = await db.Agent.findByPk(companyAgent.id);
  ok('Agent marqué vérifié en base', verifiedNow.verifie ? 200 : 500, 200);

  /* ── 10. Validation d'entrées invalides ─────────────────────────── */
  const badLoginSchema = await call('/auth/login', {
    method: 'POST',
    body: { email: 'pas-un-email', motDePasse: 'x' },
  });
  ok('Login invalide -> 400', badLoginSchema.status, 400);
  const badRefresh = await call('/auth/refresh-token', { method: 'POST', body: {} });
  ok('Refresh sans token -> 400', badRefresh.status, 400);

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS AUTH ═══════');
  let failures = 0;
  for (const [name, status, expected, extra = ''] of steps) {
    const pass = status === expected;
    if (!pass) failures += 1;
    console.log(`${pass ? '✔' : '✘'} ${name} -> ${status} (attendu ${expected}) ${extra}`.trim());
  }
  console.log(`\n${steps.length - failures}/${steps.length} tests passés.`);
  process.exit(failures ? 1 : 0);
})().catch(async (e) => {
  console.error('Erreur réseau/test :', e.message);
  process.exit(1);
});
