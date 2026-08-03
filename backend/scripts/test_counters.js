/* =====================================================================
   Tests d'intégration du module COUNTERS (guichets) — backend local
   Exécution : node scripts/test_counters.js
   Nécessite : serveur démarré (module counters chargé) + migration appliquée.
   Couvre : CRUD, statuts, affectation/retrait/transfert d'agents,
            /guichets/mine (dashboard counter_agent), KPIs, pagination,
            filtres, permissions.
   ===================================================================== */
const BASE = 'http://localhost:5000/api/v1';

const db = require('../src/models');
const { hashPassword } = require('../src/utils/password');

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
  nom: `Guichets Test ${UNIQUE}`,
  email: `guichets_${UNIQUE}@example.com`,
  plan: 'standard',
};
const AGENCY_1 = {
  nom: `Agence Guichet A ${UNIQUE}`,
  villeId: 'DLA',
  type: 'gare',
  statut: 'actif',
};
const AGENCY_2 = {
  nom: `Agence Guichet B ${UNIQUE}`,
  villeId: 'YDE',
  type: 'agence',
  statut: 'actif',
};
const AGENT_PASSWORD = 'GuichetAgent@123';

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  let companyId = null;
  let agency1Id = null;
  let agency2Id = null;
  let guichet1Id = null;
  let guichet2Id = null;
  let agentId = null;

  /* ── 1. Connexion super admin ───────────────────────────────────── */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login super admin', login.status, 200, login.data?.data?.user?.role || '');
  const adminToken = login.data?.data?.token;

  /* ── 2. Compagnie + agences de test ─────────────────────────────── */
  const company = await call('/companies', { method: 'POST', token: adminToken, body: COMPANY });
  ok('POST /companies (compagnie de test)', company.status, 201);
  companyId = company.data?.data?.id;

  const ag1 = await call('/agencies', { method: 'POST', token: adminToken, body: { ...AGENCY_1, compagnieId: companyId } });
  ok('POST /agencies (agence A)', ag1.status, 201);
  agency1Id = ag1.data?.data?.id;

  const ag2 = await call('/agencies', { method: 'POST', token: adminToken, body: { ...AGENCY_2, compagnieId: companyId } });
  ok('POST /agencies (agence B)', ag2.status, 201);
  agency2Id = ag2.data?.data?.id;

  /* ── 3. CRUD guichets ───────────────────────────────────────────── */
  const created = await call('/guichets', {
    method: 'POST', token: adminToken,
    body: { agenceId: agency1Id, nom: `Guichet Principal ${UNIQUE}`, type: 'vente_billets', statut: 'ouvert' },
  });
  ok('POST /guichets (création)', created.status, 201, created.data?.data?.code || '');
  ok('Guichet créé sans secret', hasSensitive(created.data?.data) ? 500 : 200, 200);
  guichet1Id = created.data?.data?.id;
  ok('ID guichet format GC########', /^GC\d{8}$/.test(guichet1Id || '') ? 200 : 500, 200, guichet1Id || '');
  ok('Code généré GC-XXXX', /^GC-[A-Z0-9]{4}$/.test(created.data?.data?.code || '') ? 200 : 500, 200);
  ok('Agence du guichet résolue', created.data?.data?.agenceId === agency1Id ? 200 : 500, 200);
  ok('Ville du guichet résolue', created.data?.data?.city === 'Douala' ? 200 : 500, 200, created.data?.data?.city || '');
  ok('Statut par défaut ouvert', created.data?.data?.statut === 'ouvert' ? 200 : 500, 200);

  const createdDb = await db.Guichet.findByPk(guichet1Id);
  ok('Guichet en base', createdDb?.statut === 'ouvert' ? 200 : 500, 200);

  const badCreate = await call('/guichets', { method: 'POST', token: adminToken, body: {} });
  ok('POST /guichets sans agence -> 400', badCreate.status, 400);

  const wrongAgency = await call('/guichets', {
    method: 'POST', token: adminToken, body: { agenceId: 'AG00000000', nom: 'Orphelin' },
  });
  ok("POST /guichets agence inconnue -> 400", wrongAgency.status, 400);

  const dup = await call('/guichets', {
    method: 'POST', token: adminToken,
    body: { agenceId: agency1Id, code: created.data?.data?.code, nom: 'Code dupliqué' },
  });
  ok('POST /guichets code dupliqué -> 409', dup.status, 409);

  const second = await call('/guichets', {
    method: 'POST', token: adminToken,
    body: { agenceId: agency2Id, nom: `Guichet Secondaire ${UNIQUE}`, type: 'caisse', statut: 'maintenance' },
  });
  ok('POST /guichets (2e)', second.status, 201);
  guichet2Id = second.data?.data?.id;

  /* ── 4. Liste + filtres + tri ───────────────────────────────────── */
  const list = await call('/guichets?page=1&limit=1&sort=newest', { token: adminToken });
  ok('GET /guichets paginé', list.status, 200, `total=${list.data?.data?.total}`);

  const filterAgence = await call(`/guichets?agenceId=${agency1Id}`, { token: adminToken });
  ok('GET /guichets filtre agence', filterAgence.status, 200, `total=${filterAgence.data?.data?.total}`);
  ok('Filtre agence correct', filterAgence.data?.data?.items?.every((g) => g.agenceId === agency1Id) ? 200 : 500, 200);

  const filterStatut = await call('/guichets?statut=maintenance', { token: adminToken });
  ok('GET /guichets filtre statut', filterStatut.status, 200, `total=${filterStatut.data?.data?.total}`);

  const sortCode = await call('/guichets?sort=code_asc', { token: adminToken });
  ok('GET /guichets tri code_asc', sortCode.status, 200);

  const noAuth = await call('/guichets');
  ok('GET /guichets sans token -> 401', noAuth.status, 401);

  /* ── 5. Détail + édition + statut ───────────────────────────────── */
  const detail = await call(`/guichets/${guichet1Id}`, { token: adminToken });
  ok('GET /guichets/:id', detail.status, 200, detail.data?.data?.nom || '');
  ok('Détail lié à la bonne agence', detail.data?.data?.agenceId === agency1Id ? 200 : 500, 200);

  const updated = await call(`/guichets/${guichet1Id}`, {
    method: 'PATCH', token: adminToken, body: { nom: 'Guichet Principal Rénové', description: 'après travaux' },
  });
  ok('PATCH /guichets/:id', updated.status, 200, updated.data?.data?.nom || '');

  const notFound = await call('/guichets/GC00000000', { token: adminToken });
  ok('GET /guichets/:id inconnu -> 404', notFound.status, 404);

  const close = await call(`/guichets/${guichet1Id}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'ferme', raison: 'fin de journée' },
  });
  ok('PATCH /guichets/:id/status fermer', close.status, 200);
  const closedDb = await db.Guichet.findByPk(guichet1Id);
  ok('Statut ferme en base', closedDb?.statut === 'ferme' ? 200 : 500, 200);

  const badStatus = await call(`/guichets/${guichet1Id}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'en_construction' },
  });
  ok('PATCH /guichets/:id/status invalide -> 400', badStatus.status, 400);

  const reopen = await call(`/guichets/${guichet1Id}/status`, {
    method: 'PATCH', token: adminToken, body: { statut: 'ouvert' },
  });
  ok('PATCH /guichets/:id/status rouvrir', reopen.status, 200);

  /* ── 6. Agent de guichet de test (créé en base) ─────────────────── */
  agentId = 'AG' + UNIQUE.slice(0, 8).padEnd(8, '0');
  const agent = await db.Agent.create({
    id: agentId,
    matricule: `MAT-${UNIQUE.slice(0, 6)}`,
    prenom: 'Guichet',
    nom: `Test ${UNIQUE.slice(0, 6)}`,
    email: `guichet_${UNIQUE.toLowerCase()}@example.com`,
    telephone: '+237699200002',
    role: 'counter_agent',
    date_embauche: new Date().toISOString().slice(0, 10),
    agence_id: agency1Id,
  });
  await db.CompteAgent.create({
    agent_id: agentId,
    email: agent.email,
    telephone: agent.telephone,
    mot_de_passe_hash: await hashPassword(AGENT_PASSWORD),
  });
  ok('Agent de guichet inséré en base', agent?.id === agentId ? 200 : 500, 200);

  /* ── 7. Affectation / retrait / transfert ───────────────────────── */
  const assign = await call(`/guichets/${guichet1Id}/agents`, {
    method: 'PATCH', token: adminToken, body: { agentIds: [agentId] },
  });
  ok('PATCH /guichets/:id/agents (affectation)', assign.status, 200, `agents=${assign.data?.data?.agents}`);

  const assignedDb = await db.Agent.findByPk(agentId);
  ok('Agent affecté au guichet en base', assignedDb?.guichet_id === guichet1Id ? 200 : 500, 200);

  const assignForeign = await call(`/guichets/${guichet2Id}/agents`, {
    method: 'PATCH', token: adminToken, body: { agentIds: [agentId] },
  });
  ok("Affecter agent d'une autre agence -> 400", assignForeign.status, 400);

  const assignNone = await call(`/guichets/${guichet1Id}/agents`, {
    method: 'PATCH', token: adminToken, body: { agentIds: ['AG99999999'] },
  });
  ok("Affecter un agent inexistant -> 400", assignNone.status, 400);

  /* ── 8. /guichets/mine (dashboard counter_agent) ────────────────── */
  const cLogin = await call('/auth/login', {
    method: 'POST', body: { email: agent.email, motDePasse: AGENT_PASSWORD },
  });
  ok('Login counter_agent de test', cLogin.status, 200);
  const counterToken = cLogin.data?.data?.token;

  const mine = await call('/guichets/mine', { token: counterToken });
  ok('GET /guichets/mine', mine.status, 200, mine.data?.data?.guichet?.code || '');
  ok('Mine = guichet affecté', mine.data?.data?.guichet?.id === guichet1Id ? 200 : 500, 200);
  ok('Mine avec agence + ville', mine.data?.data?.guichet?.agenceName && mine.data?.data?.guichet?.city ? 200 : 500, 200);

  const counterDenied = await call('/guichets', { token: counterToken });
  ok('Counter : GET /guichets -> 403', counterDenied.status, 403);

  /* ── 9. KPIs ────────────────────────────────────────────────────── */
  const stats = await call('/guichets/stats', { token: adminToken });
  ok('GET /guichets/stats', stats.status, 200, `total=${stats.data?.data?.total}`);
  ok('Stats par statut', stats.data?.data?.parStatut?.ouvert >= 1 ? 200 : 500, 200);

  /* ── 10. Transfert d'agents ─────────────────────────────────────── */
  const transfer = await call(`/guichets/${guichet1Id}/agents/transfer`, {
    method: 'POST', token: adminToken,
    body: { agentIds: [agentId], toGuichetId: guichet2Id },
  });
  ok('POST /guichets/:id/agents/transfer', transfer.status, 200);

  const transferredDb = await db.Agent.findByPk(agentId);
  ok('Agent transféré (nouveau guichet)', transferredDb?.guichet_id === guichet2Id ? 200 : 500, 200);
  ok('Agent transféré (nouvelle agence)', transferredDb?.agence_id === agency2Id ? 200 : 500, 200);

  const badTransfer = await call(`/guichets/${guichet1Id}/agents/transfer`, {
    method: 'POST', token: adminToken,
    body: { agentIds: [agentId], toGuichetId: 'GC99999999' },
  });
  ok('Transfert vers guichet inconnu -> 404', badTransfer.status, 404);

  /* ── 11. Retrait d'agents ───────────────────────────────────────── */
  const remove = await call(`/guichets/${guichet2Id}/agents`, {
    method: 'DELETE', token: adminToken, body: { agentIds: [agentId] },
  });
  ok('DELETE /guichets/:id/agents (retrait)', remove.status, 200);
  const removedDb = await db.Agent.findByPk(agentId);
  ok('Agent désaffecté en base', removedDb?.guichet_id === null ? 200 : 500, 200);

  /* ── 12. Permissions company_admin ──────────────────────────────── */
  const caLogin = await call('/auth/login', {
    method: 'POST', body: { email: 'company@bustixconnect.com', motDePasse: 'Company@123' },
  });
  ok('Login company_admin', caLogin.status, 200);
  const companyToken = caLogin.data?.data?.token;

  const caSeeForeign = await call(`/guichets/${guichet1Id}`, { token: companyToken });
  ok('Company : guichet hors périmètre -> 403', caSeeForeign.status, 403);

  const caCreateForeign = await call('/guichets', {
    method: 'POST', token: companyToken,
    body: { agenceId: agency1Id, nom: 'Hors périmètre' },
  });
  ok('Company : création sur agence hors périmètre -> 403', caCreateForeign.status, 403);

  const caList = await call('/guichets', { token: companyToken });
  ok('Company : GET /guichets (périmètre)', caList.status, 200, `total=${caList.data?.data?.total}`);
  ok('Company : ne voit que ses guichets', caList.data?.data?.total === 0 ? 200 : 500, 200);

  /* ── 13. Suppression (soft : désaffectation + ferme) ────────────── */
  const del = await call(`/guichets/${guichet1Id}`, { method: 'DELETE', token: adminToken });
  ok('DELETE /guichets/:id', del.status, 200);
  const deletedDb = await db.Guichet.findByPk(guichet1Id);
  ok('Guichet en statut ferme (soft)', deletedDb?.statut === 'ferme' ? 200 : 500, 200);

  /* ── Nettoyage direct (hard delete des données de test) ─────────── */
  await db.RefreshToken.destroy({ where: { agent_id: agentId } });
  await db.SessionConnexion.destroy({ where: { agent_id: agentId } });
  await db.EmailVerificationToken.destroy({ where: { agent_id: agentId } });
  await db.PasswordResetToken.destroy({ where: { agent_id: agentId } });
  await db.CompteAgent.destroy({ where: { agent_id: agentId } });
  await db.Agent.destroy({ where: { id: agentId } });
  await db.Guichet.destroy({ where: { id: [guichet1Id, guichet2Id].filter(Boolean) } });
  await db.Agence.destroy({ where: { id: [agency1Id, agency2Id].filter(Boolean) } });
  if (companyId) {
    await db.Agence.destroy({ where: { compagnie_id: companyId } });
    await db.AbonnementCompagnie.destroy({ where: { compagnie_id: companyId } });
    await db.Compagnie.destroy({ where: { id: companyId } });
  }

  /* ── Résumé ─────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS COUNTERS ═══════');
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
