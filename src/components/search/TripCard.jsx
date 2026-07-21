import { useState } from 'react';
import { SERVICES } from '@data/searchResults';

const badgeConfig = {
  meilleur_prix: { label: 'Meilleur prix', bg: 'var(--color-success)', icon: 'bi-patch-check-fill' },
  rapide: { label: 'Rapide', bg: 'var(--color-info)', icon: 'bi-lightning-fill' },
  recommande: { label: 'Recommandé', bg: 'var(--color-accent)', icon: 'bi-hand-thumbs-up-fill' },
  nouveau: { label: 'Nouveau', bg: 'var(--color-primary)', icon: 'bi-stars' },
};

const busTypeColors = {
  VIP: { bg: 'var(--color-warning-50)', color: 'var(--color-warning)', border: 'var(--color-warning-200)' },
  Business: { bg: 'var(--color-primary-50)', color: 'var(--color-primary)', border: 'var(--color-primary-200)' },
  Economique: { bg: 'var(--color-gray-100)', color: 'var(--color-gray-600)', border: 'var(--color-gray-200)' },
};

const StarRating = ({ rating, count }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  return (
    <div className="d-flex align-items-center gap-1">
      <div className="d-flex align-items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <i
            key={i}
            className="bi"
            style={{
              fontSize: '0.75rem',
              color: i < fullStars ? 'var(--color-warning)' : (i === fullStars && hasHalf ? 'var(--color-warning)' : 'var(--color-gray-300)'),
            }}
          >
            {i < fullStars ? 'bi-star-fill' : (i === fullStars && hasHalf ? 'bi-star-half' : 'bi-star')}
          </i>
        ))}
      </div>
      <span className="fw-semibold" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{rating}</span>
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>({count})</span>
    </div>
  );
};

