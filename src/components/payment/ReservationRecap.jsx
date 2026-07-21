const ReservationRecap = ({ reservation }) => (
  <div className="btc-reservation-recap card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
    <div className="card-body p-4">
      <h6 className="fw-semibold mb-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
        <i className="bi bi-info-circle-fill me-2" style={{ color: 'var(--color-primary)' }} />
        Informations importantes
      </h6>

      <div className="d-flex flex-column gap-3">
        <div className="d-flex align-items-start gap-2">
          <i className="bi bi-box" style={{ color: 'var(--color-accent)', marginTop: 2, fontSize: '0.85rem' }} />
          <div>
            <div className="fw-medium" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>Bagages inclus</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{reservation.baggageIncluded}</div>
          </div>
        </div>

        <div className="d-flex align-items-start gap-2">
          <i className="bi bi-list-check" style={{ color: 'var(--color-accent)', marginTop: 2, fontSize: '0.85rem' }} />
          <div>
            <div className="fw-medium" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>Services inclus</div>
            <div className="d-flex flex-wrap gap-1 mt-1">
              {reservation.servicesIncluded.map((svc) => (
                <span
                  key={svc}
                  className="px-2 py-1 rounded"
                  style={{ fontSize: 'var(--font-size-2xs)', background: 'var(--color-success-50)', color: 'var(--color-success)', fontWeight: 'var(--font-weight-medium)' }}
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-start gap-2">
          <i className="bi bi-shield-check" style={{ color: 'var(--color-accent)', marginTop: 2, fontSize: '0.85rem' }} />
          <div>
            <div className="fw-medium" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>Conditions d'annulation</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{reservation.cancellationPolicy}</div>
          </div>
        </div>

        <div className="d-flex align-items-start gap-2">
          <i className="bi bi-arrow-return-left" style={{ color: 'var(--color-accent)', marginTop: 2, fontSize: '0.85rem' }} />
          <div>
            <div className="fw-medium" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>Politique de remboursement</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{reservation.refundPolicy}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReservationRecap;
