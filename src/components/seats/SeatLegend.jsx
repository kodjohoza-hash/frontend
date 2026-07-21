const legendItems = [
  { state: 'available', label: 'Disponible', icon: null },
  { state: 'occupied', label: 'Occupé', icon: null },
  { state: 'reserved', label: 'Réservé', icon: null },
  { state: 'selected', label: 'Sélectionné', icon: null },
  { state: 'vip', label: 'VIP', icon: 'bi-star-fill' },
  { state: 'pmr', label: 'PMR', icon: 'bi-universal-access' },
];

const SeatLegend = ({ availableCount, totalCount }) => (
  <div className="btc-seat-legend" role="region" aria-label="Legende des sieges">
    <div className="d-flex align-items-center justify-content-between mb-2">
      <h6 className="fw-semibold mb-0" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
        Legende
      </h6>
      <span
        className="d-inline-flex align-items-center gap-1"
        style={{
          fontSize: 'var(--font-size-xs)',
          color: availableCount <= 5 ? 'var(--color-danger)' : 'var(--color-success)',
          fontWeight: 'var(--font-weight-semibold)',
        }}
      >
        <span
          className="d-inline-block rounded-circle"
          style={{
            width: 6,
            height: 6,
            background: availableCount <= 5 ? 'var(--color-danger)' : 'var(--color-success)',
            animation: availableCount <= 5 ? 'btc-pulse-dot 1.5s infinite' : 'none',
          }}
        />
        {availableCount} place{availableCount !== 1 ? 's' : ''} sur {totalCount}
      </span>
    </div>
    <div className="btc-legend-grid">
      {legendItems.map((item) => (
        <div key={item.state} className="btc-legend-item">
          <div className={`btc-legend-swatch btc-legend-${item.state}`}>
            {item.icon && <i className={`bi ${item.icon}`} style={{ fontSize: '0.6rem' }} />}
          </div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SeatLegend;
