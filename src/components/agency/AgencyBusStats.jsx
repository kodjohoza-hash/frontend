import clsx from 'clsx';

export default function AgencyBusStats({ stats, activeFilter, onFilterChange }) {
  const statCards = [
    { key: 'all', label: 'Total', value: stats.total, icon: 'bi-bus-front-fill', variant: 'ab-stat--primary' },
    { key: 'disponible', label: 'Disponibles', value: stats.disponible, icon: 'bi-check-circle', variant: 'ab-stat--success' },
    { key: 'en_voyage', label: 'En voyage', value: stats.en_voyage, icon: 'bi-play-circle', variant: 'ab-stat--info' },
    { key: 'maintenance', label: 'Maintenance', value: stats.maintenance, icon: 'bi-wrench', variant: 'ab-stat--warning' },
    { key: 'hors_service', label: 'Hors service', value: stats.hors_service, icon: 'bi-x-circle', variant: 'ab-stat--danger' },
    { key: 'occupancy', label: 'Occupation moy.', value: `${stats.avgOccupancy}%`, icon: 'bi-bar-chart-line', variant: 'ab-stat--accent' },
  ];

  return (
    <div className="ab-stats-row">
      {statCards.map((s) => (
        <button
          key={s.key}
          className={clsx('ab-stat-card', s.variant, { 'ab-stat-card--active': activeFilter === s.key })}
          onClick={() => onFilterChange(s.key)}
          type="button"
        >
          <div className="ab-stat-card__icon">
            <i className={`bi ${s.icon}`} />
          </div>
          <div className="ab-stat-card__body">
            <span className="ab-stat-card__value">{s.value}</span>
            <span className="ab-stat-card__label">{s.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
