/* =====================================================================
   Tests d'intégration du MODULE 18 — STATISTIQUES & RAPPORTS
   Exécution : node scripts/test_statistics.js
   Nécessite : serveur démarré sur le port 5000 (module statistiques chargé)
               et MySQL actif. Toutes les métriques sont agrégées en SQL
               (aucun mock) ; le périmètre est déduit du JWT côté serveur.
   Couvre (14 scénarios obligatoires) :
     1.  Dashboard par rôle (super_admin / company_admin / counter_agent / client).
     2.  Isolation compagnie : C999 ne voit AUCUNE donnée de C001 (et inversement).
     3.  Revenus : seuls les paiements CONFIRMÉS (paye + encaissement) comptent
         (echoue/remboursement exclus), montants XAF.
     4.  Taux de remplissage des voyages (places vendues / places totales).
     5.  Filtres de période (today / yesterday / all) sur les revenus.
     6.  Performances par agence (super admin via compagnieId, company admin auto).
     7.  Isolation client : B ne voit que ses propres données, jamais celles de A.
     8.  Validation : période inconnue / dates incohérentes / format → 400.
     9.  Auth : endpoint sans token → 401.
    10.  RBAC : /statistics/trips et /performances interdits au client ;
         /performances interdit au counter ; /subscriptions réservé super admin.
    11.  Super admin : performances sans compagnieId → 400.
    12.  Devise XAF partout.
    13.  Sérialisation sans donnée sensible (mots de passe / jetons).
    14.  Nettoyage complet des données de test.
   ===================================================================== */
const BASE = 'http://localhost:5000/api/v1';

const db = require('../src/models');
const { hashPassword } = require('../src/utils/password');
const { today, addDays } = require('../src/modules/statistics/utils/dates');

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
    if (/password|passwd|hash|secret|refreshToken|signature|token|motDePasse|mot_de_passe/i.test(key)) return true;
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

const C2 = 'C999';
const AG2 = 'AG99900001';
const AGT_ADMIN2 = `AGT2${SUF}`;
const AGT_COUNT2 = `AGT3${SUF}`;
const AGT_COUNT1 = `AGT1${SUF}`;

/* Voyages C001 existants (AG00000001) utilisés pour les réservations de test. */
const T1 = 'DPTEST0002'; /* 2026-08-21 programme */
const T2 = 'DPTEST0001'; /* 2026-08-20 programme */
const T3 = 'VYG6264004'; /* 2026-08-15 programme */

const R1 = `RST${SUF}`; /* hier, payee  */
const R2 = `R2T${SUF}`; /* aujourd'hui, payee */
const R3 = `R3T${SUF}`; /* aujourd'hui, confirmee */
const B1 = `BIL${SUF}`;
const B2 = `B2L${SUF}`;
const B3 = `B3L${SUF}`;
const P1 = `PAY${SUF}`;
const P2 = `P2Y${SUF}`;
const P3 = `P3Y${SUF}`;
const P4 = `P4Y${SUF}`;
const P5 = `P5Y${SUF}`;

const JOUR = today();
const HIER = addDays(JOUR, -1);
const ts = (d) => `${d} 10:00:00`;

