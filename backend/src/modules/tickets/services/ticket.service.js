const crypto = require('crypto');
const QRCode = require('qrcode');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { ROLES } = require('../../../middlewares/auth');
const env = require('../../../config/env');
const { sequelize } = require('../../../models');
const { sendMail } = require('../../../services/mailer.service');
const { ticketRepository } = require('../repositories');
const { buildPdfBuffer, buildTicketEmailHtml } = require('./ticket-pdf.service');
const { notificationService } = require('../../notifications/services');

/** Exécute une notification sans jamais casser l'émission des billets. */
const notifySafe = async (fn) => {
  try {
    await fn();
  } catch (err) {
    logger.warn(`[notifications] envoi ignoré : ${err.message}`);
  }
};

/** Statuts d'un billet (alignés sur la table `billet.statut`). */
const STATUTS = ['valide', 'utilise', 'expire', 'annule', 'rembourse', 'impaye', 'inconnu'];

/** Transitions de statut autorisées (via PATCH /tickets/:id/status). */
const ALLOWED_TRANSITIONS = {
  valide: ['utilise', 'annule', 'expire'],
  utilise: ['annule'],
  expire: ['annule'],
};

/**
 * Codes de résultat d'un contrôle (Module 15) — alignés sur la spec :
 *   VALID, ALREADY_USED, CANCELLED, REFUNDED, EXPIRED, INVALID,
 *   WRONG_COMPANY, UNPAID.
 * Le code est calculé côté backend à partir de l'état réel en base :
 * le frontend ne peut jamais imposer un statut.
 */
const RAISONS_BY_STATUT = {
  utilise: { code: 'ALREADY_USED', raison: 'Billet déjà utilisé (double utilisation).' },
  annule: { code: 'CANCELLED', raison: 'Billet annulé.' },
  rembourse: { code: 'REFUNDED', raison: 'Billet remboursé.' },
  expire: { code: 'EXPIRED', raison: 'Billet expiré.' },
  impaye: { code: 'UNPAID', raison: 'Billet impayé.' },
  inconnu: { code: 'INVALID', raison: 'Billet au statut inconnu.' },
};

const randAlnum = (len) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

/** Génère un identifiant billet CHAR(15) unique (ex: BIL0X1Y2Z3W4V5U). */
const generateBilletId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `BIL${randAlnum(12)}`;
    if (!(await ticketRepository.findById(id))) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant billet unique.');
};

/** Génère une référence lisible unique (ex: TKT-20260805-ABC123). */
const generateReference = async () => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  for (let i = 0; i < 6; i += 1) {
    const reference = `TKT-${ymd}-${randAlnum(6)}`;
    if (!(await ticketRepository.findBilletByReference(reference))) return reference;
  }
  throw new ApiError(500, 'Impossible de générer une référence billet unique.');
};

/** Code-barres numérique (13 chiffres) dérivé de la référence. */
const buildCodeBarre = (reference) =>
  String(5900000000000 + Number(reference.replace(/\D/g, '').slice(0, 9) || 0));

/** Fin de validité du billet : date/heure de départ du voyage. */
const buildValiditeJusqua = (depart) => {
  if (!depart?.date_depart || !depart?.heure_depart) return null;
  return new Date(`${depart.date_depart}T${depart.heure_depart}`);
};

/** Empreinte SHA-256 hexadécimale (index de vérification du jeton). */
const sha256hex = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

/**
 * Payload QR code sécurisé : contient UNIQUEMENT ticket_id, token et version.
 * Aucune donnée sensible (nom, téléphone, email, pièce) n'y figure.
 * Format : BTC:<ticket_id>:<token>:<version>
 */
const buildQrPayload = ({ id, token, qr_version }) => `BTC:${id}:${token}:${qr_version || 1}`;

/** Signature HMAC-SHA256 du payload QR (clé JWT) — infalsifiable. */
const signPayload = (payload) => crypto.createHmac('sha256', env.jwt.secret).update(payload).digest('hex');

/** Jeton d'authentification cryptographiquement sûr (48 hex, imprévisible). */
const generateToken = () => crypto.randomBytes(24).toString('hex');

