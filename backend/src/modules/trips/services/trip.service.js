const { sequelize, Bus, Trajet, Compagnie, Agence, Agent, Chauffeur } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { ROLES } = require('../../../middlewares/auth');
const { tripRepository } = require('../repositories');
const { STATUT_ALIASES, normalizeStatus } = require('../validators');

/** Tous les prix sont exprimés en XAF (entiers). AUCUN XOF. */
const CURRENCY = 'XAF';

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Génère un identifiant voyage CHAR(10) unique (ex: VYG0000001). */
const generateTripId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `VYG${String(Math.floor(Math.random() * 10 ** 7)).padStart(7, '0')}`;
    if (!(await tripRepository.findByPk(id))) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant voyage unique.');
};

/** Normalise une date (Date JS ou « YYYY-MM-DD ») en « YYYY-MM-DD ». */
const toYmd = (input) => {
  if (input instanceof Date) {
    return `${input.getFullYear()}-${String(input.getMonth() + 1).padStart(2, '0')}-${String(input.getDate()).padStart(2, '0')}`;
  }
  return String(input).slice(0, 10);
};

/** Génère un code lisible unique (ex: VYG-20260807-AB12). */
const generateTripCode = async (date) => {
  const ymd = toYmd(date || todayIso()).replace(/-/g, '');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 6; i += 1) {
    let rnd = '';
    for (let j = 0; j < 4; j += 1) rnd += chars[Math.floor(Math.random() * chars.length)];
    const code = `VYG-${ymd}-${rnd}`;
    if (!(await tripRepository.findByCode(code))) return code;
  }
  throw new ApiError(500, 'Impossible de générer un code voyage unique.');
};

/** « HH:MM(:SS) » → minutes. */
const timeToMinutes = (t) => {
  const parts = String(t).split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
};

/** Périmètre d'accès selon le rôle de l'acteur. */
const resolveScope = async (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) return { compagnieId: null, agenceId: null };
  if (actor.role === ROLES.COMPANY_ADMIN) return { compagnieId: actor.compagnieId, agenceId: null };
  if (actor.role === ROLES.COUNTER_AGENT) return { compagnieId: null, agenceId: actor.agenceId };
  throw new ApiError(403, 'Accès refusé : gestion des voyages non autorisée.');
};

