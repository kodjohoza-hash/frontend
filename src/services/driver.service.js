import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Driver Service (API réelle)
 * Endpoints backend :
 *   GET    /drivers                    (liste paginée + filtres, scope par rôle)
 *   GET    /drivers/stats              (KPIs par statut + expérience moyenne)
 *   GET    /drivers/:id                (détail : voyages + affectations + incidents + documents)
 *   POST   /drivers                    (création)
 *   PATCH  /drivers/:id                (mise à jour)
 *   PATCH  /drivers/:id/status         (changement de statut)
 *   DELETE /drivers/:id                (suppression douce → statut inactive)
 *   GET    /drivers/:id/availability   (disponibilité réelle)
 *   GET    /drivers/:id/voyages        (historique des voyages)
 *   GET    /drivers/:id/affectations   (historique des affectations bus)
 *   PATCH  /drivers/:id/trip           (affecter / libérer un voyage)
 *   GET    /drivers/:id/incidents      (liste des incidents)
 *   POST   /drivers/:id/incidents      (créer un incident)
 *   PATCH  /drivers/incidents/:incidentId
 *   DELETE /drivers/incidents/:incidentId
 *   GET    /drivers/:id/documents      (liste des documents)
 *   POST   /drivers/:id/documents      (upload document)
 *   DELETE /drivers/documents/:documentId
 *   POST   /drivers/:id/photo          (upload / remplacement photo)
 *   DELETE /drivers/:id/photo          (suppression photo)
 *
 * Les statuts API (available/on_trip/on_leave/suspended/inactive) sont
 * traduits vers les codes UI (disponible/en_mission/conge/suspendu/
 * indisponible) pour conserver les composants AgencyDriver* inchangés.
 */

/* ── Traduction statuts ────────────────────────────────────────── */
export const STATUS_TO_UI = {
  available: 'disponible',
  on_trip: 'en_mission',
  on_leave: 'conge',
  suspended: 'suspendu',
  inactive: 'indisponible',
};

export const UI_TO_STATUS = {
  disponible: 'available',
  en_mission: 'on_trip',
  repos: 'available',
  conge: 'on_leave',
  suspendu: 'suspended',
  indisponible: 'inactive',
};

/* ── Helpers ───────────────────────────────────────────────────── */
const defaultPerformance = () => ({
  totalTrips: 0,
  totalKm: 0,
  punctuality: 0,
  punctuation: 0,
  satisfaction: 0,
  incidents: 0,
  yearsService: 0,
});

/** Construit la carte booléenne `documents` attendue par AgencyDriverDocuments. */
const mapDocumentFlags = (documents) => {
  const flags = { license: false, nationalId: false, contract: false, medical: false, certificates: false };
  (documents || []).forEach((doc) => {
    const t = String(doc.type || '').toLowerCase();
    if (['permis', 'license', 'conduire', 'permis_de_conduire'].includes(t)) flags.license = true;
    else if (['cnib', 'nationalid', 'cni', 'identite', 'piece'].includes(t)) flags.nationalId = true;
    else if (['contrat', 'contract'].includes(t)) flags.contract = true;
    else if (['medical', 'medico', 'visite', 'visite_medicale'].includes(t)) flags.medical = true;
    else if (['certificat', 'certificates', 'formation'].includes(t)) flags.certificates = true;
  });
  return flags;
};

/** Mét en forme un chauffeur API → structure attendue par les composants AgencyDriver*. */
export const mapDriver = (d) => {
  const trip = d.currentTrip;
  const tripLabel = d.currentTripLabel
    || (trip ? `${trip.from || '—'} → ${trip.to || '—'} · ${trip.date || ''}` : null);
  const performance = d.performance
    ? {
        ...defaultPerformance(),
        totalTrips: Number(d.performance.totalTrips) || 0,
        totalKm: Number(d.performance.totalKm) || 0,
        punctuality: Number(d.performance.punctuality) || 0,
        satisfaction: Number(d.performance.satisfaction) || 0,
        incidents: Number(d.performance.incidents) || 0,
        yearsService: Number(d.performance.yearsService) || 0,
      }
    : defaultPerformance();
  performance.punctuation = performance.punctuality;

  return {
    id: d.id,
    matricule: d.matricule || '',
    firstName: d.firstName || '',
    lastName: d.lastName || '',
    phone: d.phone || '',
    email: d.email || '',
    address: d.address || '',
    city: d.city || '',
    country: d.country || 'Cameroun',
    dateOfBirth: d.dateOfBirth || '',
    gender: d.gender || 'M',
    nationality: d.nationality || '',
    photoUrl: d.photoUrl || null,
    hireDate: d.hireDate || '',
    observations: d.observations || '',
    experience: Number(d.experience) || 0,
    licenseNumber: d.licenseNumber || '',
    licenseCategory: d.licenseCategory || '',
    licenseObtained: d.licenseObtained || '',
    licenseExpiry: d.licenseExpiry || '',
    status: STATUS_TO_UI[d.status] || d.status || 'disponible',
    agenceId: d.agenceId || '',
    agenceName: d.agenceName || '',
    compagnieId: d.compagnieId || null,
    companyName: d.companyName || '',
    assignedBusId: d.assignedBus || null,
    assignedBus: d.currentBus?.plate || d.assignedBus || null,
    currentTrip: tripLabel,
    currentTripId: d.currentTripId || (trip ? trip.id : null),
    performance,
    documents: mapDocumentFlags(d.documents),
    voyages: Array.isArray(d.voyages) ? d.voyages : [],
    affectations: Array.isArray(d.affectations) ? d.affectations : [],
    incidents: Array.isArray(d.incidents) ? d.incidents : [],
  };
};