const actorName = (actor) => {
  const u = actor?.user;
  const name = [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim();
  return name || actor?.email || actor?.id || 'système';
};

/* ══════════════════════════════════════════════════════════════
   Périmètres d'accès
   ══════════════════════════════════════════════════════════════ */

const resolveScope = async (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) return {};
  if (actor.role === ROLES.COMPANY_ADMIN) {
    const agences = await ticketRepository.findAgencesByCompagnie(actor.compagnieId);
    return { agenceIds: agences.map((a) => a.id) };
  }
  if (actor.role === ROLES.COUNTER_AGENT) {
    return { agenceIds: [actor.agenceId] };
  }
  if (actor.role === ROLES.CLIENT) {
    return { clientId: actor.id };
  }
  throw new ApiError(403, 'Accès refusé : gestion des billets non autorisée.');
};

const assertCanAccess = (actor, ticket) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.CLIENT) {
    if (ticket.client_id !== actor.id) {
      throw new ApiError(403, 'Accès refusé : ce billet ne vous appartient pas.');
    }
    return;
  }
  if (actor.role === ROLES.COUNTER_AGENT) {
    if (ticket.reservation?.agence_id !== actor.agenceId) {
      throw new ApiError(403, 'Accès refusé : billet hors de votre agence.');
    }
    return;
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    if (ticket.reservation?.agence?.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : billet hors de votre compagnie.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé.');
};

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializeTicket = (t) => {
  const reservation = t.reservation;
  const depart = t.depart;
  const trajet = depart?.trajet;
  const compagnie = depart?.compagnie;
  const villeDepart = trajet?.villeDepart?.nom ?? null;
  const villeArrivee = trajet?.villeArrivee?.nom ?? null;

  return {
    id: t.id,
    reference: t.reference,
    codeBarre: t.code_barre,
    statut: t.statut,
    siege: t.siege,
    qrVersion: t.qr_version ?? 1,
    nomPassager: t.nom_passager ?? null,
    prix: Number(t.prix) || 0,
    prixLabel: `${(Number(t.prix) || 0).toLocaleString('fr-FR')} XAF`,
    validiteJusqua: t.validite_jusqua ?? null,
    emailEnvoye: !!t.email_envoye,
    smsEnvoye: !!t.sms_envoye,
    creeLe: t.cree_le ?? null,
    verifieLe: t.verifie_le ?? null,
    client: t.client
      ? { id: t.client.id, firstName: t.client.prenom, lastName: t.client.nom, phone: t.client.telephone, email: t.client.email }
      : null,
    clientName: t.client ? `${t.client.prenom} ${t.client.nom}` : null,
    creePar: t.creePar ? { id: t.creePar.id, name: `${t.creePar.prenom} ${t.creePar.nom}` } : null,
    verifiePar: t.verifiePar ? { id: t.verifiePar.id, name: `${t.verifiePar.prenom} ${t.verifiePar.nom}` } : null,
    passenger: t.passenger
      ? { id: t.passenger.id, firstName: t.passenger.first_name, lastName: t.passenger.last_name, phone: t.passenger.phone, email: t.passenger.email }
      : null,
    passengerName: t.passenger ? `${t.passenger.first_name} ${t.passenger.last_name}`.trim() : (t.nom_passager || null),
    reservation: reservation
      ? {
          id: reservation.id,
          reference: reservation.reference,
          statut: reservation.statut,
          nbPlaces: reservation.nb_places,
          montant: Number(reservation.montant) || 0,
          dateCreation: reservation.date_creation ?? null,
          agence: reservation.agence ? { id: reservation.agence.id, nom: reservation.agence.nom } : null,
        }
      : null,
    depart: depart
      ? {
          id: depart.id,
          code: depart.code ?? null,
          dateDepart: depart.date_depart ?? null,
          heureDepart: depart.heure_depart ?? null,
          dateArrivee: depart.date_arrivee ?? null,
          heureArrivee: depart.heure_arrivee ?? null,
          quai: depart.quai ?? null,
          prixBase: Number(depart.prix_base) || 0,
          villeDepart,
          villeArrivee,
          trajetLabel: villeDepart && villeArrivee ? `${villeDepart} → ${villeArrivee}` : null,
          bus: depart.bus
            ? { id: depart.bus.id, immatriculation: depart.bus.immatriculation, typeBus: depart.bus.type_bus, classe: depart.bus.classe }
            : null,
          compagnie: compagnie ? { id: compagnie.id, nom: compagnie.nom, couleur: compagnie.couleur, logo: compagnie.logo } : null,
        }
      : null,
    compagnie: compagnie ? { id: compagnie.id, nom: compagnie.nom } : null,
    tripFrom: villeDepart,
    tripTo: villeArrivee,
    tripDate: depart?.date_depart ?? null,
  };
};

/* ══════════════════════════════════════════════════════════════
   Consultation
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = await resolveScope(actor);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const where = ticketRepository.buildWhere(query, scope);
  const { rows, count } = await ticketRepository.findPage({ where, page, limit, sort: query.sort });
  return {
    items: rows.map(serializeTicket),
    pagination: { page, limit, total: count, pages: Math.ceil(count / limit) },
  };
};

const getById = async ({ id, actor }) => {
  const ticket = await ticketRepository.findByIdFull(id);
  if (!ticket) throw new ApiError(404, 'Billet introuvable.');
  assertCanAccess(actor, ticket);
  return serializeTicket(ticket);
};

/** GET /tickets/stats — KPIs tableau de bord. */
const stats = async ({ actor, query }) => {
  const scope = await resolveScope(actor);
  const filters = { ...query };
  const [synthèse, parStatut, parJour] = await Promise.all([
    ticketRepository.summary({ filters, scope }),
    ticketRepository.byStatut({ filters, scope }),
    ticketRepository.byJour({ filters, scope }),
  ]);
  return { ...synthèse, parStatut, parJour };
};

/* ══════════════════════════════════════════════════════════════
   Émission automatique
   ══════════════════════════════════════════════════════════════ */

/** Construit les données d'un billet pour une place donnée (un billet = un siège = un passager). */
const buildTicketData = async (reservation, place, passenger, creePar) => {
  const depart = reservation.depart;
  const prix = place.tarif != null && place.tarif !== '' ? Number(place.tarif) : Number(depart.prix_base) || 0;
  const siege = String(place.siege).trim().toUpperCase();
  const reference = await generateReference();
  const id = await generateBilletId();
  const token = generateToken();
  const qr_code = buildQrPayload({ id, token, qr_version: 1 });

  const fullName = passenger
    ? [passenger.first_name, passenger.last_name].filter(Boolean).join(' ').trim()
    : (place.nom_passager || null);

  return {
    id,
    reference,
    qr_code,
    code_barre: buildCodeBarre(reference),
    reservation_id: reservation.id,
    depart_id: depart.id,
    client_id: reservation.client_id,
    passenger_id: passenger?.id || null,
    siege,
    nom_passager: fullName || null,
    prix,
    statut: 'valide',
    token,
    token_hash: sha256hex(token),
    signature: signPayload(qr_code),
    qr_version: 1,
    regenerations: 0,
    cree_le: new Date(),
    cree_par: creePar,
    validite_jusqua: buildValiditeJusqua(depart),
    email_envoye: false,
    sms_envoye: false,
  };
};

/**
 * Émet les billets d'une réservation entièrement payée.
 * - Réservé aux réservations `payee` (une réservation `confirmee` n'émet rien).
 * - Idempotent : les sièges déjà émis sont ignorés (clé unique en base).
 * - Un billet par siège (place_reservee) → un billet = un passager = un siège.
 */
const generateForReservation = async ({ reservationId, actor }) => {
  const reservation = await ticketRepository.findReservationWithPlaces(reservationId);
  if (!reservation) return { created: 0, skipped: 0, message: 'Réservation introuvable.' };
  if (reservation.statut !== 'payee') {
    return {
      created: 0,
      skipped: 0,
      message: `Billets non émis : réservation au statut « ${reservation.statut} » (émission après paiement complet uniquement).`,
    };
  }

  const places = reservation.places || [];
  if (!places.length) {
    logger.warn(`[tickets] réservation ${reservation.reference} payée mais sans sièges : aucun billet émis`);
    return { created: 0, skipped: 0, message: 'Réservation sans sièges : aucun billet émis.' };
  }

  const existing = await ticketRepository.findBilletsByReservation(reservation.id);
  const existingSieges = new Set(existing.map((b) => String(b.siege).trim().toUpperCase()));
  const toCreate = places.filter((p) => !existingSieges.has(String(p.siege).trim().toUpperCase()));
  if (!toCreate.length) {
    return { created: 0, skipped: places.length, message: 'Billets déjà émis pour cette réservation.' };
  }

  const creePar = actor && actor.role !== ROLES.CLIENT ? actor.id : null;
  const passengerBySiege = new Map(
    (reservation.passengers || [])
      .filter((p) => p.place?.siege)
      .map((p) => [String(p.place.siege).trim().toUpperCase(), p])
  );
  const rows = [];
  await sequelize.transaction(async (t) => {
    for (const place of toCreate) {
      const passenger = passengerBySiege.get(String(place.siege).trim().toUpperCase()) || null;
      const data = await buildTicketData(reservation, place, passenger, creePar);
      rows.push(await ticketRepository.createBillet(data, { transaction: t }));
    }
    await ticketRepository.createHistorique(
      {
        reservation_id: reservation.id,
        action: `${rows.length} billet(s) émis automatiquement après paiement complet.`,
        timestamp: new Date(),
        utilisateur: actorName(actor),
      },
      { transaction: t }
    );
  });

  logger.info(`[tickets] ${rows.length} billet(s) émis pour ${reservation.reference}`);

  /* Notification automatique : billet disponible → client (une par réservation). */
  if (rows.length > 0 && reservation.client_id) {
    await notifySafe(async () => {
      await notificationService.send({
        recipientId: reservation.client_id,
        role: 'client',
        type: 'ticket_available',
        title: 'Billet disponible',
        message: `${rows.length} billet(s) disponible(s) pour la réservation ${reservation.reference}. Retrouvez-les dans Mes billets.`,
        data: { reservationId: reservation.id, reference: reservation.reference, count: rows.length, actionPath: '/client/tickets' },
        referenceKey: `booking:${reservation.id}`,
      });
    });
  }

  return { created: rows.length, skipped: toCreate.length - rows.length, message: 'Billets émis.' };
};

/** Annule / rembourse les billets d'une réservation entièrement remboursée. */
const annulerBilletsReservation = async ({ reservationId, actor, motif = 'Remboursement de la réservation.' }) => {
  const billets = await ticketRepository.findBilletsByReservation(reservationId);
  if (!billets.length) return { affected: 0, message: 'Aucun billet à traiter.' };

  let affected = 0;
  await sequelize.transaction(async (t) => {
    for (const billet of billets) {
      if (['annule', 'rembourse'].includes(billet.statut)) continue;
      await ticketRepository.updateBillet(billet, { statut: 'rembourse' }, { transaction: t });
      affected += 1;
    }
    if (affected) {
      await ticketRepository.createHistorique(
        {
          reservation_id: reservationId,
          action: `${affected} billet(s) remboursé(s) suite au remboursement de la réservation.`,
          timestamp: new Date(),
          utilisateur: actorName(actor),
        },
        { transaction: t }
      );
    }
  });

  if (affected) logger.info(`[tickets] ${affected} billet(s) remboursé(s) pour la réservation ${reservationId}`);
  return { affected, message: affected ? 'Billets remboursés.' : 'Aucun billet à rembourser.' };
};

/* ══════════════════════════════════════════════════════════════
   Transitions de statut
   ══════════════════════════════════════════════════════════════ */

/** PATCH /tickets/:id/status — transition de statut gardée (anti double utilisation). */
const updateStatus = async ({ id, data, actor }) => {
  const ticket = await ticketRepository.findByIdFull(id);
  if (!ticket) throw new ApiError(404, 'Billet introuvable.');
  assertCanAccess(actor, ticket);

  if (data.statut === ticket.statut) {
    return { ticket: serializeTicket(ticket), message: `Le billet est déjà au statut « ${data.statut} ».` };
  }

  const allowed = ALLOWED_TRANSITIONS[ticket.statut] || [];
  if (!allowed.includes(data.statut)) {
    throw new ApiError(400, `Transition invalide : « ${ticket.statut} » → « ${data.statut} ».`);
  }

  const patch = { statut: data.statut };
  if (data.statut === 'utilise') {
    patch.verifie_le = new Date();
    patch.verifie_par = actor.role !== ROLES.CLIENT ? actor.id : null;
  }

  await ticketRepository.updateBillet(ticket, patch);
  logger.info(`[tickets] ${ticket.reference} → ${data.statut}`);
  const full = await ticketRepository.findByIdFull(id);
  return { ticket: serializeTicket(full), message: 'Statut du billet mis à jour.' };
};

/* ══════════════════════════════════════════════════════════════
   QR Code sécurisé (Étape 2)
   ══════════════════════════════════════════════════════════════ */

const generateScanId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `SCN${randAlnum(12)}`;
    const existing = await sequelize.query('SELECT id FROM scan_billet WHERE id = :id LIMIT 1', {
      replacements: { id },
    });
    if (!existing[0]?.length) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant de scan unique.');
};

