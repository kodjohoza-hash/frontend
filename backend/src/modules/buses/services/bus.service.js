const { sequelize } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { ROLES } = require('../../../middlewares/auth');
const { busRepository } = require('../repositories');
const busPhotoService = require('./busPhoto.service');

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

/** Génère un identifiant CHAR(10) unique (ex: BS00000042, MNT0000042). */
const generateId = async (prefix, finder) => {
  const digits = 10 - prefix.length;
  for (let i = 0; i < 6; i += 1) {
    const id = `${prefix}${String(Math.floor(Math.random() * 10 ** digits)).padStart(digits, '0')}`;
    const exists = await finder(id);
    if (!exists) return id;
  }
  throw new ApiError(500, "Impossible de générer un identifiant unique.");
};

const generateBusId = () => generateId('BS', (id) => busRepository.findById(id));
const generateLayoutId = () => generateId('LAY', (id) => busRepository.getSeatLayout(id));
const generateMaintenanceId = () => generateId('MNT', (id) => busRepository.findMaintenance(id));
const generateImageId = () => generateId('IMG', (id) => busRepository.findImage(id));

/** Périmètre d'accès selon le rôle de l'acteur. */
const resolveScope = (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) {
    return { compagnieIds: null };
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    return { compagnieIds: [actor.compagnieId] };
  }
  throw new ApiError(403, 'Accès refusé : gestion des bus non autorisée.');
};

/** Vérifie que l'acteur peut gérer le bus cible. */
const assertCanManage = (actor, target) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.COMPANY_ADMIN) {
    if (target.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : bus hors de votre périmètre.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé : gestion des bus non autorisée.');
};

const parseJson = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch (_) {
    return [];
  }
};

const parseAmenities = (value) => {
  if (value == null) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (_) {
    return {};
  }
};

/** Plans de sièges par défaut (alignés sur le frontend defaultSeatLayouts). */
const DEFAULT_SEAT_LAYOUTS = {
  vip: { rows: 11, seatsPerSide: 2, aisleAfter: [5], vipRows: [1, 2, 3], pmrSeats: [] },
  confort: { rows: 10, seatsPerSide: 2, aisleAfter: [5], vipRows: [1, 2], pmrSeats: [20] },
  standard: { rows: 12, seatsPerSide: 2, aisleAfter: [6], vipRows: [], pmrSeats: [24] },
  economique: { rows: 13, seatsPerSide: 2, aisleAfter: [6], vipRows: [], pmrSeats: [26] },
  minibus: { rows: 5, seatsPerSide: 2, aisleAfter: [2], vipRows: [], pmrSeats: [] },
  double_deck: { rows: 12, seatsPerSide: 2, aisleAfter: [6], vipRows: [1, 2, 3], pmrSeats: [] },
};

/** Construit un plan de sièges pour un type / capacité donnés. */
const buildDefaultLayout = (type, seats) => {
  const base = DEFAULT_SEAT_LAYOUTS[type] || DEFAULT_SEAT_LAYOUTS.standard;
  const perRow = base.seatsPerSide * 2;
  const rows = Math.max(base.rows, Math.ceil(Number(seats || base.rows * perRow) / perRow));
  const aisleAfter = base.aisleAfter.filter((r) => r <= rows);
  const vipRows = base.vipRows.filter((r) => r <= rows);
  const pmrSeats = base.pmrSeats.filter((n) => n <= Number(seats || rows * perRow));
  return { rows, seatsPerSide: base.seatsPerSide, aisleAfter, vipRows, pmrSeats };
};

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializeChauffeurRef = (a) => {
  if (!a) return null;
  return {
    id: a.id,
    matricule: a.matricule,
    name: `${a.prenom} ${a.nom}`.trim(),
    phone: a.telephone ?? null,
  };
};

const serializeSeatLayout = (l) => {
  if (!l) return null;
  return {
    id: l.id,
    rows: l.rows_count,
    seatsPerSide: l.seats_per_side,
    aisleAfter: parseJson(l.aisle_after),
    vipRows: parseJson(l.vip_rows),
    pmrSeats: parseJson(l.pmr_seats),
    totalSeats: l.total_seats,
  };
};

const serializeMaintenance = (m) => ({
  id: m.id,
  busId: m.bus_id,
  type: m.type,
  date: m.date,
  completedDate: m.completed_date ?? null,
  mileage: Number(m.mileage) || 0,
  cost: Number(m.cost) || 0,
  provider: m.provider ?? null,
  status: m.status,
  notes: m.notes ?? null,
});

