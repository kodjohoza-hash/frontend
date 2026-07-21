const BookingSuccessCard = ({ booking }) => {
  const date = new Date(booking.createdAt);

  return (
    <div className="btc-success-card card border-0 text-center mb-4" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
      <div className="card-body p-4 p-md-5">
        <div className="btc-success-icon mx-auto mb-3">
          <div className="btc-success-check-circle">
            <i className="bi bi-check-lg" />
          </div>
        </div>

        <h4 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Votre reservation est confirmee !
        </h4>
        <p className="mb-4" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
          Merci pour votre confiance. Votre billet electronique est maintenant disponible.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <div className="btc-confirm-info-pill">
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>N° Reservation</span>
            <span className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>{booking.id}</span>
          </div>
          <div className="btc-confirm-info-pill">
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Reference</span>
            <span className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{booking.reference}</span>
          </div>
          <div className="btc-confirm-info-pill">
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Date</span>
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
              {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="btc-confirm-info-pill">
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)' }}>
              <i className="bi bi-check-circle-fill me-1" />
              Confirmee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessCard;
