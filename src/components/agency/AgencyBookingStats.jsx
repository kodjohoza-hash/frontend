import clsx from 'clsx';

const AgencyBookingStats = ({ stats }) => (
  <div className="abr-stats-row">
    {stats.map((s) => (
      <div key={s.id} className={clsx('abr-stat-card', `abr-stat-card--${s.color}`)}>
        <div className={clsx('abr-stat-card__icon', `abr-stat-card__icon--${s.color}`)}>
          <i className={`bi ${s.icon}`} />
        </div>
        <div className="abr-stat-card__body">
          <div className="abr-stat-card__value">{s.value}<span className="abr-stat-card__suffix">{s.suffix || ''}</span></div>
          <div className="abr-stat-card__label">{s.label}</div>
        </div>
      </div>
    ))}
  </div>
);

export default AgencyBookingStats;
