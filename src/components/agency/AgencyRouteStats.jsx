import clsx from 'clsx';

export default function AgencyRouteStats({ stats, activeFilter, onFilterChange }) {
  const statCards = [
    { key: 'all', label: 'Total', value: stats.total, icon: 'bi-signpost-split', variant: 'ab-stat--primary' },
    { key: 'active', label: 'Actifs', value: stats.actifs, icon: 'bi-check-circle', variant: 'ab-stat--success' },
    { key: 'inactive', label: 'Inactifs', value: stats.inactifs, icon: 'bi-pause-circle', variant: 'ab-stat--warning' },
    { key: 'archived', label: 'Archivés', value: stats.archives, icon: 'bi-archive', variant: 'ab-stat--muted' },
    { key: 'distance', label: 'Distance totale', value: stats.totalDistanceKm ? `${(stats.totalDistanceKm).toLocaleString('fr-FR')} km` : '0 km', icon: 'bi-sign-turn-right', variant: 'ab-stat--accent' },
    { key: 'villes', label: 'Villes desservies', value: stats.villesDesservies, icon: 'bi-geo-alt', variant: 'ab-stat--info' },
  ];

  const clickable = (key) => key === 'all' || key === 'active' || key === 'inactive' || key === 'archived';

  return (
    <div className="ab-stats-row">
      {statCards.map((s) => (
        <button
          key={s.key}
          className={clsx('ab-stat-card', s.variant, {
            'ab-stat-card--active': activeFilter === s.key,
            'ab-stat-card--plain': !clickable(s.key),
          })}
          onClick={clickable(s.key) ? () => onFilterChange(s.key) : undefined}
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
