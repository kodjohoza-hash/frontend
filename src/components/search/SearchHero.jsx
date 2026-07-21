import React from 'react';

const SearchHero = React.memo(({ searchParams, resultCount, onModifySearch }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const classLabels = { economy: 'Économique', business: 'Business', first: 'VIP' };

  return (
    <div
      className="btc-search-hero"
      role="region"
      aria-label="Résumé de la recherche"
      style={{
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.45)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(11, 29, 81, 0.08), 0 2px 8px rgba(11, 29, 81, 0.04)',
        padding: '28px 36px',
        marginBottom: 32,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {/* Route */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                fontSize: '1.55rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              {searchParams.departure}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--color-accent)',
                color: '#fff',
                fontSize: '0.95rem',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <i className="bi bi-arrow-right" />
            </div>
            <span
              style={{
                fontSize: '1.55rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              {searchParams.destination}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 32,
              background: 'var(--color-gray-200)',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />

          {/* Details */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              flexWrap: 'wrap',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-calendar3" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }} />
              {formatDate(searchParams.departureDate)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-person" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }} />
              {searchParams.passengers} {searchParams.passengers === 1 ? 'Voyageur' : 'Voyageurs'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-gem" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }} />
              {classLabels[searchParams.travelClass] || 'Économique'}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Result count badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 20,
              background: 'var(--color-primary-50, rgba(11, 29, 81, 0.06))',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              color: 'var(--color-primary)',
            }}
            aria-label={`${resultCount} résultat${resultCount !== 1 ? 's' : ''}`}
          >
            <i className="bi bi-list-ul" style={{ fontSize: '0.8rem' }} />
            {resultCount} {resultCount === 1 ? 'résultat' : 'résultats'}
          </div>

          {/* Modify search button */}
          <button
            onClick={onModifySearch}
            aria-label="Modifier la recherche"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 14,
              border: '1px solid var(--color-primary)',
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary-light, #1a2d6a)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 29, 81, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-primary)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="bi bi-pencil-square" style={{ fontSize: '0.8rem' }} />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
});

SearchHero.displayName = 'SearchHero';

export default SearchHero;
