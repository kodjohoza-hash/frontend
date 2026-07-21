import { Link } from 'react-router-dom';

const SearchSummary = ({ searchParams, resultCount, onModifySearch }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const classLabels = { economy: 'Économique', business: 'Business', first: 'VIP' };

  return (
    <div className="btc-search-summary card border-0 mb-4" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="card-body p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>
                {searchParams.departure}
              </span>
              <i className="bi bi-arrow-right" style={{ color: 'var(--color-accent)', fontSize: '1rem' }} />
              <span className="fw-bold" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>
                {searchParams.destination}
              </span>
            </div>

            <div className="vr d-none d-sm-block" style={{ height: 24, opacity: 0.2 }} />

            <div className="d-flex align-items-center gap-3 flex-wrap" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              <span className="d-flex align-items-center gap-1">
                <i className="bi bi-calendar3" style={{ color: 'var(--color-accent)' }} />
                {formatDate(searchParams.departureDate)}
              </span>
              <span className="d-flex align-items-center gap-1">
                <i className="bi bi-person" style={{ color: 'var(--color-accent)' }} />
                {searchParams.passengers} {searchParams.passengers === 1 ? 'Voyageur' : 'Voyageurs'}
              </span>
              <span className="d-flex align-items-center gap-1">
                <i className="bi bi-gem" style={{ color: 'var(--color-accent)' }} />
                {classLabels[searchParams.travelClass] || 'Économique'}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
              {resultCount} {resultCount === 1 ? 'voyage trouvé' : 'voyages trouvés'}
            </span>
            <button
              onClick={onModifySearch}
              className="btn btn-sm d-inline-flex align-items-center gap-1"
              style={{
                color: 'var(--color-primary)',
                background: 'var(--color-primary-50)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--font-size-xs)',
                padding: '6px 14px',
                fontWeight: 'var(--font-weight-medium)',
                border: 'none',
              }}
            >
              <i className="bi bi-pencil-square" />
              Modifier la recherche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSummary;