/**
 * Journalise chaque scan (valide ou refusé) : billet, agent, guichet,
 * compagnie, résultat, raison, adresse IP et date/heure.
 */
const logScan = async ({ ticket, actor, ip, statut, raison }) => {
  try {
    await ticketRepository.createScanBillet({
      id: await generateScanId(),
      billet_id: ticket.id,
      scanner_agent_id: actor && actor.role !== ROLES.CLIENT ? actor.id : null,
      client_id: ticket.client_id ?? null,
      agence_id: actor?.agenceId ?? ticket.reservation?.agence_id ?? null,
      compagnie_id: actor?.compagnieId ?? ticket.reservation?.agence?.compagnie_id ?? null,
      statut,
      raison: raison ? String(raison).slice(0, 120) : null,
      adresse_ip: ip || null,
      cree_le: new Date(),
    });
  } catch (err) {
    logger.error(`[tickets] échec journalisation du scan : ${err.message}`);
  }
};

/** Expiration configurable : date de départ et/ou fenêtre TTL (env). */
const isTicketExpired = (ticket) => {
  const now = Date.now();
  if (ticket.validite_jusqua && new Date(ticket.validite_jusqua).getTime() < now) return true;
  if (env.ticket.qrExpiryHours != null && ticket.cree_le) {
    const ttl = new Date(ticket.cree_le).getTime() + env.ticket.qrExpiryHours * 3600 * 1000;
    if (ttl < now) return true;
  }
  return false;
};

