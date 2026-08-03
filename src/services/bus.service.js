import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Bus Service (API réelle)
 * Endpoints backend :
 *   GET    /buses                    (liste paginée + filtres, scope par rôle)
 *   GET    /buses/stats              (KPIs par statut / type + totaux)
 *   GET    /buses/:id                (détail : plan de sièges + maintenances + images)
 *   POST   /buses                    (création)
 *   PATCH  /buses/:id                (mise à jour)
 *   PATCH  /buses/:id/status         (changement de statut opérationnel)
 *   DELETE /buses/:id                (suppression douce → statut inactive)
 *   GET    /buses/:id/seat-layout    (plan de sièges)
 *   PUT    /buses/:id/seat-layout    (enregistrer le plan de sièges)
 *   GET    /buses/:id/maintenance    (historique des maintenances)
 *   POST   /buses/:id/maintenance    (planifier une maintenance)
 *   PATCH  /buses/maintenance/:id    (mettre à jour une maintenance)
 *   DELETE /buses/maintenance/:id    (supprimer une maintenance)
 *   POST   /buses/:id/photo          (upload / remplacement de la photo)
 *   DELETE /buses/:id/photo          (suppression de la photo)
 *
 * Les statuts API (available/on_trip/maintenance/out_of_service/inactive)
 * sont traduits vers les codes UI (disponible/en_voyage/maintenance/
 * hors_service) pour conserver les composants AgencyBus* inchangés.
 */

/* ── Traduction statuts ────────────────────────────────────────── */
export const STATUS_TO_UI = {
  available: 'disponible',
  on_trip: 'en_voyage',
  maintenance: 'maintenance',
  out_of_service: 'hors_service',
  inactive: 'hors_service',
};

export const UI_TO_STATUS = {
  disponible: 'available',
  en_voyage: 'on_trip',
  maintenance: 'maintenance',
  hors_service: 'out_of_service',
  reserve: 'available',
};

/* ── Helpers ───────────────────────────────────────────────────── */
/** Met en forme un bus API → structure attendue par les composants AgencyBus*. */
export const mapBus = (b) => ({
  id: b.id,
  plate: b.plate || '',
  internalNumber: b.internalNumber || b.id,
  brand: b.brand || '',
  model: b.model || '',
  year: b.year ?? null,
  seats: Number(b.seats) || 0,
  type: b.type || 'standard',
  class: b.class || 'economy',
  status: STATUS_TO_UI[b.status] || b.status || 'disponible',
  fuelType: b.fuelType || 'diesel',
  color: b.color || '#0B1D51',
  amenities: b.amenities || {},
  notes: b.notes || '',
  photoUrl: b.photoUrl || null,
  chauffeurId: b.chauffeurId || null,
  currentDriver: b.currentDriver
    ? { id: b.currentDriver.id, name: b.currentDriver.name, phone: b.currentDriver.phone || '' }
    : null,
  lastMaintenance: b.lastMaintenance || null,
  nextMaintenance: b.nextMaintenance || null,
  serviceDate: b.serviceDate || null,
  mileage: Number(b.mileage) || 0,
  tripCount: Number(b.stats?.tripCount) || 0,
  totalKm: Number(b.stats?.totalKm) || Number(b.mileage) || 0,
  avgOccupancy: Number(b.stats?.avgOccupancy) || 0,
  seatLayout: b.seatLayout
    ? {
        id: b.seatLayout.id ?? null,
        rows: b.seatLayout.rows,
        seatsPerSide: b.seatLayout.seatsPerSide,
        aisleAfter: b.seatLayout.aisleAfter || [],
        vipRows: b.seatLayout.vipRows || [],
        pmrSeats: b.seatLayout.pmrSeats || [],
      }
    : null,
});

/** Met en forme une maintenance API (déjà alignée sur le frontend). */
export const mapMaintenance = (m) => ({
  id: m.id,
  busId: m.busId,
  type: m.type || 'autre',
  date: m.date || null,
  completedDate: m.completedDate || null,
  mileage: Number(m.mileage) || 0,
  cost: Number(m.cost) || 0,
  provider: m.provider || '',
  status: m.status || 'planifiee',
  notes: m.notes || '',
});

/** Construit les KPIs de la page à partir des bus chargés (UI). */
export const mapStats = (buses) => ({
  total: buses.length,
  disponible: buses.filter((b) => b.status === 'disponible').length,
  en_voyage: buses.filter((b) => b.status === 'en_voyage').length,
  maintenance: buses.filter((b) => b.status === 'maintenance').length,
  hors_service: buses.filter((b) => b.status === 'hors_service').length,
  reserve: buses.filter((b) => b.status === 'reserve').length,
  avgOccupancy: buses.length
    ? Math.round(buses.reduce((acc, b) => acc + (b.avgOccupancy || 0), 0) / buses.length)
    : 0,
});

