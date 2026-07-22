import React, { memo, useMemo } from 'react';

const s = {
  card: {
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
    position: 'sticky',
    top: '24px',
    fontFamily: "'Inter', sans-serif",
  },
  busPhoto: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    display: 'block',
  },
  body: {
    padding: '20px',
  },
  companyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '18px',
  },
  avatar: (color) => ({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: color || '#0B1D51',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    flexShrink: 0,
  }),
  companyName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    fontFamily: "'Inter', sans-serif",
  },
  tripNumber: {
    fontSize: '11px',
    color: '#94a3b8',
    fontFamily: "'Inter', sans-serif",
    marginTop: '1px',
  },
  timeline: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px',
    position: 'relative',
    padding: '0 4px',
  },
  timelineDot: (color) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: color || '#6366f1',
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
    boxShadow: `0 0 0 4px ${color || '#6366f1'}22`,
  }),
  timelineLine: {
    position: 'absolute',
    top: '5px',
    left: '10px',
    right: '10px',
    height: '2px',
    background: 'repeating-linear-gradient(90deg, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px)',
    zIndex: 1,
  },
  cityInfo: {
    flex: 1,
  },
  city: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#0f172a',
    fontFamily: "'Inter', sans-serif",
  },
  time: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748b',
    fontFamily: "'Inter', sans-serif",
    marginTop: '2px',
  },
  dateRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '10px 14px',
    background: '#f8fafc',
    borderRadius: '10px',
  },
  dateText: {
    fontSize: '12px',
    color: '#64748b',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
  },
  seatsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '16px',
  },
  seatBadge: {
    padding: '4px 10px',
    borderRadius: '8px',
    background: '#eff6ff',
    color: '#3b82f6',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    border: '1px solid #dbeafe',
  },
  divider: {
    height: '1px',
    background: '#f1f5f9',
    margin: '16px 0',
  },
  priceRow: (isTotal) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isTotal ? '0' : '4px 0',
    marginBottom: isTotal ? '0' : '4px',
  }),
  priceLabel: (isTotal) => ({
    fontSize: isTotal ? '16px' : '13px',
    fontWeight: isTotal ? 700 : 400,
    color: isTotal ? '#0f172a' : '#64748b',
    fontFamily: "'Inter', sans-serif",
  }),
  priceValue: (isTotal, isDiscount) => ({
    fontSize: isTotal ? '18px' : '13px',
    fontWeight: isTotal ? 800 : 600,
    color: isDiscount ? '#10b981' : isTotal ? '#6366f1' : '#1e293b',
    fontFamily: "'Inter', sans-serif",
  }),
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '2px solid #f1f5f9',
  },
};

const formatXAF = (amount) => new Intl.NumberFormat('fr-CM').format(amount) + ' FCFA';

const PaySummary = memo(({ reservation, selectedSeats = [], promoDiscount = 0, insurance = false, insurancePrice = 0, total = 0 }) => {
  const subtotal = useMemo(() => {
    const seats = selectedSeats.length || reservation.seats.length;
    return reservation.pricePerSeat * seats;
  }, [reservation, selectedSeats]);

  const serviceFee = useMemo(() => Math.round(subtotal * 0.02), [subtotal]);

  const formattedDate = useMemo(() => {
    try {
      return new Date(reservation.departureDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return reservation.departureDate;
    }
  }, [reservation.departureDate]);

  return (
    <div style={s.card} aria-label="Résumé de la réservation">
      {reservation.busPhoto && (
        <img src={reservation.busPhoto} alt="" style={s.busPhoto} loading="lazy" />
      )}

      <div style={s.body}>
        <div style={s.companyRow}>
          <div style={s.avatar(reservation.companyColor)}>
            {reservation.companyInitial}
          </div>
          <div>
            <div style={s.companyName}>{reservation.companyName}</div>
            <div style={s.tripNumber}>{reservation.tripNumber}</div>
          </div>
        </div>

        <div style={s.timeline}>
          <div style={s.timelineLine} aria-hidden="true" />
          <div style={s.cityInfo}>
            <div style={s.timelineDot('#6366f1')} />
            <div style={{ ...s.city, marginTop: '10px' }}>{reservation.departureCity}</div>
            <div style={s.time}>{reservation.departureTime}</div>
          </div>
          <div style={{ ...s.cityInfo, textAlign: 'right', alignItems: 'flex-end', display: 'flex', flexDirection: 'column' }}>
            <div style={s.timelineDot('#10b981')} />
            <div style={{ ...s.city, marginTop: '10px' }}>{reservation.arrivalCity}</div>
            <div style={s.time}>{reservation.arrivalTime}</div>
          </div>
        </div>

        <div style={s.dateRow}>
          <span style={s.dateText}>{formattedDate}</span>
          <span style={s.dateText}>{reservation.duration}</span>
        </div>

        <div style={s.seatsRow}>
          {(selectedSeats.length ? selectedSeats : reservation.seats).map(seat => (
            <span key={seat.number} style={s.seatBadge}>
              Siège {seat.number} — {seat.position}
            </span>
          ))}
        </div>

        <div style={s.divider} />

        <div style={s.priceRow(false)}>
          <span style={s.priceLabel(false)}>
            Prix × {(selectedSeats.length || reservation.seats.length)} siège{(selectedSeats.length || reservation.seats.length) > 1 ? 's' : ''}
          </span>
          <span style={s.priceValue(false)}>{formatXAF(subtotal)}</span>
        </div>

        <div style={s.priceRow(false)}>
          <span style={s.priceLabel(false)}>Frais de service</span>
          <span style={s.priceValue(false)}>{formatXAF(serviceFee)}</span>
        </div>

        {insurance && (
          <div style={s.priceRow(false)}>
            <span style={s.priceLabel(false)}>Assurance voyage</span>
            <span style={s.priceValue(false)}>{formatXAF(insurancePrice)}</span>
          </div>
        )}

        {promoDiscount > 0 && (
          <div style={s.priceRow(false)}>
            <span style={s.priceLabel(false)}>Réduction</span>
            <span style={s.priceValue(false, true)}>- {formatXAF(promoDiscount)}</span>
          </div>
        )}

        <div style={s.totalRow}>
          <span style={s.priceLabel(true)}>Total</span>
          <span style={s.priceValue(true)}>{formatXAF(total)}</span>
        </div>
      </div>
    </div>
  );
});

PaySummary.displayName = 'PaySummary';
export default PaySummary;
