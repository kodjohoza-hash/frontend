import { useState } from 'react';
import { cities, tripStatuses } from '../../data/agencyTripsData';
import clsx from 'clsx';

const initialFilters = {
  search: '',
  from: '',
  to: '',
  status: '',
  type: '',
  dateFrom: '',
  dateTo: '',
};

export default function AgencyTripFilters({ filters, onFiltersChange, onReset }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="at-filters">
      <div className="at-filters__row">
        <div className="at-filters__search">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Rechercher par n°, bus, chauffeur..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="at-filters__input"
          />
          {filters.search && (
            <button className="at-filters__clear" onClick={() => handleChange('search', '')}>
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>

        <div className="at-filters__group">
          <select
            className="at-filters__select"
            value={filters.from}
            onChange={(e) => handleChange('from', e.target.value)}
          >
            <option value="">Départ</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="at-filters__select"
            value={filters.to}
            onChange={(e) => handleChange('to', e.target.value)}
          >
            <option value="">Destination</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button
          className={clsx('at-filters__toggle', { 'at-filters__toggle--active': expanded })}
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          <i className="bi bi-sliders2" />
          <span>Filtres</span>
          {activeCount > 0 && <span className="at-filters__badge">{activeCount}</span>}
          <i className={clsx('bi', expanded ? 'bi-chevron-up' : 'bi-chevron-down')} />
        </button>

        {activeCount > 0 && (
          <button className="at-filters__reset" onClick={onReset} type="button">
            <i className="bi bi-arrow-counterclockwise" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>

      {expanded && (
        <div className="at-filters__expanded">
          <div className="at-filters__group">
            <select
              className="at-filters__select"
              value={filters.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="">Tous les statuts</option>
              {tripStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select
              className="at-filters__select"
              value={filters.type}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="vip">VIP</option>
              <option value="confort">Confort</option>
              <option value="standard">Standard</option>
              <option value="economique">Économique</option>
            </select>
          </div>
          <div className="at-filters__group">
            <label className="at-filters__label">Du</label>
            <input
              type="date"
              className="at-filters__date"
              value={filters.dateFrom}
              onChange={(e) => handleChange('dateFrom', e.target.value)}
            />
            <label className="at-filters__label">Au</label>
            <input
              type="date"
              className="at-filters__date"
              value={filters.dateTo}
              onChange={(e) => handleChange('dateTo', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
