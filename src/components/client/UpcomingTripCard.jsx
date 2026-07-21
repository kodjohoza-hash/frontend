import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const UpcomingTripCard = ({ trip }) => {
  if (!trip) return null;

  const departureDate = new Date(trip.departureDate);
  const day = departureDate.toLocaleDateString('fr-FR', { day: 'numeric' });
  const month = departureDate.toLocaleDateString('fr-FR', { month: 'short' });
  const weekday = departureDate.toLocaleDateString('fr-FR', { weekday: 'long' });

  return (
    <div className="btc-upcoming-trip card border-0 h-100" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-semibold mb-0" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
            <i className="bi bi-calendar-event-fill me-2" style={{ color: 'var(--color-accent)' }} />
            Prochain voyage
          </h6>
          <StatusBadge status={trip.status} />
        </div>

        <div className="btc-upcoming-trip-route d-flex align-items-center gap-3 mb-3">
          <div className="text-center">
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-primary)' }}>{day}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{month}</div>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{trip.departureCity}</span>
              <div className="flex-grow-1 position-relative" style={{ height: 2 }}>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'var(--border-default)' }} />
                <div className="position-absolute top-0 start-0 h-100" style={{ width: '60%', background: 'var(--color-accent)' }} />
                <div className="position-absolute" style={{ top: -3, left: '60%', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)' }} />
              </div>
              <span className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{trip.arrivalCity}</span>
            </div>
            <div className="text-center" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              {trip.departureTime} — {trip.arrivalTime} · {trip.duration}
            </div>
          </div>
          <div className="text-center">
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-primary)' }}>{weekday.charAt(0).toUpperCase() + weekday.slice(1)}</div>
          </div>
        </div>

        <div className="btc-upcoming-trip-details p-3" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
          <div className="row g-3">
            <div className="col-4">
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Compagnie</div>
              <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{trip.company}</div>
            </div>
            <div className="col-4">
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Place</div>
              <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{trip.seatNumber}</div>
            </div>
            <div className="col-4">
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Quai</div>
              <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{trip.platform}</div>
            </div>
            <div className="col-4">
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>N° Billet</div>
              <div className="fw-semibold" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{trip.ticketNumber}</div>
            </div>
            <div className="col-4">
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Embarquement</div>
              <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{trip.boardingTime}</div>
            </div>
            <div className="col-4">
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Prix</div>
              <div className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent)' }}>{trip.ticketPrice?.toLocaleString()} FCFA</div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <Link to={`/client/tickets/${trip.id}`} className="btn btn-accent btn-sm flex-fill">
            <i className="bi bi-ticket-perforated me-1" />
            Voir le billet
          </Link>
          <Link to={`/booking`} className="btn btn-outline-secondary btn-sm flex-fill">
            <i className="bi bi-arrow-repeat me-1" />
            Réserver à nouveau
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTripCard;
