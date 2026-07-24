import { useState } from 'react';
import { busTypes, busStatuses } from '../../data/agencyBusData';
import clsx from 'clsx';

const initialFilters = {
  search: '', type: '', status: '', seatsMin: '', seatsMax: '',
  climatisation: '', wifi: '', serviceDateFrom: '', serviceDateTo: '',
};

export default function AgencyBusFilters({ filters, onFiltersChange, onReset }) {
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
            placeholder="Rechercher par immatriculation, marque, modèle..."
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
            <select className="ab-filters__select" value={filters.type} onChange={(e) => handleChange('type', e.target.value)}>
              <option value="">Tous les types</option>
              {busTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select className="ab-filters__select" value={filters.status} onChange={(e) => handleChange('status', e.target.value)}>
              <option value="">Tous les statuts</option>
              {busStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="ab-filters__group">
            <label className="ab-filters__label">Places min</label>
            <input type="number" min="0" className="ab-filters__number" value={filters.seatsMin} onChange={(e) => handleChange('seatsMin', e.target.value)} placeholder="0" />
            <label className="ab-filters__label">Places max</label>
            <input type="number" min="0" className="ab-filters__number" value={filters.seatsMax} onChange={(e) => handleChange('seatsMax', e.target.value)} placeholder="100" />
          </div>
          <div className="ab-filters__group">
            <select className="ab-filters__select" value={filters.climatisation} onChange={(e) => handleChange('climatisation', e.target.value)}>
              <option value="">Climatisation</option>
              <option value="true">Avec clim</option>
              <option value="false">Sans clim</option>
            </select>
            <select className="ab-filters__select" value={filters.wifi} onChange={(e) => handleChange('wifi', e.target.value)}>
              <option value="">Wi-Fi</option>
              <option value="true">Avec Wi-Fi</option>
              <option value="false">Sans Wi-Fi</option>
            </select>
          </div>
          <div className="ab-filters__group">
            <label className="ab-filters__label">Mise en service du</label>
            <input type="date" className="ab-filters__date" value={filters.serviceDateFrom} onChange={(e) => handleChange('serviceDateFrom', e.target.value)} />
            <label className="ab-filters__label">au</label>
            <input type="date" className="ab-filters__date" value={filters.serviceDateTo} onChange={(e) => handleChange('serviceDateTo', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}
