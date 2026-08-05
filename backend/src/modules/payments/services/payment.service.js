const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { ROLES } = require('../../../middlewares/auth');
const { sequelize } = require('../../../models');
const { paymentRepository } = require('../repositories');
const { bookingService } = require('../../bookings/services');

/** Statuts de réservation qui « retiennent » les sièges en attente de paiement. */
const HOLDING_STATUTS = ['brouillon', 'en_attente'];

/** Transitions de statut autorisées via PATCH (anti double validation). */
const ALLOWED_TRANSITIONS = {
  initie: ['en_attente', 'paye', 'echoue', 'annule'],
  en_attente: ['paye', 'echoue', 'annule'],
  echoue: ['initie'],
};

/** Statuts « finalisés » d'un paiement (montant gelé). */
const FINAL_STATUTS = ['paye', 'echoue', 'annule', 'rembourse', 'partiellement_rembourse'];

const randAlnum = (len) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

/** Génère un identifiant paiement CHAR(15) unique (ex: PAY0X1Y2Z3W4V5U). */
const generatePaiementId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `PAY${randAlnum(12)}`;
    if (!(await paymentRepository.findById(id))) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant paiement unique.');
};

/** Génère une référence lisible unique (ex: PAY-20260805-ABC123). */
const generateReference = async (prefix, findByRef) => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  for (let i = 0; i < 6; i += 1) {
    const reference = `${prefix}-${ymd}-${randAlnum(6)}`;
    if (!(await findByRef(reference))) return reference;
  }
  throw new ApiError(500, 'Impossible de générer une référence unique.');
};

/* ══════════════════════════════════════════════════════════════
   Périmètres d'accès
   ══════════════════════════════════════════════════════════════ */

const resolveScope = async (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) return {};
  if (actor.role === ROLES.COMPANY_ADMIN) {
    const agences = await paymentRepository.findAgencesByCompagnie(actor.compagnieId);
    return { agenceIds: agences.map((a) => a.id) };
  }
  if (actor.role === ROLES.COUNTER_AGENT) {
    return { agenceIds: [actor.agenceId] };
  }
  if (actor.role === ROLES.CLIENT) {
    return { clientId: actor.id };
  }
  throw new ApiError(403, 'Accès refusé : gestion des paiements non autorisée.');
};

