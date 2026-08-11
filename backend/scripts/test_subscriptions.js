const BASE = 'http://localhost:5000/api/v1';

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

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push({ name, status, expected, extra });

  /* 1. Login super_admin */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  ok('Login admin', login.status, 200, login.data.message || login.data.error || '');

  if (login.status !== 200) {
    console.log(steps.map((s) => `${s.name} -> ${s.status}`).join('\n'));
    process.exit(1);
  }
  const adminToken = login.data.token || login.data.data?.token;

  /* 2. Login company_admin */
  const companyLogin = await call('/auth/login', {
    method: 'POST',
    body: { email: 'company@bustixconnect.com', motDePasse: 'Company@123' },
  });
  ok('Login company', companyLogin.status, 200);
  const companyToken = companyLogin.data.token || companyLogin.data.data?.token;

  /* 3. GET /plans */
  const plans = await call('/plans', { token: adminToken });
  ok('GET /plans', plans.status, 200, `plans=${plans.data?.data?.length}`);

  /* 4. GET /subscriptions */
  const subs = await call('/subscriptions', { token: adminToken });
  ok('GET /subscriptions', subs.status, 200, `subs=${subs.data?.data?.length}`);

  /* 5. GET /subscriptions/mine (company) */
  const mine = await call('/subscriptions/mine', { token: companyToken });
  ok('GET /subscriptions/mine (company)', mine.status, 200, mine.data?.data?.statut ?? mine.data?.error);

  /* 6. POST /payments */
  const pay = await call('/payments', {
    method: 'POST',
    token: adminToken,
    body: {
      abonnement_compagnie_id: 1,
      plan_id: 2,
      montant: 25000,
      methode: 'virement_bancaire',
      statut: 'paye',
    },
  });
  ok('POST /payments', pay.status, 201, pay.data?.data?.reference ?? pay.data?.error);

  /* 7. GET /revenue */
  const revenue = await call('/revenue', { token: adminToken });
  ok('GET /revenue', revenue.status, 200, `mrr=${revenue.data?.data?.mrr}`);

  /* 8. GET /notifications */
  const notifs = await call('/notifications', { token: adminToken });
  ok('GET /notifications', notifs.status, 200, `count=${notifs.data?.data?.length}`);

  /* 9. RBAC : company sur /plans (lecture autorisée) */
  const plansCompany = await call('/plans', { token: companyToken });
  ok('GET /plans (company)', plansCompany.status, 200, `plans=${plansCompany.data?.data?.length}`);

  /* 10. RBAC : company interdit POST /plans */
  const postPlansCompany = await call('/plans', { method: 'POST', token: companyToken, body: { code: 'X', nom: 'X', prix_mensuel: 0 } });
  ok('POST /plans (company) -> 403', postPlansCompany.status, 403, postPlansCompany.data?.error);

  /* 11. Validation Zod : POST /plans invalide */
  const badPlan = await call('/plans', { method: 'POST', token: adminToken, body: { code: '', nom: '', prix_mensuel: -5 } });
  ok('POST /plans invalide -> 400', badPlan.status, 400, badPlan.data?.error);

  /* 12. Blocage : suspendre C001, company_admin doit être bloqué sur /compagnies */
  const suspend = await call('/subscriptions/C001/suspend', {
    method: 'POST',
    token: adminToken,
    body: { motif: 'test blocage' },
  });
  ok('POST /subscriptions/C001/suspend', suspend.status, 200, suspend.data?.data?.statut);

  const blocked = await call('/compagnies', { token: companyToken });
  ok('GET /compagnies (company, suspendu) -> 403', blocked.status, 403, blocked.data?.error);

  /* 13. Réactivation */
  const reactivate = await call('/subscriptions/C001/reactivate', { method: 'POST', token: adminToken });
  ok('POST /subscriptions/C001/reactivate', reactivate.status, 200, reactivate.data?.data?.statut);

  console.log('\n═══════ RÉSULTATS TESTS ABONNEMENTS ═══════');
  let failures = 0;
  for (const { name, status, expected, extra = '' } of steps) {
    const pass = status === expected;
    if (!pass) failures += 1;
    console.log(`${pass ? '✔' : '✘'} ${name} -> ${status} (attendu ${expected}) ${extra}`.trim());
  }
  console.log(`\n${steps.length - failures}/${steps.length} tests passés.`);
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error('Erreur réseau/test :', e.message);
  process.exit(1);
});
