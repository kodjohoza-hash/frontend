import React, { useState } from 'react';
import { SERVICES } from '@data/searchResults';

const badgeConfig = {
  meilleur_prix: { label: 'Meilleur prix', bg: '#10B981', icon: 'bi-patch-check-fill' },
  rapide: { label: 'Le plus rapide', bg: '#6366F1', icon: 'bi-lightning-fill' },
  recommande: { label: 'Recommandé', bg: '#FF6B35', icon: 'bi-hand-thumbs-up-fill' },
  nouveau: { label: 'Nouveau', bg: '#0B1D51', icon: 'bi-stars' },
};

const busTypeStyles = {
  VIP: { bg: 'rgba(245, 158, 11, 0.08)', color: '#D97706', border: 'rgba(245, 158, 11, 0.2)' },
  Business: { bg: 'rgba(11, 29, 81, 0.06)', color: '#0B1D51', border: 'rgba(11, 29, 81, 0.15)' },
  Economique: { bg: 'rgba(107, 114, 128, 0.06)', color: '#4B5563', border: 'rgba(107, 114, 128, 0.15)' },
};

const StarRating = React.memo(({ rating, count }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {Array.from({ length: 5 }, (_, i) => {
          let cls = 'bi-star';
          let color = '#D1D5DB';
          if (i < fullStars) { cls = 'bi-star-fill'; color = '#F59E0B'; }
          else if (i === fullStars && hasHalf) { cls = 'bi-star-half'; color = '#F59E0B'; }
          return <i key={i} className={`bi ${cls}`} style={{ fontSize: '0.7rem', color }} />;
        })}
      </div>
      <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)', fontWeight: 600, color: 'var(--text-primary, #111827)' }}>
        {rating}
      </span>
      <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-muted, #9ca3af)' }}>
        ({count})
      </span>
    </div>
  );
});
StarRating.displayName = 'StarRating';

