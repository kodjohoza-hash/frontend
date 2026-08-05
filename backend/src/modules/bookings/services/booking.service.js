const { sequelize } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { ROLES } = require('../../../middlewares/auth');
const { bookingRepository } = require('../repositories');

/** Durée de validité d'une réservation non payée (blocage des sièges). */
const EXPIRATION_MINUTES = 30;

/** Statuts qui bloquent des sièges en attendant le paiement. */
const HOLDING_STATUTS = ['brouillon', 'en_attente'];

/** Statuts modifiables (hors paiement / finalisés). */
const EDITABLE_STATUTS = ['brouillon', 'en_attente', 'confirmee'];

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

const randAlnum = (len) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

/** Génère un identifiant réservation CHAR(15) unique (ex: RESAB12CD34EF56). */
const generateReservationId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `RES${randAlnum(12)}`;
    if (!(await bookingRepository.findReservation(id))) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant réservation unique.');
};

/** Génère un identifiant paiement CHAR(15) unique (ex: PAY0X1Y2Z3W4V5U). */
const generatePaiementId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `PAY${randAlnum(12)}`;
    if (!(await bookingRepository.findPaiement(id))) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant paiement unique.');
};

/** Génère une référence lisible unique (ex: RES-20260805-ABC123). */
const generateReference = async (prefix, findByRef) => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  for (let i = 0; i < 6; i += 1) {
    const reference = `${prefix}-${ymd}-${randAlnum(6)}`;
    if (!(await findByRef(reference))) return reference;
  }
  throw new ApiError(500, 'Impossible de générer une référence unique.');
};

/** Normalise la liste des sièges (numéro → MAJ, tarif → nombre ou null). */
const normalizeSeats = (seats) =>
  seats.map((s) => ({
    siege: String(s.siege).trim().toUpperCase(),
    nomPassager: s.nomPassager || null,
    tarif: s.tarif !== undefined && s.tarif !== null && s.tarif !== '' ? Number(s.tarif) : null,
  }));

/** Montant d'une réservation : Σ(tarifs) − remise + taxes. */
const calcMontant = (depart, seats, remise, taxes) => {
  const brut = seats.reduce((sum, s) => sum + (s.tarif ?? (Number(depart.prix_base) || 0)), 0);
  return Math.max(0, brut - (remise || 0) + (taxes || 0));
};

const nowPlusMinutes = (minutes) => new Date(Date.now() + minutes * 60 * 1000);

const actorName = (actor) => {
  const u = actor.user;
  const name = [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim();
  return name || actor.email || actor.id;
};

/* ══════════════════════════════════════════════════════════════
   Périmètres d'accès
   ══════════════════════════════════════════════════════════════ */

/** Périmètre de lecture de la liste des réservations selon le rôle. */
const resolveListScope = async (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) {
    return {};
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    const agences = await bookingRepository.findAgencesByCompagnie(actor.compagnieId);
    return { agenceIds: agences.map((a) => a.id) };
  }
  if (actor.role === ROLES.COUNTER_AGENT) {
    return { agenceIds: [actor.agenceId] };
  }
  if (actor.role === ROLES.CLIENT) {
    return { clientId: actor.id };
  }
  throw new ApiError(403, 'Accès refusé : gestion des réservations non autorisée.');
};

