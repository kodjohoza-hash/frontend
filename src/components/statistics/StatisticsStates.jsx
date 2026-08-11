/**
 * États d'interface réutilisables pour les blocs statistiques :
 * chargement, erreur, données vides.
 */

export const StatisticsLoading = ({ label = 'Chargement des statistiques…' }) => (
  <div className="stats-state stats-state--loading">
    <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export const StatisticsError = ({ message = 'Impossible de charger les données.' }) => (
  <div className="stats-state stats-state--error" role="alert">
    <i className="bi bi-exclamation-triangle-fill" />
    <span>{message}</span>
  </div>
);

export const StatisticsEmpty = ({ message = 'Aucune donnée sur cette période.' }) => (
  <div className="stats-state stats-state--empty">
    <i className="bi bi-inbox" />
    <span>{message}</span>
  </div>
);
