import { memo } from 'react';

const CkSummary = memo(({ reservation, promoDiscount, insurance, total }) => {
  const r = reservation;
  const subtotal = r.seats.reduce((a, s) => a + s.price, 0);
  const insurancePrice = insurance ? 1500 : 0;
  const fees = r.fees;

  return (
    <div className="ck-summary">
      <div className="ck-summary__hero">
        <img
          src={r.bus.photo}
          alt={`Bus ${r.company.name}`}
          className="ck-summary__photo"
          loading="lazy"
        />
        <div className="ck-summary__hero-overlay">
          <div className="ck-summary__company">
            <span className="ck-summary__company-badge" style={{ background: r.company.color }}>
              {r.company.initial}
            </span>
            <div>
              <span className="ck-summary__company-name">{r.company.name}</span>
              <span className="ck-summary__company-rating">
                <i className="bi bi-star-fill" /> {r.company.rating}
                {r.company.verified && <i className="bi bi-patch-check-fill ck-summary__verified" />}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ck-summary__body">
        <div className="ck-summary__route">
          <div className="ck-summary__city">
            <span className="ck-summary__code">{r.route.fromCode}</span>
            <span className="ck-summary__city-name">{r.route.from}</span>
          </div>
          <div className="ck-summary__route-line">
            <span className="ck-summary__dot" />
            <span className="ck-summary__dashes" />
            <i className="bi bi-bus-front-fill" />
            <span className="ck-summary__dashes" />
            <span className="ck-summary__dot" />
          </div>
          <div className="ck-summary__city">
            <span className="ck-summary__code">{r.route.toCode}</span>
            <span className="ck-summary__city-name">{r.route.to}</span>
          </div>
        </div>

        <div className="ck-summary__meta">
          <div className="ck-summary__meta-item">
            <i className="bi bi-calendar3" />
            <span>{r.schedule.dateFormatted}</span>
          </div>
          <div className="ck-summary__meta-item">
            <i className="bi bi-clock" />
            <span>{r.schedule.departure} → {r.schedule.arrival} ({r.schedule.duration})</span>
          </div>
          <div className="ck-summary__meta-item">
            <i className="bi bi-grid-3x3-gap-fill" />
            <span>Sièges : {r.seats.map((s) => s.number).join(', ')}</span>
          </div>
          <div className="ck-summary__meta-item">
            <i className="bi bi-tag" />
            <span>{r.bus.type} · {r.bus.number}</span>
          </div>
        </div>

        <div className="ck-summary__divider" />

        <div className="ck-summary__pricing">
          {r.seats.map((s) => (
            <div key={s.id} className="ck-summary__price-row">
              <span>Siège {s.number} ({s.type})</span>
              <span>{s.price.toLocaleString()} FCFA</span>
            </div>
          ))}
          <div className="ck-summary__price-row">
            <span>Frais de service</span>
            <span>{fees.toLocaleString()} FCFA</span>
          </div>
          {insurance && (
            <div className="ck-summary__price-row">
              <span>Assurance voyage</span>
              <span>{insurancePrice.toLocaleString()} FCFA</span>
            </div>
          )}
          {promoDiscount > 0 && (
            <div className="ck-summary__price-row ck-summary__price-row--promo">
              <span><i className="bi bi-tag-fill" /> Réduction</span>
              <span>-{promoDiscount.toLocaleString()} FCFA</span>
            </div>
          )}
        </div>

        <div className="ck-summary__divider" />

        <div className="ck-summary__total">
          <span>Total</span>
          <span className="ck-summary__total-val">{total.toLocaleString()} FCFA</span>
        </div>

        <div className="ck-summary__baggage">
          <i className="bi bi-box2" />
          <span>{r.baggage}</span>
        </div>
      </div>
    </div>
  );
});

CkSummary.displayName = 'CkSummary';
export default CkSummary;
