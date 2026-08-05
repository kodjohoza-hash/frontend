const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { ROLES } = require('../../../middlewares/auth');
const { paymentRepository } = require('../repositories');
const { bookingService } = require('../../bookings/services');

/** Statuts de réservation qui « retiennent » les sièges en attente de paiement. */
const HOLDING_STATUTS = ['brouillon', 'en_attente'];

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
    if (payment.reservation?.agence_id !== actor.agenceId) {
      throw new ApiError(403, 'Accès refusé : paiement hors de votre agence.');
    }
    return;
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
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
    montant: Number(p.montant) || 0,
    frais: Number(p.frais) || 0,
    devise: p.devise || 'XAF',
    methode: p.methode,
    statut: p.statut,
    creeLe: p.cree_le,
    paiementLe: p.paiement_le,
    remboursement: p.remboursement ? Number(p.remboursement) : null,
    motifRemboursement: p.motif_remboursement,
    note: p.note,
    metadata: p.metadata,
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

/** GET /payments/stats — KPIs tableau de bord (synthèse + répartitions). */
const stats = async ({ actor, query }) => {
  const scope = await resolveScope(actor);
  const filters = { ...query };

  const [synthèse, parStatut, parMethode, parJour, parAgence] = await Promise.all([
    paymentRepository.summary({ filters, scope }),
    paymentRepository.byStatus({ filters, scope }),
    paymentRepository.byMethod({ filters, scope }),
    paymentRepository.byDay({ filters, scope }),
    paymentRepository.byAgency({ filters, scope }),
  ]);

  return {
    ...synthèse,
    parStatut,
    parMethode,
    parJour,
    parAgence,
  };
};

/* ══════════════════════════════════════════════════════════════
   Transitions de statut
   ══════════════════════════════════════════════════════════════ */

/** POST /payments/:id/confirm — confirme un paiement en attente. */
const confirm = async ({ id, actor }) => {
  const payment = await paymentRepository.findByIdFull(id);
  if (!payment) throw new ApiError(404, 'Paiement introuvable.');
  assertCanAccess(actor, payment);

  if (payment.statut === 'paye') {
    return { payment: serializePayment(payment), message: 'Paiement déjà confirmé.' };
  }
  if (payment.statut !== 'en_attente') {
    throw new ApiError(400, `Impossible de confirmer un paiement au statut « ${payment.statut} ».`);
  }

  const now = new Date();
  await paymentRepository.updatePaiement(payment, { statut: 'paye', paiement_le: now });

  /* Paiement lié à une réservation : on fait avancer son statut. */
  if (payment.reservation_id) {
    const reservation = await paymentRepository.findReservation(payment.reservation_id);
    if (reservation && HOLDING_STATUTS.includes(reservation.statut)) {
      const montantPercu = await paymentRepository.sumPaidByReservation(reservation.id);
      const couvert = montantPercu >= Number(reservation.montant);
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
    }
  }

  const full = await paymentRepository.findByIdFull(id);
  logger.info(`[payments] ${payment.reference} confirmé (${payment.methode})`);
  return { payment: serializePayment(full), message: 'Paiement confirmé.' };
};

/** POST /payments/:id/cancel — annule un paiement en attente. */
const cancel = async ({ id, data, actor }) => {
  const payment = await paymentRepository.findByIdFull(id);
  if (!payment) throw new ApiError(404, 'Paiement introuvable.');
  assertCanAccess(actor, payment);

  if (payment.statut !== 'en_attente') {
    throw new ApiError(400, `Impossible d'annuler un paiement au statut « ${payment.statut} ».`);
  }

  await paymentRepository.updatePaiement(payment, { statut: 'annule', note: data.motif });
  const full = await paymentRepository.findByIdFull(id);
  logger.info(`[payments] ${payment.reference} annulé (${data.motif})`);
  return { payment: serializePayment(full), message: 'Paiement annulé.' };
};

/** POST /payments/:id/fail — marque un paiement en attente comme échoué. */
const fail = async ({ id, data, actor }) => {
  const payment = await paymentRepository.findByIdFull(id);
  if (!payment) throw new ApiError(404, 'Paiement introuvable.');
  assertCanAccess(actor, payment);

  if (payment.statut !== 'en_attente') {
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

  const result = await bookingService.refund({
    id: payment.reservation_id,
    data: { montant: data.montant, motif: data.motif, note: data.note },
    actor,
  });

  logger.info(`[payments] ${payment.reference} remboursé (${result.message})`);
  return { payment: serializePayment(payment), message: result.message };
};

module.exports = {
  HOLDING_STATUTS,
  list,
  getById,
  receipt,
  stats,
  confirm,
  cancel,
  fail,
  refund,
};
