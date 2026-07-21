import React from 'react';
import TripCard from './TripCard';
import SearchEmptyState from './SearchEmptyState';

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommandé', icon: 'bi-hand-thumbs-up' },
  { id: 'price_asc', label: 'Prix ↑', icon: 'bi-arrow-up-short' },
  { id: 'price_desc', label: 'Prix ↓', icon: 'bi-arrow-down-short' },
  { id: 'duration', label: 'Durée', icon: 'bi-hourglass-split' },
  { id: 'departure', label: 'Départ', icon: 'bi-clock' },
  { id: 'rating', label: 'Note', icon: 'bi-star' },
];

const TripResults = React.memo(({ trips = [], onBook, sortBy, onSortChange, onViewDetails, onModifySearch }) => {
  return (
    <div className="btc-trip-results">
      {/* Sort Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 'var(--font-size-sm, 0.875rem)', color: 'var(--text-secondary, #4b5563)' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary, #111827)' }}>{trips.length}</span>
          {' '}
          {trips.length === 1 ? 'voyage disponible' : 'voyages disponibles'}
        </span>

        {/* Premium sort pills */}
        <div
          role="radiogroup"
          aria-label="Trier les résultats"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 4,
            borderRadius: 14,
            background: 'var(--color-gray-50, #fafafa)',
            border: '1px solid var(--color-gray-100, #f3f4f6)',
          }}
        >
          {SORT_OPTIONS.map((opt) => {
            const isActive = sortBy === opt.id;
            return (
              <button
                key={opt.id}
                role="radio"
                aria-checked={isActive}
                aria-label={`Trier par ${opt.label}`}
                onClick={() => onSortChange(opt.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '7px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive ? 'var(--color-primary, #0B1D51)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary, #4b5563)',
                  fontSize: 'var(--font-size-xs, 0.75rem)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                }}
              >
                <i className={`bi ${opt.icon}`} style={{ fontSize: '0.7rem' }} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trip Cards */}
      {trips.length === 0 ? (
        <SearchEmptyState onModifySearch={onModifySearch} />
      ) : (
        trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onBook={onBook} onViewDetails={onViewDetails} />
        ))
      )}
    </div>
  );
});

TripResults.displayName = 'TripResults';

export { SORT_OPTIONS };
export default TripResults;
