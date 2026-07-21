import { SERVICES_CONFIG } from '@data/seatMap';

const TripInfoCard = ({ trip }) => {
  if (!trip) return null;

  const date = new Date(trip.departureDate + 'T00:00:00');
  const formattedDate = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const typeStyle = {
    vip: { bg: 'var(--color-warning-50)', color: 'var(--color-warning)', border: 'var(--color-warning-200)' },
    business: { bg: 'var(--color-primary-50)', color: 'var(--color-primary)', border: 'var(--color-primary-200)' },
    economy: { bg: 'var(--color-gray-100)', color: 'var(--color-gray-600)', border: 'var(--color-gray-200)' },
  };

  const style = typeStyle[trip.busType] || typeStyle.economy;

  return (
    <div className="btc-trip-info card border-0 mb-4" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="card-body p-4">
        {/* Company Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-primary-50)',
                color: 'var(--color-primary)',
                fontWeight: 'var(--font-weight-bold)',
                fontSize: '1.15rem',
              }}
            >
              {trip.companyName.charAt(0)}
            </div>
            <div>
              <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {trip.companyName}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                N° {trip.tripNumber}
              </div>
            </div>
          </div>
          <span
            className="d-inline-flex align-items-center px-2 py-1 rounded"
            style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              background: style.bg,
              color: style.color,
              border: `1px solid ${style.border}`,
            }}
          >
            {trip.busType === 'vip' ? 'VIP' : trip.busType === 'business' ? 'Business' : 'Economique'}
          </span>
        </div>

        {/* Route */}
        <div className="d-flex align-items-center justify-content-between mb-3 p-3" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
          <div className="text-center">
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-primary)' }}>{trip.departureTime}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{trip.departureCity}</div>
          </div>
          <div className="flex-grow-1 mx-3">
            <div className="d-flex align-items-center">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)' }} />
              <div className="flex-grow-1" style={{ height: 2, background: 'var(--color-gray-200)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--color-accent)', borderRadius: 1 }} />
              </div>
              <i className="bi bi-bus-front-fill" style={{ color: 'var(--color-accent)', fontSize: '1rem', margin: '0 -4px' }} />
              <div className="flex-grow-1" style={{ height: 2, background: 'var(--color-gray-200)' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />
            </div>
            <div className="d-flex justify-content-between mt-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              <span>{trip.duration}</span>
              <span>{trip.distance}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-primary)' }}>{trip.arrivalTime}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{trip.arrivalCity}</div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="row g-3">
          <div className="col-4 col-md-3">
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Date</div>
            <div className="fw-semibold" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{formattedDate}</div>
          </div>
          <div className="col-4 col-md-3">
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Prix / siege</div>
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent)' }}>{trip.pricePerSeat?.toLocaleString()} FCFA</div>
          </div>
          <div className="col-4 col-md-3">
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Statut</div>
            <span className="d-inline-flex align-items-center gap-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', fontWeight: 'var(--font-weight-semibold)' }}>
              <span className="d-inline-block rounded-circle" style={{ width: 6, height: 6, background: 'var(--color-success)' }} />
              Disponible
            </span>
          </div>
          <div className="col-12 col-md-3">
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Bagages</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{trip.baggagePolicy}</div>
          </div>
        </div>

        {/* Services */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {SERVICES_CONFIG.map((svc) => (
            <span
              key={svc.id}
              className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded"
              style={{
                fontSize: 'var(--font-size-2xs)',
                fontWeight: 'var(--font-weight-medium)',
                background: svc.included ? 'var(--color-success-50)' : 'var(--color-gray-100)',
                color: svc.included ? 'var(--color-success)' : 'var(--color-gray-400)',
              }}
            >
              <i className={svc.icon} style={{ fontSize: '0.65rem' }} />
              {svc.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripInfoCard;
