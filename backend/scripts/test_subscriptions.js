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

  /* 1. Login super_admin */
  const login = await call('/auth/login', {
    method: 'POST',
    body: { email: 'admin@bustixconnect.com', motDePasse: 'Admin@123' },
  });
  steps.push(['Login admin', login.status, login.data.message || login.data.error || '']);

  if (login.status !== 200) {
    console.log(steps.map((s) => `${s[0]} -> ${s[1]}`).join('\n'));
    process.exit(1);
  }
  const adminToken = login.data.token || login.data.data?.token;

  /* 2. Login company_admin */
  const companyLogin = await call('/auth/login', {
    method: 'POST',
    body: { email: 'company@bustixconnect.com', motDePasse: 'Company@123' },
  });
  steps.push(['Login company', companyLogin.status]);
  const companyToken = companyLogin.data.token || companyLogin.data.data?.token;

  /* 3. GET /plans */
  const plans = await call('/plans', { token: adminToken });
  steps.push(['GET /plans', plans.status, `plans=${plans.data?.data?.length}`]);

  /* 4. GET /subscriptions */
  const subs = await call('/subscriptions', { token: adminToken });
  steps.push(['GET /subscriptions', subs.status, `subs=${subs.data?.data?.length}`]);

  /* 5. GET /subscriptions/mine (company) */
  const mine = await call('/subscriptions/mine', { token: companyToken });
  steps.push(['GET /subscriptions/mine (company)', mine.status, mine.data?.data?.statut ?? mine.data?.error]);

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
  steps.push(['POST /payments', pay.status, pay.data?.data?.reference ?? pay.data?.error]);

  /* 7. GET /revenue */
  const revenue = await call('/revenue', { token: adminToken });
  steps.push(['GET /revenue', revenue.status, `mrr=${revenue.data?.data?.mrr}`]);

  /* 8. GET /notifications */
  const notifs = await call('/notifications', { token: adminToken });
  steps.push(['GET /notifications', notifs.status, `count=${notifs.data?.data?.length}`]);

  /* 9. RBAC : company sur /plans (lecture autorisée) */
  const plansCompany = await call('/plans', { token: companyToken });
  steps.push(['GET /plans (company)', plansCompany.status, `plans=${plansCompany.data?.data?.length}`]);

  /* 10. RBAC : company interdit POST /plans */
  const postPlansCompany = await call('/plans', { method: 'POST', token: companyToken, body: { code: 'X', nom: 'X', prix_mensuel: 0 } });
  steps.push(['POST /plans (company) -> 403', postPlansCompany.status, postPlansCompany.data?.error]);

  /* 11. Validation Zod : POST /plans invalide */
  const badPlan = await call('/plans', { method: 'POST', token: adminToken, body: { code: '', nom: '', prix_mensuel: -5 } });
  steps.push(['POST /plans invalide -> 400', badPlan.status, badPlan.data?.error]);

  /* 12. Blocage : suspendre C001, company_admin doit être bloqué sur /compagnies */
  const suspend = await call('/subscriptions/C001/suspend', {
    method: 'POST',
    token: adminToken,
    body: { motif: 'test blocage' },
  });
  steps.push(['POST /subscriptions/C001/suspend', suspend.status, suspend.data?.data?.statut]);

  const blocked = await call('/compagnies', { token: companyToken });
  steps.push(['GET /compagnies (company, suspendu) -> 403', blocked.status, blocked.data?.error]);

  /* 13. Réactivation */
  const reactivate = await call('/subscriptions/C001/reactivate', { method: 'POST', token: adminToken });
  steps.push(['POST /subscriptions/C001/reactivate', reactivate.status, reactivate.data?.data?.statut]);

  for (const [name, status, extra = ''] of steps) {
    console.log(`${status === 200 || status === 201 ? '✔' : '✘'} ${name} -> ${status} ${extra}`.trim());
  }
  process.exit(0);
})().catch((e) => {
  console.error('Erreur réseau/test :', e.message);
  process.exit(1);
});
