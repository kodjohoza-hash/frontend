const TripSummaryCard = ({ trip }) => {
  const date = new Date(trip.departureDate + 'T00:00:00');

  return (
    <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
          <i className="bi bi-bus-front-fill me-2" style={{ color: 'var(--color-accent)' }} />
          Resume du voyage
        </h6>

        {/* Company */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-50)', color: 'var(--color-primary)', fontWeight: 'var(--font-weight-bold)', fontSize: '0.95rem' }}
          >
            {trip.companyName.charAt(0)}
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{trip.companyName}</div>
            <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>{trip.busType} · {trip.busNumber}</div>
          </div>
        </div>

        {/* Route */}
        <div className="d-flex align-items-center justify-content-between mb-3 p-3" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
          <div className="text-center">
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{trip.departureTime}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{trip.departureCity}</div>
          </div>
          <div className="flex-grow-1 mx-3 text-center">
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{trip.duration} · {trip.distance}</div>
            <div className="my-1" style={{ height: 2, background: 'var(--color-gray-200)', borderRadius: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--color-accent)', borderRadius: 1 }} />
              <div style={{ position: 'absolute', top: -3, left: '50%', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', transform: 'translateX(-50%)', border: '2px solid var(--color-white)' }} />
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div className="text-center">
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{trip.arrivalTime}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{trip.arrivalCity}</div>
          </div>
        </div>

        {/* Details */}
        <div className="row g-2">
          {[
            { label: 'N° Voyage', value: trip.tripNumber },
            { label: 'Embarquement', value: trip.departurePoint },
            { label: 'Arrivee', value: trip.arrivalPoint },
          ].map((item) => (
            <div key={item.label} className="col-12">
              <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>{item.label}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripSummaryCard;
