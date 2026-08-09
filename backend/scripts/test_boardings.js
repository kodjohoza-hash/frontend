/* =====================================================================
   Tests d'intégration du MODULE 15 — CONTRÔLE DES BILLETS & EMBARQUEMENT
   Exécution : node scripts/test_boardings.js
   Nécessite : serveur démarré sur le port 5001 (modules auth, trips,
               bookings, tickets chargés ; seed réalisé).
   Couvre (10 scénarios obligatoires) :
    1. Vérification QR réelle (verify) → VALID, ré-scan valide.
    2. Anti-double-embarquement : 2 check-in SIMULTANÉS → 1 embarqué,
       1 refusé ALREADY_USED (verrouillage FOR UPDATE).
    3. Check-in guichet : agent_id + guichet_id journalisés en base.
    4. Contact d'urgence = 1 billet / 1 siège / 1 passager (jamais 2).
    5. Le client ne peut NI vérifier NI embarquer son billet (403).
    6. Contrôle hors périmètre compagnie/agence → WRONG_COMPANY / 403.
    7. QR falsifié (signature HMAC altérée) → INVALID.
    8. Billets annulé / remboursé / expiré refusés (CANCELLED/REFUNDED/
       EXPIRED + bascule auto valide→expire).
    9. Journal check-in-history : scans + check-ins fusionnés, triés,
       sans donnée sensible.
   10. Nettoyage complet des données de test.
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
const D = dayPlus(5);

(async () => {
  const steps = [];
  const ok = (name, status, expected = 200, extra = '') =>
    steps.push([name, status, expected, extra]);

  let adminToken = null;
  let counterToken = null;
  let clientToken = null;
  let otherCounterToken = null;
  let otherCompanyToken = null;
  let clientId = null;
  let tripId = null;
  let bookingA = null; // critique : 1 siège + 1 passager + 1 contact d'urgence
  let bookingB = null; // QR falsifié puis annulé
  let bookingC = null; // remboursé
  let bookingD = null; // expiré
  let bookingE = null; // billet rembourse (réservation payée) -> REFUNDED
  let ticketA = null; let ticketB = null; let ticketC = null; let ticketD = null; let ticketE = null;
  let sigB = null;

  /* Identifiants hors périmètre (compagnie C999 / agence AG9) */
  const C_OTHER = 'C999';
  const AG_OTHER = 'AG0000999';
  const AGT_OTHER_COUNTER = 'AGT0000099';
  const AGT_OTHER_COMPANY = 'AGT0000098';
  const GCH_ID = 'GCH0000001';
  const ORIG_COUNTER_GUICHET = null;

  /* Nettoyage FK-safe (repart propre si un run précédent a échoué). */
  const purgeAuth = async (agentIds, clientIds) => {
    if (agentIds?.length) {
      await db.RefreshToken.destroy({ where: { agent_id: { [db.Sequelize.Op.in]: agentIds } } }).catch(() => {});
      await db.SessionConnexion.destroy({ where: { agent_id: { [db.Sequelize.Op.in]: agentIds } } }).catch(() => {});
    }
    if (clientIds?.length) {
      await db.RefreshToken.destroy({ where: { client_id: { [db.Sequelize.Op.in]: clientIds } } }).catch(() => {});
      await db.SessionConnexion.destroy({ where: { client_id: { [db.Sequelize.Op.in]: clientIds } } }).catch(() => {});
    }
  };

  /* Pré-nettoyage : traces d'un run interrompu (idempotence du script). */
  const preClean = async () => {
    await db.Agent.update({ guichet_id: null }, { where: { id: 'AGT0000003' } }).catch(() => {});
    await db.Guichet.destroy({ where: { id: GCH_ID } }).catch(() => {});
    const testClients = await db.Client.findAll({ where: { email: { [db.Sequelize.Op.like]: 'controle.%@test.com' } } });
    const testBuses = await db.Bus.findAll({ where: { immatriculation: { [db.Sequelize.Op.like]: 'TEST-%' } } });
    const otherAgents = await db.Agent.findAll({ where: { email: { [db.Sequelize.Op.like]: 'hors.%@test.com' } } });
    const tcIds = testClients.map((c) => c.id);
    const orphanResas = tcIds.length
      ? await db.Reservation.findAll({ where: { client_id: { [db.Sequelize.Op.in]: tcIds } } })
      : [];
    await cleanup(orphanResas.map((r) => r.id));
    if (tcIds.length) await purgeAuth([], tcIds);
    if (tcIds.length) await db.Client.destroy({ where: { id: { [db.Sequelize.Op.in]: tcIds } } }).catch(() => {});
    const busIds = testBuses.map((b) => b.id);
    if (busIds.length) {
      await db.Depart.destroy({ where: { bus_id: { [db.Sequelize.Op.in]: busIds } } }).catch(() => {});
      await db.Bus.destroy({ where: { id: { [db.Sequelize.Op.in]: busIds } } }).catch(() => {});
    }
    const oaIds = otherAgents.map((a) => a.id);
    if (oaIds.length) {
      await purgeAuth(oaIds, []);
      await db.CompteAgent.destroy({ where: { agent_id: { [db.Sequelize.Op.in]: oaIds } } }).catch(() => {});
      await db.Agent.destroy({ where: { id: { [db.Sequelize.Op.in]: oaIds } } }).catch(() => {});
    }
    await db.Agence.destroy({ where: { id: AG_OTHER } }).catch(() => {});
    await db.Compagnie.destroy({ where: { id: C_OTHER } }).catch(() => {});
  };

  const cleanup = async (ids) => {
    const list = (ids || []).filter(Boolean);
    if (list.length) {
      try {
        const billets = await db.Billet.findAll({ where: { reservation_id: { [db.Sequelize.Op.in]: list } } });
        const bid = billets.map((b) => b.id);
        if (bid.length) {
          await db.CheckInBillet.destroy({ where: { billet_id: { [db.Sequelize.Op.in]: bid } } });
          await db.ScanBillet.destroy({ where: { billet_id: { [db.Sequelize.Op.in]: bid } } });
        }
        await db.Billet.destroy({ where: { reservation_id: { [db.Sequelize.Op.in]: list } } });
        await db.Paiement.destroy({ where: { reservation_id: { [db.Sequelize.Op.in]: list } } });
        const pass = await db.Passenger.findAll({ where: { reservation_id: { [db.Sequelize.Op.in]: list } } });
        const pids = pass.map((p) => p.id);
        if (pids.length) await db.EmergencyContact.destroy({ where: { passenger_id: { [db.Sequelize.Op.in]: pids } } });
        await db.Passenger.destroy({ where: { reservation_id: { [db.Sequelize.Op.in]: list } } });
        await db.PlaceReservee.destroy({ where: { reservation_id: { [db.Sequelize.Op.in]: list } } });
        await db.HistoriqueReservation.destroy({ where: { reservation_id: { [db.Sequelize.Op.in]: list } } });
        await db.Reservation.destroy({ where: { id: { [db.Sequelize.Op.in]: list } } });
      } catch (e) { console.warn(`[cleanup] ${e.message}`); }
    }
    /* Restauration du guichet de l'agent counter (seed). */
    try { await db.Agent.update({ guichet_id: ORIG_COUNTER_GUICHET }, { where: { id: 'AGT0000003' } }); } catch (_) {}
    try { await db.Guichet.destroy({ where: { id: GCH_ID } }); } catch (_) {}
    /* Données hors périmètre. */
    try {
      await purgeAuth([AGT_OTHER_COUNTER, AGT_OTHER_COMPANY], []);
      await db.CompteAgent.destroy({ where: { agent_id: { [db.Sequelize.Op.in]: [AGT_OTHER_COUNTER, AGT_OTHER_COMPANY] } } });
      await db.Agent.destroy({ where: { id: { [db.Sequelize.Op.in]: [AGT_OTHER_COUNTER, AGT_OTHER_COMPANY] } } });
      await db.Agence.destroy({ where: { id: AG_OTHER } });
      await db.Compagnie.destroy({ where: { id: C_OTHER } });
    } catch (e) { console.warn(`[cleanup-hors-scope] ${e.message}`); }
  };

  /* ── 1. Pré-nettoyage + Connexions ──────────────────────────────── */
  await preClean();
  adminToken = await loginAgent('admin@bustixconnect.com', 'Admin@123');
  ok('Login super_admin', adminToken ? 200 : 500, 200);

  /* ── 2. Données hors périmètre (C999 / AG9) ─────────────────────── */
  await db.Compagnie.findOrCreate({ where: { id: C_OTHER }, defaults: { nom: 'Compagnie Hors Scope', telephone: '+237699000099', couleur: '#111111', actif: true } });
  await db.Agence.findOrCreate({ where: { id: AG_OTHER }, defaults: { nom: 'Agence Hors Scope', ville_id: 'DLA', adresse: 'Test', telephone: '+237699000098', compagnie_id: C_OTHER, statut_abonnement: 'actif' } });
  for (const a of [
    { id: AGT_OTHER_COUNTER, matricule: 'HSC-0001', prenom: 'Hors', nom: 'Scope', email: `hors.counter.${UNIQUE.toLowerCase()}@test.com`, telephone: '+237699000097', role: 'counter_agent' },
    { id: AGT_OTHER_COMPANY, matricule: 'HSC-0002', prenom: 'Hors', nom: 'Compagnie', email: `hors.company.${UNIQUE.toLowerCase()}@test.com`, telephone: '+237699000096', role: 'company_admin' },
  ]) {
    await db.Agent.create({ id: a.id, matricule: a.matricule, prenom: a.prenom, nom: a.nom, email: a.email, telephone: a.telephone, role: a.role, date_embauche: '2026-01-01', statut: 'actif', verifie: true, agence_id: AG_OTHER });
    await db.CompteAgent.create({ agent_id: a.id, email: a.email, telephone: a.telephone, mot_de_passe_hash: await hashPassword('Other@123') });
  }
  otherCounterToken = await loginAgent(`hors.counter.${UNIQUE.toLowerCase()}@test.com`, 'Other@123');
  otherCompanyToken = await loginAgent(`hors.company.${UNIQUE.toLowerCase()}@test.com`, 'Other@123');
  ok('Login counter hors périmètre (agence AG9)', otherCounterToken ? 200 : 500, 200);
  ok('Login company hors périmètre (compagnie C999)', otherCompanyToken ? 200 : 500, 200);

  /* ── 3. Guichet de test + affectation à l'agent counter (seed) ───── */
  await db.Guichet.create({ id: GCH_ID, agence_id: 'AG00000001', code: `GCH-${UNIQUE.slice(-6)}`, nom: 'Guichet Test Contrôle', type: 'vente_billets', statut: 'ouvert' });
  await db.Agent.update({ guichet_id: GCH_ID }, { where: { id: 'AGT0000003' } });
  counterToken = await loginAgent('counter@bustixconnect.com', 'Counter@123');
  ok('Login counter_agent (avec guichet affecté)', counterToken ? 200 : 500, 200);

  /* ── 4. Bus + voyage de test ─────────────────────────────────────── */
  await db.Bus.create({
    id: BUS_ID, immatriculation: `TEST-${UNIQUE.slice(-6)}`, interne: `TI-${UNIQUE.slice(-6)}`,
    modele: 'Bus Test Contrôle', marque: 'Test', capacite: 45, compagnie_id: 'C001',
    statut: 'available', type_bus: 'standard', classe: 'economy',
  });
  const created = await call('/trips', {
    method: 'POST', token: adminToken,
    body: { routeId: 'RT81586700', busId: BUS_ID, date: D, departureTime: '08:00', arrivalTime: '11:30', price: PRICE, companyId: 'C001', agencyId: 'AG00000001' },
  });
  ok('POST /trips (voyage de test)', created.status, 201, created.data?.data?.id || '');
  tripId = created.data?.data?.id;

  /* ── 5. Inscription d'un client en ligne ─────────────────────────── */
  const reg = await call('/auth/register-client', {
    method: 'POST',
    body: {
      prenom: 'Test', nom: 'Controle',
      telephone: `+2376${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      email: `controle.${UNIQUE.toLowerCase()}@test.com`,
      motDePasse: 'Client@123',
      pays: 'Cameroun', ville: 'Douala',
    },
  });
  ok('POST /auth/register-client', reg.status, 201, reg.data?.data?.user?.role || '');
  clientId = reg.data?.data?.user?.id;
  clientToken = reg.data?.data?.token;

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 4 — Contact d'urgence = 1 billet / 1 siège / 1 passager
     ══════════════════════════════════════════════════════════════════ */
  const bA = await call('/bookings', {
    method: 'POST', token: clientToken,
    body: {
      tripId,
      seats: [{ siege: '1' }],
      passengers: [{
        firstName: 'Passager', lastName: 'Principal', gender: 'M',
        birthDate: '1990-05-10', phone: '+237699000001', email: 'pax1@test.com',
        documentType: 'cni', documentNumber: 'CNI-TEST-0001', nationality: 'Camerounaise',
        emergencyContact: { fullName: 'Contact Urgence', phone: '+237699000002', relationship: 'Soeur', address: 'Douala, Cameroun' },
      }],
      modeReservation: 'en_ligne',
    },
  });
  ok('POST /bookings 1 siège + 1 passager + 1 contact', bA.status, 201, bA.data?.data?.id || '');
  if (bA.status !== 201) { console.error('[diag] CRITICAL POST /bookings →', bA.status, JSON.stringify(bA.data)); throw new Error('ARRET: création critique en échec'); }
  bookingA = bA.data?.data?.id;
  ok('nbPlaces = 1 (contact jamais compté)', bA.data?.data?.nbPlaces === 1 ? 200 : 500, 200, `nb=${bA.data?.data?.nbPlaces}`);

  const payA = await call(`/bookings/${bookingA}/payments`, {
    method: 'POST', token: clientToken, body: { methode: 'orange_money' },
  });
  ok('Paiement intégral (statut payee)', payA.data?.data?.statut === 'payee' ? 200 : 500, 200, payA.data?.data?.statut || '');

  const dbBilletsA = await db.Billet.findAll({ where: { reservation_id: bookingA } });
  ok('DB : 1 seul billet émis pour 1 siège (jamais 2)', dbBilletsA.length === 1 ? 200 : 500, 200, `billets=${dbBilletsA.length}`);
  const dbPassA = await db.Passenger.findAll({ where: { reservation_id: bookingA } });
  const dbEcA = await db.EmergencyContact.count({ where: { passenger_id: dbPassA.map((p) => p.id) } });
  ok('DB : 1 passager uniquement', dbPassA.length === 1 ? 200 : 500, 200, `passagers=${dbPassA.length}`);
  ok('DB : 1 contact d\'urgence (rattaché, jamais compté comme billet)', dbEcA === 1 ? 200 : 500, 200, `contacts=${dbEcA}`);
  const dbBilletA = dbBilletsA[0];
  ticketA = dbBilletA?.id;
  ok('Billet valide (paiement complet)', dbBilletA?.statut === 'valide' ? 200 : 500, 200, dbBilletA?.statut || '');
  ok('Billet lié au siège 1', dbBilletA?.siege === '1' ? 200 : 500, 200, dbBilletA?.siege || '');
  ok('Billet lié au passager 1:1', dbBilletA?.passenger_id === dbPassA[0]?.id ? 200 : 500, 200);
  ok('QR payload + token + hash présents', dbBilletA?.qr_code && dbBilletA?.token && dbBilletA?.token_hash ? 200 : 500, 200);

  /* Sérialisation : passager exposé, contact d'urgence JAMAIS exposé. */
  const detA = await call(`/tickets/${ticketA}`, { token: counterToken });
  ok('GET /tickets/:id (counter)', detA.status, 200);
  ok('Passager exposé dans la sérialisation', detA.data?.data?.passenger?.firstName === 'Passager' ? 200 : 500, 200, detA.data?.data?.passenger?.firstName || '');
  ok('Contact d\'urgence jamais exposé + zéro secret', (!hasSensitive(detA.data?.data)) ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 1 — Vérification QR réelle (verify)
     ══════════════════════════════════════════════════════════════════ */
  const rawToken = dbBilletA.token;
  ok('Token QR = 48 hex', /^[A-Fa-f0-9]{48}$/.test(rawToken || '') ? 200 : 500, 200);

  const v1 = await call(`/tickets/verify/${rawToken}`, { token: counterToken });
  ok('Verify QR valide (counter)', v1.status, 200);
  ok('Résultat VALID', v1.data?.data?.valide === true && v1.data?.data?.code === 'VALID' ? 200 : 500, 200, v1.data?.data?.code || '');

  const v2 = await call(`/tickets/verify/${rawToken}`, { token: counterToken });
  ok('Ré-scan : toujours VALID (pas de consommation au scan)', v2.data?.data?.code === 'VALID' ? 200 : 500, 200, v2.data?.data?.code || '');

  const vCompany = await call(`/tickets/verify/${rawToken}`, { token: await loginAgent('company@bustixconnect.com', 'Company@123') });
  ok('Verify QR par company_admin (même compagnie)', vCompany.data?.data?.code === 'VALID' ? 200 : 500, 200, vCompany.data?.data?.code || '');

  const vNoToken = await call(`/tickets/verify/${'0'.repeat(48)}`, { token: counterToken });
  ok('Jeton inconnu -> INVALID', vNoToken.data?.data?.code === 'INVALID' ? 200 : 500, 200, vNoToken.data?.data?.code || '');

  const vPayload = await call(`/tickets/verify/${encodeURIComponent(dbBilletA.qr_code)}`, { token: counterToken });
  ok('API attend le jeton extrait (payload complet -> 400)', vPayload.status, 400, `status=${vPayload.status}`);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 5 — Le client ne peut NI vérifier NI embarquer
     ══════════════════════════════════════════════════════════════════ */
  const vClient = await call(`/tickets/verify/${rawToken}`, { token: clientToken });
  ok('Verify par le client -> 403', vClient.status, 403);
  const ciClient = await call(`/tickets/${ticketA}/check-in`, { method: 'POST', token: clientToken });
  ok('Check-in par le client -> 403', ciClient.status, 403, ciClient.data?.data?.message || '');

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 2 — ANTI-DOUBLE-EMBARQUEMENT : 2 check-in SIMULTANÉS
     ══════════════════════════════════════════════════════════════════ */
  const [ci1, ci2] = await Promise.all([
    call(`/tickets/${ticketA}/check-in`, { method: 'POST', token: counterToken }),
    call(`/tickets/${ticketA}/check-in`, { method: 'POST', token: counterToken }),
  ]);
  const emb = [ci1, ci2].filter((r) => r.data?.data?.boarded === true).length;
  const ref = [ci1, ci2].filter((r) => r.data?.data?.boarded === false && r.data?.data?.code === 'ALREADY_USED').length;
  ok('Anti-double simultané : 1 embarqué + 1 refusé ALREADY_USED', (emb === 1 && ref === 1) ? 200 : 500, 200, `embarqué=${emb}, refusé=${ref}`);
  ok('Réponse sans secret', !hasSensitive(ci1.data?.data) && !hasSensitive(ci2.data?.data) ? 200 : 500, 200);

  const ci3 = await call(`/tickets/${ticketA}/check-in`, { method: 'POST', token: counterToken });
  ok('3e check-in séquentiel : toujours refusé', ci3.data?.data?.boarded === false && ci3.data?.data?.code === 'ALREADY_USED' ? 200 : 500, 200, ci3.data?.data?.code || '');

  const dbBilletAFinal = await db.Billet.findByPk(ticketA);
  ok('DB : billet passé à « utilise » (jamais double)', dbBilletAFinal?.statut === 'utilise' ? 200 : 500, 200, dbBilletAFinal?.statut || '');
  ok('DB : verifie_le renseigné', dbBilletAFinal?.verifie_le ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 3 — Check-in guichet : agent_id + guichet_id journalisés
     ══════════════════════════════════════════════════════════════════ */
  const checkinsA = await db.CheckInBillet.findAll({ where: { billet_id: ticketA } });
  ok('DB : 3 contrôles journalisés (2 simultanés + 1 séquentiel)', checkinsA.length === 3 ? 200 : 500, 200, `checkins=${checkinsA.length}`);
  ok('DB : agent_id = AGT0000003 (Paul Atangana)', checkinsA.every((c) => c.agent_id === 'AGT0000003') ? 200 : 500, 200);
  ok('DB : guichet_id journalisé (contrôle au guichet)', checkinsA.every((c) => c.guichet_id === GCH_ID) ? 200 : 500, 200, GCH_ID);
  ok('DB : compagnie C001 + agence AG00000001 sur chaque contrôle', checkinsA.every((c) => c.compagnie_id === 'C001' && c.agence_id === 'AG00000001') ? 200 : 500, 200);
  const embEntry = checkinsA.find((c) => c.resultat === 'embarque');
  ok('DB : un contrôle « embarque » + deux « refuse » ALREADY_USED',
    embEntry && checkinsA.filter((c) => c.resultat === 'refuse').length === 2 ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 9 — Journal check-in-history (scans + check-ins fusionnés)
     ══════════════════════════════════════════════════════════════════ */
  const hist = await call(`/tickets/${ticketA}/check-in-history`, { token: counterToken });
  ok('GET /tickets/:id/check-in-history', hist.status, 200, `total=${hist.data?.data?.total}`);
  ok('Journal : billet + statut « utilise »', hist.data?.data?.billet?.id === ticketA && hist.data?.data?.billet?.statut === 'utilise' ? 200 : 500, 200);
  const types = new Set(hist.data?.data?.items?.map((i) => i.type) || []);
  ok('Journal : scans ET check-ins fusionnés', types.has('scan') && types.has('checkin') ? 200 : 500, 200, [...types].join(','));
  ok('Journal : total >= 4 (1 verify + 2 scans + 3 check-ins)', (hist.data?.data?.total || 0) >= 4 ? 200 : 500, 200, `total=${hist.data?.data?.total}`);
  const dates = hist.data?.data?.items?.map((i) => new Date(i.date).getTime());
  ok('Journal : trié du plus récent au plus ancien', dates && dates.every((d, i) => i === 0 || dates[i - 1] >= d) ? 200 : 500, 200);
  const embHist = hist.data?.data?.items?.find((i) => i.type === 'checkin' && i.statut === 'embarque');
  ok('Journal : agent nommé sur l\'embarquement', /Paul Atangana/.test(embHist?.agent?.nom || '') ? 200 : 500, 200, embHist?.agent?.nom || '');
  ok('Journal : zéro secret exposé', !hasSensitive(hist.data?.data) ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 6 — Contrôle hors périmètre compagnie/agence
     ══════════════════════════════════════════════════════════════════ */
  const wcCounter = await call(`/tickets/verify/${rawToken}`, { token: otherCounterToken });
  ok('Verify par counter d\'une autre agence -> WRONG_COMPANY', wcCounter.data?.data?.code === 'WRONG_COMPANY' ? 200 : 500, 200, wcCounter.data?.data?.raison || '');
  const wcCompany = await call(`/tickets/verify/${rawToken}`, { token: otherCompanyToken });
  ok('Verify par company d\'une autre compagnie -> WRONG_COMPANY', wcCompany.data?.data?.code === 'WRONG_COMPANY' ? 200 : 500, 200, wcCompany.data?.data?.raison || '');
  const ciOther = await call(`/tickets/${ticketA}/check-in`, { method: 'POST', token: otherCounterToken });
  ok('Check-in hors périmètre -> 403', ciOther.status, 403, ciOther.data?.data?.message || '');
  const histOther = await call(`/tickets/${ticketA}/check-in-history`, { token: otherCounterToken });
  ok('Historique hors périmètre -> 403', histOther.status, 403);
  ok('Refus hors périmètre journalisé comme scan refusé',
    (await db.ScanBillet.count({ where: { billet_id: ticketA, statut: 'refuse', raison: { [db.Sequelize.Op.like]: '%agence%' } } })) >= 1 ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 7 — QR falsifié (signature HMAC altérée) -> INVALID
     ══════════════════════════════════════════════════════════════════ */
  const bB = await call('/bookings', {
    method: 'POST', token: clientToken,
    body: { tripId, seats: [{ siege: '2' }], passengers: [{ firstName: 'Falsifié', lastName: 'Test' }], modeReservation: 'en_ligne' },
  });
  ok('POST /bookings réservation B', bB.status, 201, bB.data?.data?.id || '');
  bookingB = bB.data?.data?.id;
  const payB = await call(`/bookings/${bookingB}/payments`, { method: 'POST', token: clientToken, body: { methode: 'mtn_money' } });
  ok('Paiement réservation B', payB.data?.data?.statut === 'payee' ? 200 : 500, 200, payB.data?.data?.statut || '');
  const dbBilletB = await db.Billet.findOne({ where: { reservation_id: bookingB } });
  ticketB = dbBilletB?.id;
  sigB = dbBilletB?.signature;
  ok('Billet B émis', ticketB ? 200 : 500, 200);
  await db.Billet.update({ signature: `${'0'.repeat(63)}1` }, { where: { id: ticketB } });
  const vFake = await call(`/tickets/verify/${dbBilletB.token}`, { token: counterToken });
  ok('QR falsifié (signature altérée) -> INVALID', vFake.data?.data?.code === 'INVALID' ? 200 : 500, 200, vFake.data?.data?.raison || '');
  await db.Billet.update({ signature: sigB }, { where: { id: ticketB } });
  ok('Signature restaurée (billet toujours valide)', (await db.Billet.findByPk(ticketB))?.signature === sigB ? 200 : 500, 200);

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 8a — Billet ANNULÉ -> CANCELLED (embarquement + scan)
     ══════════════════════════════════════════════════════════════════ */
  const cancel = await call(`/tickets/${ticketB}/status`, { method: 'PATCH', token: adminToken, body: { statut: 'annule' } });
  ok('PATCH statut -> annule', cancel.status, 200, cancel.data?.data?.message || '');
  const ciCancel = await call(`/tickets/${ticketB}/check-in`, { method: 'POST', token: counterToken });
  ok('Check-in billet annulé -> CANCELLED', ciCancel.data?.data?.code === 'CANCELLED' ? 200 : 500, 200, ciCancel.data?.data?.raison || '');
  ok('Embarquement refusé (boarded=false)', ciCancel.data?.data?.boarded === false ? 200 : 500, 200);
  const vCancel = await call(`/tickets/verify/${dbBilletB.token}`, { token: counterToken });
  ok('Scan billet annulé -> CANCELLED', vCancel.data?.data?.code === 'CANCELLED' ? 200 : 500, 200, vCancel.data?.data?.code || '');

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 8b — Billet REMBOURSÉ -> REFUNDED
     ══════════════════════════════════════════════════════════════════ */
  const bC = await call('/bookings', {
    method: 'POST', token: counterToken,
    body: { tripId, clientId, seats: [{ siege: '3' }], passengers: [{ firstName: 'Remboursé', lastName: 'Test' }], modeReservation: 'guichet' },
  });
  ok('POST /bookings au guichet (réservation C)', bC.status, 201, bC.data?.data?.id || '');
  bookingC = bC.data?.data?.id;
  const payC = await call(`/bookings/${bookingC}/payments`, { method: 'POST', token: counterToken, body: { methode: 'especes', montant: PRICE } });
  ok('Paiement guichet réservation C', payC.data?.data?.statut === 'payee' ? 200 : 500, 200, payC.data?.data?.statut || '');
  const dbBilletC = await db.Billet.findOne({ where: { reservation_id: bookingC } });
  ticketC = dbBilletC?.id;
  const refund = await call(`/bookings/${bookingC}/refund`, { method: 'POST', token: counterToken, body: { motif: 'Test remboursement (module 15)' } });
  ok('Remboursement réservation C', refund.data?.data?.statut === 'remboursee' ? 200 : 500, 200, refund.data?.data?.statut || '');
  ok('Billet C remboursé', ['rembourse', 'annule'].includes((await db.Billet.findByPk(ticketC))?.statut) ? 200 : 500, 200);
  const ciRefund = await call(`/tickets/${ticketC}/check-in`, { method: 'POST', token: counterToken });
  const refundRefused = ciRefund.status === 400 || ciRefund.data?.data?.code === 'REFUNDED';
  ok('Check-in billet remboursé -> refusé (400 paiement non confirmé ou REFUNDED)', refundRefused ? 200 : 500, 200,
    ciRefund.status === 400 ? `400 ${ciRefund.data?.data?.message || ''}` : ciRefund.data?.data?.code || '');
  ok('Embarquement refusé (remboursement)', ciRefund.data?.data?.boarded === false || ciRefund.status === 400 ? 200 : 500, 200);

  /* Code REFUNDED ciblé : billet « rembourse » alors que la réservation reste payée. */
  const bE = await call('/bookings', {
    method: 'POST', token: clientToken,
    body: { tripId, seats: [{ siege: '5' }], passengers: [{ firstName: 'Remboursé', lastName: 'Billet' }], modeReservation: 'en_ligne' },
  });
  ok('POST /bookings réservation E', bE.status, 201, bE.data?.data?.id || '');
  bookingE = bE.data?.data?.id;
  const payE = await call(`/bookings/${bookingE}/payments`, { method: 'POST', token: clientToken, body: { methode: 'mtn_money' } });
  ok('Paiement réservation E', payE.data?.data?.statut === 'payee' ? 200 : 500, 200, payE.data?.data?.statut || '');
  const dbBilletE = await db.Billet.findOne({ where: { reservation_id: bookingE } });
  ticketE = dbBilletE?.id;
  await db.Billet.update({ statut: 'rembourse' }, { where: { id: ticketE } });
  const ciRefundedCode = await call(`/tickets/${ticketE}/check-in`, { method: 'POST', token: counterToken });
  ok('Check-in billet statut « rembourse » (réservation payée) -> REFUNDED', ciRefundedCode.data?.data?.code === 'REFUNDED' ? 200 : 500, 200, ciRefundedCode.data?.data?.code || '');

  /* ══════════════════════════════════════════════════════════════════
     SCÉNARIO 8c — Billet EXPIRÉ -> EXPIRED (+ bascule auto valide→expire)
     ══════════════════════════════════════════════════════════════════ */
  const bD = await call('/bookings', {
    method: 'POST', token: clientToken,
    body: { tripId, seats: [{ siege: '4' }], passengers: [{ firstName: 'Expiré', lastName: 'Test' }], modeReservation: 'en_ligne' },
  });
  ok('POST /bookings réservation D', bD.status, 201, bD.data?.data?.id || '');
  bookingD = bD.data?.data?.id;
  const payD = await call(`/bookings/${bookingD}/payments`, { method: 'POST', token: clientToken, body: { methode: 'orange_money' } });
  ok('Paiement réservation D', payD.data?.data?.statut === 'payee' ? 200 : 500, 200, payD.data?.data?.statut || '');
  const dbBilletD = await db.Billet.findOne({ where: { reservation_id: bookingD } });
  ticketD = dbBilletD?.id;
  await db.Billet.update({ validite_jusqua: new Date(Date.now() - 3600 * 1000) }, { where: { id: ticketD } });
  const ciExp = await call(`/tickets/${ticketD}/check-in`, { method: 'POST', token: counterToken });
  ok('Check-in billet expiré -> EXPIRED', ciExp.data?.data?.code === 'EXPIRED' ? 200 : 500, 200, ciExp.data?.data?.raison || '');
  ok('Bascule auto valide -> expire en base', (await db.Billet.findByPk(ticketD))?.statut === 'expire' ? 200 : 500, 200);
  const vExp = await call(`/tickets/verify/${dbBilletD.token}`, { token: counterToken });
  ok('Scan billet expiré -> EXPIRED', vExp.data?.data?.code === 'EXPIRED' ? 200 : 500, 200, vExp.data?.data?.code || '');

  /* ── SCÉNARIO 10 — Nettoyage des données de test ─────────────────── */
  await cleanup([bookingA, bookingB, bookingC, bookingD, bookingE]);
  await db.Depart.destroy({ where: { id: tripId } }).catch(() => {});
  await db.Bus.destroy({ where: { id: BUS_ID } }).catch(() => {});
  if (clientId) await db.Client.destroy({ where: { id: clientId } }).catch(() => {});
  ok('Nettoyage : 0 billet / 0 réservation / 0 contrôle restants',
    (await db.Billet.count({ where: { id: { [db.Sequelize.Op.in]: [ticketA, ticketB, ticketC, ticketD, ticketE].filter(Boolean) } } })) === 0 ? 200 : 500, 200);

  /* ── Résumé ──────────────────────────────────────────────────────── */
  console.log('\n═══════ RÉSULTATS TESTS CONTRÔLE & EMBARQUEMENT ═══════');
  let failures = 0;
  for (const [name, status, expected, extra = ''] of steps) {
    const pass = status === expected;
    if (!pass) failures += 1;
    console.log(`${pass ? '✔' : '✘'} ${name} -> ${status} (attendu ${expected}) ${extra}`.trim());
  }
  console.log(`\n${steps.length - failures}/${steps.length} tests passés.`);
  await db.sequelize.close();
  process.exitCode = failures ? 1 : 0;
  setTimeout(() => process.exit(process.exitCode), 3000).unref();
})().catch(async (e) => {
  console.error('Erreur réseau/test :', e.message);
  console.error(e.stack);
  await db.sequelize.close().catch(() => {});
  process.exitCode = 1;
  setTimeout(() => process.exit(1), 3000).unref();
});
