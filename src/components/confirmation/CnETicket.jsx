import { memo } from 'react';

const CnETicket = memo(({ booking, trip, passengers, payment }) => {
  const date = new Date(trip.schedule.date + 'T00:00:00');

  return (
    <article className="cn-ticket" aria-label="Billet électronique">
      {/* Notched sides */}
      <div className="cn-ticket__notch cn-ticket__notch--left" aria-hidden="true" />
      <div className="cn-ticket__notch cn-ticket__notch--right" aria-hidden="true" />

      {/* Header */}
      <header className="cn-ticket__header">
        <div className="cn-ticket__brand">
          <div className="cn-ticket__logo">
            <i className="bi bi-bus-front-fill" />
          </div>
          <div>
            <div className="cn-ticket__brand-name">BUS TIX CONNECT</div>
            <div className="cn-ticket__brand-tag">Billet Électronique</div>
          </div>
        </div>
        <div className="cn-ticket__status">
          <i className="bi bi-check-circle-fill" />
          Confirmé
        </div>
      </header>

      {/* Perforation */}
      <div className="cn-ticket__perf" aria-hidden="true" />

      {/* Body */}
      <div className="cn-ticket__body">
        {/* Route hero */}
        <div className="cn-ticket__route">
          <div className="cn-ticket__company">
            <span className="cn-ticket__company-badge" style={{ background: trip.company.color }}>
              {trip.company.initial}
            </span>
            <span className="cn-ticket__company-name">{trip.company.name}</span>
            {trip.company.verified && <i className="bi bi-patch-check-fill cn-ticket__verified" />}
          </div>

          <div className="cn-ticket__cities">
            <div className="cn-ticket__city">
              <span className="cn-ticket__time">{trip.schedule.departure}</span>
              <span className="cn-ticket__city-code">{trip.route.fromCode}</span>
              <span className="cn-ticket__city-name">{trip.route.from}</span>
            </div>
            <div className="cn-ticket__arrow">
              <div className="cn-ticket__arrow-line" />
              <i className="bi bi-bus-front-fill" />
              <div className="cn-ticket__arrow-line" />
              <span className="cn-ticket__duration">{trip.schedule.duration}</span>
            </div>
            <div className="cn-ticket__city">
              <span className="cn-ticket__time">{trip.schedule.arrival}</span>
              <span className="cn-ticket__city-code">{trip.route.toCode}</span>
              <span className="cn-ticket__city-name">{trip.route.to}</span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="cn-ticket__grid">
          <div className="cn-ticket__info">
            <span className="cn-ticket__info-label">Date</span>
            <span className="cn-ticket__info-value">{date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="cn-ticket__info">
            <span className="cn-ticket__info-label">Bus</span>
            <span className="cn-ticket__info-value">{trip.bus.number}</span>
          </div>
          <div className="cn-ticket__info">
            <span className="cn-ticket__info-label">Type</span>
            <span className="cn-ticket__info-value">{trip.bus.type}</span>
          </div>
          <div className="cn-ticket__info">
            <span className="cn-ticket__info-label">Sièges</span>
            <span className="cn-ticket__info-value">{passengers.map((p) => p.seat.number).join(', ')}</span>
          </div>
          <div className="cn-ticket__info">
            <span className="cn-ticket__info-label">N° Voyage</span>
            <span className="cn-ticket__info-value cn-ticket__info-value--mono">{trip.tripNumber}</span>
          </div>
          <div className="cn-ticket__info">
            <span className="cn-ticket__info-label">Réf. Billet</span>
            <span className="cn-ticket__info-value cn-ticket__info-value--mono">{booking.reference}</span>
          </div>
        </div>

        {/* Passengers */}
        <div className="cn-ticket__pax-section">
          <span className="cn-ticket__section-label">PASSAGERS</span>
          {passengers.map((pax, i) => (
            <div key={pax.id} className={`cn-ticket__pax ${i < passengers.length - 1 ? 'cn-ticket__pax--bordered' : ''}`}>
              <div className="cn-ticket__pax-avatar">
                {pax.firstName.charAt(0)}{pax.lastName.charAt(0)}
              </div>
              <div className="cn-ticket__pax-info">
                <span className="cn-ticket__pax-name">{pax.firstName} {pax.lastName}</span>
                <span className="cn-ticket__pax-seat">
                  <i className="bi bi-grid-3x3-gap-fill" /> Siège {pax.seat.number} · {pax.seat.type}
                </span>
              </div>
              <span className="cn-ticket__pax-price">{pax.seat.price.toLocaleString()} FCFA</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="cn-ticket__total-row">
          <span>Total payé</span>
          <span className="cn-ticket__total-val">{payment.amount.toLocaleString()} FCFA</span>
        </div>

        {/* Perforation */}
        <div className="cn-ticket__perf" aria-hidden="true" />

        {/* QR + Barcode */}
        <div className="cn-ticket__codes">
          <div className="cn-ticket__qr" role="img" aria-label="QR Code">
            <svg viewBox="0 0 80 80" width="100" height="100">
              <rect x="2" y="2" width="22" height="22" rx="3" fill="#0B1D51" />
              <rect x="6" y="6" width="14" height="14" rx="2" fill="#fff" />
              <rect x="9" y="9" width="8" height="8" rx="1" fill="#0B1D51" />
              <rect x="56" y="2" width="22" height="22" rx="3" fill="#0B1D51" />
              <rect x="60" y="6" width="14" height="14" rx="2" fill="#fff" />
              <rect x="63" y="9" width="8" height="8" rx="1" fill="#0B1D51" />
              <rect x="2" y="56" width="22" height="22" rx="3" fill="#0B1D51" />
              <rect x="6" y="60" width="14" height="14" rx="2" fill="#fff" />
              <rect x="9" y="63" width="8" height="8" rx="1" fill="#0B1D51" />
              {[28,32,36,40,44,48].map((x) => [28,32,36,40,44,48].map((y) => (
                <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill={(x + y) % 6 === 0 ? '#0B1D51' : 'none'} />
              )))}
              <rect x="36" y="36" width="8" height="8" rx="1" fill="#FF6B35" />
            </svg>
          </div>
          <div className="cn-ticket__barcode" role="img" aria-label="Code-barres">
            <svg viewBox="0 0 220 50" width="100%" height="48" preserveAspectRatio="xMidYMid meet">
              {Array.from({ length: 55 }, (_, i) => {
                const x = i * 4;
                const w = [1,2,1,3,1,2,1,1,2,1][i % 10];
                if (i % 2 === 0) return <rect key={i} x={x} y={2} width={w} height={38} fill="#1e293b" />;
                return null;
              })}
              <text x="110" y="48" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="'Courier New',monospace" letterSpacing="0.08em">
                {booking.reference}
              </text>
            </svg>
          </div>
          <p className="cn-ticket__scan-note">
            <i className="bi bi-phone" /> Présentez ce billet au conducteur (numérique ou imprimé)
          </p>
        </div>
      </div>
    </article>
  );
});
CnETicket.displayName = 'CnETicket';
export default CnETicket;
