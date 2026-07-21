const PaymentSummary = ({ reservation, selectedSeats, promoDiscount, insurance, total }) => {
  const seatCount = reservation.seats.length;
  const subtotal = reservation.pricePerSeat * seatCount;
  const insurancePrice = insurance ? 1500 : 0;
  const fees = 500;
  const discount = promoDiscount || 0;
  const finalTotal = total || subtotal + insurancePrice + fees - discount;

  return (
    <div className="btc-payment-summary card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
          <i className="bi bi-receipt me-2" style={{ color: 'var(--color-accent)' }} />
          Resume de reservation
        </h6>

        {/* Company + Route */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-bold)', fontSize: '0.85rem' }}
          >
            {reservation.companyName.charAt(0)}
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{reservation.companyName}</div>
            <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>N° {reservation.tripNumber}</div>
          </div>
        </div>

        {/* Route */}
        <div className="p-3 mb-3" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{reservation.departureCity}</span>
            <i className="bi bi-arrow-right" style={{ fontSize: '0.7rem', color: 'var(--color-accent)' }} />
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{reservation.arrivalCity}</span>
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {reservation.departureDate && new Date(reservation.departureDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            {' · '}{reservation.departureTime} — {reservation.arrivalTime}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {reservation.busType} · {reservation.duration}
          </div>
        </div>

        {/* Seats */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {reservation.seats.map((seat) => (
            <span
              key={seat.number}
              className="d-inline-flex align-items-center justify-content-center"
              style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', color: 'var(--color-white)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-bold)' }}
            >
              {seat.number}
            </span>
          ))}
          <span className="d-flex align-items-center ms-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {seatCount} siege{seatCount > 1 ? 's' : ''}
          </span>
        </div>

        <div className="btc-summary-line mb-2 d-flex justify-content-between">
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            {reservation.pricePerSeat.toLocaleString()} FCFA × {seatCount}
          </span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
            {subtotal.toLocaleString()} FCFA
          </span>
        </div>

        {insurance && (
          <div className="btc-summary-line mb-2 d-flex justify-content-between">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Assurance voyage</span>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>1 500 FCFA</span>
          </div>
        )}

        <div className="btc-summary-line mb-2 d-flex justify-content-between">
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Frais de service</span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>500 FCFA</span>
        </div>

        {discount > 0 && (
          <div className="btc-summary-line mb-2 d-flex justify-content-between">
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>Reduction</span>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success)' }}>-{discount.toLocaleString()} FCFA</span>
          </div>
        )}

        <div className="d-flex justify-content-between pt-2 mt-2" style={{ borderTop: '2px solid var(--border-default)' }}>
          <span className="fw-bold" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>Total</span>
          <span className="fw-bold" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-accent)' }}>
            {finalTotal.toLocaleString()} <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>FCFA</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