const TripCard = React.memo(({ trip, onBook, onViewDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  const typeStyle = busTypeStyles[trip.busType] || busTypeStyles.Economique;
  const hasDiscount = trip.originalPrice && trip.originalPrice > trip.price;
  const discountPct = hasDiscount ? Math.round(((trip.originalPrice - trip.price) / trip.originalPrice) * 100) : 0;
  const seatUrgency = trip.availableSeats <= 5;

  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev);
    if (!showDetails) onViewDetails?.(trip);
  };

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'row',
        background: 'var(--color-white, #fff)',
        borderRadius: 'var(--radius-xl, 16px)',
        border: '1px solid var(--color-gray-100, #f3f4f6)',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
        overflow: 'hidden',
        marginBottom: 16,
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(11, 29, 81, 0.12), 0 8px 16px rgba(11, 29, 81, 0.06)';
        e.currentTarget.style.borderColor = 'rgba(11, 29, 81, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))';
        e.currentTarget.style.borderColor = 'var(--color-gray-100, #f3f4f6)';
      }}
    >
      {/* Bus Photo */}
      <div
        style={{
          width: 280,
          minHeight: 220,
          flexShrink: 0,
          background: `linear-gradient(135deg, var(--color-primary-50, rgba(11,29,81,0.06)) 0%, var(--color-primary-100, rgba(11,29,81,0.12)) 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.3s ease',
        }}
        aria-hidden="true"
      >
        <i
          className="bi bi-bus-front-fill"
          style={{
            fontSize: '3.5rem',
            color: 'var(--color-primary, #0B1D51)',
            opacity: 0.2,
            transition: 'transform 0.3s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '8px 12px',
            background: 'linear-gradient(transparent, rgba(11, 29, 81, 0.7))',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.9)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: typeStyle.color,
            }}
          >
            {trip.busType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Row: Company + Badges */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--color-primary, #0B1D51)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.05rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {trip.companyName.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm, 0.875rem)', fontWeight: 600, color: 'var(--text-primary, #111827)' }}>
                {trip.companyName}
              </div>
              <StarRating rating={trip.companyRating} count={trip.companyReviewCount} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {trip.badges.map((badge) => {
              const cfg = badgeConfig[badge];
              if (!cfg) return null;
              return (
                <span
                  key={badge}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: cfg.bg,
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <i className={cfg.icon} style={{ fontSize: '0.55rem' }} />
                  {cfg.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Middle Row: Journey Timeline */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 16 }}>
          {/* Departure */}
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary, #111827)', lineHeight: 1.1 }}>
              {trip.departureTime}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm, 0.875rem)', color: 'var(--text-secondary, #4b5563)', marginTop: 4 }}>
              {trip.departureCity}
            </div>
          </div>

          {/* Journey Line */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 120 }}>
            <div style={{ fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-muted, #9ca3af)' }}>
              {trip.duration}
            </div>
            <div style={{ width: '100%', position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
              {/* Track */}
              <div style={{ position: 'absolute', left: 0, right: 0, height: 3, borderRadius: 2, background: 'var(--color-gray-200, #e5e7eb)' }} />
              {/* Progress */}
              <div style={{ position: 'absolute', left: 0, width: '100%', height: 3, borderRadius: 2, background: 'var(--color-accent, #FF6B35)' }} />
              {/* Bus icon */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--color-accent, #FF6B35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(255, 107, 53, 0.35)',
                  animation: 'btc-bus-pulse 2s ease-in-out infinite',
                }}
              >
                <i className="bi bi-bus-front-fill" style={{ color: '#fff', fontSize: '0.7rem' }} />
              </div>
              {/* Start dot */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-accent, #FF6B35)',
                  border: '2px solid #fff',
                  boxShadow: '0 0 0 2px var(--color-accent, #FF6B35)',
                }}
              />
              {/* End dot */}
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translate(50%, -50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-primary, #0B1D51)',
                  border: '2px solid #fff',
                  boxShadow: '0 0 0 2px var(--color-primary, #0B1D51)',
                }}
              />
            </div>
            <div style={{ fontSize: 'var(--font-size-2xs, 0.65rem)', color: 'var(--text-muted, #9ca3af)' }}>
              {trip.distance}
            </div>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary, #111827)', lineHeight: 1.1 }}>
              {trip.arrivalTime}
            </div>
            <div style={{ fontSize: 'var(--font-size-sm, 0.875rem)', color: 'var(--text-secondary, #4b5563)', marginTop: 4 }}>
              {trip.arrivalCity}
            </div>
          </div>
        </div>

        {/* Bottom Row: Services + Price + Action */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', gap: 16 }}>
          {/* Services */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {SERVICES.filter((s) => trip.services.includes(s.id)).slice(0, 5).map((service) => (
              <span
                key={service.id}
                title={service.label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--color-primary-50, rgba(11,29,81,0.06))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--color-primary, #0B1D51)',
                }}
              >
                <i className={service.icon} />
              </span>
            ))}
            {trip.services.length > 5 && (
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--color-gray-100, #f3f4f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: 'var(--text-muted, #9ca3af)',
                }}
              >
                +{trip.services.length - 5}
              </span>
            )}
          </div>

          {/* Price + Seats */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {seatUrgency && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#DC2626',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    animation: 'btc-pulse-urgent 1.5s ease-in-out infinite',
                  }}
                >
                  <i className="bi bi-exclamation-circle-fill" style={{ fontSize: '0.55rem' }} />
                  Plus que {trip.availableSeats}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              {hasDiscount && (
                <span style={{ fontSize: 'var(--font-size-sm, 0.875rem)', color: 'var(--text-muted, #9ca3af)', textDecoration: 'line-through' }}>
                  {trip.originalPrice.toLocaleString()}
                </span>
              )}
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-accent, #FF6B35)' }}>
                {trip.price.toLocaleString()}
              </span>
              <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-muted, #9ca3af)' }}>FCFA</span>
              {hasDiscount && (
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(16, 185, 129, 0.08)',
                    color: '#10B981',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                  }}
                >
                  -{discountPct}%
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={handleToggleDetails}
              aria-expanded={showDetails}
              aria-label="Voir les détails du voyage"
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid var(--color-gray-200, #e5e7eb)',
                background: 'var(--color-white, #fff)',
                color: 'var(--text-secondary, #4b5563)',
                fontSize: 'var(--font-size-xs, 0.75rem)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <i className={`bi bi-chevron-${showDetails ? 'up' : 'down'}`} style={{ fontSize: '0.65rem' }} />
              Détails
            </button>
            <button
              onClick={() => onBook?.(trip)}
              aria-label={`Choisir mes sièges pour ${trip.companyName} à ${trip.price} FCFA`}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: 'none',
                background: 'var(--color-accent, #FF6B35)',
                color: '#fff',
                fontSize: 'var(--font-size-sm, 0.875rem)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E55A25';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-accent, #FF6B35)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="bi bi-ticket-perforated" style={{ fontSize: '0.8rem' }} />
              Choisir mes sièges
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        <div
          style={{
            maxHeight: showDetails ? 400 : 0,
            opacity: showDetails ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div style={{ borderTop: '1px solid var(--color-gray-100, #f3f4f6)', marginTop: 16, paddingTop: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Info column */}
              <div style={{ padding: 16, borderRadius: 12, background: 'var(--color-gray-50, #fafafa)' }}>
                <h6 style={{ margin: '0 0 12px', fontSize: 'var(--font-size-sm, 0.875rem)', fontWeight: 700, color: 'var(--text-primary, #111827)' }}>
                  <i className="bi bi-info-circle" style={{ color: 'var(--color-primary, #0B1D51)', marginRight: 6 }} />
                  Informations
                </h6>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-secondary, #4b5563)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <i className="bi bi-geo-alt" style={{ color: 'var(--color-accent, #FF6B35)', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #111827)' }}>Point de départ</div>
                      {trip.departurePoint}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <i className="bi bi-flag" style={{ color: 'var(--color-accent, #FF6B35)', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #111827)' }}>Point d'arrivée</div>
                      {trip.arrivalPoint}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <i className="bi bi-box" style={{ color: 'var(--color-accent, #FF6B35)', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #111827)' }}>Bagages</div>
                      {trip.baggagePolicy}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <i className="bi bi-shield-check" style={{ color: 'var(--color-accent, #FF6B35)', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #111827)' }}>Annulation</div>
                      {trip.cancellationPolicy}
                    </div>
                  </div>
                </div>
              </div>

              {/* Services column */}
              <div style={{ padding: 16, borderRadius: 12, background: 'var(--color-gray-50, #fafafa)' }}>
                <h6 style={{ margin: '0 0 12px', fontSize: 'var(--font-size-sm, 0.875rem)', fontWeight: 700, color: 'var(--text-primary, #111827)' }}>
                  <i className="bi bi-list-check" style={{ color: 'var(--color-primary, #0B1D51)', marginRight: 6 }} />
                  Services inclus
                </h6>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SERVICES.map((service) => {
                    const included = trip.services.includes(service.id);
                    return (
                      <span
                        key={service.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '5px 12px',
                          borderRadius: 8,
                          fontSize: 'var(--font-size-xs, 0.75rem)',
                          fontWeight: 600,
                          background: included ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-gray-100, #f3f4f6)',
                          color: included ? '#10B981' : 'var(--text-muted, #9ca3af)',
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
      </div>

      <style>{`
        @keyframes btc-bus-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes btc-pulse-urgent {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </article>
  );
});

TripCard.displayName = 'TripCard';

export default TripCard;
