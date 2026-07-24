import clsx from 'clsx';

export default function AgencyDriverStats({ stats, activeFilter, onFilterChange }) {
  const statCards = [
    { key: 'all', label: 'Total', value: stats.total, icon: 'bi-person-badge', variant: 'ad-stat--primary' },
    { key: 'disponible', label: 'Disponibles', value: stats.disponible, icon: 'bi-check-circle', variant: 'ad-stat--success' },
    { key: 'en_mission', label: 'En mission', value: stats.en_mission, icon: 'bi-play-circle', variant: 'ad-stat--info' },
    { key: 'conge', label: 'En congé', value: stats.conge, icon: 'bi-calendar-check', variant: 'ad-stat--warning' },
    { key: 'suspendu', label: 'Suspendus', value: stats.suspendu, icon: 'bi-shield-x', variant: 'ad-stat--danger' },
    { key: 'experience', label: 'Exp. moy.', value: `${stats.avgExperience} ans`, icon: 'bi-clock-history', variant: 'ad-stat--accent' },
  ];

  return (
    <div className="ad-stats-row">
      {statCards.map((s) => (
        <button
          key={s.key}
          className={clsx('ad-stat-card', s.variant, { 'ad-stat-card--active': activeFilter === s.key })}
          onClick={() => onFilterChange(s.key)}
          type="button"
        >
          <div className="ad-stat-card__icon"><i className={`bi ${s.icon}`} /></div>
          <div className="ad-stat-card__body">
            <span className="ad-stat-card__value">{s.value}</span>
            <span className="ad-stat-card__label">{s.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