const assertCanAccess = (actor, payment) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.CLIENT) {
    if (payment.client_id !== actor.id) {
      throw new ApiError(403, 'Accès refusé : ce paiement ne vous appartient pas.');
    }
    return;
  }
  if (actor.role === ROLES.COUNTER_AGENT) {
    /* Paiement manuel (sans réservation) : enregistré par l'équipe, accessible. */
    if (!payment.reservation_id) return;
    if (payment.reservation?.agence_id !== actor.agenceId) {
      throw new ApiError(403, 'Accès refusé : paiement hors de votre agence.');
    }
    return;
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    if (!payment.reservation_id) return;
    if (payment.reservation?.agence?.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : paiement hors de votre compagnie.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé.');
};

const actorName = (actor) => {
  const u = actor.user;
  const name = [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim();
  return name || actor.email || actor.id;
};

/** Périmètre d'une réservation pour l'enregistrement d'un paiement. */
const assertCanAccessReservation = (actor, reservation) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.CLIENT) {
    if (reservation.client_id !== actor.id) {
      throw new ApiError(403, 'Accès refusé : réservation hors de votre périmètre.');
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

/** Calcule et attache le solde d'une réservation (montant payé / reste à payer). */
const attachBalance = async (payment) => {
  const reservation = payment.reservation;
  if (!reservation) return payment;
  const [paid, refunded] = await Promise.all([
    paymentRepository.sumPaidByReservation(reservation.id),
    paymentRepository.sumRefundedByReservation(reservation.id),
  ]);
  const montantPaye = Math.max(0, paid - refunded);
  const resteAPayer = Math.max(0, Number(reservation.montant) - montantPaye);
  payment._balance = {
    montantPaye,
    resteAPayer,
    montantReservation: Number(reservation.montant),
  };
  return payment;
};

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializePayment = (p) => {
  const reservation = p.reservation;
  const depart = reservation?.depart;
  const trajet = depart?.trajet;
  const client = p.client;

  return {
    id: p.id,
    reference: p.reference,
    type: p.type,
    categorie: p.categorie,
    montant: Number(p.montant) || 0,
    frais: Number(p.frais) || 0,
    devise: p.devise || 'XAF',
    methode: p.methode,
    statut: p.statut,
    referenceFournisseur: p.reference_fournisseur,
    provider: p.provider,
    creeLe: p.cree_le,
    paiementLe: p.paiement_le,
    remboursement: p.remboursement ? Number(p.remboursement) : null,
    motifRemboursement: p.motif_remboursement,
    note: p.note,
    metadata: p.metadata,
    compagnieId: p.compagnie_id ?? p.reservation?.agence?.compagnie_id ?? p.reservation?.depart?.compagnie_id ?? null,
    guichetId: p.guichet_id ?? null,
    abonnementCompagnie: p.abonnementCompagnie
      ? {
          id: p.abonnementCompagnie.id,
          compagnieId: p.abonnementCompagnie.compagnie_id,
          statut: p.abonnementCompagnie.statut,
        }
      : null,
    balance: p._balance
      ? {
          montantPaye: p._balance.montantPaye,
          resteAPayer: p._balance.resteAPayer,
          montantReservation: p._balance.montantReservation,
        }
      : null,
    client: client
      ? { id: client.id, firstName: client.prenom, lastName: client.nom, phone: client.telephone, email: client.email }
      : null,
    clientName: client ? `${client.prenom} ${client.nom}` : null,
    clientPhone: client?.telephone ?? null,
    clientEmail: client?.email ?? null,
    agent: p.agent
      ? { id: p.agent.id, name: `${p.agent.prenom} ${p.agent.nom}`, matricule: p.agent.matricule }
      : null,
    agentName: p.agent ? `${p.agent.prenom} ${p.agent.nom}` : null,
    reservation: reservation
      ? {
          id: reservation.id,
          reference: reservation.reference,
          statut: reservation.statut,
          nbPlaces: reservation.nb_places,
          montant: Number(reservation.montant) || 0,
          dateCreation: reservation.date_creation,
          depart: depart
            ? {
                id: depart.id,
                code: depart.code,
                dateDepart: depart.date_depart,
                heureDepart: depart.heure_depart,
                dateArrivee: depart.date_arrivee,
                heureArrivee: depart.heure_arrivee,
                quai: depart.quai,
                prixBase: depart.prix_base,
                trajet: trajet
                  ? {
                      villeDepart: trajet.villeDepart?.nom ?? null,
                      villeArrivee: trajet.villeArrivee?.nom ?? null,
                    }
                  : null,
                bus: depart.bus
                  ? { id: depart.bus.id, immatriculation: depart.bus.immatriculation, typeBus: depart.bus.type_bus, classe: depart.bus.classe }
                  : null,
                compagnie: depart.compagnie
                  ? { id: depart.compagnie.id, nom: depart.compagnie.nom, couleur: depart.compagnie.couleur, logo: depart.compagnie.logo }
                  : null,
              }
            : null,
          agence: reservation.agence
            ? { id: reservation.agence.id, nom: reservation.agence.nom, telephone: reservation.agence.telephone }
            : null,
        }
      : null,
    bookingRef: reservation?.reference ?? null,
    ticketRef: p.billet?.reference ?? null,
    tripFrom: trajet?.villeDepart?.nom ?? null,
    tripTo: trajet?.villeArrivee?.nom ?? null,
    tripDate: depart?.date_depart ?? null,
    agence: reservation?.agence ? { id: reservation.agence.id, nom: reservation.agence.nom } : null,
    agenceName: reservation?.agence?.nom ?? null,
    compagnie: depart?.compagnie ? { id: depart.compagnie.id, nom: depart.compagnie.nom } : null,
  };
};

/* ══════════════════════════════════════════════════════════════
   Consultation
   ══════════════════════════════════════════════════════════════ */

/** GET /payments — liste paginée, filtrable, triée (scope par rôle). */
const list = async ({ query, actor }) => {
  const scope = await resolveScope(actor);
  const where = paymentRepository.buildWhere(query, scope);
  const { rows, count } = await paymentRepository.findPage({
    where,
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });
  return {
    items: rows.map(serializePayment),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: count,
      pages: Math.ceil(count / query.limit),
    },
  };
};

/** GET /payments/:id — détail d'un paiement (client, réservation, voyage, agence). */
const getById = async ({ id, actor }) => {
  const payment = await paymentRepository.findByIdFull(id);
  if (!payment) throw new ApiError(404, 'Paiement introuvable.');
  assertCanAccess(actor, payment);
  await attachBalance(payment);
  return serializePayment(payment);
};

/** GET /payments/:id/receipt — données d'un reçu (impression / aperçu). */
const receipt = async ({ id, actor }) => {
  const payment = await getById({ id, actor });
  return {
    ...payment,
    receiptNo: `RCP-${payment.reference}`,
    issueDate: new Date().toISOString(),
    companyName: payment.compagnie?.nom ?? 'Bus Tix Connect',
    trip: payment.tripFrom && payment.tripTo ? `${payment.tripFrom} → ${payment.tripTo}` : null,
    methodeLabel: payment.methode,
    montantLabel: `${payment.montant.toLocaleString('fr-FR')} ${payment.devise}`,
    qrCode: `BTC-RCP-${payment.reference.replace(/-/g, '').slice(0, 10).toUpperCase()}`,
    barcode: String(5900000000000 + Number(payment.reference.replace(/\D/g, '').slice(0, 9) || 0)),
  };
};

/** GET /payments/stats (ou /payments/statistics) — KPIs tableau de bord. */
const stats = async ({ actor, query }) => {
  const scope = await resolveScope(actor);
  const filters = { ...query };

  const [synthèse, parStatut, parMethode, parJour, parAgence, parMois, parCompagnie, parCategorie] =
    await Promise.all([
      paymentRepository.summary({ filters, scope }),
      paymentRepository.byStatus({ filters, scope }),
      paymentRepository.byMethod({ filters, scope }),
      paymentRepository.byDay({ filters, scope }),
      paymentRepository.byAgency({ filters, scope }),
      paymentRepository.byMonth({ filters, scope }),
      paymentRepository.byCompagnie({ filters, scope }),
      paymentRepository.byCategorie({ filters, scope }),
    ]);

  return {
    ...synthèse,
    parStatut,
    parMethode,
    parJour,
    parAgence,
    parMois,
    parCompagnie,
    parCategorie,
  };
};

/** GET /payments/statistics — alias de /payments/stats. */
const statistics = stats;

/* ══════════════════════════════════════════════════════════════
   Création / mise à jour (grand livre)
   ══════════════════════════════════════════════════════════════ */

/** POST /payments — enregistre un paiement (réservation / abonnement / manuel). */
const create = async ({ data, actor }) => {
  await resolveScope(actor);

  /* -- Réservation liée -- */
  let reservation = null;
  if (data.reservationId) {
    reservation = await paymentRepository.findReservationLedger(data.reservationId);
    if (!reservation) throw new ApiError(404, 'Réservation introuvable.');
    assertCanAccessReservation(actor, reservation);
    if (!data.clientId) data.clientId = reservation.client_id;
  }

  /* -- Client -- */
  if (data.clientId) {
    const client = await paymentRepository.findClient(data.clientId);
    if (!client) throw new ApiError(404, 'Client introuvable.');
    if (actor.role === ROLES.CLIENT && data.clientId !== actor.id) {
      throw new ApiError(403, 'Accès refusé : ce client ne vous correspond pas.');
    }
  } else if (actor.role === ROLES.CLIENT) {
    data.clientId = actor.id;
  }
  if (!data.clientId) throw new ApiError(400, 'Le client est requis pour enregistrer ce paiement.');

  /* -- Abonnement compagnie -- */
  let abonnement = null;
  if (data.abonnementCompagnieId) {
    abonnement = await paymentRepository.findAbonnementCompagnie(data.abonnementCompagnieId);
    if (!abonnement) throw new ApiError(404, 'Abonnement compagnie introuvable.');
    if (actor.role === ROLES.COMPANY_ADMIN && abonnement.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : abonnement hors de votre compagnie.');
    }
  }

  /* -- Reste à payer : le montant ne peut pas dépasser la dette -- */
  let montantPercu = 0;
  if (reservation) {
    const [paid, refunded] = await Promise.all([
      paymentRepository.sumPaidByReservation(reservation.id),
      paymentRepository.sumRefundedByReservation(reservation.id),
    ]);
    montantPercu = Math.max(0, paid - refunded);
    const resteAPayer = Math.max(0, Number(reservation.montant) - montantPercu);
    if (Number(data.montant) > resteAPayer) {
      throw new ApiError(400, `Le montant dépasse le reste à payer (${resteAPayer} FCFA).`);
    }
  }

  /* -- Catégorie / compagnie / guichet dérivés -- */
  const categorie =
    data.categorie ||
    (abonnement
      ? 'abonnement'
      : reservation
        ? montantPercu > 0
          ? 'complement'
          : 'reservation'
        : 'manuel');
  const compagnieId =
    abonnement?.compagnie_id ||
    reservation?.agence?.compagnie_id ||
    reservation?.depart?.compagnie_id ||
    null;
  const guichetId = reservation?.guichet_id ?? null;

  const isConfirmed = data.statut === 'paye';
  const now = new Date();
  const paiementId = await generatePaiementId();
  const reference = await generateReference('PAY', paymentRepository.findPaiementByReference);

  await sequelize.transaction(async (t) => {
    await paymentRepository.createPaiement(
      {
        id: paiementId,
        reference,
        reservation_id: reservation ? reservation.id : null,
        billet_id: null,
        client_id: data.clientId,
        agent_id: actor.role === ROLES.CLIENT ? null : actor.id,
        montant: Number(data.montant),
        frais: Number(data.frais) || 0,
        devise: data.devise || 'XAF',
        methode: data.methode,
        statut: data.statut || 'en_attente',
        type: 'encaissement',
        categorie,
        abonnement_compagnie_id: abonnement ? abonnement.id : null,
        compagnie_id: compagnieId,
        guichet_id: guichetId,
        reference_fournisseur: data.referenceFournisseur || null,
        provider: data.provider || null,
        note: data.note || null,
        metadata: data.metadata || null,
        cree_le: now,
        paiement_le: isConfirmed ? now : null,
      },
      { transaction: t }
    );

    if (isConfirmed && reservation) {
      const newStatut = montantPercu + Number(data.montant) >= Number(reservation.montant) ? 'payee' : 'confirmee';
      const patch = {
        statut: newStatut,
        date_expiration: null,
        mode_paiement: reservation.mode_paiement || data.methode,
      };
      if (newStatut === 'payee' && !reservation.date_confirmation) patch.date_confirmation = now;
      await paymentRepository.updateReservation(reservation, patch, { transaction: t });
      await paymentRepository.createHistorique(
        {
          reservation_id: reservation.id,
          action: `Paiement ${reference} de ${Number(data.montant)} FCFA reçu (${data.methode}) — réservation ${newStatut}.`,
          timestamp: now,
          utilisateur: actorName(actor),
        },
        { transaction: t }
      );
    }
  });

  const full = await paymentRepository.findByIdFull(paiementId);
  await attachBalance(full);
  logger.info(`[payments] ${reference} créé (${Number(data.montant)} FCFA, ${data.methode}, ${categorie})`);
  return { payment: serializePayment(full), message: 'Paiement enregistré.' };
};

/** PATCH /payments/:id — met à jour un paiement (métadonnées + statut gardé). */
const update = async ({ id, data, actor }) => {
  const payment = await paymentRepository.findByIdFull(id);
  if (!payment) throw new ApiError(404, 'Paiement introuvable.');
  assertCanAccess(actor, payment);

  const patch = {};

  /* -- Statut : transitions gardées (anti double validation) -- */
  if (data.statut) {
    if (data.statut === payment.statut) {
      if (data.statut === 'paye') {
        throw new ApiError(400, 'Paiement déjà confirmé.');
      }
    } else {
      const allowed = ALLOWED_TRANSITIONS[payment.statut] || [];
      if (!allowed.includes(data.statut)) {
        throw new ApiError(400, `Transition invalide : « ${payment.statut} » → « ${data.statut} ».`);
      }
      patch.statut = data.statut;
      if (data.statut === 'paye') patch.paiement_le = new Date();
    }
  }

  /* -- Montant : modifiable uniquement avant finalisation -- */
  if (data.montant !== undefined) {
    if (FINAL_STATUTS.includes(payment.statut)) {
      throw new ApiError(400, "Impossible de modifier le montant d'un paiement finalisé.");
    }
    if (Number(data.montant) <= 0) {
      throw new ApiError(400, 'Le montant doit être positif.');
    }
    if (payment.reservation) {
      const [paid, refunded] = await Promise.all([
        paymentRepository.sumPaidByReservation(payment.reservation.id),
        paymentRepository.sumRefundedByReservation(payment.reservation.id),
      ]);
      const resteAPayer = Math.max(0, Number(payment.reservation.montant) - Math.max(0, paid - refunded));
      if (Number(data.montant) > resteAPayer) {
        throw new ApiError(400, `Le montant dépasse le reste à payer (${resteAPayer} FCFA).`);
      }
    }
    patch.montant = Number(data.montant);
  }

  /* -- Champs libres -- */
  if (data.frais !== undefined) patch.frais = Number(data.frais);
  if (data.methode !== undefined) patch.methode = data.methode;
  if (data.referenceFournisseur !== undefined) patch.reference_fournisseur = data.referenceFournisseur || null;
  if (data.provider !== undefined) patch.provider = data.provider || null;
  if (data.note !== undefined) patch.note = data.note;
  if (data.paiementLe !== undefined) patch.paiement_le = data.paiementLe || null;
  if (data.metadata !== undefined) patch.metadata = data.metadata;

  if (Object.keys(patch).length === 0) {
    throw new ApiError(400, 'Aucune donnée à mettre à jour.');
  }

  await paymentRepository.updatePaiement(payment, patch);

  /* Confirmation via PATCH : la réservation liée avance. */
  if (patch.statut === 'paye' && payment.reservation_id) {
    await confirmReservationFromPayment(payment, actor);
  }

  const full = await paymentRepository.findByIdFull(id);
  await attachBalance(full);
  logger.info(`[payments] ${payment.reference} mis à jour (${Object.keys(patch).join(', ')})`);
  return { payment: serializePayment(full), message: 'Paiement mis à jour.' };
};

/** Fait avancer le statut de la réservation liée après confirmation d'un paiement. */
const confirmReservationFromPayment = async (payment, actor) => {
  const reservation = await paymentRepository.findReservation(payment.reservation_id);
  if (!reservation) return;
  const montantPercu = await paymentRepository.sumPaidByReservation(reservation.id);
  const couvert = montantPercu >= Number(reservation.montant);
  if (reservation.statut === 'payee' || (!HOLDING_STATUTS.includes(reservation.statut) && !couvert)) {
    return;
  }
  const now = new Date();
  const patch = {
    statut: couvert ? 'payee' : 'confirmee',
    date_expiration: null,
    mode_paiement: reservation.mode_paiement || payment.methode,
  };
  if (couvert && !reservation.date_confirmation) patch.date_confirmation = now;
  await paymentRepository.updateReservation(reservation, patch);
  await paymentRepository.createHistorique({
    reservation_id: reservation.id,
    action: `Paiement ${payment.reference} confirmé (${payment.methode}) — réservation ${patch.statut}.`,
    timestamp: now,
    utilisateur: actorName(actor),
  });
};

/* ══════════════════════════════════════════════════════════════
   Transitions de statut
   ══════════════════════════════════════════════════════════════ */

/** POST /payments/:id/confirm — confirme un paiement initié ou en attente. */
const confirm = async ({ id, actor }) => {
  const payment = await paymentRepository.findByIdFull(id);
  if (!payment) throw new ApiError(404, 'Paiement introuvable.');
  assertCanAccess(actor, payment);

  if (payment.statut === 'paye') {
    return { payment: serializePayment(payment), message: 'Paiement déjà confirmé.' };
  }
  if (!['initie', 'en_attente'].includes(payment.statut)) {
    throw new ApiError(400, `Impossible de confirmer un paiement au statut « ${payment.statut} ».`);
  }

  const now = new Date();
  await paymentRepository.updatePaiement(payment, { statut: 'paye', paiement_le: now });

  /* Paiement lié à une réservation : on fait avancer son statut. */
  if (payment.reservation_id) {
    await confirmReservationFromPayment(payment, actor);
  }

  const full = await paymentRepository.findByIdFull(id);
  await attachBalance(full);
  logger.info(`[payments] ${payment.reference} confirmé (${payment.methode})`);
  return { payment: serializePayment(full), message: 'Paiement confirmé.' };
};

/** POST /payments/:id/cancel — annule un paiement initié ou en attente. */
const cancel = async ({ id, data, actor }) => {
  const payment = await paymentRepository.findByIdFull(id);
  if (!payment) throw new ApiError(404, 'Paiement introuvable.');
  assertCanAccess(actor, payment);

  if (!['initie', 'en_attente'].includes(payment.statut)) {
    throw new ApiError(400, `Impossible d'annuler un paiement au statut « ${payment.statut} ».`);
  }

  await paymentRepository.updatePaiement(payment, { statut: 'annule', note: data.motif });
  const full = await paymentRepository.findByIdFull(id);
  logger.info(`[payments] ${payment.reference} annulé (${data.motif})`);
  return { payment: serializePayment(full), message: 'Paiement annulé.' };
};

/** POST /payments/:id/fail — marque un paiement initié ou en attente comme échoué. */
const fail = async ({ id, data, actor }) => {
  const payment = await paymentRepository.findByIdFull(id);
  if (!payment) throw new ApiError(404, 'Paiement introuvable.');
  assertCanAccess(actor, payment);

  if (!['initie', 'en_attente'].includes(payment.statut)) {
    throw new ApiError(400, `Impossible de marquer un paiement au statut « ${payment.statut} » comme échoué.`);
  }

  await paymentRepository.updatePaiement(payment, { statut: 'echoue', note: data.motif || payment.note });
  const full = await paymentRepository.findByIdFull(id);
  logger.info(`[payments] ${payment.reference} échoué`);
  return { payment: serializePayment(full), message: 'Paiement marqué comme échoué.' };
};

/** POST /payments/:id/refund — rembourse un paiement encaissé (via module Bookings). */
const refund = async ({ id, data, actor }) => {
  const payment = await paymentRepository.findByIdFull(id);
  if (!payment) throw new ApiError(404, 'Paiement introuvable.');
  assertCanAccess(actor, payment);

  if (payment.statut !== 'paye') {
    throw new ApiError(400, 'Seul un paiement encaissé peut être remboursé.');
  }
  if (!payment.reservation_id) {
    throw new ApiError(400, "Ce paiement n'est rattaché à aucune réservation remboursable.");
  }

  /* Garde anti double-remboursement : montant ≤ net déjà payé (payé − remboursé). */
  const [paid, refunded] = await Promise.all([
    paymentRepository.sumPaidByReservation(payment.reservation_id),
    paymentRepository.sumRefundedByReservation(payment.reservation_id),
  ]);
  const net = Math.max(0, paid - refunded);
  const refundAmount = Number(data.montant) || net;
  if (refundAmount > net) {
    throw new ApiError(400, `Le montant remboursé ne peut pas dépasser le total net payé (${net} FCFA).`);
  }
  if (refundAmount > Number(payment.montant)) {
    throw new ApiError(400, `Le montant remboursé ne peut pas dépasser ce paiement (${Number(payment.montant)} FCFA).`);
  }

  const result = await bookingService.refund({
    id: payment.reservation_id,
    data: { montant: refundAmount, motif: data.motif, note: data.note },
    actor,
  });

  const full = await paymentRepository.findByIdFull(id);
  await attachBalance(full);
  logger.info(`[payments] ${payment.reference} remboursé (${result.message})`);
  return { payment: serializePayment(full), message: result.message };
};

module.exports = {
  HOLDING_STATUTS,
  list,
  getById,
  receipt,
  stats,
  statistics,
  create,
  update,
  confirm,
  cancel,
  fail,
  refund,
};