/** Construit le payload d'écriture (formulaire modal → API). */
const buildPayload = (form) => {
  const payload = {};
  if (form.plate !== undefined) payload.plate = form.plate;
  if (form.internalNumber !== undefined) payload.internalNumber = form.internalNumber || null;
  if (form.brand !== undefined) payload.brand = form.brand || null;
  if (form.model !== undefined) payload.model = form.model || null;
  if (form.year !== undefined) payload.year = form.year ?? null;
  if (form.seats !== undefined) payload.seats = Number(form.seats);
  if (form.type !== undefined) payload.type = form.type || 'standard';
  if (form.class !== undefined) payload.class = form.class || 'economy';
  if (form.status !== undefined) payload.status = UI_TO_STATUS[form.status] || form.status || 'available';
  if (form.fuelType !== undefined) payload.fuelType = form.fuelType || 'diesel';
  if (form.color !== undefined) payload.color = form.color || '#0B1D51';
  if (form.amenities !== undefined) payload.amenities = form.amenities || {};
  if (form.notes !== undefined) payload.notes = form.notes || null;
  if (form.currentDriver !== undefined) payload.chauffeurId = form.currentDriver || null;
  if (form.serviceDate !== undefined) payload.serviceDate = form.serviceDate || null;
  if (form.lastMaintenance !== undefined) payload.lastMaintenance = form.lastMaintenance || null;
  if (form.nextMaintenance !== undefined) payload.nextMaintenance = form.nextMaintenance || null;
  if (form.mileage !== undefined) payload.mileage = Number(form.mileage) || 0;
  return payload;
};

/* ── Méthodes API ───────────────────────────────────────────────── */
const busService = {
  /** Liste paginée brute (non mappée). */
  list: async (params = {}) => {
    const data = await apiClient.get('/buses', { params });
    return data;
  },

  /** Toutes les bus (pages cumulées, sans les bus supprimés) mappés pour l'UI. */
  getAll: async (params = {}) => {
    const first = await busService.list({ ...params, page: 1, limit: 100 });
    let items = [...first.items];
    let page = 2;
    while (page <= first.totalPages && items.length < first.total) {
      const next = await busService.list({ ...params, page, limit: 100 });
      items = items.concat(next.items);
      page += 1;
    }
    return items.filter((b) => b.status !== 'inactive').map(mapBus);
  },

  getById: async (id) => {
    const data = await apiClient.get(`/buses/${id}`);
    return mapBus(data);
  },

  create: async (form) => {
    const data = await apiClient.post('/buses', buildPayload(form));
    return mapBus(data);
  },

  update: async (id, form) => {
    const data = await apiClient.patch(`/buses/${id}`, buildPayload(form));
    return mapBus(data);
  },

  /** Changement de statut (statut API : available/on_trip/maintenance/out_of_service/inactive). */
  updateStatus: async (id, statut, raison) => {
    const data = await apiClient.patch(`/buses/${id}/status`, { statut, raison: raison || null });
    return data;
  },

  remove: async (id) => {
    const data = await apiClient.delete(`/buses/${id}`);
    return data;
  },

  getStats: async () => {
    const data = await apiClient.get('/buses/stats');
    return data;
  },

  getSeatLayout: async (id) => {
    const data = await apiClient.get(`/buses/${id}/seat-layout`);
    return data;
  },

  saveSeatLayout: async (id, layout) => {
    const data = await apiClient.put(`/buses/${id}/seat-layout`, layout);
    return data;
  },

  listMaintenances: async (id) => {
    const data = await apiClient.get(`/buses/${id}/maintenance`);
    return (data || []).map(mapMaintenance);
  },

  createMaintenance: async (id, data) => {
    const result = await apiClient.post(`/buses/${id}/maintenance`, data);
    return mapMaintenance(result);
  },

  updateMaintenance: async (maintenanceId, data) => {
    const result = await apiClient.patch(`/buses/maintenance/${maintenanceId}`, data);
    return mapMaintenance(result);
  },

  deleteMaintenance: async (maintenanceId) => {
    const data = await apiClient.delete(`/buses/maintenance/${maintenanceId}`);
    return data;
  },

  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const data = await apiClient.post(`/buses/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deletePhoto: async (id, imageId) => {
    const params = imageId ? { imageId } : undefined;
    const data = await apiClient.delete(`/buses/${id}/photo`, { params });
    return data;
  },
};

export default busService;
