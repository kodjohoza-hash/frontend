import { useState } from 'react';
import clsx from 'clsx';

const CounterCustomerFilters = ({ filters = {}, onFilterChange, onReset, options = {} }) => {
  const [open, setOpen] = useState(true);

  const {
    statusOptions = [],
    cityOptions = [],
    loyaltyOptions = [],
  } = options;

  const handleChange = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => v && v !== '' && k !== 'search'
  ).length;

  return (
    <div className="acc-filters">
      <div className="acc-filters-header">
        <div className="acc-filters-header-left">
          <i className="bi bi-funnel" />
          <span>Filtres</span>
          {activeCount > 0 && (
            <span className="acc-filter-badge">{activeCount}</span>
          )}
        </div>
        <div className="acc-filters-header-right">
          {activeCount > 0 && (
            <button className="acc-btn acc-btn-ghost acc-btn-sm" onClick={onReset}>
              <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
            </button>
          )}
          <button
            className={clsx('acc-filters-toggle', { open })}
            onClick={() => setOpen(!open)}
          >
            <i className={clsx('bi', open ? 'bi-chevron-up' : 'bi-chevron-down')} />
          </button>
        </div>
      </div>

      <div className={clsx('acc-filters-body', { open })}>
        <div className="acc-filters-grid">
          <div className="acc-filter-group acc-filter-group-search">
            <div className="acc-search-input-wrap">
              <i className="bi bi-search acc-search-icon" />
              <input
                type="text"
                className="acc-filter-input acc-filter-input-search"
                placeholder="Rechercher un client (nom, téléphone, email)..."
                value={filters.search || ''}
                onChange={(e) => handleChange('search', e.target.value)}
              />
              {filters.search && (
                <button className="acc-search-clear" onClick={() => handleChange('search', '')}>
                  <i className="bi bi-x" />
                </button>
              )}
            </div>
          </div>
          <div className="acc-filter-group">
            <label className="acc-filter-label">Statut</label>
            <select
              className="acc-filter-select"
              value={filters.status || ''}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="">Tous les statuts</option>
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="acc-filter-group">
            <label className="acc-filter-label">Ville</label>
            <select
              className="acc-filter-select"
              value={filters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
            >
              <option value="">Toutes les villes</option>
              {cityOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="acc-filter-group">
            <label className="acc-filter-label">Fidélité</label>
            <select
              className="acc-filter-select"
              value={filters.loyalty || ''}
              onChange={(e) => handleChange('loyalty', e.target.value)}
            >
              <option value="">Tous niveaux</option>
              {loyaltyOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="acc-active-filters">
          {Object.entries(filters).map(([k, v]) => {
            if (!v || k === 'search' || v === '') return null;
            const labels = { status: 'Statut', city: 'Ville', loyalty: 'Fidélité' };
            return (
              <span key={k} className="acc-active-filter">
                {labels[k] || k}: {v}
                <button onClick={() => handleChange(k, '')}>
                  <i className="bi bi-x" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CounterCustomerFilters;
