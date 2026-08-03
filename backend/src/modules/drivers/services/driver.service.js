const crypto = require('crypto');
const { sequelize, Agent, Agence, Bus } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { ROLES } = require('../../../middlewares/auth');
const { driverRepository } = require('../repositories');
const fileService = require('./file.service');

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Génère un identifiant agent CHAR(10) unique (ex: DRV0000001). */
const generateId = async () => {
  for (let i = 0; i < 5; i += 1) {
    const id = `DRV${String(Math.floor(Math.random() * 10 ** 7)).padStart(7, '0')}`;
    const exists = await driverRepository.findById(id);
    if (!exists) return id;
  }
  throw new ApiError(500, "Impossible de générer un identifiant chauffeur unique.");
};

/** Génère un matricule unique (CHF-XXXXXXXX). */
const generateMatricule = async () => {
  for (let i = 0; i < 5; i += 1) {
    const matricule = `CHF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const exists = await driverRepository.findByMatricule(matricule);
    if (!exists) return matricule;
  }
  throw new ApiError(500, 'Impossible de générer un matricule unique.');
};

/** Génère un identifiant CHAR(10) unique pour les sous-ressources. */
const generateSubId = async (prefix, finder) => {
  for (let i = 0; i < 6; i += 1) {
    const id = `${prefix}${String(Math.floor(Math.random() * 10 ** (10 - prefix.length))).padStart(10 - prefix.length, '0')}`;
    const exists = await finder(id);
    if (!exists) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant unique.');
};

const generateDocumentId = () => generateSubId('DOC', (id) => driverRepository.findDocument(id));
const generateIncidentId = () => generateSubId('INC', (id) => driverRepository.findIncident(id));
const generateAffectationId = () => generateSubId('AFF', async (id) => {
  const [rows] = await sequelize.query('SELECT id FROM chauffeur_affectation WHERE id = :id LIMIT 1', {
    replacements: { id },
  });
  return rows.length > 0;
});

/** Périmètre d'accès selon le rôle de l'acteur. */
const resolveScope = async (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) {
    return { agenceIds: null, compagnieId: null };
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    const agenceIds = await driverRepository.agenceIdsOfCompany(actor.compagnieId);
    return { agenceIds, compagnieId: actor.compagnieId };
  }
  throw new ApiError(403, 'Accès refusé : gestion des chauffeurs non autorisée.');
};

/** Vérifie que l'acteur peut gérer le chauffeur cible. */
const assertCanManage = (actor, target) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.COMPANY_ADMIN) {
    const targetCompany = target.agence?.compagnie_id ?? null;
    if (targetCompany !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : chauffeur hors de votre compagnie.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé : gestion des chauffeurs non autorisée.');
};

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializeBusRef = (b) => {
  if (!b) return null;
  return {
    id: b.id,
    plate: b.immatriculation ?? null,
    internalNumber: b.interne ?? null,
    model: b.modele ?? null,
    companyName: b.compagnie?.nom ?? null,
  };
};

const serializeIncident = (i) => ({
  id: i.id,
  driverId: i.chauffeur_id,
  type: i.type,
  date: i.date,
  description: i.description ?? null,
  severity: i.severite,
  resolved: Boolean(i.resolu),
});

const serializeDocument = (d) => ({
  id: d.id,
  driverId: d.chauffeur_id,
  type: d.type,
  url: d.url,
  notes: d.notes ?? null,
});

const serializeAffectation = (a) => ({
  id: a.id,
  driverId: a.chauffeur_id,
  busId: a.bus_id,
  bus: serializeBusRef(a.bus),
  startDate: a.date_debut ?? null,
  endDate: a.date_fin ?? null,
  notes: a.notes ?? null,
});

const serializeTrip = (t) => {
  if (!t) return null;
  return {
    id: t.id,
    trajetId: t.trajet_id,
    busId: t.bus_id,
    busPlate: t.bus_plate ?? null,
    busInternalNumber: t.bus_interne ?? null,
    busModel: t.bus_modele ?? null,
    date: t.date_depart,
    departureTime: t.heure_depart,
    arrivalTime: t.heure_arrivee,
    from: t.ville_depart ?? null,
    to: t.ville_arrivee ?? null,
    status: t.depart_statut,
    price: Number(t.prix_base) || 0,
    availableSeats: Number(t.places_dispo) || 0,
    totalSeats: Number(t.places_total) || 0,
  };
};

/** Sérialise un chauffeur (agent + profil + agence/compagnie + bus actuel). */
const serializeDriver = (d, extras = {}) => {
  const profile = d.chauffeurProfile || {};
  const agence = d.agence || null;
  const compagnie = agence?.compagnie || null;
  const currentBus = (d.busesConduites || [])[0] || null;
  return {
    id: d.id,
    matricule: d.matricule,
    firstName: d.prenom,
    lastName: d.nom,
    phone: d.telephone,
    email: d.email,
    address: d.adresse ?? null,
    city: profile.ville ?? null,
    country: profile.pays ?? null,
    dateOfBirth: d.date_naissance ?? null,
    gender: d.genre ?? null,
    nationality: d.nationalite ?? null,
    photoUrl: d.photo ?? null,
    hireDate: d.date_embauche ?? null,
    observations: profile.observations ?? null,
    experience: Number(profile.annees_experience) || 0,
    licenseNumber: profile.permis_numero ?? null,
    licenseCategory: profile.permis_categorie ?? null,
    licenseObtained: profile.permis_obtention ?? null,
    licenseExpiry: profile.permis_expiration ?? null,
    status: profile.statut || 'available',
    agenceId: d.agence_id,
    agenceName: agence?.nom ?? null,
    compagnieId: compagnie?.id ?? null,
    companyName: compagnie?.nom ?? null,
    assignedBus: currentBus ? currentBus.id : null,
    currentBus: serializeBusRef(currentBus),
    ...extras,
  };
};

const buildPerformance = (departStats, incidentCount, hireDate) => {
  const years = hireDate
    ? Math.max(0, Math.floor((Date.now() - new Date(`${hireDate}T00:00:00`).getTime()) / 31557600000))
    : 0;
  return {
    totalTrips: Number(departStats?.voyages) || 0,
    totalKm: Number(departStats?.total_km) || 0,
    punctuality: 0,
    satisfaction: 0,
    incidents: incidentCount || 0,
    yearsService: years,
  };
};

/* ══════════════════════════════════════════════════════════════
   Liste / détail
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = await resolveScope(actor);
  const where = driverRepository.buildWhere(query, scope);

  const { rows, count } = await driverRepository.findPage({
    where,
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });

  /* Voyages actifs en lot (évite le N+1). */
  const activeTrips = await driverRepository.activeDepartsForDrivers(rows.map((r) => r.id));
  const tripByDriver = new Map();
  activeTrips.forEach((t) => {
    if (!tripByDriver.has(t.chauffeur_id)) tripByDriver.set(t.chauffeur_id, t);
  });

  const items = rows.map((r) => {
    const trip = tripByDriver.get(r.id) || null;
    return serializeDriver(r, {
      currentTrip: serializeTrip(trip),
      currentTripId: trip ? trip.id : null,
      currentTripLabel: trip
        ? `${trip.ville_depart || '—'} → ${trip.ville_arrivee || '—'} · ${trip.date_depart}`
        : null,
    });
  });

  return {
    items,
    total: count,
    page: query.page,
    limit: query.limit,
    totalPages: Math.max(1, Math.ceil(count / query.limit)),
  };
};

const getById = async ({ id, actor }) => {
  const target = await driverRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);

  const [departStats, activeTrip, voyageRows, affectationRows, incidentRows, documentRows] = await Promise.all([
    driverRepository.departStatsForDriver(target.id),
    driverRepository.activeDepart(target.id),
    driverRepository.listVoyages(target.id),
    driverRepository.listAffectations(target.id),
    driverRepository.listIncidents(target.id),
    driverRepository.listDocuments(target.id),
  ]);

  return serializeDriver(target, {
    currentTrip: serializeTrip(activeTrip),
    currentTripId: activeTrip ? activeTrip.id : null,
    voyages: voyageRows.map(serializeTrip),
    affectations: affectationRows.map(serializeAffectation),
    incidents: incidentRows.map(serializeIncident),
    documents: documentRows.map(serializeDocument),
    performance: buildPerformance(departStats, incidentRows.length, target.date_embauche),
  });
};

/* ══════════════════════════════════════════════════════════════
   Création
   ══════════════════════════════════════════════════════════════ */

/** Valide l'agence du chauffeur selon le rôle de l'acteur. */
const resolveAgence = async (data, actor) => {
  let agenceId = data.agenceId || (actor.role === ROLES.COMPANY_ADMIN ? actor.agenceId : null);
  if (!agenceId) throw new ApiError(400, 'Une agence est requise (champ `agenceId`).');

  const agence = await Agence.findByPk(agenceId);
  if (!agence) throw new ApiError(400, 'Agence inconnue.');

  if (actor.role === ROLES.COMPANY_ADMIN && agence.compagnie_id !== actor.compagnieId) {
    throw new ApiError(400, 'Agence invalide : hors de votre compagnie.');
  }
  return { agenceId, compagnieId: agence.compagnie_id };
};

/** Affecte (ou libère) le bus par défaut d'un chauffeur + journal d'affectation. */
const assignBus = async ({ chauffeurId, busId, compagnieId, t }) => {
  /* Ferme toutes les affectations ouvertes du chauffeur. */
  const open = await driverRepository.listAffectations(chauffeurId, { transaction: t });
  for (const aff of open) {
    if (!aff.date_fin) await driverRepository.updateAffectation(aff, { date_fin: todayIso() }, { transaction: t });
  }

  /* Libère les bus actuellement affectés à ce chauffeur. */
  const currentBuses = await Bus.findAll({ where: { chauffeur_id: chauffeurId }, transaction: t });
  for (const b of currentBuses) await b.update({ chauffeur_id: null }, { transaction: t });

  if (!busId) return;

  const bus = await Bus.findByPk(busId, { transaction: t });
  if (!bus) throw new ApiError(400, 'Bus inconnu.');
  if (compagnieId && bus.compagnie_id !== compagnieId) {
    throw new ApiError(400, 'Bus invalide : hors de votre compagnie.');
  }

  await bus.update({ chauffeur_id: chauffeurId }, { transaction: t });
  await driverRepository.createAffectation(
    {
      id: await generateAffectationId(),
      chauffeur_id: chauffeurId,
      bus_id: busId,
      date_debut: todayIso(),
      date_fin: null,
      notes: 'Affectation par défaut.',
    },
    { transaction: t }
  );
};

const create = async ({ data, actor }) => {
  const { agenceId, compagnieId } = await resolveAgence(data, actor);

  const email = data.email.trim().toLowerCase();
  if (await driverRepository.findByEmail(email)) {
    throw new ApiError(409, 'Un utilisateur avec cet email existe déjà.');
  }
  if (data.licenseNumber && (await driverRepository.findByPermisNumero(data.licenseNumber.trim()))) {
    throw new ApiError(409, 'Un chauffeur avec ce numéro de permis existe déjà.');
  }

  const id = await generateId();
  const matricule = await generateMatricule();
  const statut = data.status || 'available';

  await sequelize.transaction(async (t) => {
    await driverRepository.createAgent(
      {
        id,
        matricule,
        prenom: data.firstName.trim(),
        nom: data.lastName.trim(),
        email,
        telephone: data.phone.trim(),
        role: 'chauffeur',
        date_naissance: data.dateOfBirth || null,
        genre: data.gender || null,
        adresse: data.address || null,
        nationalite: data.nationality || null,
        langue: null,
        photo: null,
        date_creation: todayIso(),
        date_embauche: data.hireDate || todayIso(),
        statut: 'actif',
        verifie: false,
        agence_id: agenceId,
      },
      { transaction: t }
    );

    await driverRepository.createChauffeur(
      {
        agent_id: id,
        ville: data.city || null,
        pays: data.country || null,
        permis_numero: data.licenseNumber ? data.licenseNumber.trim() : null,
        permis_categorie: data.licenseCategory || null,
        permis_obtention: data.licenseObtained || null,
        permis_expiration: data.licenseExpiry || null,
        annees_experience: data.experience ?? 0,
        observations: data.observations || null,
        statut,
      },
      { transaction: t }
    );

    if (data.assignedBusId !== undefined && data.assignedBusId !== '') {
      await assignBus({ chauffeurId: id, busId: data.assignedBusId, compagnieId, t });
    }
  });

  logger.info(`Chauffeur créé : ${id} (${email}) par ${actor.role}`);
  return getById({ id, actor });
};

/* ══════════════════════════════════════════════════════════════
   Mise à jour
   ══════════════════════════════════════════════════════════════ */

const update = async ({ id, data, actor }) => {
  const target = await driverRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);

  const compagnieId = target.agence?.compagnie_id ?? null;

  if (data.email) {
    const email = data.email.trim().toLowerCase();
    if (email !== target.email) {
      const existant = await driverRepository.findByEmail(email);
      if (existant && existant.id !== target.id) {
        throw new ApiError(409, 'Un utilisateur avec cet email existe déjà.');
      }
      data.email = email;
    }
  }

  if (data.licenseNumber) {
    const numero = data.licenseNumber.trim();
    const existant = await driverRepository.findByPermisNumero(numero);
    if (existant && existant.agent_id !== target.id) {
      throw new ApiError(409, 'Un chauffeur avec ce numéro de permis existe déjà.');
    }
  }

  let newAgenceId = target.agence_id;
  if (data.agenceId && data.agenceId !== target.agence_id) {
    if (actor.role !== ROLES.SUPER_ADMIN) {
      const agence = await Agence.findByPk(data.agenceId);
      if (!agence || agence.compagnie_id !== actor.compagnieId) {
        throw new ApiError(400, 'Agence invalide : hors de votre compagnie.');
      }
    }
    newAgenceId = data.agenceId;
  }

  await sequelize.transaction(async (t) => {
    const agentPatch = {};
    if (data.firstName !== undefined) agentPatch.prenom = data.firstName.trim();
    if (data.lastName !== undefined) agentPatch.nom = data.lastName.trim();
    if (data.phone !== undefined) agentPatch.telephone = data.phone.trim();
    if (data.email !== undefined) agentPatch.email = data.email;
    if (data.dateOfBirth !== undefined) agentPatch.date_naissance = data.dateOfBirth || null;
    if (data.gender !== undefined) agentPatch.genre = data.gender || null;
    if (data.address !== undefined) agentPatch.adresse = data.address || null;
    if (data.nationality !== undefined) agentPatch.nationalite = data.nationality || null;
    if (data.hireDate !== undefined) agentPatch.date_embauche = data.hireDate || todayIso();
    if (newAgenceId !== target.agence_id) agentPatch.agence_id = newAgenceId;
    if (Object.keys(agentPatch).length > 0) {
      await driverRepository.updateAgent(target, agentPatch, { transaction: t });
    }

    const profilePatch = {};
    if (data.city !== undefined) profilePatch.ville = data.city || null;
    if (data.country !== undefined) profilePatch.pays = data.country || null;
    if (data.licenseNumber !== undefined) profilePatch.permis_numero = data.licenseNumber ? data.licenseNumber.trim() : null;
    if (data.licenseCategory !== undefined) profilePatch.permis_categorie = data.licenseCategory || null;
    if (data.licenseObtained !== undefined) profilePatch.permis_obtention = data.licenseObtained || null;
    if (data.licenseExpiry !== undefined) profilePatch.permis_expiration = data.licenseExpiry || null;
    if (data.experience !== undefined) profilePatch.annees_experience = data.experience;
    if (data.observations !== undefined) profilePatch.observations = data.observations || null;
    if (data.status !== undefined) profilePatch.statut = data.status;
    if (Object.keys(profilePatch).length > 0 && target.chauffeurProfile) {
      await driverRepository.updateChauffeur(target.chauffeurProfile, profilePatch, { transaction: t });
    }

    if (data.assignedBusId !== undefined) {
      await assignBus({ chauffeurId: target.id, busId: data.assignedBusId || null, compagnieId, t });
    }
  });

  logger.info(`Chauffeur mis à jour : ${target.id} par ${actor.role}`);
  return getById({ id: target.id, actor });
};

/* ══════════════════════════════════════════════════════════════
   Statut / suppression
   ══════════════════════════════════════════════════════════════ */

const updateStatus = async ({ id, statut, raison, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);
  if (!target.chauffeurProfile) throw new ApiError(404, 'Profil chauffeur introuvable.');

  await driverRepository.updateChauffeur(target.chauffeurProfile, { statut });

  logger.info(`Statut chauffeur modifié : ${id} → ${statut}`, { raison: raison || null, by: actor.role });
  return { id, statut, message: `Statut du chauffeur mis à jour : ${statut}.` };
};

const remove = async ({ id, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);
  if (!target.chauffeurProfile) throw new ApiError(404, 'Profil chauffeur introuvable.');

  await driverRepository.updateChauffeur(target.chauffeurProfile, { statut: 'inactive' });
  logger.info(`Chauffeur supprimé (soft) : ${id} par ${actor.role}`);
  return { id, statut: 'inactive', message: 'Chauffeur supprimé.' };
};

/* ══════════════════════════════════════════════════════════════
   KPIs (super admin / company admin)
   ══════════════════════════════════════════════════════════════ */

const stats = async ({ actor }) => {
  const scope = await resolveScope(actor);
  const where = driverRepository.buildWhere({}, scope);
  const rows = await driverRepository.findAll(where);

  const parStatut = { available: 0, on_trip: 0, on_leave: 0, suspended: 0, inactive: 0 };
  rows.forEach((r) => {
    const s = r.chauffeurProfile?.statut || 'available';
    parStatut[s] = (parStatut[s] || 0) + 1;
  });

  const totalExperience = rows.reduce(
    (acc, r) => acc + (Number(r.chauffeurProfile?.annees_experience) || 0),
    0
  );

  return {
    total: rows.length,
    parStatut,
    avgExperience: rows.length ? Math.round(totalExperience / rows.length) : 0,
  };
};

/* ══════════════════════════════════════════════════════════════
   Disponibilité
   ══════════════════════════════════════════════════════════════ */

const availability = async ({ id, actor }) => {
  const target = await driverRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);

  const currentTrip = await driverRepository.activeDepart(target.id);
  const declared = target.chauffeurProfile?.statut || 'available';
  const effective = currentTrip && declared === 'available' ? 'on_trip' : declared;
  const available = effective === 'available';

  let reason = null;
  if (!available) {
    if (effective === 'on_trip') reason = 'Chauffeur en mission.';
    else if (effective === 'on_leave') reason = 'Chauffeur en congé.';
    else if (effective === 'suspended') reason = 'Chauffeur suspendu.';
    else if (effective === 'inactive') reason = 'Chauffeur inactif.';
  }

  const currentBus =
    (target.busesConduites || [])[0] || (currentTrip ? await Bus.findByPk(currentTrip.bus_id) : null);

  return {
    available,
    status: effective,
    reason,
    currentTrip: serializeTrip(currentTrip),
    currentBus: serializeBusRef(currentBus),
  };
};

/* ══════════════════════════════════════════════════════════════
   Voyages / affectations
   ══════════════════════════════════════════════════════════════ */

const voyages = async ({ id, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);
  const rows = await driverRepository.listVoyages(target.id);
  return rows.map(serializeTrip);
};

const affectations = async ({ id, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);
  const rows = await driverRepository.listAffectations(target.id);
  return rows.map(serializeAffectation);
};

/** Affecte / libère un voyage (un seul voyage actif à un instant donné). */
const assignTrip = async ({ id, departId, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);

  if (!departId) {
    await sequelize.transaction(async (t) => {
      const openDeparts = await sequelize.query(
        `SELECT id FROM depart WHERE chauffeur_id = :id AND date_depart >= CURDATE() AND statut <> 'annule'`,
        { replacements: { id: target.id }, transaction: t }
      );
      for (const row of openDeparts[0]) {
        await driverRepository.updateDepart(await driverRepository.findDepart(row.id), { chauffeur_id: null }, { transaction: t });
      }
      if (target.chauffeurProfile?.statut === 'on_trip') {
        await driverRepository.updateChauffeur(target.chauffeurProfile, { statut: 'available' }, { transaction: t });
      }
    });
    return { id: target.id, message: 'Voyages libérés.' };
  }

  const depart = await driverRepository.findDepart(departId);
  if (!depart) throw new ApiError(404, 'Voyage introuvable.');
  if (depart.date_depart < todayIso()) throw new ApiError(400, 'Impossible d\'affecter un voyage déjà passé.');
  if (depart.statut === 'annule') throw new ApiError(400, 'Impossible d\'affecter un voyage annulé.');
  if (depart.chauffeur_id && depart.chauffeur_id !== target.id) {
    throw new ApiError(409, 'Ce voyage est déjà affecté à un autre chauffeur.');
  }

  /* Un seul voyage actif à un instant donné. */
  const active = await driverRepository.activeDepart(target.id);
  if (active && active.id !== departId) {
    throw new ApiError(409, 'Ce chauffeur est déjà affecté à un voyage actif.');
  }

  const bus = await Bus.findByPk(depart.bus_id);
  const compagnieId = target.agence?.compagnie_id ?? null;
  if (compagnieId && bus && bus.compagnie_id !== compagnieId) {
    throw new ApiError(400, 'Voyage invalide : bus hors de votre compagnie.');
  }

  await sequelize.transaction(async (t) => {
    await driverRepository.updateDepart(depart, { chauffeur_id: target.id }, { transaction: t });
    if (target.chauffeurProfile?.statut === 'available') {
      await driverRepository.updateChauffeur(target.chauffeurProfile, { statut: 'on_trip' }, { transaction: t });
    }
    if (bus) {
      const aff = await driverRepository.openAffectation(target.id, bus.id);
      if (!aff) {
        await driverRepository.createAffectation(
          {
            id: await generateAffectationId(),
            chauffeur_id: target.id,
            bus_id: bus.id,
            date_debut: depart.date_depart,
            date_fin: null,
            notes: `Voyage ${depart.id}`,
          },
          { transaction: t }
        );
      }
    }
  });

  logger.info(`Voyage ${departId} affecté au chauffeur ${target.id} par ${actor.role}`);
  return availability({ id: target.id, actor });
};

/* ══════════════════════════════════════════════════════════════
   Incidents
   ══════════════════════════════════════════════════════════════ */

const listIncidents = async ({ id, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);
  const rows = await driverRepository.listIncidents(target.id);
  return rows.map(serializeIncident);
};

const createIncident = async ({ id, data, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);

  const incident = await driverRepository.createIncident({
    id: await generateIncidentId(),
    chauffeur_id: target.id,
    type: data.type,
    date: data.date,
    description: data.description || null,
    severite: data.severite || 'low',
    resolu: data.resolu ?? false,
  });

  logger.info(`Incident créé : ${incident.id} pour chauffeur ${target.id} par ${actor.role}`);
  return serializeIncident(incident);
};

const updateIncident = async ({ incidentId, data, actor }) => {
  const incident = await driverRepository.findIncident(incidentId);
  if (!incident) throw new ApiError(404, 'Incident introuvable.');
  const target = await driverRepository.findById(incident.chauffeur_id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);

  await driverRepository.updateIncident(incident, data);
  logger.info(`Incident mis à jour : ${incidentId} par ${actor.role}`);
  return serializeIncident(await driverRepository.findIncident(incidentId));
};

const deleteIncident = async ({ incidentId, actor }) => {
  const incident = await driverRepository.findIncident(incidentId);
  if (!incident) throw new ApiError(404, 'Incident introuvable.');
  const target = await driverRepository.findById(incident.chauffeur_id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);

  await driverRepository.deleteIncident(incident);
  logger.info(`Incident supprimé : ${incidentId} par ${actor.role}`);
  return { id: incidentId, message: 'Incident supprimé.' };
};

/* ══════════════════════════════════════════════════════════════
   Documents
   ══════════════════════════════════════════════════════════════ */

const listDocuments = async ({ id, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);
  const rows = await driverRepository.listDocuments(target.id);
  return rows.map(serializeDocument);
};

const uploadDocument = async ({ id, file, type, notes, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);
  if (!file) throw new ApiError(400, 'Aucun document fourni (champ `document`).');

  const url = await fileService.saveDocument(file.buffer, target.id, file.originalname);
  const document = await driverRepository.createDocument({
    id: await generateDocumentId(),
    chauffeur_id: target.id,
    type: type || 'autre',
    url,
    notes: notes || null,
  });

  logger.info(`Document ajouté : ${document.id} pour chauffeur ${target.id} par ${actor.role}`);
  return serializeDocument(document);
};

const deleteDocument = async ({ documentId, actor }) => {
  const document = await driverRepository.findDocument(documentId);
  if (!document) throw new ApiError(404, 'Document introuvable.');
  const target = await driverRepository.findById(document.chauffeur_id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);

  if (fileService.isDriverDocumentUrl(document.url)) {
    fileService.deleteFile(document.url, fileService.docsDir);
  }
  await driverRepository.deleteDocument(document);
  logger.info(`Document supprimé : ${documentId} par ${actor.role}`);
  return { id: documentId, message: 'Document supprimé.' };
};

/* ══════════════════════════════════════════════════════════════
   Photo
   ══════════════════════════════════════════════════════════════ */

const uploadPhoto = async ({ id, file, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);
  if (!file) throw new ApiError(400, 'Aucune photo fournie (champ `photo`).');

  const url = await fileService.savePhoto(file.buffer, target.id);
  const oldPhoto = target.photo;
  await driverRepository.updateAgent(target, { photo: url });
  if (oldPhoto && oldPhoto !== url && fileService.isDriverPhotoUrl(oldPhoto)) {
    fileService.deleteFile(oldPhoto, fileService.driversDir);
  }

  logger.info(`Photo de chauffeur mise à jour : ${target.id} par ${actor.role}`);
  return { id: target.id, photoUrl: url, message: 'Photo de chauffeur mise à jour.' };
};

const deletePhoto = async ({ id, actor }) => {
  const target = await driverRepository.findById(id);
  if (!target) throw new ApiError(404, 'Chauffeur introuvable.');
  assertCanManage(actor, target);

  if (target.photo && fileService.isDriverPhotoUrl(target.photo)) {
    fileService.deleteFile(target.photo, fileService.driversDir);
  }
  await driverRepository.updateAgent(target, { photo: null });
  logger.info(`Photo de chauffeur supprimée : ${target.id} par ${actor.role}`);
  return { id: target.id, photoUrl: null, message: 'Photo de chauffeur supprimée.' };
};

module.exports = {
  list,
  getById,
  create,
  update,
  updateStatus,
  remove,
  stats,
  availability,
  voyages,
  affectations,
  assignTrip,
  listIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
  listDocuments,
  uploadDocument,
  deleteDocument,
  uploadPhoto,
  deletePhoto,
  assertCanManage,
  serializeDriver,
  serializeIncident,
  serializeDocument,
  ROLES,
};
