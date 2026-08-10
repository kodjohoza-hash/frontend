/* =====================================================================
   Tests d'intégration du MODULE 17 — MESSAGERIE INTERNE
   Exécution : node scripts/test_messaging.js
   Nécessite : serveur démarré sur le port 5001 (module messages chargé ;
               tables `conversation`, `conversation_participant`, `message`
               créées). Lance le serveur avec DB_SYNC=false une fois les
               tables créées.
   Couvre (14 scénarios obligatoires) :
     1.  Client ↔ compagnie (conversation créée, contexte réservation).
     2.  Company_admin ↔ client (réutilise la conversation → dédoublonnage).
     3.  Agent ↔ agent (company_admin ↔ counter_agent, même compagnie).
     4.  Super_admin ↔ compagnie (compagnies actives).
     5.  Client ↔ super_admin (support).
     6.  Liste paginée + sérialisation (otherParty, lastMessage, contexte).
     7.  Compteur de non lues (incrément/décrément).
     8.  Marquage d'une conversation comme lue.
     9.  Témoin de lecture d'un message (PATCH /messages/:id/read).
    10.  Suppression d'un message (propriété stricte : 403 si pas l'auteur).
    11.  Isolation client : B ne voit pas / n'écrit pas dans la conversation de A.
    12.  Isolation compagnie : C999 ne contacte pas C001 (403 partout).
    13.  Validation : message vide / >2000 caractères → 400 ; 2000 → OK.
    14.  Nettoyage complet des données de test.
   ===================================================================== */
const BASE = 'http://localhost:5001/api/v1';

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
const D = dayPlus(6);

