import QRCodePlaceholder from './QRCodePlaceholder';
import BarcodePlaceholder from './BarcodePlaceholder';
import BookingStatusBadge from './BookingStatusBadge';

const ETicketCard = ({ booking, trip, passengers, seats, payment }) => {
  const date = new Date(trip.departureDate + 'T00:00:00');

  return (
    <div className="btc-eticket card border-0 mb-4" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
      {/* Ticket Header */}
      <div className="btc-eticket-header text-center" style={{ background: 'var(--color-primary)', color: 'var(--color-white)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', padding: '20px 24px 16px' }}>
        <div className="fw-bold" style={{ fontSize: 'var(--font-size-xl)', letterSpacing: '-0.01em' }}>BILLET ELECTRONIQUE</div>
        <div style={{ fontSize: 'var(--font-size-2xs)', opacity: 0.75, letterSpacing: '0.12em' }}>BUS TIX CONNECT</div>
      </div>

      {/* Perforation line */}
      <div className="btc-perforation mx-auto" />

      <div className="card-body p-4 p-md-5">
        {/* Status + Reference */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <BookingStatusBadge status={booking.status} />
          <div className="text-end">
            <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>N° {booking.id}</div>
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', letterSpacing: '0.03em' }}>{booking.reference}</div>
          </div>
        </div>

        {/* Route */}
        <div className="text-center mb-4 p-3" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
          <div className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{trip.companyName}</div>
          <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
            <div className="text-center">
              <div className="fw-bold" style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', lineHeight: 1 }}>{trip.departureTime}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-semibold)' }}>{trip.departureCity}</div>
            </div>
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-arrow-right" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-accent)' }} />
              <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>{trip.duration}</div>
            </div>
            <div className="text-center">
              <div className="fw-bold" style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', lineHeight: 1 }}>{trip.arrivalTime}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 'var(--font-weight-semibold)' }}>{trip.arrivalCity}</div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>Date</div>
            <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
              {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>Bus</div>
            <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{trip.busNumber}</div>
          </div>
          <div className="col-6 col-lg-3">
            <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>Sieges</div>
            <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
              {seats.map((s) => String(s.number).padStart(2, '0')).join(', ')}
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>Total</div>
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent)' }}>
              {payment.amount.toLocaleString()} FCFA
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className="mb-4">
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', marginBottom: 6 }}>PASSAGERS</div>
          <div className="d-flex flex-column gap-1">
            {passengers.map((pax, idx) => (
              <div key={pax.id} className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: idx < passengers.length - 1 ? '1px dashed var(--color-gray-200)' : 'none' }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{pax.firstName} {pax.lastName}</span>
                </div>
                <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>{pax.phone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Perforation */}
        <div className="btc-perforation mx-auto" />

        {/* QR + Barcode */}
        <div className="d-flex flex-column align-items-center pt-4">
          <QRCodePlaceholder size={110} />
          <div className="mt-3 w-100" style={{ maxWidth: 240 }}>
            <BarcodePlaceholder value={booking.reference} height={44} />
          </div>
          <div className="mt-2 text-center" style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>
            Presentez ce billet au conducteur (numerique ou imprime)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETicketCard;
