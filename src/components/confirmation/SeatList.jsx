const SeatList = ({ seats }) => (
  <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
    <div className="card-body p-4">
      <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
        <i className="bi bi-grid-3x3-gap-fill me-2" style={{ color: 'var(--color-accent)' }} />
        Sieges attribues
      </h6>
      <div className="d-flex flex-wrap gap-2">
        {seats.map((seat) => (
          <div
            key={seat.number}
            className="btc-seat-badge d-inline-flex align-items-center gap-1 px-3 py-2"
            style={{
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: 'var(--color-white)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '0.03em',
            }}
          >
            <span style={{ fontSize: '0.7em', fontWeight: 'var(--font-weight-medium)', opacity: 0.8 }}>
              {seat.type}
            </span>
            {String(seat.number).padStart(2, '0')}
          </div>
        ))}
      </div>
      <div className="mt-2" style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>
        {seats.map((s) => `Siege ${String(s.number).padStart(2, '0')} — ${s.position === 'window' ? 'Fenetre' : 'Couloir'}`).join(' · ')}
      </div>
    </div>
  </div>
);

export default SeatList;