/**
 * GET /tickets/:id/qrcode — rend l'image PNG du QR code d'un billet.
 * Le payload encodé ne contient QUE ticket_id, token et version.
 */
const getQrCode = async ({ id, actor }) => {
  const ticket = await ticketRepository.findByIdFull(id);
  if (!ticket) throw new ApiError(404, 'Billet introuvable.');
  assertCanAccess(actor, ticket);
  if (!ticket.token) throw new ApiError(404, 'QR code indisponible pour ce billet.');

  const payload = buildQrPayload(ticket);
  try {
    return await QRCode.toBuffer(payload, {
      type: 'png',
      width: env.ticket.qrWidth || 480,
      errorCorrectionLevel: 'M',
      margin: 2,
    });
  } catch (err) {
    logger.error(`[tickets] génération PNG impossible : ${err.message}`);
    throw new ApiError(500, 'Impossible de générer le QR code.');
  }
};

/**
 * Périmètre de contrôle (Module 15) — l'accès à un billet est toujours
 * borné à la compagnie / à l'agence de l'agent authentifié :
 *   - counter_agent : billet de SA propre agence uniquement.
 *   - company_admin : billet de SA compagnie uniquement.
 *   - super_admin   : tous les billets.
 *   - client        : ne peut jamais contrôler/valider un billet.
 * Retourne un message de refus (null si autorisé).
 */