const serializeImage = (i) => ({
  id: i.id,
  busId: i.bus_id,
  url: i.url,
  isPrimary: Boolean(i.is_primary),
});

/** Sérialise un bus (compagnie + chauffeur + stats + plan + maintenances + images). */
const serializeBus = (b, departStats = null) => {
  const d = departStats || {};
  return {
    id: b.id,
    plate: b.immatriculation,
    internalNumber: b.interne ?? null,
    brand: b.marque ?? null,
    model: b.modele,
    year: b.annee ?? null,
    seats: b.capacite,
    type: b.type_bus,
    class: b.classe,
    status: b.statut,
    fuelType: b.carburant,
    color: b.couleur ?? null,
    amenities: parseAmenities(b.equipements),
    notes: b.notes ?? null,
    photoUrl: b.photo_url ?? null,
    chauffeurId: b.chauffeur_id ?? null,
    currentDriver: serializeChauffeurRef(b.chauffeur),
    lastMaintenance: b.dernier_maintenance ?? null,
    nextMaintenance: b.prochaine_maintenance ?? null,
    serviceDate: b.mise_en_service ?? null,
    mileage: Number(b.kilometrage) || 0,
    compagnieId: b.compagnie_id,
    companyName: b.compagnie?.nom ?? null,
    stats: {
      tripCount: Number(d.voyages) || 0,
      avgOccupancy: Math.round(Number(d.avg_occupancy) || 0),
      totalKm: Number(b.kilometrage) || 0,
    },
    seatLayout: serializeSeatLayout(b.seatLayout),
    maintenances: b.maintenances?.map(serializeMaintenance) ?? null,
    images: b.images?.map(serializeImage) ?? null,
  };
};

const attachDepartStats = async (serialized) => {
  const row = await busRepository.departStatsForBus(serialized.id);
  const d = row || {};
  return {
    ...serialized,
    stats: {
      tripCount: Number(d.voyages) || 0,
      avgOccupancy: Math.round(Number(d.avg_occupancy) || 0),
      totalKm: Number(serialized.mileage) || 0,
    },
  };
};

/* ══════════════════════════════════════════════════════════════
   Liste / détail
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = resolveScope(actor);
  const where = busRepository.buildWhere(query, scope);

  const { rows, count } = await busRepository.findPage({
    where,
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });

  const departRows = await busRepository.departStatsForBuses(rows.map((r) => r.id));
  const departMap = new Map(departRows.map((r) => [r.bus_id, r]));

  return {
    items: rows.map((r) => serializeBus(r, departMap.get(r.id))),
    total: count,
    page: query.page,
    limit: query.limit,
    totalPages: Math.max(1, Math.ceil(count / query.limit)),
  };
};

const getById = async ({ id, actor }) => {
  const target = await busRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);
  return attachDepartStats(serializeBus(target));
};

/* ══════════════════════════════════════════════════════════════
   Création
   ══════════════════════════════════════════════════════════════ */

const create = async ({ data, actor }) => {
  const compagnieId = actor.role === ROLES.SUPER_ADMIN ? data.compagnieId || null : actor.compagnieId;
  if (!compagnieId) {
    throw new ApiError(400, 'Un bus doit être rattaché à une compagnie (champ `compagnieId`).');
  }

  const compagnie = await busRepository.Compagnie.findByPk(compagnieId);
  if (!compagnie) throw new ApiError(400, 'Compagnie inconnue.');

  const plate = String(data.plate).trim();
  const existant = await busRepository.findByPlate(plate, compagnieId);
  if (existant) throw new ApiError(409, 'Un bus avec cette immatriculation existe déjà pour cette compagnie.');

  if (data.internalNumber) {
    const existantInterne = await busRepository.findByInterne(String(data.internalNumber).trim(), compagnieId);
    if (existantInterne) throw new ApiError(409, 'Un bus avec ce numéro interne existe déjà pour cette compagnie.');
  }

  if (data.chauffeurId) {
    const chauffeur = await busRepository.Agent.findByPk(data.chauffeurId);
    if (!chauffeur) throw new ApiError(400, 'Chauffeur inconnu.');
  }

  const id = await generateBusId();
  const statut = data.status || 'available';

  const bus = await sequelize.transaction(async (t) => {
    const created = await busRepository.create(
      {
        id,
        immatriculation: plate,
        interne: data.internalNumber ? String(data.internalNumber).trim() : null,
        modele: data.model || '',
        marque: data.brand || null,
        annee: data.year ?? null,
        capacite: data.seats,
        classe: data.class || 'economy',
        type_bus: data.type || 'standard',
        compagnie_id: compagnieId,
        carburant: data.fuelType || 'diesel',
        couleur: data.color || '#0B1D51',
        equipements: data.amenities ?? null,
        notes: data.notes || null,
        chauffeur_id: data.chauffeurId || null,
        dernier_maintenance: data.lastMaintenance || null,
        prochaine_maintenance: data.nextMaintenance || null,
        mise_en_service: data.serviceDate || null,
        kilometrage: data.mileage ?? 0,
        statut,
      },
      { transaction: t }
    );

    const layout = buildDefaultLayout(created.type_bus, created.capacite);
    await busRepository.createSeatLayout(
      {
        id: await generateLayoutId(),
        bus_id: created.id,
        rows_count: layout.rows,
        seats_per_side: layout.seatsPerSide,
        aisle_after: layout.aisleAfter,
        vip_rows: layout.vipRows,
        pmr_seats: layout.pmrSeats,
        total_seats: created.capacite,
      },
      { transaction: t }
    );

    return created;
  });

  logger.info(`Bus créé : ${id} (${plate}) par ${actor.role}`);
  return attachDepartStats(serializeBus(await busRepository.findByIdFull(id)));
};