/** Construit les KPIs de la page à partir des chauffeurs chargés (UI). */
export const mapStats = (drivers) => ({
  total: drivers.length,
  disponible: drivers.filter((d) => d.status === 'disponible').length,
  en_mission: drivers.filter((d) => d.status === 'en_mission').length,
  repos: drivers.filter((d) => d.status === 'repos').length,
  conge: drivers.filter((d) => d.status === 'conge').length,
  suspendu: drivers.filter((d) => d.status === 'suspendu').length,
  indisponible: drivers.filter((d) => d.status === 'indisponible').length,
  avgExperience: drivers.length
    ? Math.round(drivers.reduce((acc, d) => acc + (d.experience || 0), 0) / drivers.length)
    : 0,
});

/** Construit le payload d'écriture (formulaire modal → API). */
const buildPayload = (form) => {
  const payload = {};
  if (form.firstName !== undefined) payload.firstName = form.firstName;
  if (form.lastName !== undefined) payload.lastName = form.lastName;
  if (form.phone !== undefined) payload.phone = form.phone;
  if (form.email !== undefined) payload.email = form.email;
  if (form.dateOfBirth !== undefined) payload.dateOfBirth = form.dateOfBirth || null;
  if (form.gender !== undefined) payload.gender = form.gender;
  if (form.address !== undefined) payload.address = form.address || null;
  if (form.city !== undefined) payload.city = form.city || null;
  if (form.country !== undefined) payload.country = form.country || null;
  if (form.licenseNumber !== undefined) payload.licenseNumber = form.licenseNumber;
  if (form.licenseCategory !== undefined) payload.licenseCategory = form.licenseCategory || null;
  if (form.licenseObtained !== undefined) payload.licenseObtained = form.licenseObtained || null;
  if (form.licenseExpiry !== undefined) payload.licenseExpiry = form.licenseExpiry || null;
  if (form.experience !== undefined) payload.experience = Number(form.experience) || 0;
  if (form.hireDate !== undefined) payload.hireDate = form.hireDate || null;
  if (form.observations !== undefined) payload.observations = form.observations || null;
  if (form.status !== undefined) payload.status = UI_TO_STATUS[form.status] || form.status || 'available';
  if (form.agenceId !== undefined) payload.agenceId = form.agenceId;
  if (form.assignedBus !== undefined) payload.assignedBusId = form.assignedBus || null;
  return payload;
};

/* ── Méthodes API ───────────────────────────────────────────────── */
const driverService = {
  /** Liste paginée brute (non mappée). */
  list: async (params = {}) => {
    const data = await apiClient.get('/drivers', { params });
    return data;
  },

  /** Tous les chauffeurs (pages cumulées, sans les chauffeurs supprimés) mappés pour l'UI. */
  getAll: async (params = {}) => {
    const first = await driverService.list({ ...params, page: 1, limit: 100 });
    let items = [...first.items];
    let page = 2;
    while (page <= first.totalPages && items.length < first.total) {
      const next = await driverService.list({ ...params, page, limit: 100 });
      items = items.concat(next.items);
      page += 1;
    }
    return items.filter((d) => d.status !== 'inactive').map(mapDriver);
  },

  getById: async (id) => {
    const data = await apiClient.get(`/drivers/${id}`);
    return mapDriver(data);
  },

  create: async (form) => {
    const data = await apiClient.post('/drivers', buildPayload(form));
    return mapDriver(data);
  },

  update: async (id, form) => {
    const data = await apiClient.patch(`/drivers/${id}`, buildPayload(form));
    return mapDriver(data);
  },

  /** Changement de statut (statut API : available/on_trip/on_leave/suspended/inactive). */
  updateStatus: async (id, statut, raison) => {
    const data = await apiClient.patch(`/drivers/${id}/status`, { statut, raison: raison || null });
    return data;
  },

  remove: async (id) => {
    const data = await apiClient.delete(`/drivers/${id}`);
    return data;
  },

  getStats: async () => {
    const data = await apiClient.get('/drivers/stats');
    return data;
  },

  getAvailability: async (id) => {
    const data = await apiClient.get(`/drivers/${id}/availability`);
    return data;
  },

  listVoyages: async (id) => {
    const data = await apiClient.get(`/drivers/${id}/voyages`);
    return data || [];
  },

  listAffectations: async (id) => {
    const data = await apiClient.get(`/drivers/${id}/affectations`);
    return data || [];
  },

  setTrip: async (id, departId) => {
    const data = await apiClient.patch(`/drivers/${id}/trip`, { departId: departId || null });
    return data;
  },

  listIncidents: async (id) => {
    const data = await apiClient.get(`/drivers/${id}/incidents`);
    return data || [];
  },

  createIncident: async (id, data) => {
    const result = await apiClient.post(`/drivers/${id}/incidents`, data);
    return result;
  },

  updateIncident: async (incidentId, data) => {
    const result = await apiClient.patch(`/drivers/incidents/${incidentId}`, data);
    return result;
  },

  deleteIncident: async (incidentId) => {
    const data = await apiClient.delete(`/drivers/incidents/${incidentId}`);
    return data;
  },

  listDocuments: async (id) => {
    const data = await apiClient.get(`/drivers/${id}/documents`);
    return data || [];
  },

  uploadDocument: async (id, file, type, notes) => {
    const formData = new FormData();
    formData.append('document', file);
    if (type) formData.append('type', type);
    if (notes) formData.append('notes', notes);
    const data = await apiClient.post(`/drivers/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteDocument: async (documentId) => {
    const data = await apiClient.delete(`/drivers/documents/${documentId}`);
    return data;
  },

  uploadPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const data = await apiClient.post(`/drivers/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deletePhoto: async (id) => {
    const data = await apiClient.delete(`/drivers/${id}/photo`);
    return data;
  },
};

export default driverService;