const scopeIssueFor = (actor, ticket) => {
  if (actor.role === ROLES.SUPER_ADMIN) return null;
  if (actor.role === ROLES.CLIENT) return 'Accès refusé : le client ne peut pas contrôler son propre billet.';
  const reservation = ticket.reservation;
  if (actor.role === ROLES.COUNTER_AGENT) {
    if (!reservation || reservation.agence_id !== actor.agenceId) return 'Billet hors de votre agence.';
    return null;
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    const compagnieId = reservation?.agence?.compagnie_id ?? ticket.depart?.compagnie?.id ?? null;
    if (compagnieId !== actor.compagnieId) return 'Billet d\'une autre compagnie.';
    return null;
  }
  return null;
};

/**
 * GET /tickets/verify/:token — vérification sécurisée d'un QR scanné.
 * Contrôles anti-fraude :
 *   1. Billet existant (résolution par empreinte SHA-256 du jeton).
 *   2. QR non falsifié (signature HMAC du payload QR).
 *   3. Billet non expiré (validite_jusqua / fenêtre configurable).
 *   4. Billet non annulé / non remboursé / non inconnu.
 *   5. Anti double-utilisation (un billet « utilise » est refusé).
 *   6. Périmètre compagnie/agence de l'agent (le QR ne sert qu'à
 *      retrouver le billet : jamais de confiance envers le QR).
 * Chaque scan est journalisé dans `scan_billet` avec un code de résultat
 * explicite (VALID, ALREADY_USED, CANCELLED, REFUNDED, EXPIRED, UNPAID,
 * INVALID, WRONG_COMPANY).
 */
