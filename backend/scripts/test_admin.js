/* =====================================================================
   Tests d'intégration du MODULE 19 — ADMINISTRATION SUPER ADMIN
   Exécution : node scripts/test_admin.js
   Nécessite : serveur démarré sur le port 5000 (module admin chargé)
               et MySQL actif.
   Couvre (18 scénarios obligatoires) :
     1.  Auth : endpoint admin sans token → 401.
     2.  RBAC : /admin/audit-logs refusé au company_admin → 403.
     3.  RBAC : /admin/audit-logs refusé au client → 403.
     4.  RBAC : /admin/payments refusé au company_admin → 403.
     5.  Le login du super_admin écrit une entrée `login` au journal.
     6.  Pagination : page/limit + calcul des pages.
     7.  Filtre action=login.
     8.  Filtre entite=compagnie.
     9.  Filtre dateDebut/dateFin (et 400 si dateFin < dateDebut).
    10.  Validation : action inconnue / limit > 100 → 400.
    11.  KPIs /admin/audit-logs/stats (total, logins, byAction, byEntite, byRole).
    12.  Sérialisation : aucune donnée sensible, `details` parsé en objet.
    13.  GET /admin/audit-logs/:id → 200 ; id inconnu → 404.
    14.  Création utilisateur → entrée journal `utilisateur/create` (email, sans mot de passe).
    15.  Changement de statut utilisateur → entrée journal `utilisateur/reactivate`.
    16.  Création de plan → entrée journal `plan/create`.
    17.  Paiements opérationnels : liste globale + stats XAF (toutes compagnies).
    18.  Nettoyage complet (utilisateur, plan, entrées de journal de test).
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
    if (/password|passwd|hash|secret|refreshToken|signature|token|motDePasse|mot_de_passe|jeton/i.test(key)) return true;
    if (typeof obj[key] === 'object' && hasSensitive(obj[key])) return true;
  }
  return false;
};

const loginAgent = async (email, motDePasse) => {
  const r = await call('/auth/login', { method: 'POST', body: { email, motDePasse } });
  return r.data?.data?.token || null;
};

const UNIQUE = Date.now().toString(36).toUpperCase();
const SUF = UNIQUE.slice(-6);
const TEST_AGENT_ID = `AU${SUF}`;
const TEST_PLAN_ID = `PL${SUF}`;
const TEST_EMAIL = `adm.${UNIQUE.toLowerCase()}@test.com`;
const TEST_AGENT_MARKERS = [TEST_AGENT_ID, TEST_PLAN_ID, TEST_EMAIL];

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);
  const assert = (name, cond, extra = '') =>
    ok(name, cond ? 200 : 500, 200, extra);
  const d = (payload) => payload?.data?.data;

  /* Nettoyage idempotent (relances sûres) : résidus des exécutions passées
     portant les mêmes marqueurs UNIQUE/SUF. */
  const cleanup = async () => {
    try {
      await db.AuditLog.destroy({
        where: {
          [db.Sequelize.Op.or]: [
            { entite_id: { [db.Sequelize.Op.in]: TEST_AGENT_MARKERS } },
            { utilisateur: TEST_EMAIL },
            { details: { [db.Sequelize.Op.like]: '%Test module 19%' } },
          ],
        },
      }).catch(() => {});
      const agent = await db.Agent.findOne({ where: { id: TEST_AGENT_ID } });
      if (agent) {
        await db.RefreshToken.destroy({ where: { agent_id: TEST_AGENT_ID } }).catch(() => {});
        await db.SessionConnexion.destroy({ where: { agent_id: TEST_AGENT_ID } }).catch(() => {});
        await db.CompteAgent.destroy({ where: { agent_id: TEST_AGENT_ID } }).catch(() => {});
        await db.Agent.destroy({ where: { id: TEST_AGENT_ID } }).catch(() => {});
      }
      await db.PlanAbonnement?.destroy({ where: { id: TEST_PLAN_ID } }).catch(() => {});
    } catch (e) { console.warn(`[cleanup] ${e.message}`); }
  };

  /* ── Pré-nettoyage + connexions ─────────────────────────────────── */
  await cleanup();
  const adminToken = await loginAgent('admin@bustixconnect.com', 'Admin@123');
  ok('Login super_admin', adminToken ? 200 : 500, 200);
  const companyToken = await loginAgent('company@bustixconnect.com', 'Company@123');
  ok('Login company_admin (C001)', companyToken ? 200 : 500, 200);

  /* Client pour les tests RBAC. */
  const reg = await call('/auth/register-client', {
    method: 'POST',
    body: {
      prenom: 'Audit', nom: 'RBAC',
      telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      email: `adm.rbac.${UNIQUE.toLowerCase()}@test.com`,
      motDePasse: 'Client@123', pays: 'Cameroun', ville: 'Douala',
    },
  });
  const clientToken = reg.data?.data?.token;
  const clientId = reg.data?.data?.user?.id;
  ok('Inscription client RBAC', clientToken ? 201 : 500, 201);

  /* ══════════════════════════════════════════════════════════════════
     SC 1 à 4 — Auth + RBAC
     ══════════════════════════════════════════════════════════════════ */
  const anon = await call('/admin/audit-logs');
  ok('SC1 GET /admin/audit-logs sans token → 401', anon.status, 401, `status=${anon.status}`);

  const coAudit = await call('/admin/audit-logs', { token: companyToken });
  ok('SC2 GET /admin/audit-logs company_admin → 403', coAudit.status, 403, `status=${coAudit.status}`);
  const coStats = await call('/admin/audit-logs/stats', { token: companyToken });
  ok('SC2 GET /admin/audit-logs/stats company_admin → 403', coStats.status, 403, `status=${coStats.status}`);

  const clAudit = await call('/admin/audit-logs', { token: clientToken });
  ok('SC3 GET /admin/audit-logs client → 403', clAudit.status, 403, `status=${clAudit.status}`);

  const coPay = await call('/admin/payments', { token: companyToken });
  ok('SC4 GET /admin/payments company_admin → 403', coPay.status, 403, `status=${coPay.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SC 5 — Le login du super_admin est journalisé
     ══════════════════════════════════════════════════════════════════ */
  const auditLogin = await call('/admin/audit-logs?action=login&limit=10', { token: adminToken });
  const loginItems = d(auditLogin)?.items || [];
  const foundSuperLogin = loginItems.some((i) => i.action === 'login' && i.role === 'super_admin');
  ok('SC5 Entrée login super_admin au journal', auditLogin.status === 200 && foundSuperLogin ? 200 : 500, 200,
    `n=${loginItems.length}`);

  /* ══════════════════════════════════════════════════════════════════
     SC 6 — Pagination
     ══════════════════════════════════════════════════════════════════ */
  const listAll = await call('/admin/audit-logs?page=1&limit=25', { token: adminToken });
  const allData = d(listAll);
  ok('SC6 GET /admin/audit-logs → 200', listAll.status, 200, `status=${listAll.status}`);
  ok('SC6 items est un tableau', Array.isArray(allData?.items) ? 200 : 500, 200, `n=${allData?.items?.length}`);
  ok('SC6 pagination.total > 0', (allData?.pagination?.total || 0) > 0 ? 200 : 500, 200, `total=${allData?.pagination?.total}`);
  ok('SC6 pagination.page = 1', allData?.pagination?.page === 1 ? 200 : 500, 200, `page=${allData?.pagination?.page}`);
  ok('SC6 pagination.pages calculé', (allData?.pagination?.pages || 0) >= 1 ? 200 : 500, 200, `pages=${allData?.pagination?.pages}`);
  ok('SC6 items triés du plus récent au plus ancien',
    allData?.items?.length > 1 ? new Date(allData.items[0].date) >= new Date(allData.items[1].date) ? 200 : 500 : 200, 200);

  /* ══════════════════════════════════════════════════════════════════
     SC 7 — Filtre action=login
     ══════════════════════════════════════════════════════════════════ */
  const onlyLogin = d(auditLogin)?.items || [];
  ok('SC7 Filtre action=login : toutes les lignes sont des login',
    onlyLogin.length > 0 && onlyLogin.every((i) => i.action === 'login') ? 200 : 500, 200,
    `n=${onlyLogin.length}`);

  /* ══════════════════════════════════════════════════════════════════
     SC 8 — Filtre entite=compagnie (via une action de statut compagnie)
     ══════════════════════════════════════════════════════════════════ */
  const c001Before = await call('/companies/C001', { token: adminToken });
  const c001Statut = d(c001Before)?.statut || 'actif';
  const companyStatus = await call('/companies/C001/status', {
    method: 'PATCH',
    token: adminToken,
    body: { statut: 'actif', raison: 'Test module 19' },
  });
  ok('SC8 PATCH /companies/C001/status → 200', companyStatus.status, 200, `status=${companyStatus.status}`);
  const compAudit = await call('/admin/audit-logs?entite=compagnie&limit=10', { token: adminToken });
  const compItems = d(compAudit)?.items || [];
  ok('SC8 Filtre entite=compagnie : entrée journalisée', compItems.length > 0 ? 200 : 500, 200, `n=${compItems.length}`);
  ok('SC8 Toutes les lignes ont entite=compagnie', compItems.every((i) => i.entite === 'compagnie') ? 200 : 500, 200,
    `n=${compItems.length}`);
  if (c001Statut !== 'actif') {
    await call('/companies/C001/status', {
      method: 'PATCH',
      token: adminToken,
      body: { statut: c001Statut, raison: 'Test module 19 (restauration)' },
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     SC 9 — Filtre dateDebut/dateFin
     ══════════════════════════════════════════════════════════════════ */
  const todayIso = new Date().toISOString().slice(0, 10);
  const dateAudit = await call(`/admin/audit-logs?dateDebut=${todayIso}&dateFin=${todayIso}`, { token: adminToken });
  ok('SC9 Filtre dateDebut/dateFin → 200', dateAudit.status, 200, `status=${dateAudit.status}`);
  const badRange = await call('/admin/audit-logs?dateDebut=2026-08-20&dateFin=2026-08-10', { token: adminToken });
  ok('SC9 dateFin < dateDebut → 400', badRange.status, 400, `status=${badRange.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SC 10 — Validation des filtres
     ══════════════════════════════════════════════════════════════════ */
  const badAction = await call('/admin/audit-logs?action=hack', { token: adminToken });
  ok('SC10 action inconnue → 400', badAction.status, 400, `status=${badAction.status}`);
  const bigLimit = await call('/admin/audit-logs?limit=500', { token: adminToken });
  ok('SC10 limit > 100 → 400', bigLimit.status, 400, `status=${bigLimit.status}`);
  const badDate = await call('/admin/audit-logs?dateDebut=20-08-2026', { token: adminToken });
  ok('SC10 dateDebut mal formée → 400', badDate.status, 400, `status=${badDate.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SC 11 — KPIs du journal d'audit
     ══════════════════════════════════════════════════════════════════ */
  const statsRes = await call('/admin/audit-logs/stats', { token: adminToken });
  const stats = d(statsRes);
  ok('SC11 GET /admin/audit-logs/stats → 200', statsRes.status, 200, `status=${statsRes.status}`);
  ok('SC11 stats.total > 0', (stats?.total || 0) > 0 ? 200 : 500, 200, `total=${stats?.total}`);
  ok('SC11 stats.logins > 0', (stats?.logins || 0) > 0 ? 200 : 500, 200, `logins=${stats?.logins}`);
  ok('SC11 stats.byAction est un objet', stats?.byAction && typeof stats.byAction === 'object' ? 200 : 500, 200);
  ok('SC11 stats.byEntite est un objet', stats?.byEntite && typeof stats.byEntite === 'object' ? 200 : 500, 200);
  ok('SC11 stats.byRole est un objet', stats?.byRole && typeof stats.byRole === 'object' ? 200 : 500, 200, JSON.stringify(stats?.byRole));

  /* ══════════════════════════════════════════════════════════════════
     SC 12 — Sérialisation : aucune donnée sensible
     ══════════════════════════════════════════════════════════════════ */
  const sample = allData?.items?.[0];
  ok('SC12 item expose id/action/entite/date', sample && sample.id && sample.action && sample.entite && sample.date ? 200 : 500, 200);
  ok('SC12 aucune donnée sensible dans la liste', !hasSensitive(allData) ? 200 : 500, 200);
  ok('SC12 aucune donnée sensible dans les stats', !hasSensitive(stats) ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SC 13 — Détail d'une entrée
     ══════════════════════════════════════════════════════════════════ */
  const detail = await call(`/admin/audit-logs/${sample?.id}`, { token: adminToken });
  ok('SC13 GET /admin/audit-logs/:id → 200', detail.status, 200, `status=${detail.status}`);
  ok('SC13 détail.id correspond', detail.status === 200 && d(detail)?.id === sample?.id ? 200 : 500, 200);
  const missing = await call('/admin/audit-logs/99999999', { token: adminToken });
  ok('SC13 id inconnu → 404', missing.status, 404, `status=${missing.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SC 14 à 16 — Les actions du super admin sont journalisées
     ══════════════════════════════════════════════════════════════════ */
  const createdUser = await call('/users', {
    method: 'POST',
    token: adminToken,
    body: {
      prenom: 'Audit', nom: 'Test', email: TEST_EMAIL,
      telephone: '+237690000123', role: 'counter_agent',
      genre: 'M', agence_id: 'AG00000001', motDePasse: 'Audit@123',
    },
  });
  ok('SC14 POST /users → 201', createdUser.status, 201, `status=${createdUser.status}`);
  const createdUserId = d(createdUser)?.id;

  const userAudit = await call(`/admin/audit-logs?entite=utilisateur&search=${TEST_EMAIL}&limit=10`, { token: adminToken });
  const userItems = d(userAudit)?.items || [];
  const createUserEntry = userItems.find((i) => i.action === 'create');
  ok('SC14 entrée utilisateur/create journalisée', createUserEntry ? 200 : 500, 200, `n=${userItems.length}`);
  ok('SC14 détails sans mot de passe', createUserEntry && !JSON.stringify(createUserEntry.details || {}).match(/motDePasse|password/i) ? 200 : 500, 200,
    JSON.stringify(createUserEntry?.details));

  const statusChange = await call('/users/status', {
    method: 'PATCH',
    token: adminToken,
    body: { id: createdUserId, statut: 'suspendu', raison: 'Test module 19' },
  });
  ok('SC15 PATCH /users/status → 200', statusChange.status, 200, `status=${statusChange.status}`);
  const statusAudit = await call(`/admin/audit-logs?entite=utilisateur&action=suspend&limit=10`, { token: adminToken });
  ok('SC15 entrée utilisateur/suspend journalisée',
    statusAudit.status === 200 && (d(statusAudit)?.items || []).length > 0 ? 200 : 500, 200,
    `n=${(d(statusAudit)?.items || []).length}`);

  const createdPlan = await call('/plans', {
    method: 'POST',
    token: adminToken,
    body: { code: `T${SUF}`, nom: `Plan Audit ${SUF}`, prix_mensuel: 1000, duree_jours: 30 },
  });
  ok('SC16 POST /plans → 201', createdPlan.status, 201, `status=${createdPlan.status}`);
  const planAudit = await call('/admin/audit-logs?entite=plan&action=create&limit=10', { token: adminToken });
  ok('SC16 entrée plan/create journalisée',
    planAudit.status === 200 && (d(planAudit)?.items || []).some((i) => i.entite === 'plan') ? 200 : 500, 200,
    `n=${(d(planAudit)?.items || []).length}`);

  /* ══════════════════════════════════════════════════════════════════
     SC 17 — Paiements opérationnels globaux (toutes compagnies)
     ══════════════════════════════════════════════════════════════════ */
  const payList = await call('/admin/payments?limit=5', { token: adminToken });
  const payData = d(payList);
  ok('SC17 GET /admin/payments → 200', payList.status, 200, `status=${payList.status}`);
  ok('SC17 items est un tableau', Array.isArray(payData?.items) ? 200 : 500, 200, `n=${payData?.items?.length}`);
  ok('SC17 pagination présente', payData?.pagination && typeof payData.pagination.total === 'number' ? 200 : 500, 200);

  const payStats = await call('/admin/payments/stats', { token: adminToken });
  const payStatsData = d(payStats);
  ok('SC17 GET /admin/payments/stats → 200', payStats.status, 200, `status=${payStats.status}`);
  ok('SC17 stats.parStatut présent', payStatsData?.parStatut ? 200 : 500, 200);
  ok('SC17 stats.parCompagnie présent', Array.isArray(payStatsData?.parCompagnie) ? 200 : 500, 200,
    `n=${payStatsData?.parCompagnie?.length}`);
  const payItems = payData?.items || [];
  ok('SC17 devise XAF sur chaque paiement', payItems.length > 0 && payItems.every((p) => p.devise === 'XAF') ? 200 : 500, 200,
    `n=${payItems.length}`);
  ok('SC17 montants entiers XAF (aucune décimale)',
    (payItems.length > 0 && payItems.every((p) => Number.isInteger(p.montant)))
    && ['total', 'encaisse', 'rembourse', 'remboursePartiel', 'netRevenu', 'week']
      .every((k) => Number.isInteger(payStatsData?.[k])) ? 200 : 500, 200,
    `encaisse=${payStatsData?.encaisse}`);
  ok('SC17 aucune donnée sensible', !hasSensitive(payList) && !hasSensitive(payStats) ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SC 18 — Nettoyage complet
     ══════════════════════════════════════════════════════════════════ */
  await cleanup();
  const afterUser = await db.Agent.count({ where: { id: TEST_AGENT_ID } });
  const afterPlan = await db.PlanAbonnement?.count({ where: { id: TEST_PLAN_ID } }) ?? 0;
  const afterAudit = await db.AuditLog.count({
    where: {
      [db.Sequelize.Op.or]: [
        { entite_id: { [db.Sequelize.Op.in]: TEST_AGENT_MARKERS } },
        { utilisateur: TEST_EMAIL },
      ],
    },
  });
  ok('SC18 Nettoyage : utilisateur de test supprimé', afterUser === 0 ? 200 : 500, 200, `agents=${afterUser}`);
  ok('SC18 Nettoyage : plan de test supprimé', afterPlan === 0 ? 200 : 500, 200, `plans=${afterPlan}`);
  ok('SC18 Nettoyage : entrées de journal de test purgées', afterAudit === 0 ? 200 : 500, 200, `audit=${afterAudit}`);
  if (clientId) {
    await db.RefreshToken.destroy({ where: { client_id: clientId } }).catch(() => {});
    await db.SessionConnexion.destroy({ where: { client_id: clientId } }).catch(() => {});
    await db.Client.destroy({ where: { id: clientId } }).catch(() => {});
  }

  /* ── Rapport ─────────────────────────────────────────────────────── */
  console.log('\n════════ RAPPORT TEST ADMIN (MODULE 19) ════════');
  const fails = steps.filter(([, s, e]) => s !== e);
  for (const [name, s, e, extra] of steps) {
    const okk = s === e;
    console.log(`  ${okk ? '✔' : '✘'} ${name} → ${s}${extra ? ` (${extra})` : ''}${okk ? '' : ` [attendu ${e}]`}`);
  }
  console.log(`\n  RÉSULTAT : ${steps.length - fails.length}/${steps.length} scénarios OK`);
  if (fails.length) {
    console.error(`  ÉCHECS (${fails.length}) :`);
    for (const f of fails) console.error(`    - ${f[0]} → ${f[1]} (attendu ${f[2]}) ${f[3] || ''}`);
  }
  await db.sequelize.close();
  process.exit(fails.length ? 1 : 0);
})().catch(async (err) => {
  console.error('ERREUR FATALE:', err);
  try { await db.sequelize.close(); } catch (_) { /* noop */ }
  process.exit(1);
});