const sumBy = (arr, key) => (arr || []).reduce((s, r) => s + Number(r[key] || 0), 0);
const delta = (a, b) => Number(a || 0) - Number(b || 0);

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);
  const assertNum = (name, actual, expected, extra = '') =>
    ok(name, actual === expected ? 200 : 500, 200, `valeur=${actual} attendu=${expected} ${extra}`);

  const clientEmailA = `st.a.${UNIQUE.toLowerCase()}@test.com`;
  const clientEmailB = `st.b.${UNIQUE.toLowerCase()}@test.com`;
  const admin2Email = `st.admin2.${UNIQUE.toLowerCase()}@test.com`;
  const count2Email = `st.count2.${UNIQUE.toLowerCase()}@test.com`;
  const count1Email = `st.count1.${UNIQUE.toLowerCase()}@test.com`;

  const TEST_AGENTS = [AGT_ADMIN2, AGT_COUNT2, AGT_COUNT1];
  const TEST_RESAS = [R1, R2, R3];
  const TEST_BILLETS = [B1, B2, B3];
  const TEST_PAIEMENTS = [P1, P2, P3, P4, P5];

  /* Nettoyage complet (idempotent, relance sûre ; purge aussi les résidus
     d'exécutions interrompues : emails de test `st.%@test.com`, agents de l'agence). */
  const cleanup = async () => {
    try {
      const testClients = await db.Client.findAll({ where: { email: { [db.Sequelize.Op.like]: 'st.%@test.com' } } });
      const tcIds = testClients.map((c) => c.id);

      await db.Paiement.destroy({ where: { id: { [db.Sequelize.Op.in]: TEST_PAIEMENTS } } }).catch(() => {});
      await db.Billet.destroy({ where: { id: { [db.Sequelize.Op.in]: TEST_BILLETS } } }).catch(() => {});
      await db.PlaceReservee.destroy({ where: { reservation_id: { [db.Sequelize.Op.in]: TEST_RESAS } } }).catch(() => {});
      await db.Reservation.destroy({ where: { id: { [db.Sequelize.Op.in]: TEST_RESAS } } }).catch(() => {});

      for (const r of TEST_RESAS) {
        await db.Paiement.destroy({ where: { reservation_id: r } }).catch(() => {});
        await db.Billet.destroy({ where: { reservation_id: r } }).catch(() => {});
        await db.PlaceReservee.destroy({ where: { reservation_id: r } }).catch(() => {});
      }

      if (tcIds.length) {
        const resas = await db.Reservation.findAll({ where: { client_id: { [db.Sequelize.Op.in]: tcIds } } });
        for (const r of resas) {
          await db.Paiement.destroy({ where: { reservation_id: r.id } }).catch(() => {});
          await db.Billet.destroy({ where: { reservation_id: r.id } }).catch(() => {});
          await db.PlaceReservee.destroy({ where: { reservation_id: r.id } }).catch(() => {});
          await db.Reservation.destroy({ where: { id: r.id } }).catch(() => {});
        }
        await db.RefreshToken.destroy({ where: { client_id: { [db.Sequelize.Op.in]: tcIds } } }).catch(() => {});
        await db.SessionConnexion.destroy({ where: { client_id: { [db.Sequelize.Op.in]: tcIds } } }).catch(() => {});
        await db.Client.destroy({ where: { id: { [db.Sequelize.Op.in]: tcIds } } }).catch(() => {});
      }

      const agents = await db.Agent.findAll({ where: { id: { [db.Sequelize.Op.in]: TEST_AGENTS } } });
      const agentsAg2 = await db.Agent.findAll({ where: { agence_id: AG2 } });
      const allAgents = [...new Set([...agents, ...agentsAg2].map((a) => a.id))];
      for (const agt of allAgents) {
        await db.RefreshToken.destroy({ where: { agent_id: agt } }).catch(() => {});
        await db.SessionConnexion.destroy({ where: { agent_id: agt } }).catch(() => {});
        await db.CompteAgent.destroy({ where: { agent_id: agt } }).catch(() => {});
        await db.Agent.destroy({ where: { id: agt } }).catch(() => {});
      }
      await db.Agence.destroy({ where: { id: AG2 } }).catch(() => {});
      await db.Compagnie.destroy({ where: { id: C2 } }).catch(() => {});
    } catch (e) { console.warn(`[cleanup] ${e.message}`); }
  };

  /* ── Pré-nettoyage + connexions ─────────────────────────────────── */
  await cleanup();
  const adminToken = await loginAgent('admin@bustixconnect.com', 'Admin@123');
  ok('Login super_admin', adminToken ? 200 : 500, 200);
  const companyToken = await loginAgent('company@bustixconnect.com', 'Company@123');
  ok('Login company_admin (C001)', companyToken ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 9 — Auth : endpoint sans token → 401
     ══════════════════════════════════════════════════════════════════ */
  const anon = await call('/statistics/dashboard');
  ok('SC9 GET /statistics/dashboard sans token → 401', anon.status, 401, `status=${anon.status}`);

  /* ── Baselines (avant insertion des données de test) ─────────────── */
  const g = async (path, token) => (await call(path, { token })).data?.data;
  const d = (payload) => payload?.data;
  const sd0 = await g('/statistics/dashboard', adminToken);
  const sr0 = await g('/statistics/revenue', adminToken);
  const cd0 = await g('/statistics/dashboard', companyToken);
  const crA0 = await g('/statistics/revenue', companyToken);
  const crT0 = await g('/statistics/revenue?periode=today', companyToken);
  const crY0 = await g('/statistics/revenue?periode=yesterday', companyToken);
  const cb0 = await g('/statistics/bookings', companyToken);
  const ct0 = await g('/statistics/tickets', companyToken);
  const ctp0 = await g('/statistics/trips', companyToken);
  const perf0 = await g('/statistics/performances?compagnieId=C001', adminToken);
  const perfC10 = await g('/statistics/performances', companyToken);
  ok('SC1 Devise XAF sur les métadonnées (dashboard super)', sd0?.devise === 'XAF' ? 200 : 500, 200, sd0?.devise);
  ok('SC1 Role du payload dashboard = super_admin', sd0?.role === 'super_admin' ? 200 : 500, 200, sd0?.role);

  /* ── Création : counter_agent C001 + compagnie C999 (admin + counter) ── */
  await db.Agent.create({
    id: AGT_COUNT1, matricule: `M18C1-${SUF}`, prenom: 'Comptoir', nom: 'C001',
    email: count1Email, telephone: '+237698100001', role: 'counter_agent', date_embauche: '2026-01-01',
    statut: 'actif', verifie: true, agence_id: 'AG00000001',
  });
  await db.CompteAgent.create({ agent_id: AGT_COUNT1, email: count1Email, telephone: '+237698100001', mot_de_passe_hash: await hashPassword('Stats@123') });
  const count1Token = await loginAgent(count1Email, 'Stats@123');
  ok('Login counter_agent (C001)', count1Token ? 200 : 500, 200);

  await db.Compagnie.create({ id: C2, nom: `Compagnie Statistiques Test ${C2}`, telephone: '+237698100009', couleur: '#996633', actif: true, statut: 'actif' });
  await db.Agence.create({ id: AG2, nom: `Agence Stats ${C2}`, ville_id: 'DLA', adresse: 'Test', telephone: '+237698100011', compagnie_id: C2, statut_abonnement: 'actif' });
  await db.Agent.create({
    id: AGT_ADMIN2, matricule: `M18C2-${SUF}`, prenom: 'Admin', nom: 'C999',
    email: admin2Email, telephone: '+237698100012', role: 'company_admin', date_embauche: '2026-01-01',
    statut: 'actif', verifie: true, agence_id: AG2,
  });
  await db.CompteAgent.create({ agent_id: AGT_ADMIN2, email: admin2Email, telephone: '+237698100012', mot_de_passe_hash: await hashPassword('Stats@123') });
  await db.Agent.create({
    id: AGT_COUNT2, matricule: `M18C3-${SUF}`, prenom: 'Comptoir', nom: 'C999',
    email: count2Email, telephone: '+237698100013', role: 'counter_agent', date_embauche: '2026-01-01',
    statut: 'actif', verifie: true, agence_id: AG2,
  });
  await db.CompteAgent.create({ agent_id: AGT_COUNT2, email: count2Email, telephone: '+237698100013', mot_de_passe_hash: await hashPassword('Stats@123') });
  const admin2Token = await loginAgent(admin2Email, 'Stats@123');
  const count2Token = await loginAgent(count2Email, 'Stats@123');
  ok('Login company_admin (C999)', admin2Token ? 200 : 500, 200);
  ok('Login counter_agent (C999)', count2Token ? 200 : 500, 200);

  /* ── Baselines C001 counter + C999 (avant données) ───────────────── */
  const c1d0 = await g('/statistics/dashboard', count1Token);
  const c2d0 = await g('/statistics/dashboard', admin2Token);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 2 — Isolation compagnie : C999 vide, C001 ne voit que le sien
     ══════════════════════════════════════════════════════════════════ */
  ok('SC2 C999 dashboard : reservations.total = 0', c2d0?.data?.reservations?.total === 0 ? 200 : 500, 200, `total=${c2d0?.data?.reservations?.total}`);
  ok('SC2 C999 dashboard : billets.total = 0', c2d0?.data?.billets?.total === 0 ? 200 : 500, 200, `total=${c2d0?.data?.billets?.total}`);
  ok('SC2 C999 dashboard : voyages.total = 0', c2d0?.data?.voyages?.total === 0 ? 200 : 500, 200, `total=${c2d0?.data?.voyages?.total}`);
  ok('SC2 C999 dashboard : paiements.net = 0', c2d0?.data?.paiements?.net === 0 ? 200 : 500, 200, `net=${c2d0?.data?.paiements?.net}`);

  /* ── Inscription de deux clients ─────────────────────────────────── */
  const regA = await call('/auth/register-client', {
    method: 'POST',
    body: { prenom: 'Statistiques', nom: 'ClientA', telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`, email: clientEmailA, motDePasse: 'Client@123', pays: 'Cameroun', ville: 'Douala' },
  });
  ok('POST /auth/register-client A', regA.status, 201, regA.data?.data?.user?.role || '');
  const clientAId = regA.data?.data?.user?.id;
  const clientTokenA = regA.data?.data?.token;

  const regB = await call('/auth/register-client', {
    method: 'POST',
    body: { prenom: 'Statistiques', nom: 'ClientB', telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`, email: clientEmailB, motDePasse: 'Client@123', pays: 'Cameroun', ville: 'Douala' },
  });
  ok('POST /auth/register-client B', regB.status, 201, regB.data?.data?.user?.role || '');
  const clientBId = regB.data?.data?.user?.id;
  const clientTokenB = regB.data?.data?.token;

  /* ── Données de test (réservations / billets / paiements) ────────── */
  const mkResa = async (id, ref, clientId, departId, statut, montant, nbPlaces, dateCreation) =>
    db.Reservation.create({ id, reference: ref, client_id: clientId, depart_id: departId, agence_id: 'AG00000001', mode_reservation: 'en_ligne', nb_places: nbPlaces, date_creation: ts(dateCreation), montant, statut });

  await mkResa(R1, `REF-R1-${SUF}`, clientAId, T1, 'payee', 10000, 2, HIER);
  await db.Billet.create({ id: B1, reference: `REF-B1-${SUF}`, qr_code: `QR-B1-${SUF}`, code_barre: `CB-B1-${SUF}`, reservation_id: R1, depart_id: T1, client_id: clientAId, siege: '1A', nom_passager: 'Client A', prix: 10000, statut: 'utilise', cree_le: ts(HIER) });
  await db.Paiement.create({ id: P1, reference: `REF-P1-${SUF}`, reservation_id: R1, client_id: clientAId, montant: 10000, methode: 'orange_money', statut: 'paye', type: 'encaissement', categorie: 'reservation', cree_le: ts(HIER), paiement_le: ts(HIER) });

  await mkResa(R2, `REF-R2-${SUF}`, clientAId, T2, 'payee', 5000, 1, JOUR);
  await db.Billet.create({ id: B2, reference: `REF-B2-${SUF}`, qr_code: `QR-B2-${SUF}`, code_barre: `CB-B2-${SUF}`, reservation_id: R2, depart_id: T2, client_id: clientAId, siege: '1B', nom_passager: 'Client A', prix: 5000, statut: 'valide', cree_le: ts(JOUR) });
  await db.Paiement.create({ id: P2, reference: `REF-P2-${SUF}`, reservation_id: R2, client_id: clientAId, montant: 5000, methode: 'mtn_money', statut: 'paye', type: 'encaissement', categorie: 'reservation', cree_le: ts(JOUR), paiement_le: ts(JOUR) });
  await db.Paiement.create({ id: P3, reference: `REF-P3-${SUF}`, reservation_id: R2, client_id: clientAId, montant: 5000, methode: 'orange_money', statut: 'echoue', type: 'encaissement', categorie: 'reservation', cree_le: ts(JOUR), paiement_le: ts(JOUR) });
  await db.Paiement.create({ id: P4, reference: `REF-P4-${SUF}`, reservation_id: R2, client_id: clientAId, montant: 5000, methode: 'orange_money', statut: 'rembourse', type: 'remboursement', categorie: 'remboursement', remboursement: 2000, cree_le: ts(JOUR), paiement_le: ts(JOUR) });

  await mkResa(R3, `REF-R3-${SUF}`, clientBId, T3, 'confirmee', 3000, 1, JOUR);
  await db.Billet.create({ id: B3, reference: `REF-B3-${SUF}`, qr_code: `QR-B3-${SUF}`, code_barre: `CB-B3-${SUF}`, reservation_id: R3, depart_id: T3, client_id: clientBId, siege: '1C', nom_passager: 'Client B', prix: 3000, statut: 'valide', cree_le: ts(JOUR) });
  await db.Paiement.create({ id: P5, reference: `REF-P5-${SUF}`, reservation_id: R3, client_id: clientBId, montant: 3000, methode: 'especes', statut: 'paye', type: 'encaissement', categorie: 'reservation', cree_le: ts(JOUR), paiement_le: ts(JOUR) });

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 3 — Revenus : paiements CONFIRMÉS uniquement, XAF
     ══════════════════════════════════════════════════════════════════ */
  const crA1 = await g('/statistics/revenue', companyToken);
  const cd1 = await g('/statistics/dashboard', companyToken);

  assertNum('SC3 C001 revenue(encaisse) : +18000', delta(d(crA1).encaisse, d(crA0).encaisse), 18000);
  assertNum('SC3 C001 revenue(nbEncaissements) : +3', delta(d(crA1).nbEncaissements, d(crA0).nbEncaissements), 3);
  assertNum('SC3 C001 revenue(rembourse) : +2000', delta(d(crA1).rembourse, d(crA0).rembourse), 2000);
  assertNum('SC3 C001 revenue(nbRemboursements) : +1', delta(d(crA1).nbRemboursements, d(crA0).nbRemboursements), 1);
  assertNum('SC3 C001 revenue(net) : +16000', delta(d(crA1).net, d(crA0).net), 16000);
  ok('SC3 revenue.devise = XAF', d(crA1)?.devise === 'XAF' ? 200 : 500, 200, d(crA1)?.devise);

  /* P3 (echoue) et P4 (remboursement) n'augmentent PAS l'encaisse. */
  const pjDelta = (jour) => {
    const b = (d(crA0)?.parJour || []).find((r) => r.jour === jour)?.total || 0;
    const a = (d(crA1)?.parJour || []).find((r) => r.jour === jour)?.total || 0;
    return a - b;
  };
  assertNum('SC3 parJour hier : +10000', pjDelta(HIER), 10000);
  assertNum('SC3 parJour aujourd\u2019hui : +8000', pjDelta(JOUR), 8000);

  const crT1 = await g('/statistics/revenue?periode=today', companyToken);
  const crY1 = await g('/statistics/revenue?periode=yesterday', companyToken);
  ok('SC3 Revenue Aujourd\u2019hui : encaisse +8000', delta(d(crT1).encaisse, d(crT0).encaisse) === 8000 ? 200 : 500, 200, `delta=${delta(d(crT1).encaisse, d(crT0).encaisse)}`);
  ok('SC3 Revenue Hier : encaisse +10000', delta(d(crY1).encaisse, d(crY0).encaisse) === 10000 ? 200 : 500, 200, `delta=${delta(d(crY1).encaisse, d(crY0).encaisse)}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 1 — Dashboard compagnie (agrégats réels)
     ══════════════════════════════════════════════════════════════════ */
  ok('SC1 C001 dashboard : reservations.total +3', delta(d(cd1).reservations.total, d(cd0).reservations.total) === 3 ? 200 : 500, 200, `delta=${delta(d(cd1).reservations.total, d(cd0).reservations.total)}`);
  ok('SC1 C001 dashboard : billets.total +3', delta(d(cd1).billets.total, d(cd0).billets.total) === 3 ? 200 : 500, 200, `delta=${delta(d(cd1).billets.total, d(cd0).billets.total)}`);
  ok('SC1 C001 dashboard : paiements.montant +18000', delta(d(cd1).paiements.montant, d(cd0).paiements.montant) === 18000 ? 200 : 500, 200, `delta=${delta(d(cd1).paiements.montant, d(cd0).paiements.montant)}`);
  ok('SC1 C001 dashboard : remboursements.montant +2000', delta(d(cd1).paiements.remboursements.montant, d(cd0).paiements.remboursements.montant) === 2000 ? 200 : 500, 200, `delta=${delta(d(cd1).paiements.remboursements.montant, d(cd0).paiements.remboursements.montant)}`);
  ok('SC1 C001 dashboard : paiements.net +16000', delta(d(cd1).paiements.net, d(cd0).paiements.net) === 16000 ? 200 : 500, 200, `delta=${delta(d(cd1).paiements.net, d(cd0).paiements.net)}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 4 — Taux de remplissage (voyages)
     ══════════════════════════════════════════════════════════════════ */
  const ctp1 = await g('/statistics/trips', companyToken);
  ok('SC4 C001 trips : total inchangé (aucun nouveau voyage)', d(ctp1).total === d(ctp0).total ? 200 : 500, 200, `total=${d(ctp1).total}`);
  ok('SC4 C001 trips : placesTotal = placesVendues + dispo (cohérence)', d(ctp1).placesTotal >= d(ctp1).placesVendues ? 200 : 500, 200, `${d(ctp1).placesVendues}/${d(ctp1).placesTotal}`);
  const expectedTaux = d(ctp1).placesTotal ? Math.round((d(ctp1).placesVendues / d(ctp1).placesTotal) * 1000) / 1000 : 0;
  ok('SC4 C001 trips : tauxRemplissage cohérent (0..1)', d(ctp1).tauxRemplissage === expectedTaux && d(ctp1).tauxRemplissage >= 0 && d(ctp1).tauxRemplissage <= 1 ? 200 : 500, 200, `taux=${d(ctp1).tauxRemplissage}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 6 — Performances par agence
     ══════════════════════════════════════════════════════════════════ */
  const perf1 = await g('/statistics/performances?compagnieId=C001', adminToken);
  const ag1 = d(perf1).agences.find((a) => a.agenceId === 'AG00000001');
  ok('SC6 Super : performances C001 → agence AG00000001 présente', ag1 ? 200 : 500, 200, `agences=${d(perf1).agences.length}`);
  assertNum('SC6 Super : CA agence AG00000001 +18000', delta(ag1?.ca, d(perf0).agences.find((a) => a.agenceId === 'AG00000001')?.ca), 18000);
  assertNum('SC6 Super : réservations AG00000001 +3', delta(ag1?.reservations, d(perf0).agences.find((a) => a.agenceId === 'AG00000001')?.reservations), 3);

  const perfC11 = await g('/statistics/performances', companyToken);
  ok('SC6 Company C001 : performances auto → AG00000001 présente', d(perfC11).agences.some((a) => a.agenceId === 'AG00000001') ? 200 : 500, 200, `agences=${d(perfC11).agences.length}`);
  const perfC999 = await g('/statistics/performances', admin2Token);
  ok('SC6 Company C999 : performances = sa propre agence uniquement', d(perfC999).agences.length === 1 && d(perfC999).agences[0].agenceId === AG2 ? 200 : 500, 200, JSON.stringify(d(perfC999).agences.map((a) => a.agenceId)));
  ok('SC6 Company C999 : CA = 0', d(perfC999).agences[0]?.ca === 0 ? 200 : 500, 200, `ca=${d(perfC999).agences[0]?.ca}`);
  const perfC999Super = await g('/statistics/performances?compagnieId=C999', adminToken);
  ok('SC6 Super : performances C999 → aucune donnée C001 (CA=0)', d(perfC999Super).agences.length === 1 && d(perfC999Super).agences[0].ca === 0 ? 200 : 500, 200, `agences=${d(perfC999Super).agences.length}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 1 — Dashboard counter (agence) & clients
     ══════════════════════════════════════════════════════════════════ */
  const c1d1 = await g('/statistics/dashboard', count1Token);
  ok('SC1 Counter C001 : reservations.total +3', delta(d(c1d1).reservations.total, d(c1d0).reservations.total) === 3 ? 200 : 500, 200, `delta=${delta(d(c1d1).reservations.total, d(c1d0).reservations.total)}`);
  ok('SC1 Counter C001 : reservations.aujourdhui +2', delta(d(c1d1).reservations.aujourdhui, d(c1d0).reservations.aujourdhui) === 2 ? 200 : 500, 200, `delta=${delta(d(c1d1).reservations.aujourdhui, d(c1d0).reservations.aujourdhui)}`);
  ok('SC1 Counter C001 : billets.aujourdhui +2', delta(d(c1d1).billets.aujourdhui, d(c1d0).billets.aujourdhui) === 2 ? 200 : 500, 200, `delta=${delta(d(c1d1).billets.aujourdhui, d(c1d0).billets.aujourdhui)}`);
  ok('SC1 Counter C001 : paiements.montant +18000', delta(d(c1d1).paiements.montant, d(c1d0).paiements.montant) === 18000 ? 200 : 500, 200, `delta=${delta(d(c1d1).paiements.montant, d(c1d0).paiements.montant)}`);
  ok('SC1 Counter C001 : paiements.montantAujourdhui +8000', delta(d(c1d1).paiements.montantAujourdhui, d(c1d0).paiements.montantAujourdhui) === 8000 ? 200 : 500, 200, `delta=${delta(d(c1d1).paiements.montantAujourdhui, d(c1d0).paiements.montantAujourdhui)}`);

  const c2d1 = await g('/statistics/dashboard', count2Token);
  ok('SC2 Counter C999 : reservations.total = 0', d(c2d1).reservations.total === 0 ? 200 : 500, 200, `total=${d(c2d1).reservations.total}`);
  ok('SC2 Counter C999 : paiements.montantAujourdhui = 0', d(c2d1).paiements.montantAujourdhui === 0 ? 200 : 500, 200, `montant=${d(c2d1).paiements.montantAujourdhui}`);

  /* ── Dashboard client ────────────────────────────────────────────── */
  const ca = await g('/statistics/dashboard', clientTokenA);
  const cb = await g('/statistics/dashboard', clientTokenB);
  assertNum('SC1 Client A : reservations.total = 2', ca.data.reservations.total, 2);
  assertNum('SC1 Client A : reservations.payees = 2', ca.data.reservations.payees, 2);
  assertNum('SC1 Client A : reservations.aVenir = 2', ca.data.reservations.aVenir, 2);
  assertNum('SC1 Client A : billets.total = 2', ca.data.billets.total, 2);
  assertNum('SC1 Client A : billets.effectues = 1', ca.data.billets.effectues, 1);
  assertNum('SC1 Client A : voyages.aVenir = 2', ca.data.voyages.aVenir, 2);
  assertNum('SC1 Client A : depenses = 15000', ca.data.depenses, 15000);
  ok('SC1 Client A : prochain voyage = 2026-08-20', ca.data.voyages.prochain === '2026-08-20' ? 200 : 500, 200, ca.data.voyages.prochain);
  assertNum('SC1 Client B : reservations.total = 1', cb.data.reservations.total, 1);
  assertNum('SC1 Client B : reservations.confirmees = 1', cb.data.reservations.confirmees, 1);
  assertNum('SC1 Client B : depenses = 3000', cb.data.depenses, 3000);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 7 — Isolation client
     ══════════════════════════════════════════════════════════════════ */
  const revA = await g('/statistics/revenue', clientTokenA);
  const revB = await g('/statistics/revenue', clientTokenB);
  assertNum('SC7 Client A : encaisse = 15000', d(revA).encaisse, 15000);
  assertNum('SC7 Client A : rembourse = 2000', d(revA).rembourse, 2000);
  assertNum('SC7 Client A : net = 13000', d(revA).net, 13000);
  assertNum('SC7 Client B : encaisse = 3000 (jamais les données de A)', d(revB).encaisse, 3000);
  assertNum('SC7 Client B : rembourse = 0', d(revB).rembourse, 0);
  assertNum('SC7 Client B : net = 3000', d(revB).net, 3000);

  const bkA = await g('/statistics/bookings', clientTokenA);
  const bkB = await g('/statistics/bookings', clientTokenB);
  assertNum('SC7 Client A : bookings.total = 2', d(bkA).total, 2);
  assertNum('SC7 Client B : bookings.total = 1', d(bkB).total, 1);
  assertNum('SC7 Client B : bookings.confirmees = 1', d(bkB).confirmees, 1);

  const tkA = await g('/statistics/tickets', clientTokenA);
  const tkB = await g('/statistics/tickets', clientTokenB);
  assertNum('SC7 Client A : tickets.total = 2', d(tkA).total, 2);
  assertNum('SC7 Client A : tickets.montant = 15000', d(tkA).montant, 15000);
  assertNum('SC7 Client B : tickets.total = 1', d(tkB).total, 1);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 10 — RBAC
     ══════════════════════════════════════════════════════════════════ */
  const clTrips = await call('/statistics/trips', { token: clientTokenA });
  ok('SC10 Client → /statistics/trips : 403', clTrips.status, 403, `status=${clTrips.status}`);
  const clPerf = await call('/statistics/performances', { token: clientTokenA });
  ok('SC10 Client → /statistics/performances : 403', clPerf.status, 403, `status=${clPerf.status}`);
  const clSub = await call('/statistics/subscriptions', { token: clientTokenA });
  ok('SC10 Client → /statistics/subscriptions : 403', clSub.status, 403, `status=${clSub.status}`);
  const coSub = await call('/statistics/subscriptions', { token: companyToken });
  ok('SC10 Company_admin → /statistics/subscriptions : 403', coSub.status, 403, `status=${coSub.status}`);
  const cnSub = await call('/statistics/subscriptions', { token: count1Token });
  ok('SC10 Counter → /statistics/subscriptions : 403', cnSub.status, 403, `status=${cnSub.status}`);
  const cnPerf = await call('/statistics/performances', { token: count1Token });
  ok('SC10 Counter → /statistics/performances : 403', cnPerf.status, 403, `status=${cnPerf.status}`);
  const cnTrips = await call('/statistics/trips', { token: count1Token });
  ok('SC10 Counter → /statistics/trips : 200', cnTrips.status, 200, `status=${cnTrips.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 11 — Super admin : performances sans compagnieId → 400
     ══════════════════════════════════════════════════════════════════ */
  const saNoCie = await call('/statistics/performances', { token: adminToken });
  ok('SC11 Super → /statistics/performances sans compagnieId : 400', saNoCie.status, 400, `status=${saNoCie.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 8 — Validation des paramètres
     ══════════════════════════════════════════════════════════════════ */
  const badPeriode = await call('/statistics/revenue?periode=tomorrow', { token: companyToken });
  ok('SC8 periode inconnue → 400', badPeriode.status, 400, `status=${badPeriode.status}`);
  const badRange = await call('/statistics/revenue?dateDebut=2026-08-15&dateFin=2026-08-01', { token: companyToken });
  ok('SC8 dateFin < dateDebut → 400', badRange.status, 400, `status=${badRange.status}`);
  const badFormat = await call('/statistics/revenue?dateDebut=15-08-2026', { token: companyToken });
  ok('SC8 format de date invalide → 400', badFormat.status, 400, `status=${badFormat.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 12 — Super admin global (delta attendus)
     ══════════════════════════════════════════════════════════════════ */
  const sd1 = await g('/statistics/dashboard', adminToken);
  const sr1 = await g('/statistics/revenue', adminToken);
  assertNum('SC12 Super : compagnies +1', delta(d(sd1).compagnies.total, d(sd0).compagnies.total), 1);
  assertNum('SC12 Super : clients +2', delta(d(sd1).clients.total, d(sd0).clients.total), 2);
  assertNum('SC12 Super : reservations.total +3', delta(d(sd1).reservations.total, d(sd0).reservations.total), 3);
  assertNum('SC12 Super : billets.total +3', delta(d(sd1).billets.total, d(sd0).billets.total), 3);
  assertNum('SC12 Super : revenu.transactions.montant +18000', delta(d(sd1).revenu.transactions.montant, d(sd0).revenu.transactions.montant), 18000);
  assertNum('SC12 Super : revenu.remboursements.montant +2000', delta(d(sd1).revenu.remboursements.montant, d(sd0).revenu.remboursements.montant), 2000);
  assertNum('SC12 Super : revenu.net +16000', delta(d(sd1).revenu.net, d(sd0).revenu.net), 16000);
  assertNum('SC12 Super : revenue encaisse +18000', delta(d(sr1).encaisse, d(sr0).encaisse), 18000);
  assertNum('SC12 Super : revenue net +16000', delta(d(sr1).net, d(sr0).net), 16000);

  /* ══════════════════════════════════════════════════════════════════
     Abonnements (Super Admin)
     ══════════════════════════════════════════════════════════════════ */
  const subs = await g('/statistics/subscriptions', adminToken);
  ok('Subscriptions super : total >= 1', Number(d(subs).total) >= 1 ? 200 : 500, 200, `total=${d(subs).total}`);
  ok('Subscriptions super : parStatut est un objet', d(subs).parStatut && typeof d(subs).parStatut === 'object' ? 200 : 500, 200, JSON.stringify(d(subs).parStatut));
  ok('Subscriptions super : compagnies est un tableau', Array.isArray(d(subs).compagnies) ? 200 : 500, 200, `n=${d(subs).compagnies?.length}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 13 — Sérialisation sans donnée sensible
     ══════════════════════════════════════════════════════════════════ */
  const all = await Promise.all([
    call('/statistics/dashboard', { token: adminToken }),
    call('/statistics/revenue', { token: companyToken }),
    call('/statistics/bookings', { token: clientTokenA }),
    call('/statistics/tickets', { token: clientTokenA }),
    call('/statistics/trips', { token: companyToken }),
    call('/statistics/performances', { token: admin2Token }),
    call('/statistics/subscriptions', { token: adminToken }),
  ]);
  ok('SC13 Aucune donnée sensible dans les réponses', all.every((r) => r.status === 200 && !hasSensitive(r.data)) ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 14 — Nettoyage complet
     ══════════════════════════════════════════════════════════════════ */
  await cleanup();
  const afterClients = await db.Client.count({ where: { email: { [db.Sequelize.Op.like]: 'st.%@test.com' } } });
  const afterAgents = await db.Agent.count({ where: { id: { [db.Sequelize.Op.in]: TEST_AGENTS } } });
  const afterCompanies = await db.Compagnie.count({ where: { id: C2 } });
  const afterResas = await db.Reservation.count({ where: { id: { [db.Sequelize.Op.in]: TEST_RESAS } } });
  const afterBillets = await db.Billet.count({ where: { id: { [db.Sequelize.Op.in]: TEST_BILLETS } } });
  const afterPaiements = await db.Paiement.count({ where: { id: { [db.Sequelize.Op.in]: TEST_PAIEMENTS } } });
  ok('SC14 Nettoyage : clients de test supprimés', afterClients === 0 ? 200 : 500, 200, `clients=${afterClients}`);
  ok('SC14 Nettoyage : agents de test supprimés', afterAgents === 0 ? 200 : 500, 200, `agents=${afterAgents}`);
  ok('SC14 Nettoyage : compagnie C999 supprimée', afterCompanies === 0 ? 200 : 500, 200, `compagnies=${afterCompanies}`);
  ok('SC14 Nettoyage : réservations de test supprimées', afterResas === 0 ? 200 : 500, 200, `résas=${afterResas}`);
  ok('SC14 Nettoyage : billets de test supprimés', afterBillets === 0 ? 200 : 500, 200, `billets=${afterBillets}`);
  ok('SC14 Nettoyage : paiements de test supprimés', afterPaiements === 0 ? 200 : 500, 200, `paiements=${afterPaiements}`);

  /* ── Rapport ─────────────────────────────────────────────────────── */
  console.log('\n════════ RAPPORT TEST STATISTIQUES ════════');
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