/* ══════════════════════════════════════════════════════════════
   Mise à jour
   ══════════════════════════════════════════════════════════════ */

const update = async ({ id, data, actor }) => {
  const target = await busRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  if (data.plate) {
    const plate = String(data.plate).trim();
    const existant = await busRepository.findByPlate(plate, target.compagnie_id);
    if (existant && existant.id !== target.id) {
      throw new ApiError(409, 'Un bus avec cette immatriculation existe déjà pour cette compagnie.');
    }
  }
  if (data.internalNumber) {
    const existantInterne = await busRepository.findByInterne(String(data.internalNumber).trim(), target.compagnie_id);
    if (existantInterne && existantInterne.id !== target.id) {
      throw new ApiError(409, 'Un bus avec ce numéro interne existe déjà pour cette compagnie.');
    }
  }
  if (data.chauffeurId) {
    const chauffeur = await busRepository.Agent.findByPk(data.chauffeurId);
    if (!chauffeur) throw new ApiError(400, 'Chauffeur inconnu.');
  }

  const patch = {
    immatriculation: data.plate !== undefined ? String(data.plate).trim() : undefined,
    interne: data.internalNumber !== undefined ? (String(data.internalNumber).trim() || null) : undefined,
    modele: data.model !== undefined ? data.model : undefined,
    marque: data.brand !== undefined ? data.brand || null : undefined,
    annee: data.year !== undefined ? data.year : undefined,
    capacite: data.seats !== undefined ? data.seats : undefined,
    classe: data.class !== undefined ? data.class : undefined,
    type_bus: data.type !== undefined ? data.type : undefined,
    carburant: data.fuelType !== undefined ? data.fuelType : undefined,
    couleur: data.color !== undefined ? data.color || null : undefined,
    equipements: data.amenities !== undefined ? data.amenities : undefined,
    notes: data.notes !== undefined ? data.notes || null : undefined,
    chauffeur_id: data.chauffeurId !== undefined ? data.chauffeurId || null : undefined,
    dernier_maintenance: data.lastMaintenance !== undefined ? data.lastMaintenance || null : undefined,
    prochaine_maintenance: data.nextMaintenance !== undefined ? data.nextMaintenance || null : undefined,
    mise_en_service: data.serviceDate !== undefined ? data.serviceDate || null : undefined,
    kilometrage: data.mileage !== undefined ? data.mileage : undefined,
    statut: data.status !== undefined ? data.status : undefined,
  };
  delete patch.compagnieId;

  await busRepository.update(target, patch);

  /* Le plan de sièges doit suivre une éventuelle nouvelle capacité. */
  if (data.seats !== undefined && data.seats !== target.capacite) {
    const layout = await busRepository.getSeatLayout(target.id);
    if (layout) {
      const rebuilt = buildDefaultLayout(target.type_bus, data.seats);
      await busRepository.updateSeatLayout(layout, {
        rows_count: rebuilt.rows,
        total_seats: data.seats,
        aisle_after: rebuilt.aisleAfter,
        vip_rows: rebuilt.vipRows,
        pmr_seats: rebuilt.pmrSeats,
      });
    }
  }

  logger.info(`Bus mis à jour : ${target.id} par ${actor.role}`);
  return attachDepartStats(serializeBus(await busRepository.findByIdFull(target.id)));
};

/* ══════════════════════════════════════════════════════════════
   Statut / suppression
   ══════════════════════════════════════════════════════════════ */

