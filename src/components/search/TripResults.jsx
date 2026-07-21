import TripCard from './TripCard';
import EmptyState from '@components/client/EmptyState';

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommandé' },
  { id: 'price_asc', label: 'Prix croissant' },
  { id: 'price_desc', label: 'Prix décroissant' },
  { id: 'duration', label: 'Durée la plus courte' },
  { id: 'departure', label: 'Départ le plus tôt' },
  { id: 'rating', label: 'Meilleure note' },
];

const TripResults = ({ trips = [], onBook, sortBy, onSortChange }) => {
  if (trips.length === 0) {
    return (
      <EmptyState
        icon="bi-bus-front"
        title="Aucun voyage disponible"
        description="Aucun voyage ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou votre recherche."
        actionLabel="Modifier la recherche"
        actionPath="#"
      />
    );
  }

  return (
    <div className="btc-trip-results">
      {/* Sort Bar */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          {trips.length} {trips.length === 1 ? 'voyage disponible' : 'voyages disponibles'}
        </span>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="sort-select" className="d-none d-sm-inline" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            Trier par
          </label>
          <select
            id="sort-select"
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              width: 'auto',
              fontSize: 'var(--font-size-xs)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-default)',
              padding: '4px 28px 4px 10px',
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface)',
            }}
            aria-label="Trier les résultats"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trip Cards */}
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} onBook={onBook} />
      ))}
    </div>
  );
};

export default TripResults;
