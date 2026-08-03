export const routeStatuses = [
  { value: 'active', label: 'Actif', color: 'success', icon: 'bi-check-circle-fill' },
  { value: 'inactive', label: 'Inactif', color: 'warning', icon: 'bi-pause-circle-fill' },
  { value: 'archived', label: 'Archivé', color: 'muted', icon: 'bi-archive-fill' },
];

export const routeSorts = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'name_asc', label: 'Nom A → Z' },
  { value: 'name_desc', label: 'Nom Z → A' },
  { value: 'distance_asc', label: 'Distance croissante' },
  { value: 'distance_desc', label: 'Distance décroissante' },
  { value: 'duration_asc', label: 'Durée croissante' },
  { value: 'duration_desc', label: 'Durée décroissante' },
];
