import { useState } from 'react';
import { routeStatuses, routeSorts } from '../../data/agencyRouteData';
import clsx from 'clsx';

export default function AgencyRouteFilters({ filters, onFiltersChange, onReset, villes = [] }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="ab-filters">
      <div className="ab-filters__row">
        <div className="ab-filters__search">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Rechercher par nom, code, ville, compagnie..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="ab-filters__input"
          />
          {filters.search && (
            <button className="ab-filters__clear" onClick={() => handleChange('search', '')}>
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>

        <button
          className={clsx('ab-filters__toggle', { 'ab-filters__toggle--active': expanded })}
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          <i className="bi bi-sliders2" />
          <span>Filtres</span>
          {activeCount > 0 && <span className="ab-filters__badge">{activeCount}</span>}
          <i className={clsx('bi', expanded ? 'bi-chevron-up' : 'bi-chevron-down')} />
        </button>

        {activeCount > 0 && (
          <button className="ab-filters__reset" onClick={onReset} type="button">
            <i className="bi bi-arrow-counterclockwise" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>

      {expanded && (
        <div className="ab-filters__expanded">
          <div className="ab-filters__group">
            <select className="ab-filters__select" value={filters.status} onChange={(e) => handleChange('status', e.target.value)}>
              <option value="">Tous les statuts</option>
              {routeStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select className="ab-filters__select" value={filters.sort} onChange={(e) => handleChange('sort', e.target.value)}>
              {routeSorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="ab-filters__group">
            <select className="ab-filters__select" value={filters.villeDepart} onChange={(e) => handleChange('villeDepart', e.target.value)}>
              <option value="">Toutes les villes de départ</option>
              {villes.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
            </select>
            <select className="ab-filters__select" value={filters.villeArrivee} onChange={(e) => handleChange('villeArrivee', e.target.value)}>
              <option value="">Toutes les villes d'arrivée</option>
              {villes.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
            </select>
          </div>
          <div className="ab-filters__group">
            <label className="ab-filters__label">Prix min (XAF)</label>
            <input type="number" min="0" className="ab-filters__number" value={filters.priceMin} onChange={(e) => handleChange('priceMin', e.target.value)} placeholder="0" />
            <label className="ab-filters__label">Prix max (XAF)</label>
            <input type="number" min="0" className="ab-filters__number" value={filters.priceMax} onChange={(e) => handleChange('priceMax', e.target.value)} placeholder="100000" />
          </div>
        </div>
      )}
    </div>
  );
}