const verify = async ({ token, actor, ip }) => {
  const ticket = await ticketRepository.findFullByTokenHash(sha256hex(token));

  if (!ticket) {
    return { valide: false, code: 'INVALID', raison: 'Billet introuvable ou QR invalide.', billet: null };
  }

  const scopeIssue = scopeIssueFor(actor, ticket);
  if (scopeIssue) {
    await logScan({ ticket, actor, ip, statut: 'refuse', raison: scopeIssue });
    logger.warn(`[tickets] contrôle hors périmètre rejeté (${ticket.reference})`);
    return { valide: false, code: 'WRONG_COMPANY', raison: scopeIssue, billet: serializeTicket(ticket) };
  }

  const expected = signPayload(buildQrPayload(ticket));
  if (ticket.signature && expected !== ticket.signature) {
    await logScan({ ticket, actor, ip, statut: 'refuse', raison: 'QR falsifié (signature invalide).' });
    logger.warn(`[tickets] QR falsifié rejeté (${ticket.reference})`);
    return { valide: false, code: 'INVALID', raison: 'QR falsifié (signature invalide).', billet: serializeTicket(ticket) };
  }

  let valide = false;
  let raison = null;
  let code = 'INVALID';

  if (isTicketExpired(ticket)) {
    raison = RAISONS_BY_STATUT.expire.raison;
    code = RAISONS_BY_STATUT.expire.code;
    if (ticket.statut === 'valide') {
      await ticketRepository.updateBillet(ticket, { statut: 'expire' });
      ticket.statut = 'expire';
    }
  } else if (ticket.statut === 'valide') {
    valide = true;
    code = 'VALID';
  } else {
    const conf = RAISONS_BY_STATUT[ticket.statut];
    raison = conf ? conf.raison : 'Billet non valide.';
    code = conf ? conf.code : 'INVALID';
  }

  await logScan({ ticket, actor, ip, statut: valide ? 'valide' : 'refuse', raison });
  logger.info(`[tickets] scan ${ticket.reference} → ${valide ? 'valide' : 'refusé'} (${code})${raison ? ` — ${raison}` : ''}`);
  return { valide, code, raison, billet: serializeTicket(ticket) };
};

const generateCheckInId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `CHK${randAlnum(12)}`;
    const rows = await sequelize.query('SELECT id FROM checkin_billet WHERE id = :id LIMIT 1', {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });
    if (!rows.length) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant de contrôle unique.');
};

/**
 * POST /tickets/:id/check-in — embarquement réel.
 * Garanties backend (jamais de confiance envers le client) :
 *   - Verrouillage pessimiste SELECT ... FOR UPDATE dans une transaction :
 *     deux requêtes simultanées sur le même billet ne peuvent PAS toutes
 *     deux valider (anti-double-embarquement garanti côté base).
 *   - Re-vérification intégrale : paiement confirmé, billet valide,
 *     non expiré, non annulé/remboursé, périmètre compagnie/agence.
 *   - Passage du billet à « utilise » uniquement si TOUS les contrôles
 *     passent. Chaque tentative (succès ou refus) est journalisée dans
 *     `checkin_billet` avec date/heure, agent, guichet et résultat.
 */
