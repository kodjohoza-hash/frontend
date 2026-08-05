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

/** Statuts d'un billet (alignés sur la table `billet.statut`). */
const STATUTS = ['valide', 'utilise', 'expire', 'annule', 'rembourse', 'impaye', 'inconnu'];

/** Transitions de statut autorisées (via PATCH /tickets/:id/status). */
const ALLOWED_TRANSITIONS = {
  valide: ['utilise', 'annule', 'expire'],
  utilise: ['annule'],
  expire: ['annule'],
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
 * GET /tickets/verify/:token — vérification sécurisée d'un QR scanné.
 * Contrôles anti-fraude :
 *   1. Billet existant (résolution par empreinte SHA-256 du jeton).
 *   2. QR non falsifié (signature HMAC du payload QR).
 *   3. Billet non expiré (validite_jusqua / fenêtre configurable).
 *   4. Billet non annulé / non remboursé / non inconnu.
 *   5. Anti double-utilisation (un billet « utilise » est refusé).
 * Chaque scan est journalisé dans `scan_billet`.
 */
const verify = async ({ token, actor, ip }) => {
  const ticket = await ticketRepository.findFullByTokenHash(sha256hex(token));

  if (!ticket) {
    return { valide: false, raison: 'Billet introuvable ou QR invalide.', billet: null };
  }

  const expected = signPayload(buildQrPayload(ticket));
  if (ticket.signature && expected !== ticket.signature) {
    await logScan({ ticket, actor, ip, statut: 'refuse', raison: 'QR falsifié (signature invalide).' });
    logger.warn(`[tickets] QR falsifié rejeté (${ticket.reference})`);
    return { valide: false, raison: 'QR falsifié (signature invalide).', billet: serializeTicket(ticket) };
  }

  let valide = false;
  let raison = null;

  if (isTicketExpired(ticket)) {
    raison = 'Billet expiré.';
    if (ticket.statut === 'valide') {
      await ticketRepository.updateBillet(ticket, { statut: 'expire' });
      ticket.statut = 'expire';
    }
  } else if (ticket.statut === 'valide') {
    valide = true;
  } else {
    const raisons = {
      utilise: 'Billet déjà utilisé (double utilisation).',
      annule: 'Billet annulé.',
      rembourse: 'Billet remboursé.',
      expire: 'Billet expiré.',
      impaye: 'Billet impayé.',
      inconnu: 'Billet au statut inconnu.',
    };
    raison = raisons[ticket.statut] || 'Billet non valide.';
  }

  await logScan({ ticket, actor, ip, statut: valide ? 'valide' : 'refuse', raison });
  logger.info(`[tickets] scan ${ticket.reference} → ${valide ? 'valide' : 'refusé'}${raison ? ` (${raison})` : ''}`);
  return { valide, raison, billet: serializeTicket(ticket) };
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
  regenerateQrCode,
  getPdf,
  envoyerBilletParEmail,
};
