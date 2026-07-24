import AgencyTripStatus from './AgencyTripStatus';
import { tripStatuses } from '../../data/agencyTripsData';
import clsx from 'clsx';

export default function AgencyTripStats({ stats, activeFilter, onFilterChange }) {
  const statCards = [
    { key: 'all', label: 'Total', value: stats.total, icon: 'bi-signpost-2', variant: 'at-stat-card--primary' },
    { key: 'programmee', label: 'Programmées', value: stats.today, icon: 'bi-calendar-event', variant: 'at-stat-card--info' },
    { key: 'en_cours', label: 'En cours', value: stats.active, icon: 'bi-play-circle', variant: 'at-stat-card--accent' },
    { key: 'terminee', label: 'Terminées', value: stats.completed, icon: 'bi-check-circle', variant: 'at-stat-card--success' },
    { key: 'annulee', label: 'Annulées', value: stats.cancelled, icon: 'bi-x-circle', variant: 'at-stat-card--danger' },
  ];

  return (
    <div className="at-stats-row">
      {statCards.map((s) => (
        <button
          key={s.key}
          className={clsx('at-stat-card', s.variant, { 'at-stat-card--active': activeFilter === s.key })}
          onClick={() => onFilterChange(s.key)}
          type="button"
        >
          <div className="at-stat-card__icon">
            <i className={`bi ${s.icon}`} />
          </div>
          <div className="at-stat-card__body">
            <span className="at-stat-card__value">{s.value}</span>
            <span className="at-stat-card__label">{s.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
