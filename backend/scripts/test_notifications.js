/* =====================================================================
   Tests d'intégration du MODULE 16 — NOTIFICATIONS CENTRALISÉES
   Exécution : node scripts/test_notifications.js
   Nécessite : serveur démarré sur le port 5001 (modules notifications,
               auth, trips, bookings, tickets, subscriptions chargés ;
               table `notification` créée).
   Couvre (13 scénarios obligatoires) :
     1. Création d'une notification client (réservation créée).
     2. Récupération paginée + métadonnées (total / unread / page).
     3. Compteur de non lues.
     4. Marquage lu (PATCH /:id/read) + décrément du compteur.
     5. Tout marquer lu (PATCH /read-all).
     6. Suppression (DELETE /:id).
     7. Isolation : le client B ne voit pas / ne lit pas les notifs de A.
     8. Paiement confirmé → notification client + company_admin.
     9. Billet généré → notification client (ticket_available).
    10. Abonnement proche expiration → notification company_admin.
    11. Abonnement expiré → notification company_admin + super_admin.
    12. Aucune notification dupliquée (même événement rejoué).
    13. Nettoyage complet des données de test.
   ===================================================================== */
const BASE = 'http://localhost:5001/api/v1';

const db = require('../src/models');
const { hashPassword } = require('../src/utils/password');
const { runSubscriptionJob } = require('../src/modules/subscriptions/cron/subscription.cron');

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
    if (/password|passwd|hash|secret|refreshToken|signature|token|contactUrgence|emergencyContact/i.test(key)) return true;
    if (typeof obj[key] === 'object' && hasSensitive(obj[key])) return true;
  }
  return false;
};

const loginAgent = async (email, motDePasse) => {
  const r = await call('/auth/login', { method: 'POST', body: { email, motDePasse } });
  return r.data?.data?.token || null;
};

const UNIQUE = Date.now().toString(36).toUpperCase();
const BUS_ID = `BS${UNIQUE.slice(-8)}`;
const PRICE = 5500;

const toIso = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const dayPlus = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return toIso(d); };
const D = dayPlus(5);