const checkIn = async ({ id, actor, ip }) => {
  if (actor.role === ROLES.CLIENT) {
    throw new ApiError(403, 'Accès refusé : le client ne peut pas valider son propre billet.');
  }

  let outcome = null;
  await sequelize.transaction(async (t) => {
    const ticket = await ticketRepository.findByIdFullLocked(id, t);
    if (!ticket) throw new ApiError(404, 'Billet introuvable.');

    const scopeIssue = scopeIssueFor(actor, ticket);
    if (scopeIssue) throw new ApiError(403, scopeIssue);

    if (!ticket.reservation) {
      throw new ApiError(400, 'Réservation introuvable pour ce billet.');
    }
    if (ticket.reservation.statut !== 'payee') {
      throw new ApiError(400, `Paiement non confirmé (réservation « ${ticket.reservation.statut} ») : embarquement refusé.`);
    }

    let refused = null;
    if (isTicketExpired(ticket)) {
      if (ticket.statut === 'valide') {
        await ticketRepository.updateBillet(ticket, { statut: 'expire' }, { transaction: t });
        ticket.statut = 'expire';
      }
      refused = { code: RAISONS_BY_STATUT.expire.code, raison: RAISONS_BY_STATUT.expire.raison };
    } else if (ticket.statut !== 'valide') {
      const conf = RAISONS_BY_STATUT[ticket.statut] || { code: 'INVALID', raison: 'Billet non valide.' };
      refused = { code: conf.code, raison: conf.raison };
    }

    const compagnieId = actor.compagnieId ?? ticket.reservation?.agence?.compagnie_id ?? ticket.depart?.compagnie?.id ?? null;
    const agenceId = actor.agenceId ?? ticket.reservation?.agence_id ?? null;
    const base = {
      billet_id: ticket.id,
      agent_id: actor.id,
      compagnie_id: compagnieId,
      agence_id: agenceId,
      guichet_id: actor.guichetId ?? null,
      action: 'checkin',
      adresse_ip: ip || null,
      cree_le: new Date(),
    };

    if (refused) {
      await ticketRepository.createCheckIn(
        { id: await generateCheckInId(), ...base, resultat: 'refuse', raison: refused.raison.slice(0, 120) },
        { transaction: t }
      );
      outcome = { boarded: false, resultat: 'refuse', code: refused.code, raison: refused.raison, ticket: serializeTicket(ticket) };
      return;
    }

    await ticketRepository.updateBillet(
      ticket,
      { statut: 'utilise', verifie_le: new Date(), verifie_par: actor.id },
      { transaction: t }
    );
    ticket.statut = 'utilise';
    ticket.verifie_le = new Date();
    await ticketRepository.createCheckIn(
      { id: await generateCheckInId(), ...base, resultat: 'embarque', raison: null },
      { transaction: t }
    );
    outcome = { boarded: true, resultat: 'embarque', code: 'VALID', raison: null, ticket: serializeTicket(ticket) };
  });

  logger.info(
    `[tickets] check-in ${outcome.ticket.reference} → ${outcome.resultat}${outcome.raison ? ` (${outcome.raison})` : ''} par ${actor.email}`
  );
  return outcome;
};

/**
 * GET /tickets/:id/check-in-history — journal complet du billet
 * (scans `scan_billet` + contrôles d'embarquement `checkin_billet`),
 * du plus récent au plus ancien. Périmètre d'accès standard.
 */
