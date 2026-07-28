import clsx from 'clsx';

export default function AgencyClientStats({ stats }) {
  return (
    <div className="ac-stats-row">
      {stats.map((stat) => (
        <div key={stat.id} className={clsx('ac-stat-card', stat.color && `ac-stat-card--${stat.color}`)}>
          <div className={clsx('ac-stat-card__icon', stat.color && `ac-stat-card__icon--${stat.color}`)}>
            <i className={`bi ${stat.icon}`} />
          </div>
          <div className="ac-stat-card__value">{stat.value}</div>
          <div className="ac-stat-card__label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
