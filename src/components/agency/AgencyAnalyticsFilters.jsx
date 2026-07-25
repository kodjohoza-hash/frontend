import clsx from 'clsx';

const PERIODS = [
  { key: 'today', label: "Aujourd'hui" },
  { key: 'week', label: 'Cette semaine' },
  { key: 'month', label: 'Ce mois' },
  { key: 'year', label: 'Cette année' },
  { key: 'custom', label: 'Personnalisée' },
];

export default function AgencyAnalyticsFilters({ filters, onFilterChange, onReset }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="aa-filters">
      <div className="aa-filters__row">
        <div className="aa-filters__period-group">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              className={clsx('aa-filters__period-btn', { 'aa-filters__period-btn--active': filters.period === p.key })}
              onClick={() => handleChange('period', p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="aa-filters__row">
        <div className="aa-filters__group">
          <select
            className="aa-filters__select"
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
          >
            <option value="">Toutes les villes</option>
          </select>
          <select
            className="aa-filters__select"
            value={filters.method}
            onChange={(e) => handleChange('method', e.target.value)}
          >
            <option value="">Toutes les méthodes</option>
          </select>
          <select
            className="aa-filters__select"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Tous les statuts</option>
          </select>
          <select
            className="aa-filters__select"
            value={filters.outlet}
            onChange={(e) => handleChange('outlet', e.target.value)}
          >
            <option value="">Tous les points de vente</option>
          </select>
          <select
            className="aa-filters__select"
            value={filters.agent}
            onChange={(e) => handleChange('agent', e.target.value)}
          >
            <option value="">Tous les agents</option>
          </select>
        </div>

        {activeCount > 0 && (
          <button className="aa-filters__reset" onClick={onReset} type="button">
            <i className="bi bi-arrow-counterclockwise" />
            <span>Réinitialiser</span>
            <span className="aa-filters__badge">{activeCount}</span>
          </button>
        )}
      </div>
    </div>
  );
}
