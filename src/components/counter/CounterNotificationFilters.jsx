import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const CounterNotificationFilters = ({
  filters = {},
  onFilterChange,
  onReset,
  options = {},
  quickFilters = [],
  activeQuickFilter,
  onQuickFilter,
}) => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  const activeCount = Object.entries(filters || {}).filter(
    ([k, v]) => v && v !== ''
  ).length;

  const renderSelect = (key, label, arr) => (
    <div className="acn-filter-group">
      <label className="acn-filter-label">{label}</label>
      <select
        className="acn-filter-select"
        value={filters[key] || ''}
        onChange={(e) => handleChange(key, e.target.value)}
      >
        <option value="">Tous</option>
        {arr?.map((o) => (
          <option key={o.id || o.value} value={o.id || o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderInput = (key, label, icon) => (
    <div className="acn-filter-group">
      <label className="acn-filter-label">{label}</label>
      <div className="acn-filter-input-wrap">
        {icon && <i className={clsx('bi', icon)} />}
        <input
          className="acn-filter-input"
          type="text"
          placeholder={label}
          value={filters[key] || ''}
          onChange={(e) => handleChange(key, e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="acn-filters">
      <div className="acn-filters-header">
        <div className="acn-filters-header-left">
          <i className="bi bi-funnel" />
          <span>Filtres</span>
          {activeCount > 0 && (
            <span className="acn-filter-badge">{activeCount}</span>
          )}
        </div>
        <div className="acn-filters-header-right">
          <button className="acn-btn acn-btn-secondary acn-btn-sm" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
          </button>
          <button
            className={clsx('acn-filters-toggle', { open })}
            onClick={() => setOpen(!open)}
          >
            <i className={clsx('bi', open ? 'bi-chevron-up' : 'bi-chevron-down')} />
          </button>
        </div>
      </div>

      <div className="acn-filters-search">
        <i className="bi bi-search" />
        <input
          type="text"
          className="acn-filters-search-input"
          placeholder="Rechercher dans les notifications..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
        {filters.search && (
          <button className="acn-filters-search-clear" onClick={() => handleChange('search', '')}>
            <i className="bi bi-x" />
          </button>
        )}
      </div>

      {quickFilters.length > 0 && (
        <div className="acn-quick-filters">
          {quickFilters.map((qf) => (
            <button
              key={qf.id}
              className={clsx('acn-quick-filter-chip', { active: activeQuickFilter === qf.id })}
              onClick={() => onQuickFilter?.(qf.id)}
            >
              {qf.icon && <i className={clsx('bi', qf.icon)} />}
              {qf.label}
            </button>
          ))}
        </div>
      )}

      <div className={clsx('acn-filters-body', { open })}>
        <div className="acn-filters-grid">
          {renderSelect('category', 'Catégorie', options.categories)}
          {renderSelect('priority', 'Priorité', options.priorities)}
          {renderSelect('status', 'Statut', options.statuses)}
          {renderInput('client', 'Client', 'bi-person')}
          {renderInput('trip', 'Voyage', 'bi-bus-front')}
          {renderInput('bus', 'Bus', 'bi-truck')}
          {renderInput('booking', 'Réservation', 'bi-ticket')}
          {renderInput('payment', 'Paiement', 'bi-credit-card')}
          {renderInput('branch', 'Point de vente', 'bi-shop')}
        </div>
      </div>

      {activeCount > 0 && (
        <div className="acn-active-filters">
          {Object.entries(filters || {}).map(([k, v]) => {
            if (!v || v === '' || k === 'search') return null;
            const labels = {
              category: 'Catégorie', priority: 'Priorité', status: 'Statut',
              client: 'Client', trip: 'Voyage', bus: 'Bus',
              booking: 'Réservation', payment: 'Paiement', branch: 'Point de vente',
            };
            const found = [
              ...(options.categories || []),
              ...(options.priorities || []),
              ...(options.statuses || []),
              ...(options.sortOptions || []),
            ].find((o) => (o.id || o.value) === v);
            return (
              <span key={k} className="acn-active-filter">
                {labels[k] || k}: {found?.label || v}
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

export default CounterNotificationFilters;
