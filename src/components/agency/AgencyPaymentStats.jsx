import clsx from 'clsx';

export default function AgencyPaymentStats({ stats }) {
  return (
    <div className="ap-stats-row">
      {stats.map((s) => (
        <div key={s.id} className={clsx('ap-stat-card', `ap-stat-card--${s.color}`)}>
          <div className={clsx('ap-stat-card__icon', `ap-stat-card__icon--${s.color}`)}>
            <i className={`bi ${s.icon}`} />
          </div>
          <div className="ap-stat-card__body">
            <div className="ap-stat-card__value">{s.value}</div>
            <div className="ap-stat-card__label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