/* Compagnies de test abonnement (unique, jamais commitées). */
const C_NEAR = 'CN16';
const C_EXP = 'CN17';
const AG_NEAR = 'AG16000001';
const AG_EXP = 'AG17000001';
const AGT_NEAR = 'AGT1600001';
const AGT_EXP = 'AGT1700001';

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  let adminToken = null;
  let companyToken = null;
  let clientTokenA = null;
  let clientTokenB = null;
  let clientAId = null;
  let clientBId = null;
  let tripId = null;
  let bookingId = null;
  let paymentId = null;
  let companyAdminId = null;

  const clientEmailA = `notif.a.${UNIQUE.toLowerCase()}@test.com`;
  const clientEmailB = `notif.b.${UNIQUE.toLowerCase()}@test.com`;
  const NEAR_ADMIN_EMAIL = `notif.near.${UNIQUE.toLowerCase()}@test.com`;
  const EXP_ADMIN_EMAIL = `notif.exp.${UNIQUE.toLowerCase()}@test.com`;

  /* Nettoyage complet (idempotent, relance sûre). */
  const cleanup = async () => {
    try {
      const testClients = await db.Client.findAll({ where: { email: { [db.Sequelize.Op.in]: [clientEmailA, clientEmailB] } } });
      const tcIds = testClients.map((c) => c.id);
      const resas = tcIds.length ? await db.Reservation.findAll({ where: { client_id: { [db.Sequelize.Op.in]: tcIds } } }) : [];
      for (const r of resas) {
        const billets = await db.Billet.findAll({ where: { reservation_id: r.id } });
        for (const b of billets) {
          await db.CheckInBillet.destroy({ where: { billet_id: b.id } }).catch(() => {});
          await db.ScanBillet.destroy({ where: { billet_id: b.id } }).catch(() => {});
        }
        await db.Billet.destroy({ where: { reservation_id: r.id } }).catch(() => {});
        await db.Paiement.destroy({ where: { reservation_id: r.id } }).catch(() => {});
        const pass = await db.Passenger.findAll({ where: { reservation_id: r.id } });
        for (const p of pass) await db.EmergencyContact.destroy({ where: { passenger_id: p.id } }).catch(() => {});
        await db.Passenger.destroy({ where: { reservation_id: r.id } }).catch(() => {});
        await db.PlaceReservee.destroy({ where: { reservation_id: r.id } }).catch(() => {});
        await db.HistoriqueReservation.destroy({ where: { reservation_id: r.id } }).catch(() => {});
        await db.Reservation.destroy({ where: { id: r.id } }).catch(() => {});
      }
      if (tcIds.length) {
        await db.RefreshToken.destroy({ where: { client_id: { [db.Sequelize.Op.in]: tcIds } } }).catch(() => {});
        await db.SessionConnexion.destroy({ where: { client_id: { [db.Sequelize.Op.in]: tcIds } } }).catch(() => {});
        await db.Client.destroy({ where: { id: { [db.Sequelize.Op.in]: tcIds } } }).catch(() => {});
      }
      const testBuses = await db.Bus.findAll({ where: { immatriculation: { [db.Sequelize.Op.like]: 'TEST-%' } } });
      const busIds = testBuses.map((b) => b.id);
      if (busIds.length) {
        await db.Depart.destroy({ where: { bus_id: { [db.Sequelize.Op.in]: busIds } } }).catch(() => {});
        await db.Bus.destroy({ where: { id: { [db.Sequelize.Op.in]: busIds } } }).catch(() => {});
      }
      for (const [agt, ag, cid] of [[AGT_NEAR, AG_NEAR, C_NEAR], [AGT_EXP, AG_EXP, C_EXP]]) {
        await db.RefreshToken.destroy({ where: { agent_id: agt } }).catch(() => {});
        await db.SessionConnexion.destroy({ where: { agent_id: agt } }).catch(() => {});
        await db.CompteAgent.destroy({ where: { agent_id: agt } }).catch(() => {});
        await db.Agent.destroy({ where: { id: agt } }).catch(() => {});
        await db.Agence.destroy({ where: { id: ag } }).catch(() => {});
        await db.NotificationAbonnement.destroy({ where: { compagnie_id: cid } }).catch(() => {});
        await db.RappelAbonnement.destroy({ where: { compagnie_id: cid } }).catch(() => {});
        await db.PaiementAbonnementCompagnie.destroy({ where: { compagnie_id: cid } }).catch(() => {});
        await db.HistoriqueAbonnement.destroy({ where: { compagnie_id: cid } }).catch(() => {});
        await db.AbonnementCompagnie.destroy({ where: { compagnie_id: cid } }).catch(() => {});
        await db.Compagnie.destroy({ where: { id: cid } }).catch(() => {});
      }
      /* Notifications centralisées des destinataires de test. */
      const adminOfC001 = await db.Agent.findOne({ where: { email: 'company@bustixconnect.com' } });
      const recipientIds = [
        ...tcIds,
        AGT_NEAR, AGT_EXP,
        adminOfC001?.id,
      ].filter(Boolean);
      await db.Notification.destroy({ where: { recipient_id: { [db.Sequelize.Op.in]: recipientIds } } }).catch(() => {});
    } catch (e) { console.warn(`[cleanup] ${e.message}`); }
  };

  const purgeNotifications = async (recipientId, types) => {
    if (!recipientId) return;
    await db.Notification.destroy({ where: { recipient_id: recipientId, type: { [db.Sequelize.Op.in]: types } } }).catch(() => {});
  };

  /* ── 1. Pré-nettoyage + connexions ──────────────────────────────── */
  await cleanup();
  adminToken = await loginAgent('admin@bustixconnect.com', 'Admin@123');
  ok('Login super_admin', adminToken ? 200 : 500, 200);
  companyToken = await loginAgent('company@bustixconnect.com', 'Company@123');
  ok('Login company_admin (C001)', companyToken ? 200 : 500, 200);
  const companyAdmin = await db.Agent.findOne({ where: { email: 'company@bustixconnect.com' } });
  companyAdminId = companyAdmin?.id;
  await purgeNotifications(companyAdminId, ['nouvelle_reservation', 'nouveau_paiement']);

  /* ── 2. Compagnies/agences/agents de test abonnement ────────────── */
  for (const [cid, ag, agt, email, dateFin] of [
    [C_NEAR, AG_NEAR, AGT_NEAR, NEAR_ADMIN_EMAIL, dayPlus(0)],
    [C_EXP, AG_EXP, AGT_EXP, EXP_ADMIN_EMAIL, dayPlus(-1)],
  ]) {
    await db.Compagnie.create({ id: cid, nom: `Compagnie Notif Test ${cid}`, telephone: '+237699001' + cid.slice(-2), couleur: '#336699', actif: true });
    await db.Agence.create({ id: ag, nom: `Agence Notif ${cid}`, ville_id: 'DLA', adresse: 'Test', telephone: '+237699002' + cid.slice(-2), compagnie_id: cid, statut_abonnement: 'actif' });
    await db.Agent.create({ id: agt, matricule: `NOT-${cid}`, prenom: 'Notif', nom: cid, email, telephone: '+237699003' + cid.slice(-2), role: 'company_admin', date_embauche: '2026-01-01', statut: 'actif', verifie: true, agence_id: ag });
    await db.CompteAgent.create({ agent_id: agt, email, telephone: '+237699003' + cid.slice(-2), mot_de_passe_hash: await hashPassword('Notif@123') });
    await db.AbonnementCompagnie.create({ compagnie_id: cid, plan_id: 2, date_debut: dayPlus(-30), date_fin: dateFin, renouvellement_auto: false, statut: 'actif' });
  }
  const nearToken = await loginAgent(NEAR_ADMIN_EMAIL, 'Notif@123');
  const expToken = await loginAgent(EXP_ADMIN_EMAIL, 'Notif@123');
  ok('Login company_admin (CN16 abonnement proche expiration)', nearToken ? 200 : 500, 200);
  ok('Login company_admin (CN17 abonnement expiré)', expToken ? 200 : 500, 200);

  /* ── 3. Bus + voyage de test (C001) ─────────────────────────────── */
  await db.Bus.create({
    id: BUS_ID, immatriculation: `TEST-${UNIQUE.slice(-6)}`, interne: `TI-${UNIQUE.slice(-6)}`,
    modele: 'Bus Test Notif', marque: 'Test', capacite: 45, compagnie_id: 'C001',
    statut: 'available', type_bus: 'standard', classe: 'economy',
  });
  const created = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: PRICE, companyId: 'C001', agencyId: 'AG00000001' },
  });
  ok('POST /trips (voyage de test)', created.status, 201, created.data?.data?.id || '');
  tripId = created.data?.data?.id;

  /* ── 4. Inscription de deux clients ─────────────────────────────── */
  const regA = await call('/auth/register-client', {
    method: 'POST',
    body: { prenom: 'Notif', nom: 'ClientA', telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`, email: clientEmailA, motDePasse: 'Client@123', pays: 'Cameroun', ville: 'Douala' },
  });
  ok('POST /auth/register-client A', regA.status, 201, regA.data?.data?.user?.role || '');
  clientAId = regA.data?.data?.user?.id;
  clientTokenA = regA.data?.data?.token;

  const regB = await call('/auth/register-client', {
    method: 'POST',
    body: { prenom: 'Notif', nom: 'ClientB', telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`, email: clientEmailB, motDePasse: 'Client@123', pays: 'Cameroun', ville: 'Douala' },
  });
  ok('POST /auth/register-client B', regB.status, 201, regB.data?.data?.user?.role || '');
  clientBId = regB.data?.data?.user?.id;
  clientTokenB = regB.data?.data?.token;

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 1 — Création d'une notification client (réservation créée)
     ══════════════════════════════════════════════════════════════════ */
  const bA = await call('/bookings', {
    method: 'POST', token: clientTokenA,
    body: {
      tripId,
      seats: [{ siege: '1' }],
      passengers: [{ firstName: 'Passager', lastName: 'Notif', gender: 'M', birthDate: '1990-05-10', phone: '+237699001001', email: 'pax.notif@test.com', documentType: 'cni', documentNumber: 'CNI-NOTIF-0001', nationality: 'Camerounaise' }],
      modeReservation: 'en_ligne',
    },
  });
  ok('POST /bookings (client A)', bA.status, 201, bA.data?.data?.id || '');
  if (bA.status !== 201) { console.error('[diag] CRITICAL POST /bookings →', bA.status, JSON.stringify(bA.data)); throw new Error('ARRET: création critique en échec'); }
  bookingId = bA.data?.data?.id;

  const listA = await call('/notifications?limit=20', { token: clientTokenA });
  ok('GET /notifications (client A) : 1 notification', listA.data?.data?.total === 1 ? 200 : 500, 200, `total=${listA.data?.data?.total}`);
  const notifResa = listA.data?.data?.items?.find((n) => n.type === 'reservation_created');
  ok('Notification « reservation_created » présente', notifResa ? 200 : 500, 200, notifResa?.label || '');
  ok('Sérialisation : aucune donnée sensible', !hasSensitive(notifResa) ? 200 : 500, 200);
  ok('data.actionPath renseigné (client/bookings)', notifResa?.actionPath === '/client/bookings' ? 200 : 500, 200, notifResa?.actionPath || '');

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 2 — Récupération paginée + métadonnées
     ══════════════════════════════════════════════════════════════════ */
  const page1 = await call('/notifications?page=1&limit=1', { token: clientTokenA });
  ok('GET /notifications?page=1&limit=1 : 1 item + totalPages', page1.data?.data?.items?.length === 1 && page1.data?.data?.totalPages === 1 ? 200 : 500, 200, `items=${page1.data?.data?.items?.length}, pages=${page1.data?.data?.totalPages}`);
  ok('Filtre statut=non_lu retourne la notif', (await call('/notifications?statut=non_lu', { token: clientTokenA })).data?.data?.total === 1 ? 200 : 500, 200);
  ok('Filtre statut=lu retourne 0', (await call('/notifications?statut=lu', { token: clientTokenA })).data?.data?.total === 0 ? 200 : 500, 200);
  ok('Filtre type=reservation_created retourne 1', (await call('/notifications?type=reservation_created', { token: clientTokenA })).data?.data?.total === 1 ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 3 — Compteur de non lues
     ══════════════════════════════════════════════════════════════════ */
  const unread0 = await call('/notifications/unread-count', { token: clientTokenA });
  ok('GET /notifications/unread-count = 1', unread0.data?.data?.unread === 1 ? 200 : 500, 200, `unread=${unread0.data?.data?.unread}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 4 — Marquage lu (PATCH /:id/read)
     ══════════════════════════════════════════════════════════════════ */
  const readRes = await call(`/notifications/${notifResa.id}/read`, { method: 'PATCH', token: clientTokenA });
  ok('PATCH /notifications/:id/read : 200', readRes.status, 200);
  ok('read=true + readAt renseigné', readRes.data?.data?.read === true && readRes.data?.data?.readAt ? 200 : 500, 200);
  const unread1 = await call('/notifications/unread-count', { token: clientTokenA });
  ok('Compteur décrémenté → 0', unread1.data?.data?.unread === 0 ? 200 : 500, 200, `unread=${unread1.data?.data?.unread}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 5 — Tout marquer lu (PATCH /read-all)
     ══════════════════════════════════════════════════════════════════ */
  const payA = await call(`/bookings/${bookingId}/payments`, {
    method: 'POST', token: clientTokenA, body: { methode: 'orange_money' },
  });
  ok('Paiement intégral (statut payee)', payA.data?.data?.statut === 'payee' ? 200 : 500, 200, payA.data?.data?.statut || '');
  paymentId = payA.data?.data?.paiements?.[0]?.id || payA.data?.data?.id;
  const allRead = await call('/notifications/read-all', { method: 'PATCH', token: clientTokenA });
  ok('PATCH /notifications/read-all : 200', allRead.status, 200);
  ok('unread = 0 après read-all', allRead.data?.data?.unread === 0 ? 200 : 500, 200, `unread=${allRead.data?.data?.unread}`);
  const listAfterRead = await call('/notifications?statut=non_lu', { token: clientTokenA });
  ok('Aucune non lue restante', listAfterRead.data?.data?.total === 0 ? 200 : 500, 200, `total=${listAfterRead.data?.data?.total}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 8 — Paiement confirmé → client + company_admin
     ══════════════════════════════════════════════════════════════════ */
  const listA2 = await call('/notifications', { token: clientTokenA });
  ok('Client A : notification payment_confirmed', listA2.data?.data?.items?.some((n) => n.type === 'payment_confirmed') ? 200 : 500, 200, `total=${listA2.data?.data?.total}`);
  const companyList = await call('/notifications', { token: companyToken });
  const cNewResa = companyList.data?.data?.items?.find((n) => n.type === 'nouvelle_reservation');
  const cNewPay = companyList.data?.data?.items?.find((n) => n.type === 'nouveau_paiement');
  ok('Company C001 : notification nouvelle_reservation', cNewResa ? 200 : 500, 200, cNewResa?.label || '');
  ok('Company C001 : notification nouveau_paiement', cNewPay ? 200 : 500, 200, cNewPay?.label || '');
  ok('Company C001 : data.compagnieId = C001', cNewPay?.data?.compagnieId === 'C001' ? 200 : 500, 200, cNewPay?.data?.compagnieId || '');
  ok('Company C001 : aucune donnée sensible', !hasSensitive(cNewResa) && !hasSensitive(cNewPay) ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 9 — Billet généré → notification client (ticket_available)
     ══════════════════════════════════════════════════════════════════ */
  const billets = await db.Billet.findAll({ where: { reservation_id: bookingId } });
  ok('DB : billet auto-émis après paiement', billets.length >= 1 ? 200 : 500, 200, `billets=${billets.length}`);
  const listA3 = await call('/notifications', { token: clientTokenA });
  const tAvail = listA3.data?.data?.items?.find((n) => n.type === 'ticket_available');
  ok('Client A : notification ticket_available', tAvail ? 200 : 500, 200, tAvail?.actionPath || '');
  ok('ticket_available : actionPath /client/tickets', tAvail?.actionPath === '/client/tickets' ? 200 : 500, 200, tAvail?.actionPath || '');

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 7 — Isolation : B ne voit pas / ne lit pas les notifs de A
     ══════════════════════════════════════════════════════════════════ */
  const listB = await call('/notifications', { token: clientTokenB });
  ok('Client B : aucune notification', listB.data?.data?.total === 0 ? 200 : 500, 200, `total=${listB.data?.data?.total}`);
  const readByB = await call(`/notifications/${notifResa.id}/read`, { method: 'PATCH', token: clientTokenB });
  ok('Client B : PATCH /:id/read de A → 404', readByB.status, 404, `status=${readByB.status}`);
  const delByB = await call(`/notifications/${notifResa.id}`, { method: 'DELETE', token: clientTokenB });
  ok('Client B : DELETE de A → 404', delByB.status, 404, `status=${delByB.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 6 — Suppression (DELETE /:id)
     ══════════════════════════════════════════════════════════════════ */
  const delRes = await call(`/notifications/${notifResa.id}`, { method: 'DELETE', token: clientTokenA });
  ok('DELETE /notifications/:id : 200', delRes.status, 200);
  const listAfterDel = await call('/notifications', { token: clientTokenA });
  ok('Notification supprimée absente de la liste', !listAfterDel.data?.data?.items?.some((n) => n.id === notifResa.id) ? 200 : 500, 200);
  const delAgain = await call(`/notifications/${notifResa.id}`, { method: 'DELETE', token: clientTokenA });
  ok('DELETE d\'une notification inexistante → 404', delAgain.status, 404, `status=${delAgain.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 10 — Abonnement proche expiration → company_admin
     ══════════════════════════════════════════════════════════════════ */
  await runSubscriptionJob();
  const nearList = await call('/notifications?type=abonnement_bientot_expire', { token: nearToken });
  ok('CN16 : notification abonnement_bientot_expire', nearList.data?.data?.total >= 1 ? 200 : 500, 200, `total=${nearList.data?.data?.total}`);
  const nearNotif = nearList.data?.data?.items?.find((n) => n.data?.compagnieId === C_NEAR);
  ok('CN16 : data.compagnieId = CN16', nearNotif ? 200 : 500, 200, nearNotif?.title || '');

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 11 — Abonnement expiré → company_admin + super_admin
     ══════════════════════════════════════════════════════════════════ */
  const expList = await call('/notifications?type=abonnement_expire', { token: expToken });
  ok('CN17 : notification abonnement_expire (company)', expList.data?.data?.total >= 1 ? 200 : 500, 200, `total=${expList.data?.data?.total}`);
  const superList = await call('/notifications', { token: adminToken });
  ok('Super admin : notification abonnement_expire', superList.data?.data?.items?.some((n) => n.type === 'abonnement_expire' && n.data?.compagnieId === C_EXP) ? 200 : 500, 200, `total=${superList.data?.data?.total}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 12 — Aucune notification dupliquée (événement rejoué)
     ══════════════════════════════════════════════════════════════════ */
  const dbCountNear = await db.Notification.count({ where: { recipient_id: AGT_NEAR, type: 'abonnement_bientot_expire' } });
  const dbCountExp = await db.Notification.count({ where: { recipient_id: AGT_EXP, type: 'abonnement_expire' } });
  const dbCountSuper = await db.Notification.count({ where: { recipient_id: companyAdminId, type: 'nouvelle_reservation' } });
  await runSubscriptionJob();
  const dbCountNear2 = await db.Notification.count({ where: { recipient_id: AGT_NEAR, type: 'abonnement_bientot_expire' } });
  const dbCountExp2 = await db.Notification.count({ where: { recipient_id: AGT_EXP, type: 'abonnement_expire' } });
  ok('Rejeu cron : CN16 toujours 1 notification (idempotent)', dbCountNear === 1 && dbCountNear2 === 1 ? 200 : 500, 200, `avant=${dbCountNear}, après=${dbCountNear2}`);
  ok('Rejeu cron : CN17 toujours 1 notification (idempotent)', dbCountExp === 1 && dbCountExp2 === 1 ? 200 : 500, 200, `avant=${dbCountExp}, après=${dbCountExp2}`);
  ok('Nouvelle réservation : 1 seule notification company', dbCountSuper === 1 ? 200 : 500, 200, `count=${dbCountSuper}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 13 — Nettoyage complet
     ══════════════════════════════════════════════════════════════════ */
  await cleanup();
  const afterClient = await db.Client.count({ where: { email: { [db.Sequelize.Op.in]: [clientEmailA, clientEmailB] } } });
  const afterAgents = await db.Agent.count({ where: { id: { [db.Sequelize.Op.in]: [AGT_NEAR, AGT_EXP] } } });
  const afterSubs = await db.AbonnementCompagnie.count({ where: { compagnie_id: { [db.Sequelize.Op.in]: [C_NEAR, C_EXP] } } });
  const afterNotif = await db.Notification.count({ where: { recipient_id: { [db.Sequelize.Op.in]: [clientAId, clientBId, AGT_NEAR, AGT_EXP, companyAdminId] } } });
  ok('Nettoyage : clients de test supprimés', afterClient === 0 ? 200 : 500, 200, `clients=${afterClient}`);
  ok('Nettoyage : agents de test supprimés', afterAgents === 0 ? 200 : 500, 200, `agents=${afterAgents}`);
  ok('Nettoyage : abonnements de test supprimés', afterSubs === 0 ? 200 : 500, 200, `subs=${afterSubs}`);
  ok('Nettoyage : notifications de test supprimées', afterNotif === 0 ? 200 : 500, 200, `notifs=${afterNotif}`);

  /* ── Rapport ─────────────────────────────────────────────────────── */
  console.log('\n════════ RAPPORT TEST NOTIFICATIONS ════════');
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
