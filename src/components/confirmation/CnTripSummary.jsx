import { memo } from 'react';

const CnTripSummary = memo(({ trip }) => {
  const date = new Date(trip.schedule.date + 'T00:00:00');
  return (
    <div className="cn-card">
      <h3 className="cn-card__title">
        <i className="bi bi-bus-front-fill" />
        Résumé du voyage
      </h3>
      <div className="cn-ts">
        <div className="cn-ts__company">
          <span className="cn-ts__avatar" style={{ background: trip.company.color }}>
            {trip.company.initial}
          </span>
          <div>
            <span className="cn-ts__company-name">{trip.company.name}</span>
            <span className="cn-ts__company-meta">{trip.bus.type} · {trip.bus.number}</span>
          </div>
        </div>
        <div className="cn-ts__route">
          <div className="cn-ts__city">
            <span className="cn-ts__code">{trip.route.fromCode}</span>
            <span className="cn-ts__name">{trip.route.from}</span>
          </div>
          <div className="cn-ts__line">
            <span className="cn-ts__dot" />
            <span className="cn-ts__dash" />
            <i className="bi bi-bus-front-fill" />
            <span className="cn-ts__dash" />
            <span className="cn-ts__dot" />
          </div>
          <div className="cn-ts__city">
            <span className="cn-ts__code">{trip.route.toCode}</span>
            <span className="cn-ts__name">{trip.route.to}</span>
          </div>
        </div>
        <div className="cn-ts__meta">
          <div className="cn-ts__meta-row"><i className="bi bi-calendar3" /><span>{trip.schedule.dateFormatted}</span></div>
          <div className="cn-ts__meta-row"><i className="bi bi-clock" /><span>{trip.schedule.departure} → {trip.schedule.arrival} ({trip.schedule.duration})</span></div>
          <div className="cn-ts__meta-row"><i className="bi bi-geo-alt" /><span>{trip.boarding}</span></div>
          <div className="cn-ts__meta-row"><i className="bi bi-geo-alt-fill" /><span>{trip.arrivalPoint}</span></div>
        </div>
      </div>
    </div>
  );
});
CnTripSummary.displayName = 'CnTripSummary';
export default CnTripSummary;