const getCheckInHistory = async ({ id, actor }) => {
  const ticket = await ticketRepository.findByIdFull(id);
  if (!ticket) throw new ApiError(404, 'Billet introuvable.');
  assertCanAccess(actor, ticket);

  const [checkins, scans] = await Promise.all([
    ticketRepository.findCheckInsByTicket(id),
    ticketRepository.findScansByTicket(id),
  ]);

  const items = [
    ...scans.map((s) => ({
      id: s.id,
      type: 'scan',
      action: 'scan',
      statut: s.statut,
      raison: s.raison,
      agent: s.scannerAgent ? { id: s.scannerAgent.id, nom: `${s.scannerAgent.prenom} ${s.scannerAgent.nom}` } : null,
      compagnieId: s.compagnie_id,
      agenceId: s.agence_id,
      date: s.cree_le,
    })),
    ...checkins.map((c) => ({
      id: c.id,
      type: 'checkin',
      action: c.action,
      statut: c.resultat,
      raison: c.raison,
      agent: c.agent ? { id: c.agent.id, nom: `${c.agent.prenom} ${c.agent.nom}` } : null,
      compagnieId: c.compagnie_id,
      agenceId: c.agence_id,
      guichetId: c.guichet_id,
      date: c.cree_le,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    billet: { id: ticket.id, reference: ticket.reference, statut: ticket.statut, siege: ticket.siege },
    total: items.length,
    items,
  };
};

/**
 * POST /tickets/:id/regenerate-qrcode — Super Admin uniquement.
 * Fait tourner le jeton + signature + version : l'ancien QR devient
 * immédiatement invalide (le token ne correspond plus).
 */
const regenerateQrCode = async ({ id, actor }) => {
  const ticket = await ticketRepository.findByIdFull(id);
  if (!ticket) throw new ApiError(404, 'Billet introuvable.');
  if (actor.role !== ROLES.SUPER_ADMIN) {
    throw new ApiError(403, 'Accès refusé : régénération réservée au Super Admin.');
  }

  const token = generateToken();
  const qr_version = (ticket.qr_version || 1) + 1;
  const qr_code = buildQrPayload({ id: ticket.id, token, qr_version });

  await ticketRepository.updateBillet(ticket, {
    token,
    token_hash: sha256hex(token),
    qr_code,
    signature: signPayload(qr_code),
    qr_version,
    regenerations: (ticket.regenerations || 0) + 1,
  });

  const full = await ticketRepository.findByIdFull(id);
  logger.info(`[tickets] QR régénéré pour ${ticket.reference} (v${qr_version}) par ${actor.email}`);
  return {
    regenerated: true,
    version: qr_version,
    message: 'QR code régénéré : l\'ancien QR est désormais invalide.',
    ticket: serializeTicket(full),
  };
};

/* ══════════════════════════════════════════════════════════════
   PDF professionnel & envoi email (Étape 3)
   ══════════════════════════════════════════════════════════════ */

/**
 * GET /tickets/:id/pdf — buffer PDF du billet (logo compagnie, voyage,
 * passager, QR code intégré, code-barres). Périmètre d'accès identique
 * au QR code (propriétaire du billet ou personnel autorisé).
 */
const getPdf = async ({ id, actor }) => {
  const ticket = await ticketRepository.findByIdFull(id);
  if (!ticket) throw new ApiError(404, 'Billet introuvable.');
  assertCanAccess(actor, ticket);
  return buildPdfBuffer({ ticket });
};

/**
 * POST /tickets/:id/send-email — envoi du billet PDF au passager.
 * - En SMTP configuré : envoi réel avec pièce jointe PDF, puis `email_envoye = true`.
 * - Sans SMTP (dev) : l'email est journalisé (mailer existant), aucun envoi réel.
 * N'envoie jamais les secrets du billet (token/signature) dans le corps.
 */
const envoyerBilletParEmail = async ({ id, actor, to }) => {
  const ticket = await ticketRepository.findByIdFull(id);
  if (!ticket) throw new ApiError(404, 'Billet introuvable.');
  assertCanAccess(actor, ticket);

  const destinataire = to || ticket.client?.email;
  if (!destinataire) throw new ApiError(400, 'Aucune adresse email disponible pour ce passager.');

  const pdf = await buildPdfBuffer({ ticket });
  const envoye = await sendMail({
    to: destinataire,
    subject: `Votre billet de voyage ${ticket.reference}`,
    html: buildTicketEmailHtml({ ticket }),
    attachments: [{ filename: `billet-${ticket.reference}.pdf`, content: pdf, contentType: 'application/pdf' }],
  });

  if (envoye && !ticket.email_envoye) {
    await ticketRepository.updateBillet(ticket, { email_envoye: true });
    ticket.email_envoye = true;
  }
  logger.info(`[tickets] billet ${ticket.reference} → email ${destinataire}${envoye ? '' : ' (journalisé, SMTP non configuré)'}`);
  return {
    envoye,
    destinataire,
    mode: envoye ? 'smtp' : 'dev-log',
    message: envoye ? 'Billet envoyé par email.' : 'Email journalisé : SMTP non configuré (aucun envoi réel).',
    emailEnvoye: !!ticket.email_envoye,
    ticket: serializeTicket(ticket),
  };
};

module.exports = {
  STATUTS,
  ALLOWED_TRANSITIONS,
  list,
  getById,
  stats,
  generateForReservation,
  annulerBilletsReservation,
  updateStatus,
  getQrCode,
  verify,
  checkIn,
  getCheckInHistory,
  regenerateQrCode,
  getPdf,
  envoyerBilletParEmail,
};