const updateStatus = async ({ id, statut, raison, actor }) => {
  const target = await busRepository.findById(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  await busRepository.update(target, { statut });

  logger.info(`Statut bus modifié : ${id} → ${statut}`, { raison: raison || null, by: actor.role });
  return { id, statut, message: `Statut du bus mis à jour : ${statut}.` };
};

const remove = async ({ id, actor }) => {
  const target = await busRepository.findById(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  /* Soft delete : désactivation (pas de hard delete : FK multiples). */
  await busRepository.update(target, { statut: 'inactive' });

  logger.info(`Bus supprimé (soft) : ${id} par ${actor.role}`);
  return { id, statut: 'inactive', message: 'Bus supprimé.' };
};

/* ══════════════════════════════════════════════════════════════
   KPIs (super admin / company admin)
   ══════════════════════════════════════════════════════════════ */

const stats = async ({ actor }) => {
  const scope = resolveScope(actor);
  const where = busRepository.buildWhere({}, scope);
  const rows = await busRepository.findAll(where);
  const ids = rows.map((r) => r.id);

  const parStatut = { available: 0, on_trip: 0, maintenance: 0, out_of_service: 0, inactive: 0 };
  const parType = { vip: 0, confort: 0, standard: 0, economique: 0, minibus: 0, double_deck: 0 };
  const parClasse = { first: 0, business: 0, economy: 0, mixed: 0 };

  rows.forEach((r) => {
    parStatut[r.statut] = (parStatut[r.statut] || 0) + 1;
    parType[r.type_bus] = (parType[r.type_bus] || 0) + 1;
    parClasse[r.classe] = (parClasse[r.classe] || 0) + 1;
  });

  const departRows = await busRepository.departStatsForBuses(ids);
  const totaux = departRows.reduce(
    (acc, d) => {
      acc.voyages += Number(d.voyages) || 0;
      acc.occupancy += Number(d.avg_occupancy) || 0;
      return acc;
    },
    { voyages: 0, occupancy: 0 }
  );

  const totalKm = rows.reduce((acc, r) => acc + (Number(r.kilometrage) || 0), 0);
  const totalSeats = rows.reduce((acc, r) => acc + (Number(r.capacite) || 0), 0);

  return {
    total: rows.length,
    parStatut,
    parType,
    parClasse,
    totaux: {
      voyages: totaux.voyages,
      avgOccupancy: departRows.length ? Math.round(totaux.occupancy / departRows.length) : 0,
      totalKm,
      totalSeats,
    },
  };
};

/* ══════════════════════════════════════════════════════════════
   Plan de sièges
   ══════════════════════════════════════════════════════════════ */

const getSeatLayout = async ({ id, actor }) => {
  const target = await busRepository.findById(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  const layout = await busRepository.getSeatLayout(target.id);
  if (!layout) {
    const rebuilt = buildDefaultLayout(target.type_bus, target.capacite);
    return { ...rebuilt, id: null, totalSeats: target.capacite };
  }
  return serializeSeatLayout(layout);
};

const saveSeatLayout = async ({ id, data, actor }) => {
  const target = await busRepository.findById(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  const existing = await busRepository.getSeatLayout(target.id);
  const payload = {
    rows_count: data.rows,
    seats_per_side: data.seatsPerSide,
    aisle_after: data.aisleAfter || [],
    vip_rows: data.vipRows || [],
    pmr_seats: data.pmrSeats || [],
    total_seats: target.capacite,
  };

  if (existing) {
    await busRepository.updateSeatLayout(existing, payload);
  } else {
    await busRepository.createSeatLayout({ id: await generateLayoutId(), bus_id: target.id, ...payload });
  }

  const layout = await busRepository.getSeatLayout(target.id);
  return serializeSeatLayout(layout);
};

/* ══════════════════════════════════════════════════════════════
   Maintenances
   ══════════════════════════════════════════════════════════════ */

const listMaintenances = async ({ id, actor }) => {
  const target = await busRepository.findById(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);
  const items = await busRepository.listMaintenances(target.id);
  return items.map(serializeMaintenance);
};

const createMaintenance = async ({ id, data, actor }) => {
  const target = await busRepository.findById(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  const maintenance = await busRepository.createMaintenance({
    id: await generateMaintenanceId(),
    bus_id: target.id,
    type: data.type,
    date: data.date,
    completed_date: data.completedDate || null,
    mileage: data.mileage ?? target.kilometrage,
    cost: data.cost ?? 0,
    provider: data.provider || null,
    status: data.status || 'planifiee',
    notes: data.notes || null,
  });

  /* Une maintenance en cours/réalisée passe le bus en maintenance. */
  if (data.status && data.status !== 'planifiee') {
    await busRepository.update(target, { statut: 'maintenance' });
  }

  logger.info(`Maintenance planifiée : ${maintenance.id} pour bus ${target.id} par ${actor.role}`);
  return serializeMaintenance(maintenance);
};

const updateMaintenance = async ({ maintenanceId, data, actor }) => {
  const maintenance = await busRepository.findMaintenance(maintenanceId);
  if (!maintenance) throw new ApiError(404, 'Maintenance introuvable.');

  const target = await busRepository.findById(maintenance.bus_id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  const patch = {
    type: data.type,
    date: data.date,
    completed_date: data.completedDate !== undefined ? data.completedDate || null : undefined,
    mileage: data.mileage !== undefined ? data.mileage : undefined,
    cost: data.cost !== undefined ? data.cost : undefined,
    provider: data.provider !== undefined ? data.provider || null : undefined,
    status: data.status,
    notes: data.notes !== undefined ? data.notes || null : undefined,
  };
  Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

  await busRepository.updateMaintenance(maintenance, patch);

  /* Une maintenance terminée met à jour les dates de suivi du bus. */
  if (data.status === 'terminee') {
    const completed = data.completedDate || maintenance.completed_date || maintenance.date;
    const next = new Date(completed);
    next.setDate(next.getDate() + 90);
    await busRepository.update(target, {
      dernier_maintenance: completed,
      prochaine_maintenance: next.toISOString().slice(0, 10),
    });
  }
  if (data.status && data.status !== 'planifiee') {
    await busRepository.update(target, { statut: 'maintenance' });
  }

  logger.info(`Maintenance mise à jour : ${maintenanceId} par ${actor.role}`);
  return serializeMaintenance(await busRepository.findMaintenance(maintenanceId));
};

const deleteMaintenance = async ({ maintenanceId, actor }) => {
  const maintenance = await busRepository.findMaintenance(maintenanceId);
  if (!maintenance) throw new ApiError(404, 'Maintenance introuvable.');

  const target = await busRepository.findById(maintenance.bus_id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  await busRepository.deleteMaintenance(maintenance);
  logger.info(`Maintenance supprimée : ${maintenanceId} par ${actor.role}`);
  return { id: maintenanceId, message: 'Maintenance supprimée.' };
};

/* ══════════════════════════════════════════════════════════════
   Photos
   ══════════════════════════════════════════════════════════════ */

const uploadPhoto = async ({ id, file, actor }) => {
  const target = await busRepository.findById(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  if (!file) throw new ApiError(400, 'Aucune photo fournie (champ `photo`).');

  const url = await busPhotoService.savePhoto(file.buffer, target.id);
  const imageId = await generateImageId();

  await sequelize.transaction(async (t) => {
    /* La photo précédente perd son statut principal. */
    await busRepository.createImage(
      { id: imageId, bus_id: target.id, url, is_primary: true },
      { transaction: t }
    );
    await busRepository.update(target, { photo_url: url }, { transaction: t });
  });

  logger.info(`Photo de bus ajoutée : ${imageId} pour bus ${target.id} par ${actor.role}`);
  return { id: imageId, busId: target.id, url, isPrimary: true, photoUrl: url };
};

const deletePhoto = async ({ id, imageId, actor }) => {
  const target = await busRepository.findById(id);
  if (!target) throw new ApiError(404, 'Bus introuvable.');
  assertCanManage(actor, target);

  const image = imageId ? await busRepository.findImage(imageId) : null;
  if (image) {
    if (image.bus_id !== target.id) throw new ApiError(400, "Photo ne correspondant pas à ce bus.");
    busPhotoService.deletePhoto(image.url);
    await busRepository.deleteImage(image);
  } else if (target.photo_url) {
    busPhotoService.deletePhoto(target.photo_url);
  } else {
    throw new ApiError(404, 'Aucune photo à supprimer.');
  }

  if (target.photo_url && (!image || image.url === target.photo_url)) {
    await busRepository.update(target, { photo_url: null });
  }

  logger.info(`Photo de bus supprimée : bus ${target.id} par ${actor.role}`);
  return { id: target.id, message: 'Photo supprimée.' };
};

module.exports = {
  list,
  getById,
  create,
  update,
  updateStatus,
  remove,
  stats,
  getSeatLayout,
  saveSeatLayout,
  listMaintenances,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  uploadPhoto,
  deletePhoto,
  assertCanManage,
  serializeBus,
  serializeMaintenance,
  buildDefaultLayout,
  ROLES,
};