/** Vérifie que l'acteur peut gérer le voyage cible. */
const assertCanManage = (actor, depart) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.COMPANY_ADMIN) {
    if (depart.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : voyage hors de votre compagnie.');
    }
    return;
  }
  if (actor.role === ROLES.COUNTER_AGENT) {
    if (depart.agence_id !== actor.agenceId) {
      throw new ApiError(403, 'Accès refusé : voyage hors de votre agence.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé : gestion des voyages non autorisée.');
};

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializeAgentRef = (a) => (a
  ? { id: a.id, name: [a.prenom, a.nom].filter(Boolean).join(' ').trim(), matricule: a.matricule ?? null }
  : null);

const serializeBusRef = (b) => (b
  ? {
      id: b.id,
      plate: b.immatriculation ?? null,
      internalNumber: b.interne ?? null,
      model: b.modele ?? null,
      brand: b.marque ?? null,
      type: b.type_bus ?? null,
      classe: b.classe ?? null,
      capacity: Number(b.capacite) || 0,
      status: b.statut ?? null,
    }
  : null);

const serializeCompanyRef = (c) => (c
  ? { id: c.id, name: c.nom, color: c.couleur ?? null, logo: c.logo ?? null, status: c.statut ?? null }
  : null);

const serializeRouteRef = (t) => {
  if (!t) return null;
  const villeDepart = t.villeDepart;
  const villeArrivee = t.villeArrivee;
  return {
    id: t.id,
    code: t.code ?? null,
    name: t.nom ?? null,
    departureCityId: t.ville_depart_id ?? null,
    arrivalCityId: t.ville_arrivee_id ?? null,
    departureCity: villeDepart?.nom ?? null,
    arrivalCity: villeArrivee?.nom ?? null,
  };
};

/** Sérialise un voyage (instance ORM) avec disponibilité réelle fournie. */
const serializeTrip = (d, occupied = 0) => {
  if (!d) return null;
  const occupiedSeats = Number(occupied) || 0;
  const totalSeats = Number(d.places_total) || 0;
  const availableSeats = Math.max(0, totalSeats - occupiedSeats);
  const trajet = d.trajet;

  return {
    id: d.id,
    code: d.code ?? null,
    routeId: trajet?.id ?? d.trajet_id,
    route: serializeRouteRef(trajet),
    companyId: d.compagnie_id ?? null,
    company: serializeCompanyRef(d.compagnie),
    agencyId: d.agence_id ?? null,
    agency: d.agence ? { id: d.agence.id, name: d.agence.nom } : null,
    busId: d.bus_id ?? null,
    bus: serializeBusRef(d.bus),
    driverId: d.chauffeur_id ?? null,
    driver: serializeAgentRef(d.chauffeur),
    substituteDriverId: d.chauffeur_remplacant_id ?? null,
    substituteDriver: serializeAgentRef(d.chauffeurRemplacant),
    date: d.date_depart ?? null,
    arrivalDate: d.date_arrivee ?? null,
    departureTime: d.heure_depart ?? null,
    arrivalTime: d.heure_arrivee ?? null,
    price: Number(d.prix_base) || 0,
    currency: CURRENCY,
    totalSeats,
    occupiedSeats,
    availableSeats,
    storedAvailableSeats: Number(d.places_dispo) || 0,
    quai: d.quai ?? null,
    observations: d.observations ?? null,
    status: d.statut ?? 'programme',
    createdAt: d.date_creation ?? null,
    updatedAt: d.date_modification ?? null,
  };
};

/** Sérialise une ligne de la recherche publique (requête SQL brute). */
const serializePublicRow = (r) => ({
  id: r.id,
  code: r.code ?? null,
  routeId: r.trajet_id,
  route: {
    id: r.trajet_id,
    code: r.trajet_code ?? null,
    name: r.trajet_nom ?? null,
    departureCityId: r.ville_depart_id ?? null,
    arrivalCityId: r.ville_arrivee_id ?? null,
    departureCity: r.ville_depart_nom ?? null,
    arrivalCity: r.ville_arrivee_nom ?? null,
  },
  companyId: r.compagnie_id ?? null,
  company: {
    id: r.compagnie_id ?? null,
    name: r.compagnie_nom ?? null,
    color: r.compagnie_couleur ?? null,
    logo: r.compagnie_logo ?? null,
  },
  agencyId: r.agence_id ?? null,
  agency: r.agence_nom ? { id: r.agence_id, name: r.agence_nom } : null,
  busId: r.bus_id ?? null,
  bus: {
    id: r.bus_id ?? null,
    plate: r.bus_immatriculation ?? null,
    internalNumber: r.bus_interne ?? null,
    model: r.bus_modele ?? null,
    brand: r.bus_marque ?? null,
    type: r.type_bus ?? null,
    classe: r.classe ?? null,
    capacity: Number(r.capacite) || 0,
  },
  driverId: r.chauffeur_id ?? null,
  substituteDriverId: r.chauffeur_remplacant_id ?? null,
  date: r.date_depart ?? null,
  arrivalDate: r.date_arrivee ?? null,
  departureTime: r.heure_depart ?? null,
  arrivalTime: r.heure_arrivee ?? null,
  price: Number(r.prix_base) || 0,
  currency: CURRENCY,
  totalSeats: Number(r.places_total) || 0,
  occupiedSeats: Number(r.occupees) || 0,
  availableSeats: Math.max(0, (Number(r.places_total) || 0) - (Number(r.occupees) || 0)),
  storedAvailableSeats: Number(r.places_dispo) || 0,
  quai: r.quai ?? null,
  observations: r.observations ?? null,
  status: r.statut ?? 'programme',
  createdAt: r.date_creation ?? null,
  updatedAt: r.date_modification ?? null,
});

/* ══════════════════════════════════════════════════════════════
   Règles métier (validations métier partagées)
   ══════════════════════════════════════════════════════════════ */

/** Vérifie qu'un itinéraire existe et est actif. */
const assertRouteValid = async (routeId) => {
  const route = await Trajet.findByPk(routeId);
  if (!route) throw new ApiError(400, "L'itinéraire est introuvable.");
  if (route.statut !== 'active') {
    throw new ApiError(400, "L'itinéraire sélectionné n'est pas actif.");
  }
  return route;
};

/** Vérifie qu'un bus existe, est disponible et appartient à la compagnie. */
const assertBusValid = async (busId, compagnieId) => {
  const bus = await Bus.findByPk(busId);
  if (!bus) throw new ApiError(400, 'Le bus est introuvable.');
  if (bus.compagnie_id !== compagnieId) {
    throw new ApiError(400, 'Le bus sélectionné n\'appartient pas à la compagnie du voyage.');
  }
  if (bus.statut !== 'available') {
    throw new ApiError(409, `Le bus est indisponible (statut « ${bus.statut} »). Choisissez un bus disponible ou maintenez son statut « available ».`);
  }
  if (!Number(bus.capacite) || Number(bus.capacite) <= 0) {
    throw new ApiError(400, 'Le bus sélectionné a une capacité invalide.');
  }
  return bus;
};

/** Vérifie qu'une compagnie est active (opérationnelle). */
const assertCompanyActive = async (compagnieId) => {
  const compagnie = await Compagnie.findByPk(compagnieId);
  if (!compagnie) throw new ApiError(400, 'La compagnie est introuvable.');
  if (compagnie.statut !== 'actif' || !compagnie.actif) {
    throw new ApiError(409, 'La compagnie n\'est pas active : impossible de créer ou de publier un voyage.');
  }
  return compagnie;
};

/** Vérifie qu'une agence existe et appartient à la compagnie. */
const assertAgencyValid = async (agenceId, compagnieId) => {
  if (!agenceId) return null;
  const agence = await Agence.findByPk(agenceId);
  if (!agence) throw new ApiError(400, "L'agence de départ est introuvable.");
  if (agence.compagnie_id !== compagnieId) {
    throw new ApiError(400, "L'agence sélectionnée n'appartient pas à la compagnie du voyage.");
  }
  return agence;
};

/** Vérifie qu'un chauffeur existe, est actif et rattaché à la compagnie. */
const assertDriverValid = async (driverId, compagnieId) => {
  if (!driverId) return null;
  const agent = await Agent.findByPk(driverId, { include: [{ model: Chauffeur, as: 'chauffeurProfile' }] });
  if (!agent) throw new ApiError(400, 'Le chauffeur est introuvable.');
  if (agent.role !== 'chauffeur' && !agent.chauffeurProfile) {
    throw new ApiError(400, "L'agent sélectionné n'est pas un chauffeur.");
  }
  if (agent.statut !== 'actif') {
    throw new ApiError(400, 'Le chauffeur sélectionné est inactif.');
  }
  const agence = await Agence.findByPk(agent.agence_id);
  if (!agence || agence.compagnie_id !== compagnieId) {
    throw new ApiError(400, 'Le chauffeur sélectionné n\'appartient pas à la compagnie du voyage.');
  }
  return agent;
};

/** Vérifie la cohérence date/heure (pas de départ passé, arrivée après départ). */
const assertDateTimeValid = ({ date, arrivalDate, departureTime, arrivalTime }) => {
  if (date < todayIso()) {
    throw new ApiError(400, 'La date de départ ne peut pas être dans le passé.');
  }
  const depMin = timeToMinutes(departureTime);
  const arrMin = timeToMinutes(arrivalTime);
  const overnight = arrivalDate && arrivalDate > date;
  if (!overnight && arrMin <= depMin) {
    throw new ApiError(400, "L'heure d'arrivée doit être postérieure à l'heure de départ (ou renseigner une date d'arrivée au lendemain).");
  }
};

/** Vérifie qu'il n'y a pas de conflit d'horaires bus / chauffeur. */
const assertNoOverlap = async ({ busId, driverId, substituteDriverId, date, arrivalDate, departureTime, arrivalTime, excludeId }) => {
  const depMin = timeToMinutes(departureTime);
  const arrMin = timeToMinutes(arrivalTime);
  const overnight = Boolean(arrivalDate && arrivalDate > date);

  const busConflicts = await tripRepository.findOverlappingBus({ busId, date, depMinutes: depMin, arrMinutes: arrMin, overnight, excludeId });
  if (busConflicts.length) {
    throw new ApiError(409, `Le bus est déjà affecté à un autre voyage le ${date} (${busConflicts.map((c) => c.id).join(', ')}).`);
  }
  if (driverId) {
    const driverConflicts = await tripRepository.findOverlappingDriver({ driverId, date, depMinutes: depMin, arrMinutes: arrMin, overnight, excludeId });
    if (driverConflicts.length) {
      throw new ApiError(409, `Le chauffeur est déjà affecté à un autre voyage le ${date} (${driverConflicts.map((c) => c.id).join(', ')}).`);
    }
  }
  if (substituteDriverId && substituteDriverId !== driverId) {
    const subConflicts = await tripRepository.findOverlappingDriver({ driverId: substituteDriverId, date, depMinutes: depMin, arrMinutes: arrMin, overnight, excludeId });
    if (subConflicts.length) {
      throw new ApiError(409, `Le chauffeur remplaçant est déjà affecté à un autre voyage le ${date} (${subConflicts.map((c) => c.id).join(', ')}).`);
    }
  }
};

/* ══════════════════════════════════════════════════════════════
   Liste (admin) & recherche publique
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = await resolveScope(actor);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  const filters = { ...query };
  if (filters.statut) filters.statut = normalizeStatus(filters.statut);

  const where = tripRepository.buildWhere(filters, scope);
  const { rows, count } = await tripRepository.findPage({ where, page, limit, sort: query.sort });
  const occupied = await tripRepository.batchAvailability(rows.map((r) => r.id));

  return {
    items: rows.map((r) => serializeTrip(r, occupied.get(r.id) || 0)),
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

/** Recherche publique des voyages réservables (sans authentification requise). */
const searchPublic = async ({ query }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  const filters = { ...query };
  if (filters.statut) filters.statut = normalizeStatus(filters.statut);

  const { rows, total } = await tripRepository.publicSearch({ filters, page, limit });
  return {
    items: rows.map(serializePublicRow),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getById = async ({ id, actor }) => {
  const depart = await tripRepository.findByIdFull(id);
  if (!depart) throw new ApiError(404, 'Voyage introuvable.');

  /* Route publique : uniquement les voyages réservables. */
  if (!actor || actor.role === ROLES.CLIENT) {
    if (!['programme', 'embarquement'].includes(depart.statut)) {
      throw new ApiError(404, 'Voyage introuvable.');
    }
    if (depart.date_depart < todayIso()) {
      throw new ApiError(404, 'Voyage introuvable.');
    }
  } else {
    assertCanManage(actor, depart);
  }

  const occupied = await tripRepository.availabilityFor(depart.id);
  return serializeTrip(depart, occupied);
};

const stats = async ({ actor }) => {
  const scope = await resolveScope(actor);
  return tripRepository.stats(scope);
};

/* ══════════════════════════════════════════════════════════════
   Création
   ══════════════════════════════════════════════════════════════ */

const create = async ({ data, actor }) => {
  const scope = await resolveScope(actor);

  /* Compagnie du voyage : scope company_admin, sinon bus (ou fournie pour super_admin). */
  let compagnieId;
  if (actor.role === ROLES.COMPANY_ADMIN) {
    compagnieId = scope.compagnieId;
  } else if (actor.role === ROLES.SUPER_ADMIN) {
    const route = await Trajet.findByPk(data.routeId);
    const fallback = route?.compagnie_id || null;
    compagnieId = data.companyId || fallback;
  } else {
    throw new ApiError(403, 'Accès refusé : création de voyage non autorisée.');
  }
  if (!compagnieId) {
    throw new ApiError(400, 'La compagnie du voyage est introuvable. Renseignez companyId ou rattachez l\'itinéraire à une compagnie.');
  }

  const route = await assertRouteValid(data.routeId);
  await assertCompanyActive(compagnieId);
  const bus = await assertBusValid(data.busId, compagnieId);
  const agence = await assertAgencyValid(data.agencyId, compagnieId);
  const driver = await assertDriverValid(data.driverId, compagnieId);
  if (data.substituteDriverId) await assertDriverValid(data.substituteDriverId, compagnieId);
  assertDateTimeValid({
    date: data.date,
    arrivalDate: data.arrivalDate || null,
    departureTime: data.departureTime,
    arrivalTime: data.arrivalTime,
  });
  await assertNoOverlap({
    busId: bus.id,
    driverId: driver?.id || null,
    substituteDriverId: data.substituteDriverId || null,
    date: data.date,
    arrivalDate: data.arrivalDate || null,
    departureTime: data.departureTime,
    arrivalTime: data.arrivalTime,
    excludeId: null,
  });

  if (data.code) {
    const existing = await tripRepository.findByCode(data.code.trim());
    if (existing) throw new ApiError(409, `Le code « ${data.code} » est déjà utilisé.`);
  }

  const statut = normalizeStatus(data.status || 'programme');
  const capacity = Number(bus.capacite);
  const id = await generateTripId();
  const code = data.code ? data.code.trim() : await generateTripCode(data.date);

  const depart = await tripRepository.createDepart({
    id,
    code,
    trajet_id: route.id,
    compagnie_id: compagnieId,
    agence_id: agence ? agence.id : null,
    bus_id: bus.id,
    chauffeur_id: driver ? driver.id : null,
    chauffeur_remplacant_id: data.substituteDriverId || null,
    date_depart: data.date,
    date_arrivee: data.arrivalDate || null,
    heure_depart: data.departureTime,
    heure_arrivee: data.arrivalTime,
    prix_base: Number(data.price),
    places_total: capacity,
    places_dispo: capacity,
    quai: data.quai || null,
    observations: data.observations || null,
    statut,
  });

  logger.info(`[trips] Voyage créé : ${depart.id} (${code}) ${data.date} ${data.departureTime} — ${data.price} ${CURRENCY}`);
  return getById({ id: depart.id, actor });
};

/* ══════════════════════════════════════════════════════════════
   Mise à jour
   ══════════════════════════════════════════════════════════════ */

const update = async ({ id, data, actor }) => {
  const depart = await tripRepository.findByPk(id);
  if (!depart) throw new ApiError(404, 'Voyage introuvable.');
  assertCanManage(actor, depart);

  if (depart.statut === 'termine' || depart.statut === 'annule') {
    throw new ApiError(400, `Impossible de modifier un voyage au statut « ${depart.statut} ».`);
  }

  const patch = {};
  const reservations = await tripRepository.countReservations(id);
  const occupied = await tripRepository.availabilityFor(id);

  /* Périmètre : la compagnie d'un voyage n'est modifiable que par super_admin. */
  let compagnieId = depart.compagnie_id;
  if (data.companyId !== undefined) {
    if (actor.role !== ROLES.SUPER_ADMIN) {
      throw new ApiError(403, 'Accès refusé : seuls les super admins peuvent changer la compagnie du voyage.');
    }
    compagnieId = data.companyId || null;
    await assertCompanyActive(compagnieId);
    patch.compagnie_id = compagnieId;
  }

  /* Itinéraire. */
  if (data.routeId !== undefined) {
    const route = await assertRouteValid(data.routeId);
    patch.trajet_id = route.id;
  }

  /* Bus : interdit si des réservations existent déjà. */
  if (data.busId !== undefined) {
    if (reservations > 0) {
      throw new ApiError(409, 'Impossible de changer le bus : ce voyage est déjà utilisé par des réservations.');
    }
    const bus = await assertBusValid(data.busId, compagnieId);
    patch.bus_id = bus.id;
    patch.places_total = Number(bus.capacite);
    patch.places_dispo = Math.max(0, Number(bus.capacite) - occupied);
  }

  /* Agence. */
  if (data.agencyId !== undefined) {
    const agence = await assertAgencyValid(data.agencyId, compagnieId);
    patch.agence_id = agence ? agence.id : null;
  }

  /* Chauffeurs. */
  if (data.driverId !== undefined) {
    const driver = await assertDriverValid(data.driverId, compagnieId);
    patch.chauffeur_id = driver ? driver.id : null;
  }
  if (data.substituteDriverId !== undefined) {
    if (data.substituteDriverId) await assertDriverValid(data.substituteDriverId, compagnieId);
    patch.chauffeur_remplacant_id = data.substituteDriverId || null;
  }

  /* Code. */
  if (data.code !== undefined) {
    if (data.code) {
      const existing = await tripRepository.findByCode(data.code.trim());
      if (existing && existing.id !== id) {
        throw new ApiError(409, `Le code « ${data.code} » est déjà utilisé.`);
      }
      patch.code = data.code.trim();
    } else {
      patch.code = null;
    }
  }

  /* Dates / heures. */
  const date = data.date !== undefined ? data.date : depart.date_depart;
  const arrivalDate = data.arrivalDate !== undefined ? data.arrivalDate : depart.date_arrivee;
  const departureTime = data.departureTime !== undefined ? data.departureTime : depart.heure_depart;
  const arrivalTime = data.arrivalTime !== undefined ? data.arrivalTime : depart.heure_arrivee;

  if (data.date !== undefined) patch.date_depart = date;
  if (data.arrivalDate !== undefined) patch.date_arrivee = arrivalDate;
  if (data.departureTime !== undefined) patch.heure_depart = departureTime;
  if (data.arrivalTime !== undefined) patch.heure_arrivee = arrivalTime;

  const dateChanged = data.date !== undefined || data.arrivalDate !== undefined
    || data.departureTime !== undefined || data.arrivalTime !== undefined;

  if (dateChanged) {
    assertDateTimeValid({ date, arrivalDate, departureTime, arrivalTime });
    const effectiveBusId = patch.bus_id || depart.bus_id;
    await assertNoOverlap({
      busId: effectiveBusId,
      driverId: patch.chauffeur_id !== undefined ? patch.chauffeur_id : depart.chauffeur_id,
      substituteDriverId: patch.chauffeur_remplacant_id !== undefined ? patch.chauffeur_remplacant_id : depart.chauffeur_remplacant_id,
      date,
      arrivalDate,
      departureTime,
      arrivalTime,
      excludeId: id,
    });
  }

  /* Prix (XAF). */
  if (data.price !== undefined) patch.prix_base = Number(data.price);

  /* Divers. */
  if (data.quai !== undefined) patch.quai = data.quai || null;
  if (data.observations !== undefined) patch.observations = data.observations || null;
  if (data.status !== undefined) patch.statut = normalizeStatus(data.status);

  if (Object.keys(patch).length) {
    await tripRepository.updateDepart(depart, { ...patch, date_modification: new Date() });
  }

  logger.info(`[trips] Voyage mis à jour : ${id}`);
  return getById({ id, actor });
};

/* ══════════════════════════════════════════════════════════════
   Changement de statut
   ══════════════════════════════════════════════════════════════ */

/** Transitions autorisées entre statuts (départ → destinations). */
const TRANSITIONS = {
  programme: ['embarquement', 'en_cours', 'retarde', 'annule'],
  embarquement: ['en_cours', 'retarde', 'annule'],
  en_cours: ['termine', 'annule'],
  retarde: ['programme', 'embarquement', 'en_cours', 'annule'],
  termine: [],
  annule: [],
};

const updateStatus = async ({ id, statut, raison, actor }) => {
  const depart = await tripRepository.findByPk(id);
  if (!depart) throw new ApiError(404, 'Voyage introuvable.');
  assertCanManage(actor, depart);

  const next = normalizeStatus(statut);
  if (depart.statut === next) {
    return { trip: await getById({ id, actor }), message: 'Aucun changement de statut.' };
  }

  const allowed = TRANSITIONS[depart.statut] || [];
  if (!allowed.includes(next)) {
    throw new ApiError(409, `Transition de statut impossible : « ${depart.statut} » → « ${next} ».`);
  }

  await tripRepository.updateDepart(depart, { statut: next, date_modification: new Date() });
  if (raison) logger.info(`[trips] ${id} statut → ${next} : ${raison}`);

  return {
    trip: await getById({ id, actor }),
    message: `Statut du voyage mis à jour : ${next}.`,
  };
};

/* ══════════════════════════════════════════════════════════════
   Suppression (protégée)
   ══════════════════════════════════════════════════════════════ */

const remove = async ({ id, actor }) => {
  const depart = await tripRepository.findByPk(id);
  if (!depart) throw new ApiError(404, 'Voyage introuvable.');
  assertCanManage(actor, depart);

  /* Un voyage utilisé par des réservations ne se supprime JAMAIS : on l'annule. */
  const reservations = await tripRepository.countReservations(id);
  if (reservations > 0) {
    throw new ApiError(
      409,
      `Ce voyage est utilisé par ${reservations} réservation(s) : il ne peut pas être supprimé. Utilisez PATCH /trips/:id/status (annule) pour l'annuler.`
    );
  }

  if (depart.statut === 'termine' || depart.statut === 'annule') {
    return { id, message: `Voyage déjà « ${depart.statut} ».` };
  }

  try {
    await sequelize.transaction(async (t) => {
      await tripRepository.destroyDepart(depart, { transaction: t });
    });
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      /* Référencé par billet/alerte/notification sans réservation : annulation douce. */
      await tripRepository.updateDepart(depart, { statut: 'annule', date_modification: new Date() });
      return { id, message: 'Voyage annulé (références existantes, suppression impossible).' };
    }
    throw err;
  }

  logger.info(`[trips] Voyage supprimé : ${id}`);
  return { id, message: 'Voyage supprimé.' };
};

module.exports = {
  CURRENCY,
  TRANSITIONS,
  list,
  searchPublic,
  getById,
  stats,
  create,
  update,
  updateStatus,
  remove,
};