const TripCard = ({ trip, onBook }) => {
  const [showDetails, setShowDetails] = useState(false);

  const typeStyle = busTypeColors[trip.busType] || busTypeColors.Economique;
  const hasDiscount = trip.originalPrice && trip.originalPrice > trip.price;
  const discountPct = hasDiscount ? Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100) : 0;
  const seatUrgency = trip.availableSeats <= 5;

  return (
    <div
      className="btc-trip-card card border-0 mb-3"
      style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div className="card-body p-4">
        {/* Top Row: Company + Badges */}
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-primary-50)',
                color: 'var(--color-primary)',
                fontSize: '1.15rem',
                fontWeight: 'var(--font-weight-bold)',
              }}
            >
              {trip.companyName.charAt(0)}
            </div>
            <div>
              <div className="fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {trip.companyName}
              </div>
              <StarRating rating={trip.companyRating} count={trip.companyReviewCount} />
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <span
              className="d-inline-flex align-items-center px-2 py-1 rounded"
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                background: typeStyle.bg,
                color: typeStyle.color,
                border: `1px solid ${typeStyle.border}`,
              }}
            >
              {trip.busType}
            </span>
            {trip.badges.map((badge) => {
              const cfg = badgeConfig[badge];
              if (!cfg) return null;
              return (
                <span
                  key={badge}
                  className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                  style={{
                    fontSize: 'var(--font-size-2xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    background: cfg.bg,
                    color: 'var(--color-white)',
                  }}
                >
                  <i className={cfg.icon} style={{ fontSize: '0.65rem' }} />
                  {cfg.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Main Content: Time + Info + Price */}
        <div className="row g-3 align-items-center">
          {/* Departure */}
          <div className="col-3 col-md-2 text-center">
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {trip.departureTime}
            </div>
            <div className="mt-1" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              {trip.departureCity}
            </div>
          </div>

          {/* Duration + Route Line */}
          <div className="col-6 col-md-4">
            <div className="text-center mb-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              {trip.duration}
            </div>
            <div className="btc-route-line position-relative mx-2" style={{ height: 2 }}>
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'var(--color-gray-200)', borderRadius: 1 }} />
              <div className="position-absolute top-0 start-0 h-100" style={{ background: 'var(--color-accent)', borderRadius: 1, width: '100%' }} />
              <div
                className="position-absolute"
                style={{
                  top: -3,
                  left: '100%',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  border: '2px solid var(--color-white)',
                }}
              />
            </div>
            <div className="text-center mt-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              {trip.distance}
            </div>
          </div>

          {/* Arrival */}
          <div className="col-3 col-md-2 text-center">
            <div className="fw-bold" style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {trip.arrivalTime}
            </div>
            <div className="mt-1" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              {trip.arrivalCity}
            </div>
          </div>

          {/* Seats + Price + Actions */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center justify-content-between flex-md-column flex-row gap-2" style={{ textAlign: 'right' }}>
              <div>
                <div className="d-flex align-items-center gap-1 mb-1">
                  <i className="bi bi-person" style={{ fontSize: '0.7rem', color: seatUrgency ? 'var(--color-danger)' : 'var(--text-muted)' }} />
                  <span
                    className="fw-semibold"
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: seatUrgency ? 'var(--color-danger)' : 'var(--text-secondary)',
                    }}
                  >
                    {seatUrgency ? `Plus que ${trip.availableSeats} places !` : `${trip.availableSeats} places`}
                  </span>
                </div>
                <div className="d-flex align-items-baseline gap-2 justify-content-md-end">
                  {hasDiscount && (
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {trip.originalPrice.toLocaleString()} FCFA
                    </span>
                  )}
                  <span className="fw-bold" style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)' }}>
                    {trip.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>FCFA</span>
                  {hasDiscount && (
                    <span
                      className="px-1 rounded"
                      style={{
                        fontSize: 'var(--font-size-2xs)',
                        fontWeight: 'var(--font-weight-bold)',
                        background: 'var(--color-success-50)',
                        color: 'var(--color-success)',
                      }}
                    >
                      -{discountPct}%
                    </span>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="btn btn-sm"
                  style={{
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary-200)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-xs)',
                    padding: '6px 12px',
                    background: 'var(--color-primary-50)',
                  }}
                  aria-expanded={showDetails}
                >
                  <i className="bi bi-info-circle me-1" />
                  Détails
                </button>
                <button
                  onClick={() => onBook?.(trip)}
                  className="btn btn-accent btn-sm"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-xs)',
                    padding: '6px 16px',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  <i className="bi bi-ticket-perforated me-1" />
                  Réserver
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="btc-trip-details mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-3" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
                  <h6 className="fw-semibold mb-2" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                    <i className="bi bi-info-circle me-1" style={{ color: 'var(--color-primary)' }} />
                    Informations
                  </h6>
                  <div className="d-flex flex-column gap-2" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-geo-alt" style={{ color: 'var(--color-accent)', marginTop: 2 }} />
                      <div>
                        <div className="fw-medium" style={{ color: 'var(--text-primary)' }}>Point de départ</div>
                        {trip.departurePoint}
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-flag" style={{ color: 'var(--color-accent)', marginTop: 2 }} />
                      <div>
                        <div className="fw-medium" style={{ color: 'var(--text-primary)' }}>Point d'arrivée</div>
                        {trip.arrivalPoint}
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-box" style={{ color: 'var(--color-accent)', marginTop: 2 }} />
                      <div>
                        <div className="fw-medium" style={{ color: 'var(--text-primary)' }}>Politique bagages</div>
                        {trip.baggagePolicy}
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-shield-check" style={{ color: 'var(--color-accent)', marginTop: 2 }} />
                      <div>
                        <div className="fw-medium" style={{ color: 'var(--text-primary)' }}>Conditions d'annulation</div>
                        {trip.cancellationPolicy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-3" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
                  <h6 className="fw-semibold mb-2" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                    <i className="bi bi-list-check me-1" style={{ color: 'var(--color-primary)' }} />
                    Services inclus
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {SERVICES.map((service) => {
                      const included = trip.services.includes(service.id);
                      return (
                        <span
                          key={service.id}
                          className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded"
                          style={{
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 'var(--font-weight-medium)',
                            background: included ? 'var(--color-success-50)' : 'var(--color-gray-100)',
                            color: included ? 'var(--color-success)' : 'var(--color-gray-400)',
                          }}
                        >
                          <i className={included ? 'bi-check-circle-fill' : 'bi-x-circle'} style={{ fontSize: '0.7rem' }} />
                          {service.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCard;