/** Vérifie que l'acteur peut accéder à une réservation donnée. */
const assertCanAccess = (actor, reservation) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.CLIENT) {
    if (reservation.client_id !== actor.id) {
      throw new ApiError(403, 'Accès refusé : cette réservation ne vous appartient pas.');
    }
    return;
  }
  if (actor.role === ROLES.COUNTER_AGENT) {
    if (reservation.agence_id !== actor.agenceId) {
      throw new ApiError(403, 'Accès refusé : réservation hors de votre agence.');
    }
    return;
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    if (reservation.agence?.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : réservation hors de votre compagnie.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé.');
};

/** Vérifie qu'un agent peut réserver sur ce voyage (agence / compagnie). */
const assertScopeDepart = (actor, depart) => {
  if (actor.role === ROLES.SUPER_ADMIN || actor.role === ROLES.CLIENT) return;
  if (actor.role === ROLES.COUNTER_AGENT && depart.agence_id !== actor.agenceId) {
    throw new ApiError(403, 'Accès refusé : voyage hors de votre agence.');
  }
  if (actor.role === ROLES.COMPANY_ADMIN && depart.compagnie_id !== actor.compagnieId) {
    throw new ApiError(403, 'Accès refusé : voyage hors de votre compagnie.');
  }
};

const assertClientActive = (client) => {
  if (!['nouveau', 'actif', 'vip'].includes(client.statut)) {
    throw new ApiError(403, 'Ce compte client est inactif ou suspendu.');
  }
};

/** Règles de réservation : voyage valide, pas passé, rattaché à une agence. */
const assertTripBookable = (depart) => {
  if (depart.statut === 'annule') {
    throw new ApiError(400, 'Ce voyage est annulé.');
  }
  if (depart.statut === 'termine') {
    throw new ApiError(400, 'Ce voyage est déjà terminé.');
  }
  if (!depart.agence_id) {
    throw new ApiError(400, "Ce voyage n'est rattaché à aucune agence.");
  }
  const dep = new Date(`${depart.date_depart}T${depart.heure_depart}`);
  if (dep < new Date()) {
    throw new ApiError(400, 'Ce voyage est déjà passé.');
  }
};

/** Vérifie que les sièges demandés existent sur le véhicule. */
const assertSeatsWithinCapacity = (depart, seats) => {
  for (const seat of seats) {
    if (/^\d+$/.test(seat.siege) && Number(seat.siege) > Number(depart.places_total)) {
      throw new ApiError(400, `Le siège ${seat.siege} n'existe pas sur ce véhicule.`);
    }
  }
};

const SEAT_STATE_LABEL = {
  occupe: 'occupé',
  reserve: 'réservé',
  bloque: 'temporairement bloqué',
};

/** Vérifie qu'aucun siège demandé n'est déjà pris (occupé / réservé / bloqué). */
const assertSeatsAvailable = (held, seats) => {
  const bySeat = new Map();
  for (const h of held) {
    bySeat.set(h.siege, ['payee', 'partiellement_payee'].includes(h.statut) ? 'occupe' : h.statut === 'confirmee' ? 'reserve' : 'bloque');
  }
  for (const seat of seats) {
    if (bySeat.has(seat.siege)) {
      throw new ApiError(409, `Le siège ${seat.siege} est déjà ${SEAT_STATE_LABEL[bySeat.get(seat.siege)]}.`);
    }
  }
};

/** Résout le guichet (réservations au guichet uniquement, jamais en ligne). */
const resolveGuichet = async (actor, guichetId) => {
  if (!guichetId) return null;
  if (actor.role === ROLES.CLIENT) {
    throw new ApiError(403, "Un client en ligne ne peut pas choisir un guichet.");
  }
  const guichet = await bookingRepository.findGuichet(guichetId);
  if (!guichet) throw new ApiError(404, 'Guichet introuvable.');
  if (actor.role === ROLES.COUNTER_AGENT && guichet.agence_id !== actor.agenceId) {
    throw new ApiError(403, 'Accès refusé : guichet hors de votre agence.');
  }
  return guichet.id;
};

const resolveModeReservation = (actor, value) => {
  if (value) return value;
  return actor.role === ROLES.CLIENT ? 'en_ligne' : 'guichet';
};

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializeClientRef = (c) => (c
  ? { id: c.id, firstName: c.prenom, lastName: c.nom, phone: c.telephone, email: c.email }
  : null);

const serializeAgentRef = (a) => (a
  ? { id: a.id, name: `${a.prenom} ${a.nom}`, matricule: a.matricule ?? null }
  : null);

const serializeAgenceRef = (a) => (a
  ? { id: a.id, name: a.nom, phone: a.telephone ?? null }
  : null);

const serializeDepart = (d) => {
  if (!d) return null;
  const trajet = d.trajet;
  return {
    id: d.id,
    code: d.code ?? null,
    dateDepart: d.date_depart ?? null,
    heureDepart: d.heure_depart ?? null,
    dateArrivee: d.date_arrivee ?? null,
    heureArrivee: d.heure_arrivee ?? null,
    prixBase: Number(d.prix_base) || 0,
    placesTotal: Number(d.places_total) || 0,
    placesDispo: Number(d.places_dispo) || 0,
    statut: d.statut ?? null,
    quai: d.quai ?? null,
    agence: serializeAgenceRef(d.agence),
    bus: d.bus
      ? { id: d.bus.id, immatriculation: d.bus.immatriculation, typeBus: d.bus.type_bus, classe: d.bus.classe, capacite: Number(d.bus.capacite) || 0 }
      : null,
    compagnie: d.compagnie
      ? { id: d.compagnie.id, nom: d.compagnie.nom, couleur: d.compagnie.couleur ?? null, logo: d.compagnie.logo ?? null }
      : null,
    trajet: trajet
      ? {
          id: trajet.id,
          code: trajet.code ?? null,
          departureCity: trajet.villeDepart?.nom ?? null,
          arrivalCity: trajet.villeArrivee?.nom ?? null,
        }
      : null,
  };
};

const serializePlace = (p) => ({
  siege: p.siege,
  passengerName: p.nom_passager ?? null,
  price: p.tarif !== null && p.tarif !== undefined ? Number(p.tarif) : null,
});

const serializePaiement = (p) => ({
  id: p.id,
  reference: p.reference,
  montant: Number(p.montant),
  methode: p.methode,
  statut: p.statut,
  dateCreation: p.cree_le ?? null,
  datePaiement: p.paiement_le ?? null,
  note: p.note ?? null,
});

const serializeReservation = (r) => {
  if (!r) return null;
  const paiements = r.paiements || [];
  const montantPaye = paiements
    .filter((p) => p.statut === 'paye')
    .reduce((sum, p) => sum + Number(p.montant), 0);

  return {
    id: r.id,
    reference: r.reference,
    statut: r.statut,
    modeReservation: r.mode_reservation,
    modePaiement: r.mode_paiement ?? null,
    clientId: r.client_id,
    client: serializeClientRef(r.client),
    departId: r.depart_id,
    depart: serializeDepart(r.depart),
    agenceId: r.agence_id,
    agence: serializeAgenceRef(r.agence),
    agentId: r.agent_id ?? null,
    agent: serializeAgentRef(r.agent),
    guichetId: r.guichet_id ?? null,
    guichet: r.guichet ? { id: r.guichet.id, code: r.guichet.code, name: r.guichet.nom } : null,
    places: (r.places || []).map(serializePlace),
    nbPlaces: r.nb_places,
    montant: Number(r.montant) || 0,
    remise: Number(r.remise) || 0,
    taxes: Number(r.taxes) || 0,
    montantPaye,
    resteAPayer: Math.max(0, (Number(r.montant) || 0) - montantPaye),
    dateCreation: r.date_creation ?? null,
    dateConfirmation: r.date_confirmation ?? null,
    dateAnnulation: r.date_annulation ?? null,
    dateExpiration: r.date_expiration ?? null,
    motifAnnulation: r.motif_annulation ?? null,
    observations: r.observations ?? null,
    paiements: paiements.map(serializePaiement),
    historique: (r.historique || []).map((h) => ({
      action: h.action,
      timestamp: h.timestamp,
      utilisateur: h.utilisateur,
    })),
  };
};

/* ══════════════════════════════════════════════════════════════
   Services
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = await resolveListScope(actor);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const sort = query.sort || 'newest';

  const where = bookingRepository.buildWhere(query, scope);
  const { rows, count } = await bookingRepository.findPage({ where, page, limit, sort });

  return { items: rows.map(serializeReservation), total: count, page, limit, totalPages: Math.ceil(count / limit) };
};

const getById = async ({ id, actor }) => {
  const reservation = await bookingRepository.findByIdFull(id);
  if (!reservation) throw new ApiError(404, 'Réservation introuvable.');
  assertCanAccess(actor, reservation);
  return serializeReservation(reservation);
};

const create = async ({ data, actor }) => {
  const isClient = actor.role === ROLES.CLIENT;
  const clientId = isClient ? actor.id : data.clientId;
  if (!clientId) throw new ApiError(400, "L'identifiant du client est requis.");

  const client = await bookingRepository.findClient(clientId);
  if (!client) throw new ApiError(404, 'Client introuvable.');
  assertClientActive(client);

  const depart = await bookingRepository.findDepart(data.departId);
  if (!depart) throw new ApiError(404, 'Voyage introuvable.');
  assertTripBookable(depart);
  assertScopeDepart(actor, depart);

  const guichetId = await resolveGuichet(actor, data.guichetId);

  const seats = normalizeSeats(data.seats);
  assertSeatsWithinCapacity(depart, seats);
  if (seats.length > Number(depart.places_dispo)) {
    throw new ApiError(400, 'Plus assez de places disponibles sur ce voyage.');
  }

  const modeReservation = resolveModeReservation(actor, data.modeReservation);
  const statut = data.statut || 'en_attente';
  const remise = Number(data.remise) || 0;
  const taxes = Number(data.taxes) || 0;
  const montant = calcMontant(depart, seats, remise, taxes);

  const id = await generateReservationId();
  const reference = await generateReference('RES', bookingRepository.findReservationByReference);
  const now = new Date();

  await sequelize.transaction(async (t) => {
    const locked = await bookingRepository.lockDepart(depart.id, t);
    assertTripBookable(locked);

    const held = await bookingRepository.findSeatsByDepart(depart.id, { transaction: t });
    assertSeatsAvailable(held, seats);

    if (seats.length > Number(locked.places_dispo)) {
      throw new ApiError(400, 'Plus assez de places disponibles sur ce voyage.');
    }

    await bookingRepository.createReservation(
      {
        id,
        reference,
        client_id: clientId,
        depart_id: depart.id,
        agence_id: depart.agence_id,
        agent_id: isClient ? null : actor.id,
        guichet_id: guichetId,
        mode_reservation: modeReservation,
        mode_paiement: data.modePaiement || null,
        nb_places: seats.length,
        montant,
        remise,
        taxes,
        statut,
        date_creation: now,
        date_expiration: HOLDING_STATUTS.includes(statut) ? nowPlusMinutes(EXPIRATION_MINUTES) : null,
        observations: data.observations || null,
      },
      { transaction: t }
    );

    for (const seat of seats) {
      await bookingRepository.createPlace(
        { reservation_id: id, siege: seat.siege, nom_passager: seat.nomPassager, tarif: seat.tarif },
        { transaction: t }
      );
    }

    await bookingRepository.createHistorique(
      {
        reservation_id: id,
        action: `Réservation créée (${statut}) — ${seats.length} place(s)`,
        timestamp: now,
        utilisateur: actorName(actor),
      },
      { transaction: t }
    );

    await bookingRepository.adjustDepartDispo(depart.id, -seats.length, { transaction: t });
  });

  const full = await bookingRepository.findByIdFull(id);
  logger.info(`[bookings] ${reference} créée (${statut}) : ${seats.length} place(s) sur ${depart.id}`);
  return serializeReservation(full);
};

const update = async ({ id, data, actor }) => {
  const reservation = await bookingRepository.findByIdFull(id);
  if (!reservation) throw new ApiError(404, 'Réservation introuvable.');
  assertCanAccess(actor, reservation);

  if (!EDITABLE_STATUTS.includes(reservation.statut)) {
    throw new ApiError(400, `Une réservation au statut « ${reservation.statut} » ne peut pas être modifiée.`);
  }

  const depart = await bookingRepository.findDepart(reservation.depart_id);
  if (!depart) throw new ApiError(404, 'Voyage introuvable.');

  const seats = data.seats ? normalizeSeats(data.seats) : null;
  const patch = {};
  if (data.modeReservation !== undefined) patch.mode_reservation = data.modeReservation;
  if (data.modePaiement !== undefined) patch.mode_paiement = data.modePaiement || null;
  if (data.observations !== undefined) patch.observations = data.observations || null;
  if (data.remise !== undefined) patch.remise = Number(data.remise) || 0;
  if (data.taxes !== undefined) patch.taxes = Number(data.taxes) || 0;

  await sequelize.transaction(async (t) => {
    if (seats) {
      const locked = await bookingRepository.lockDepart(depart.id, t);
      assertTripBookable(locked);
      assertSeatsWithinCapacity(locked, seats);

      const currentPlaces = await bookingRepository.findPlacesByReservation(id, { transaction: t });
      const curSet = new Map(currentPlaces.map((p) => [String(p.siege).toUpperCase(), p]));
      const newSet = new Set(seats.map((s) => s.siege));
      const added = seats.filter((s) => !curSet.has(s.siege));

      if (added.length) {
        const held = await bookingRepository.findSeatsByDepart(depart.id, { transaction: t });
        assertSeatsAvailable(held, added);
        if (seats.length > Number(locked.places_dispo) + currentPlaces.length) {
          throw new ApiError(400, 'Plus assez de places disponibles sur ce voyage.');
        }
      }

      for (const s of seats) {
        const existing = curSet.get(s.siege);
        if (existing) {
          await bookingRepository.updatePlace(
            existing,
            { nom_passager: s.nomPassager, tarif: s.tarif },
            { transaction: t }
          );
        } else {
          await bookingRepository.createPlace(
            { reservation_id: id, siege: s.siege, nom_passager: s.nomPassager, tarif: s.tarif },
            { transaction: t }
          );
        }
      }
      for (const [siege, place] of curSet) {
        if (!newSet.has(siege)) {
          await bookingRepository.destroyPlace(place, { transaction: t });
        }
      }

      const delta = seats.length - currentPlaces.length;
      if (delta !== 0) await bookingRepository.adjustDepartDispo(depart.id, -delta, { transaction: t });
      patch.nb_places = seats.length;
    }

    const remise = patch.remise !== undefined ? patch.remise : Number(reservation.remise) || 0;
    const taxes = patch.taxes !== undefined ? patch.taxes : Number(reservation.taxes) || 0;
    const finalSeats = seats
      || (reservation.places || []).map((p) => ({ siege: String(p.siege).toUpperCase(), tarif: p.tarif }));
    if (seats || patch.remise !== undefined || patch.taxes !== undefined) {
      patch.montant = calcMontant(depart, finalSeats, remise, taxes);
    }

    if (Object.keys(patch).length) {
      await bookingRepository.updateReservation(reservation, patch, { transaction: t });
    }

    await bookingRepository.createHistorique(
      { reservation_id: id, action: 'Réservation modifiée', timestamp: new Date(), utilisateur: actorName(actor) },
      { transaction: t }
    );
  });

  const full = await bookingRepository.findByIdFull(id);
  logger.info(`[bookings] ${reservation.reference} modifiée`);
  return serializeReservation(full);
};

const confirm = async ({ id, actor }) => {
  const reservation = await bookingRepository.findByIdFull(id);
  if (!reservation) throw new ApiError(404, 'Réservation introuvable.');
  assertCanAccess(actor, reservation);

  if (['confirmee', 'payee'].includes(reservation.statut)) {
    return { booking: serializeReservation(reservation), message: 'Réservation déjà confirmée.' };
  }
  if (!HOLDING_STATUTS.includes(reservation.statut)) {
    throw new ApiError(400, `Impossible de confirmer une réservation au statut « ${reservation.statut} ».`);
  }

  const depart = await bookingRepository.findDepart(reservation.depart_id);
  assertTripBookable(depart);

  const now = new Date();
  await bookingRepository.updateReservation(reservation, { statut: 'confirmee', date_confirmation: now, date_expiration: null });
  await bookingRepository.createHistorique({
    reservation_id: id,
    action: 'Réservation confirmée',
    timestamp: now,
    utilisateur: actorName(actor),
  });

  const full = await bookingRepository.findByIdFull(id);
  logger.info(`[bookings] ${reservation.reference} confirmée`);
  return { booking: serializeReservation(full), message: 'Réservation confirmée.' };
};

const cancel = async ({ id, data, actor }) => {
  const reservation = await bookingRepository.findByIdFull(id);
  if (!reservation) throw new ApiError(404, 'Réservation introuvable.');
  assertCanAccess(actor, reservation);

  if (reservation.statut === 'annulee') {
    return { booking: serializeReservation(reservation), message: 'Réservation déjà annulée.' };
  }
  if (['payee', 'partiellement_payee'].includes(reservation.statut)) {
    throw new ApiError(400, 'Réservation payée : utilisez le remboursement pour annuler.');
  }
  if (!EDITABLE_STATUTS.includes(reservation.statut)) {
    throw new ApiError(400, `Impossible d'annuler une réservation au statut « ${reservation.statut} ».`);
  }

  const depart = await bookingRepository.findDepart(reservation.depart_id);
  if (!depart) throw new ApiError(404, 'Voyage introuvable.');

  const now = new Date();
  await sequelize.transaction(async (t) => {
    await bookingRepository.lockDepart(depart.id, t);
    await bookingRepository.updateReservation(
      reservation,
      { statut: 'annulee', date_annulation: now, motif_annulation: data.motif },
      { transaction: t }
    );
    await bookingRepository.adjustDepartDispo(depart.id, reservation.nb_places, { transaction: t });
    await bookingRepository.createHistorique(
      { reservation_id: id, action: `Réservation annulée : ${data.motif}`, timestamp: now, utilisateur: actorName(actor) },
      { transaction: t }
    );
  });

  const full = await bookingRepository.findByIdFull(id);
  logger.info(`[bookings] ${reservation.reference} annulée (${data.motif})`);
  return { booking: serializeReservation(full), message: 'Réservation annulée.' };
};

const pay = async ({ id, data, actor }) => {
  const reservation = await bookingRepository.findByIdFull(id);
  if (!reservation) throw new ApiError(404, 'Réservation introuvable.');
  assertCanAccess(actor, reservation);

  if (reservation.statut === 'payee') {
    throw new ApiError(400, 'Réservation déjà entièrement payée.');
  }
  if (['annulee', 'expiree', 'remboursee'].includes(reservation.statut)) {
    throw new ApiError(400, `Impossible de payer une réservation au statut « ${reservation.statut} ».`);
  }

  const depart = await bookingRepository.findDepart(reservation.depart_id);
  assertTripBookable(depart);

  const montantPercu = await bookingRepository.sumPaidByReservation(id);
  const reste = Math.max(0, Number(reservation.montant) - montantPercu);
  if (Number(data.montant) > reste) {
    throw new ApiError(400, `Le montant dépasse le reste à payer (${reste} FCFA).`);
  }

  const paiementId = await generatePaiementId();
  const reference = await generateReference('PAY', bookingRepository.findPaiementByReference);
  const now = new Date();

  const newStatut = montantPercu + Number(data.montant) >= Number(reservation.montant)
    ? 'payee'
    : HOLDING_STATUTS.includes(reservation.statut)
      ? 'confirmee'
      : reservation.statut;

  await sequelize.transaction(async (t) => {
    await bookingRepository.createPaiement(
      {
        id: paiementId,
        reference,
        reservation_id: id,
        billet_id: null,
        client_id: reservation.client_id,
        agent_id: actor.role === ROLES.CLIENT ? null : actor.id,
        montant: Number(data.montant),
        methode: data.methode,
        statut: 'paye',
        cree_le: now,
        paiement_le: now,
        note: data.note || null,
      },
      { transaction: t }
    );

    const patch = {
      statut: newStatut,
      date_expiration: null,
      mode_paiement: reservation.mode_paiement || data.methode,
    };
    if (newStatut === 'payee' && !reservation.date_confirmation) patch.date_confirmation = now;

    await bookingRepository.updateReservation(reservation, patch, { transaction: t });
    await bookingRepository.createHistorique(
      {
        reservation_id: id,
        action: `Paiement de ${Number(data.montant)} FCFA reçu (${data.methode}).`,
        timestamp: now,
        utilisateur: actorName(actor),
      },
      { transaction: t }
    );
  });

  const full = await bookingRepository.findByIdFull(id);
  logger.info(`[bookings] ${reservation.reference} paiement ${data.montant} FCFA (${data.methode})`);
  return { booking: serializeReservation(full), message: 'Paiement enregistré.' };
};

const refund = async ({ id, data, actor }) => {
  const reservation = await bookingRepository.findByIdFull(id);
  if (!reservation) throw new ApiError(404, 'Réservation introuvable.');
  assertCanAccess(actor, reservation);

  if (!['payee', 'partiellement_payee'].includes(reservation.statut)) {
    throw new ApiError(400, 'Seule une réservation payée peut être remboursée.');
  }

  const montantPercu = await bookingRepository.sumPaidByReservation(id);
  const refundAmount = Number(data.montant) || montantPercu;
  if (refundAmount > montantPercu) {
    throw new ApiError(400, `Le montant remboursé ne peut pas dépasser le total payé (${montantPercu} FCFA).`);
  }
  const fullRefund = refundAmount >= montantPercu;
  const now = new Date();

  const paiementId = await generatePaiementId();
  const reference = await generateReference('REM', bookingRepository.findPaiementByReference);

  await sequelize.transaction(async (t) => {
    await bookingRepository.createPaiement(
      {
        id: paiementId,
        reference,
        reservation_id: id,
        billet_id: null,
        client_id: reservation.client_id,
        agent_id: actor.role === ROLES.CLIENT ? null : actor.id,
        montant: refundAmount,
        methode: reservation.mode_paiement || 'especes',
        statut: 'rembourse',
        type: 'remboursement',
        cree_le: now,
        paiement_le: now,
        remboursement: refundAmount,
        motif_remboursement: data.motif || null,
        note: data.note || null,
      },
      { transaction: t }
    );

    if (fullRefund) {
      await bookingRepository.lockDepart(reservation.depart_id, t);
      await bookingRepository.updateReservation(
        reservation,
        { statut: 'remboursee', date_annulation: now, motif_annulation: data.motif || null },
        { transaction: t }
      );
      await bookingRepository.adjustDepartDispo(reservation.depart_id, reservation.nb_places, { transaction: t });
    }

    await bookingRepository.createHistorique(
      { reservation_id: id, action: `Remboursement de ${refundAmount} FCFA effectué.`, timestamp: now, utilisateur: actorName(actor) },
      { transaction: t }
    );
  });

  const full = await bookingRepository.findByIdFull(id);
  logger.info(`[bookings] ${reservation.reference} remboursement ${refundAmount} FCFA`);
  return { booking: serializeReservation(full), message: 'Remboursement effectué.' };
};

const remove = async ({ id, actor }) => {
  const reservation = await bookingRepository.findByIdFull(id);
  if (!reservation) throw new ApiError(404, 'Réservation introuvable.');
  assertCanAccess(actor, reservation);

  if (reservation.statut !== 'brouillon') {
    throw new ApiError(409, 'Seules les réservations en brouillon peuvent être supprimées. Utilisez l\'annulation pour les autres statuts.');
  }

  await sequelize.transaction(async (t) => {
    await bookingRepository.lockDepart(reservation.depart_id, t);
    await bookingRepository.destroyHistoriqueByReservation(id, { transaction: t });
    await bookingRepository.destroyPlacesByReservation(id, { transaction: t });
    await bookingRepository.destroyReservation(reservation, { transaction: t });
    await bookingRepository.adjustDepartDispo(reservation.depart_id, reservation.nb_places, { transaction: t });
  });

  logger.info(`[bookings] ${reservation.reference} supprimée`);
  return { id, message: 'Réservation supprimée.' };
};

const availability = async ({ departId, actor }) => {
  const depart = await bookingRepository.findDepart(departId);
  if (!depart) throw new ApiError(404, 'Voyage introuvable.');

  const held = await bookingRepository.findSeatsByDepart(departId);
  const stateBySeat = new Map();
  for (const h of held) {
    const state = ['payee', 'partiellement_payee'].includes(h.statut)
      ? 'occupe'
      : h.statut === 'confirmee'
        ? 'reserve'
        : 'bloque';
    stateBySeat.set(h.siege, state);
  }

  const isVipBus = depart.bus && ['vip', 'premium'].includes(depart.bus.type_bus);
  const vipSeats = isVipBus
    ? Array.from({ length: Math.min(8, Number(depart.places_total)) }, (_, i) => String(i + 1))
    : [];

  const seats = [];
  const counts = { libre: 0, bloque: 0, reserve: 0, occupe: 0 };
  for (let n = 1; n <= Number(depart.places_total); n += 1) {
    const number = String(n);
    const state = stateBySeat.get(number) || 'libre';
    counts[state] += 1;
    seats.push({ number, state, vip: vipSeats.includes(number) });
  }

  return {
    depart: serializeDepart(depart),
    placesTotal: Number(depart.places_total),
    placesDispo: Number(depart.places_dispo),
    vipSeats,
    seats,
    counts,
  };
};

const stats = async ({ actor, query }) => {
  if (actor.role === ROLES.CLIENT) {
    return bookingRepository.clientStats(actor.id);
  }
  if (actor.role === ROLES.COUNTER_AGENT) {
    return bookingRepository.agentStats({ agentId: actor.id, agenceId: actor.agenceId });
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    return bookingRepository.scopeStats({ compagnieId: actor.compagnieId });
  }
  return bookingRepository.scopeStats({});
};

module.exports = {
  EXPIRATION_MINUTES,
  list,
  getById,
  create,
  update,
  confirm,
  cancel,
  pay,
  refund,
  remove,
  availability,
  stats,
};
