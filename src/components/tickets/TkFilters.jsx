import clsx from 'clsx';

const statusFilters = [
  { key: 'all', label: 'Tous', icon: 'bi-grid' },
  { key: 'active', label: 'Actifs', icon: 'bi-check-circle' },
  { key: 'upcoming', label: 'À venir', icon: 'bi-calendar-event' },
  { key: 'used', label: 'Utilisés', icon: 'bi-clock-history' },
  { key: 'expired', label: 'Expirés', icon: 'bi-archive' },
];

const TkFilters = ({ activeFilter, onFilterChange, viewMode, onViewModeChange }) => {
  return (
    <div className="tk-filters">
      <div className="tk-filters__tabs">
        {statusFilters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={clsx('tk-filters__tab', activeFilter === f.key && 'tk-filters__tab--active')}
            onClick={() => onFilterChange(f.key)}
          >
            <i className={clsx('bi', f.icon)} />
            <span>{f.label}</span>
          </button>
        ))}
      </div>
      <div className="tk-filters__actions">
        <div className="tk-filters__view-toggle">
          <button
            type="button"
            className={clsx('tk-filters__view-btn', viewMode === 'grid' && 'tk-filters__view-btn--active')}
            onClick={() => onViewModeChange('grid')}
            title="Vue cartes"
          >
            <i className="bi bi-grid-1x2-fill" />
          </button>
          <button
            type="button"
            className={clsx('tk-filters__view-btn', viewMode === 'list' && 'tk-filters__view-btn--active')}
            onClick={() => onViewModeChange('list')}
            title="Vue liste"
          >
            <i className="bi bi-list-ul" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TkFilters;