/* Entités de test (compagnie C999 isolée + counter_agent C001). */
const C2 = 'C999';
const AG2 = 'AG99900001';
const AGT_ADMIN2 = 'AGT9990001';
const AGT_COUNT2 = 'AGT9990002';
const AGT_COUNT1 = 'AGT0010001';

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  const clientEmailA = `msg.a.${UNIQUE.toLowerCase()}@test.com`;
  const clientEmailB = `msg.b.${UNIQUE.toLowerCase()}@test.com`;
  const admin2Email = `msg.admin2.${UNIQUE.toLowerCase()}@test.com`;
  const count2Email = `msg.count2.${UNIQUE.toLowerCase()}@test.com`;
  const count1Email = `msg.count1.${UNIQUE.toLowerCase()}@test.com`;

  const TEST_AGENTS = [AGT_ADMIN2, AGT_COUNT2, AGT_COUNT1];
  const C001_PARTICIPANTS = ['AGT0000001', 'AGT0000002'];

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

      /* Conversations de la messagerie : participants de test + C001 (résidus SC4/SC5) + C999. */
      const partRows = await db.ConversationParticipant.findAll({
        where: { participant_id: { [db.Sequelize.Op.in]: [...tcIds, ...TEST_AGENTS, ...C001_PARTICIPANTS] } },
      }).catch(() => []);
      const convIds = new Set(partRows.map((p) => p.conversation_id));
      const c999 = await db.Conversation.findAll({ where: { company_id: C2 } }).catch(() => []);
      c999.forEach((c) => convIds.add(c.id));
      for (const cid of convIds) {
        await db.Message.destroy({ where: { conversation_id: cid } }).catch(() => {});
        await db.ConversationParticipant.destroy({ where: { conversation_id: cid } }).catch(() => {});
        await db.Conversation.destroy({ where: { id: cid } }).catch(() => {});
      }

      const testBuses = await db.Bus.findAll({ where: { immatriculation: { [db.Sequelize.Op.like]: 'TEST-%' } } });
      const busIds = testBuses.map((b) => b.id);
      if (busIds.length) {
        await db.Depart.destroy({ where: { bus_id: { [db.Sequelize.Op.in]: busIds } } }).catch(() => {});
        await db.Bus.destroy({ where: { id: { [db.Sequelize.Op.in]: busIds } } }).catch(() => {});
      }

      for (const agt of TEST_AGENTS) {
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

  const superAdmin = await db.Agent.findOne({ where: { email: 'admin@bustixconnect.com' } });
  const companyAdmin = await db.Agent.findOne({ where: { email: 'company@bustixconnect.com' } });
  const superAdminId = superAdmin.id;
  const companyAdminId = companyAdmin.id;

  /* ── Création : counter_agent C001 + compagnie C999 (admin + counter) ── */
  await db.Agent.create({
    id: AGT_COUNT1, matricule: `M17C1-${UNIQUE.slice(-6)}`, prenom: 'Comptoir', nom: 'C001',
    email: count1Email, telephone: '+237698000001', role: 'counter_agent', date_embauche: '2026-01-01',
    statut: 'actif', verifie: true, agence_id: 'AG00000001',
  });
  await db.CompteAgent.create({ agent_id: AGT_COUNT1, email: count1Email, telephone: '+237698000001', mot_de_passe_hash: await hashPassword('Msg@123') });
  const count1Token = await loginAgent(count1Email, 'Msg@123');
  ok('Login counter_agent (C001)', count1Token ? 200 : 500, 200);

  await db.Compagnie.create({ id: C2, nom: `Compagnie Messagerie Test ${C2}`, telephone: '+237698000009', couleur: '#993366', actif: true, statut: 'actif' });
  await db.Agence.create({ id: AG2, nom: `Agence Msg ${C2}`, ville_id: 'DLA', adresse: 'Test', telephone: '+237698000011', compagnie_id: C2, statut_abonnement: 'actif' });
  await db.Agent.create({
    id: AGT_ADMIN2, matricule: `M17C2-${UNIQUE.slice(-6)}`, prenom: 'Admin', nom: 'C999',
    email: admin2Email, telephone: '+237698000012', role: 'company_admin', date_embauche: '2026-01-01',
    statut: 'actif', verifie: true, agence_id: AG2,
  });
  await db.CompteAgent.create({ agent_id: AGT_ADMIN2, email: admin2Email, telephone: '+237698000012', mot_de_passe_hash: await hashPassword('Msg@123') });
  await db.Agent.create({
    id: AGT_COUNT2, matricule: `M17C3-${UNIQUE.slice(-6)}`, prenom: 'Comptoir', nom: 'C999',
    email: count2Email, telephone: '+237698000013', role: 'counter_agent', date_embauche: '2026-01-01',
    statut: 'actif', verifie: true, agence_id: AG2,
  });
  await db.CompteAgent.create({ agent_id: AGT_COUNT2, email: count2Email, telephone: '+237698000013', mot_de_passe_hash: await hashPassword('Msg@123') });
  const admin2Token = await loginAgent(admin2Email, 'Msg@123');
  const count2Token = await loginAgent(count2Email, 'Msg@123');
  ok('Login company_admin (C999)', admin2Token ? 200 : 500, 200);
  ok('Login counter_agent (C999)', count2Token ? 200 : 500, 200);

  /* ── Bus + voyage de test (C001) ─────────────────────────────────── */
  await db.Bus.create({
    id: BUS_ID, immatriculation: `TEST-${UNIQUE.slice(-6)}`, interne: `TI-${UNIQUE.slice(-6)}`,
    modele: 'Bus Test Msg', marque: 'Test', capacite: 45, compagnie_id: 'C001',
    statut: 'available', type_bus: 'standard', classe: 'economy',
  });
  const created = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: PRICE, companyId: 'C001', agencyId: 'AG00000001' },
  });
  ok('POST /trips (voyage de test)', created.status, 201, created.data?.data?.id || '');
  const tripId = created.data?.data?.id;

  /* ── Inscription de deux clients ─────────────────────────────────── */
  const regA = await call('/auth/register-client', {
    method: 'POST',
    body: { prenom: 'Messagerie', nom: 'ClientA', telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`, email: clientEmailA, motDePasse: 'Client@123', pays: 'Cameroun', ville: 'Douala' },
  });
  ok('POST /auth/register-client A', regA.status, 201, regA.data?.data?.user?.role || '');
  const clientAId = regA.data?.data?.user?.id;
  const clientTokenA = regA.data?.data?.token;

  const regB = await call('/auth/register-client', {
    method: 'POST',
    body: { prenom: 'Messagerie', nom: 'ClientB', telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`, email: clientEmailB, motDePasse: 'Client@123', pays: 'Cameroun', ville: 'Douala' },
  });
  ok('POST /auth/register-client B', regB.status, 201, regB.data?.data?.user?.role || '');
  const clientBId = regB.data?.data?.user?.id;
  const clientTokenB = regB.data?.data?.token;

  /* ── Réservation du client A sur un voyage C001 ──────────────────── */
  const bA = await call('/bookings', {
    method: 'POST', token: clientTokenA,
    body: {
      tripId,
      seats: [{ siege: '1' }],
      passengers: [{ firstName: 'Passager', lastName: 'Msg', gender: 'M', birthDate: '1990-05-10', phone: '+237698000021', email: 'pax.msg@test.com', documentType: 'cni', documentNumber: 'CNI-MSG-0001', nationality: 'Camerounaise' }],
      modeReservation: 'en_ligne',
    },
  });
  ok('POST /bookings (client A)', bA.status, 201, bA.data?.data?.id || '');
  if (bA.status !== 201) { console.error('[diag] CRITICAL POST /bookings →', bA.status, JSON.stringify(bA.data)); throw new Error('ARRET: création critique en échec'); }
  const reservationId = bA.data?.data?.id;

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 1 — Client ↔ compagnie (contexte réservation)
     ══════════════════════════════════════════════════════════════════ */
  const convBody = (recipient, context) => ({
    subject: 'Question sur ma réservation',
    recipient,
    ...(context ? { context } : {}),
  });
  const convA = await call('/messages/conversations', {
    method: 'POST', token: clientTokenA,
    body: convBody({ type: 'company', id: 'C001' }, { type: 'reservation', id: reservationId }),
  });
  ok('SC1 Client A → compagnie C001 : conversation créée (201)', convA.status, 201, convA.data?.data?.conversationId || '');
  const convAId = convA.data?.data?.conversationId;

  const msg1 = await call(`/messages/conversations/${convAId}/messages`, {
    method: 'POST', token: clientTokenA, body: { content: 'Bonjour, ma réservation est-elle confirmée ?' },
  });
  ok('SC1 Client A envoie un message (201)', msg1.status, 201, msg1.data?.data?.id || '');

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 7 — Compteur de non lues
     ══════════════════════════════════════════════════════════════════ */
  const adminUnread1 = await call('/messages/unread-count', { token: companyToken });
  ok('SC7 Company_admin : 1 message non lu', adminUnread1.data?.data?.unread === 1 ? 200 : 500, 200, `unread=${adminUnread1.data?.data?.unread}`);
  const clientUnread0 = await call('/messages/unread-count', { token: clientTokenA });
  ok('SC7 Client A : 0 non lu (message à soi-même)', clientUnread0.data?.data?.unread === 0 ? 200 : 500, 200, `unread=${clientUnread0.data?.data?.unread}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 6 — Liste paginée + sérialisation
     ══════════════════════════════════════════════════════════════════ */
  const adminList = await call('/messages/conversations', { token: companyToken });
  const adminConv = adminList.data?.data?.items?.find((c) => c.id === convAId);
  ok('SC6 Company_admin : conversation visible dans la liste', adminConv ? 200 : 500, 200, `items=${adminList.data?.data?.items?.length}`);
  ok('SC6 otherParty = client A (nom + initiales)', adminConv?.otherParty?.type === 'client' && adminConv?.otherParty?.name ? 200 : 500, 200, adminConv?.otherParty?.name || '');
  ok('SC6 lastMessage renseigné', adminConv?.lastMessage?.content ? 200 : 500, 200, adminConv?.lastMessage?.content || '');
  ok('SC6 unreadCount = 1 pour le company_admin', adminConv?.unreadCount === 1 ? 200 : 500, 200, `unread=${adminConv?.unreadCount}`);
  ok('SC6 contexte réservation exposé', adminConv?.context?.type === 'reservation' && adminConv?.context?.reference ? 200 : 500, 200, adminConv?.context?.reference || '');
  ok('SC6 sérialisation sans donnée sensible', !hasSensitive(adminConv) ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 8 — Marquage d'une conversation comme lue
     ══════════════════════════════════════════════════════════════════ */
  const readConv = await call(`/messages/conversations/${convAId}/read`, { method: 'PATCH', token: companyToken });
  ok('SC8 PATCH /conversations/:id/read : 200', readConv.status, 200);
  const adminUnread2 = await call('/messages/unread-count', { token: companyToken });
  ok('SC8 Company_admin : compteur remis à 0', adminUnread2.data?.data?.unread === 0 ? 200 : 500, 200, `unread=${adminUnread2.data?.data?.unread}`);

  /* ══════════════════════════════════════════════════════════════════
     Réponse du company_admin → client A non lu
     ══════════════════════════════════════════════════════════════════ */
  const reply1 = await call(`/messages/conversations/${convAId}/messages`, {
    method: 'POST', token: companyToken, body: { content: 'Bonjour, votre réservation est bien confirmée. À bientôt.' },
  });
  ok('Company_admin répond (201)', reply1.status, 201, reply1.data?.data?.id || '');
  const clientUnread1 = await call('/messages/unread-count', { token: clientTokenA });
  ok('SC7 Client A : 1 non lu après réponse', clientUnread1.data?.data?.unread === 1 ? 200 : 500, 200, `unread=${clientUnread1.data?.data?.unread}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 9 — Témoin de lecture d'un message
     ══════════════════════════════════════════════════════════════════ */
  const msgsA = await call(`/messages/conversations/${convAId}/messages`, { token: clientTokenA });
  const adminMsg = msgsA.data?.data?.items?.find((m) => m.senderId === companyAdminId);
  ok('SC9 GET messages : 2 messages, hasMore=false', msgsA.data?.data?.items?.length === 2 && msgsA.data?.data?.hasMore === false ? 200 : 500, 200, `items=${msgsA.data?.data?.items?.length}`);
  const markRead = await call(`/messages/${adminMsg.id}/read`, { method: 'PATCH', token: clientTokenA });
  ok('SC9 PATCH /messages/:id/read : read=true', markRead.status === 200 && markRead.data?.data?.read === true ? 200 : 500, 200, `read=${markRead.data?.data?.read}`);

  const clientConvDetail = await call(`/messages/conversations/${convAId}`, { token: clientTokenA });
  ok('SC8 Client A : conversation lue → unread 0', clientConvDetail.data?.data?.unreadCount === 0 ? 200 : 500, 200, `unread=${clientConvDetail.data?.data?.unreadCount}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 2 — Company_admin → client : dédoublonnage
     ══════════════════════════════════════════════════════════════════ */
  const convByAdmin = await call('/messages/conversations', {
    method: 'POST', token: companyToken,
    body: convBody({ type: 'client', id: clientAId }, { type: 'reservation', id: reservationId }),
  });
  ok('SC2 Company_admin → client A : conversation réutilisée (created=false)', convByAdmin.status === 200 && convByAdmin.data?.data?.created === false ? 200 : 500, 200, `id=${convByAdmin.data?.data?.conversationId}`);

  /* Dédoublonnage : re-création client → compagnie */
  const convADup = await call('/messages/conversations', {
    method: 'POST', token: clientTokenA,
    body: convBody({ type: 'company', id: 'C001' }, { type: 'reservation', id: reservationId }),
  });
  ok('SC1 Dédoublonnage : même conversation réutilisée', convADup.status === 200 && convADup.data?.data?.conversationId === convAId ? 200 : 500, 200, `id=${convADup.data?.data?.conversationId}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 3 — Agent ↔ agent (même compagnie)
     ══════════════════════════════════════════════════════════════════ */
  const convAA = await call('/messages/conversations', {
    method: 'POST', token: companyToken,
    body: { subject: 'Coordination guichet', recipient: { type: 'agent', id: AGT_COUNT1 } },
  });
  ok('SC3 Company_admin → counter_agent (C001) : conversation créée', convAA.status, 201, convAA.data?.data?.conversationId || '');
  const convAAId = convAA.data?.data?.conversationId;

  const count1List = await call('/messages/conversations', { token: count1Token });
  ok('SC3 Counter_agent : conversation visible (otherParty admin)', count1List.data?.data?.items?.some((c) => c.id === convAAId && c.otherParty?.id === companyAdminId) ? 200 : 500, 200, `items=${count1List.data?.data?.items?.length}`);

  const msgAA = await call(`/messages/conversations/${convAAId}/messages`, {
    method: 'POST', token: count1Token, body: { content: 'Guichet 1 : places disponibles pour dimanche.' },
  });
  ok('SC3 Counter_agent envoie un message (201)', msgAA.status, 201);
  const adminUnread3 = await call('/messages/unread-count', { token: companyToken });
  ok('SC3 Company_admin : 1 non lu du counter_agent', adminUnread3.data?.data?.unread === 1 ? 200 : 500, 200, `unread=${adminUnread3.data?.data?.unread}`);
  const readConvAA = await call(`/messages/conversations/${convAAId}/read`, { method: 'PATCH', token: companyToken });
  ok('SC3 Company_admin marque la conversation lue', readConvAA.status, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 4 — Super_admin ↔ compagnie
     ══════════════════════════════════════════════════════════════════ */
  const convSA = await call('/messages/conversations', {
    method: 'POST', token: adminToken,
    body: { subject: 'Alerte plateforme', recipient: { type: 'company', id: 'C001' } },
  });
  ok('SC4 Super_admin → compagnie C001 : conversation créée', convSA.status, 201, convSA.data?.data?.conversationId || '');
  const convSAId = convSA.data?.data?.conversationId;
  const adminConvSA = await call(`/messages/conversations/${convSAId}`, { token: companyToken });
  ok('SC4 Company_admin voit la conversation du super_admin', adminConvSA.status, 200);
  const msgSA = await call(`/messages/conversations/${convSAId}/messages`, {
    method: 'POST', token: adminToken, body: { content: 'Maintenance prévue dimanche 02h-04h.' },
  });
  ok('SC4 Super_admin envoie un message (201)', msgSA.status, 201);
  const saUnreadAdmin = await call(`/messages/conversations/${convSAId}`, { token: companyToken });
  ok('SC4 Company_admin : conversation non lue (unread=1)', saUnreadAdmin.data?.data?.unreadCount === 1 ? 200 : 500, 200, `unread=${saUnreadAdmin.data?.data?.unreadCount}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 5 — Client ↔ super_admin (support)
     ══════════════════════════════════════════════════════════════════ */
  const convSup = await call('/messages/conversations', {
    method: 'POST', token: clientTokenA,
    body: { subject: 'Besoin d’aide', recipient: { type: 'agent', id: superAdminId } },
  });
  ok('SC5 Client A → super_admin : conversation créée', convSup.status, 201, convSup.data?.data?.conversationId || '');
  const convSupId = convSup.data?.data?.conversationId;
  const msgSup = await call(`/messages/conversations/${convSupId}/messages`, {
    method: 'POST', token: clientTokenA, body: { content: 'Je n’arrive pas à télécharger mon billet.' },
  });
  ok('SC5 Client A écrit au support (201)', msgSup.status, 201);
  const superList = await call('/messages/conversations', { token: adminToken });
  ok('SC5 Super_admin voit la conversation support', superList.data?.data?.items?.some((c) => c.id === convSupId && c.otherParty?.type === 'client') ? 200 : 500, 200, `items=${superList.data?.data?.items?.length}`);
  const replySup = await call(`/messages/conversations/${convSupId}/messages`, {
    method: 'POST', token: adminToken, body: { content: 'Le billet est disponible dans votre espace « Mes billets ».' },
  });
  ok('SC5 Super_admin répond (201)', replySup.status, 201);
  const clientUnread2 = await call('/messages/unread-count', { token: clientTokenA });
  ok('SC5 Client A : 1 non lu du support', clientUnread2.data?.data?.unread === 1 ? 200 : 500, 200, `unread=${clientUnread2.data?.data?.unread}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 11 — Isolation client
     ══════════════════════════════════════════════════════════════════ */
  const bGetConv = await call(`/messages/conversations/${convAId}`, { token: clientTokenB });
  ok('SC11 Client B : GET conversation de A → 403', bGetConv.status, 403, `status=${bGetConv.status}`);
  const bSendMsg = await call(`/messages/conversations/${convAId}/messages`, {
    method: 'POST', token: clientTokenB, body: { content: 'Je me faufile.' },
  });
  ok('SC11 Client B : envoi dans la conversation de A → 403', bSendMsg.status, 403, `status=${bSendMsg.status}`);
  const bCreate = await call('/messages/conversations', {
    method: 'POST', token: clientTokenB,
    body: { subject: 'Sans réservation', recipient: { type: 'company', id: 'C001' } },
  });
  ok('SC11 Client B : conversation C001 sans réservation → 403', bCreate.status, 403, `status=${bCreate.status}`);
  const bUnread = await call('/messages/unread-count', { token: clientTokenB });
  ok('SC11 Client B : 0 non lu', bUnread.data?.data?.unread === 0 ? 200 : 500, 200, `unread=${bUnread.data?.data?.unread}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 12 — Isolation compagnie
     ══════════════════════════════════════════════════════════════════ */
  const c2Cross = await call('/messages/conversations', {
    method: 'POST', token: admin2Token,
    body: { subject: 'Bonne affaire', recipient: { type: 'agent', id: companyAdminId } },
  });
  ok('SC12 C999 admin → agent C001 : 403', c2Cross.status, 403, `status=${c2Cross.status}`);
  const c2Get = await call(`/messages/conversations/${convAId}`, { token: admin2Token });
  ok('SC12 C999 admin : GET conversation C001 → 403', c2Get.status, 403, `status=${c2Get.status}`);
  const c2Client = await call('/messages/conversations', {
    method: 'POST', token: admin2Token,
    body: { subject: 'Contact direct', recipient: { type: 'client', id: clientAId } },
  });
  ok('SC12 C999 admin → client de C001 : 403 (aucune réservation C999)', c2Client.status, 403, `status=${c2Client.status}`);
  const c2Count = await call('/messages/conversations', {
    method: 'POST', token: count2Token,
    body: { subject: 'Intercompagnie', recipient: { type: 'agent', id: AGT_COUNT1 } },
  });
  ok('SC12 C999 counter → counter C001 : 403', c2Count.status, 403, `status=${c2Count.status}`);
  const c2Send = await call(`/messages/conversations/${convAAId}/messages`, {
    method: 'POST', token: count2Token, body: { content: 'Intrusion.' },
  });
  ok('SC12 C999 : envoi dans la conversation C001 → 403', c2Send.status, 403, `status=${c2Send.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 13 — Validation du contenu
     ══════════════════════════════════════════════════════════════════ */
  const emptyMsg = await call(`/messages/conversations/${convAId}/messages`, {
    method: 'POST', token: clientTokenA, body: { content: '   ' },
  });
  ok('SC13 Message vide → 400', emptyMsg.status, 400, `status=${emptyMsg.status}`);
  const tooLong = await call(`/messages/conversations/${convAId}/messages`, {
    method: 'POST', token: clientTokenA, body: { content: 'x'.repeat(2001) },
  });
  ok('SC13 Message >2000 caractères → 400', tooLong.status, 400, `status=${tooLong.status}`);
  const maxMsg = await call(`/messages/conversations/${convAId}/messages`, {
    method: 'POST', token: clientTokenA, body: { content: 'x'.repeat(2000) },
  });
  ok('SC13 Message de 2000 caractères → 201', maxMsg.status, 201, maxMsg.data?.data?.id || '');

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 10 — Suppression d'un message (propriété stricte)
     ══════════════════════════════════════════════════════════════════ */
  const maxMsgId = maxMsg.data?.data?.id;
  const delByOther = await call(`/messages/${maxMsgId}`, { method: 'DELETE', token: companyToken });
  ok('SC10 Company_admin : suppression du message de A → 403', delByOther.status, 403, `status=${delByOther.status}`);
  const delOwn = await call(`/messages/${maxMsgId}`, { method: 'DELETE', token: clientTokenA });
  ok('SC10 Client A : suppression de son propre message → 200', delOwn.status, 200, `status=${delOwn.status}`);
  const delTwice = await call(`/messages/${maxMsgId}`, { method: 'DELETE', token: clientTokenA });
  ok('SC10 Suppression d’un message inexistant → 404', delTwice.status, 404, `status=${delTwice.status}`);

  /* ══════════════════════════════════════════════════════════════════
     Annuaires (compagnies & clients)
     ══════════════════════════════════════════════════════════════════ */
  const companies = await call('/messages/companies', { token: adminToken });
  ok('Annuaire : super_admin liste les compagnies actives (C001 présent)', companies.data?.data?.some((c) => c.id === 'C001') ? 200 : 500, 200, `n=${companies.data?.data?.length}`);
  const clientsOfC001 = await call('/messages/companies/C001/clients', { token: companyToken });
  ok('Annuaire : company_admin liste ses clients (client A présent)', clientsOfC001.data?.data?.some((c) => c.id === clientAId) ? 200 : 500, 200, `n=${clientsOfC001.data?.data?.length}`);
  const clientsForbidden = await call('/messages/companies/C001/clients', { token: count1Token });
  ok('Annuaire : counter_agent → 403', clientsForbidden.status, 403, `status=${clientsForbidden.status}`);

  /* ══════════════════════════════════════════════════════════════════
     Pagination de la liste
     ══════════════════════════════════════════════════════════════════ */
  const pageA = await call('/messages/conversations?page=1&limit=1', { token: clientTokenA });
  ok('Pagination client A : 1 item/page, total=2', pageA.data?.data?.items?.length === 1 && pageA.data?.data?.total === 2 ? 200 : 500, 200, `items=${pageA.data?.data?.items?.length}, total=${pageA.data?.data?.total}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 14 — Nettoyage complet
     ══════════════════════════════════════════════════════════════════ */
  await cleanup();
  const afterClients = await db.Client.count({ where: { email: { [db.Sequelize.Op.in]: [clientEmailA, clientEmailB] } } });
  const afterAgents = await db.Agent.count({ where: { id: { [db.Sequelize.Op.in]: TEST_AGENTS } } });
  const afterCompanies = await db.Compagnie.count({ where: { id: C2 } });
  const afterConvs = await db.Conversation.count({ where: { company_id: C2 } });
  ok('SC14 Nettoyage : clients de test supprimés', afterClients === 0 ? 200 : 500, 200, `clients=${afterClients}`);
  ok('SC14 Nettoyage : agents de test supprimés', afterAgents === 0 ? 200 : 500, 200, `agents=${afterAgents}`);
  ok('SC14 Nettoyage : compagnie C999 supprimée', afterCompanies === 0 ? 200 : 500, 200, `compagnies=${afterCompanies}`);
  ok('SC14 Nettoyage : conversations C999 supprimées', afterConvs === 0 ? 200 : 500, 200, `convs=${afterConvs}`);

  /* ── Rapport ─────────────────────────────────────────────────────── */
  console.log('\n════════ RAPPORT TEST MESSAGERIE ════════');
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
