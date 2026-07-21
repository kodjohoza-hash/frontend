const PassengerCard = ({ passengers }) => (
  <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
    <div className="card-body p-4">
      <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
        <i className="bi bi-person-fill me-2" style={{ color: 'var(--color-accent)' }} />
        Passagers ({passengers.length})
      </h6>

      <div className="d-flex flex-column gap-2">
        {passengers.map((pax, idx) => (
          <div
            key={pax.id}
            className="d-flex align-items-center gap-3 p-2"
            style={{ borderRadius: 'var(--radius-md)', background: idx === 0 ? 'var(--color-primary-50)' : 'var(--color-gray-50)' }}
          >
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 32, height: 32, borderRadius: '50%', background: idx === 0 ? 'var(--color-primary)' : 'var(--color-gray-200)', color: idx === 0 ? 'var(--color-white)' : 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-bold)' }}
            >
              {pax.firstName.charAt(0)}{pax.lastName.charAt(0)}
            </div>
            <div className="flex-grow-1 min-width-0">
              <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {pax.firstName} {pax.lastName}
              </div>
              <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>
                {pax.phone} · {pax.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PassengerCard;
