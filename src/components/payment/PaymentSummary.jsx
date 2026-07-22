import React from 'react';

const keyframes = `
  @keyframes btcFadeInUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const styles = {
  card: {
    borderRadius: 'var(--radius-xl)',
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
    animation: 'btcFadeInUp 0.5s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    borderBottom: '1px solid var(--color-gray-100)',
  },
  companyAvatar: (color) => ({
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-md)',
    background: color || 'var(--color-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.85rem',
    flexShrink: 0,
  }),
  companyName: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  tripNumber: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    marginTop: 1,
  },
  busPhoto: {
    width: '100%',
    height: 140,
    objectFit: 'cover',
    display: 'block',
  },
  routeSection: {
    padding: '16px 20px',
  },
  routeVisual: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  city: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  routeArrow: {
    flex: 1,
    height: 2,
    background: 'var(--color-gray-200)',
    position: 'relative',
    borderRadius: 1,
  },
  routeDot: (left) => ({
    position: 'absolute',
    top: -3,
    left: left ? 0 : 'auto',
    right: left ? 'auto' : 0,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--color-accent)',
    border: '2px solid #fff',
    boxShadow: '0 0 0 2px var(--color-accent)',
  }),
  routeTime: (align) => ({
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    textAlign: align,
  }),
  routeDate: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: 4,
  },
  routeDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  badge: (bg, color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 8px',
    borderRadius: 'var(--radius-sm)',
    background: bg,
    color: color,
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
  }),
  seatsSection: {
    padding: '0 20px 16px',
  },
  seatsTitle: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  seatsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  seatBadge: (num) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-primary)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
  }),
  seatPos: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    marginLeft: 2,
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    background: 'var(--color-gray-100)',
    margin: '0 20px',
  },
  priceSection: {
    padding: '16px 20px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
  },
  priceValue: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  discountValue: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--color-success)',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 4,
    borderTop: '2px solid var(--color-gray-200)',
  },
  totalLabel: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  totalValue: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: 'var(--color-accent)',
  },
  totalCurrency: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginLeft: 3,
  },
};

const PaymentSummary = React.memo(({ reservation, selectedSeats, promoDiscount, insurance, total }) => {
  const seatCount = reservation.seats.length;
  const subtotal = reservation.pricePerSeat * seatCount;
  const insurancePrice = insurance ? 1500 : 0;
  const fees = 500;
  const discount = promoDiscount || 0;
  const finalTotal = total || subtotal + insurancePrice + fees - discount;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.companyAvatar(reservation.companyColor)}>
            {reservation.companyInitial || reservation.companyName.charAt(0)}
          </div>
          <div>
            <div style={styles.companyName}>{reservation.companyName}</div>
            <div style={styles.tripNumber}>N° {reservation.tripNumber}</div>
          </div>
        </div>

        {reservation.busPhoto && (
          <img
            src={reservation.busPhoto}
            alt={`Bus ${reservation.companyName}`}
            style={styles.busPhoto}
          />
        )}

        <div style={styles.routeSection}>
          <div style={styles.routeVisual}>
            <span style={styles.city}>{reservation.departureCity}</span>
            <div style={styles.routeArrow}>
              <div style={styles.routeDot(true)} />
              <div style={styles.routeDot(false)} />
            </div>
            <span style={styles.city}>{reservation.arrivalCity}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={styles.routeTime('left')}>{reservation.departureTime}</span>
            <span style={styles.routeTime('right')}>{reservation.arrivalTime}</span>
          </div>
          <div style={styles.routeDate}>
            {formatDate(reservation.departureDate)} · {reservation.duration}
            {reservation.distance && ` · ${reservation.distance}`}
          </div>
          <div style={styles.routeDetails}>
            <span style={styles.badge('rgba(11, 29, 81, 0.08)', 'var(--color-primary)')}>
              {reservation.busType}
            </span>
            {reservation.busNumber && (
              <span style={styles.badge('var(--color-gray-50)', 'var(--text-muted)')}>
                <i className="bi bi-bus-front" style={{ marginRight: 4, fontSize: '0.6rem' }} />
                {reservation.busNumber}
              </span>
            )}
          </div>
        </div>

        <div style={styles.seatsSection}>
          <div style={styles.seatsTitle}>Sièges sélectionnés</div>
          <div style={styles.seatsRow}>
            {reservation.seats.map((seat) => (
              <span key={seat.number} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={styles.seatBadge(seat.number)}>{seat.number}</span>
                <span style={styles.seatPos}>{seat.position}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.priceSection}>
          <div style={styles.priceRow}>
            <span style={styles.priceLabel}>
              {reservation.pricePerSeat.toLocaleString()} FCFA × {seatCount}
            </span>
            <span style={styles.priceValue}>{subtotal.toLocaleString()} FCFA</span>
          </div>

          <div style={styles.priceRow}>
            <span style={styles.priceLabel}>Frais de service</span>
            <span style={styles.priceValue}>500 FCFA</span>
          </div>

          {insurance && (
            <div style={styles.priceRow}>
              <span style={styles.priceLabel}>Assurance voyage</span>
              <span style={styles.priceValue}>1 500 FCFA</span>
            </div>
          )}

          {discount > 0 && (
            <div style={styles.priceRow}>
              <span style={styles.discountValue}>Réduction promo</span>
              <span style={styles.discountValue}>-{discount.toLocaleString()} FCFA</span>
            </div>
          )}

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>
              {finalTotal.toLocaleString()}
              <span style={styles.totalCurrency}>FCFA</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
});

export default PaymentSummary;
