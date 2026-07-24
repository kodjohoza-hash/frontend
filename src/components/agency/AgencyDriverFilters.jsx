import { useState } from 'react';
import { driverStatuses, licenseCategories, cities } from '../../data/agencyDriverData';
import clsx from 'clsx';

const initialFilters = {
  search: '', lastName: '', firstName: '', phone: '', status: '',
  licenseCategory: '', assignedBus: '', city: '', experience: '', available: '',
};

export default function AgencyDriverFilters({ filters, onFiltersChange, onReset }) {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (key, value) => onFiltersChange({ ...filters, [key]: value });
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="ad-filters">
      <div className="ad-filters__row">
        <div className="ad-filters__search">
          <i className="bi bi-search" />
          <input type="text" placeholder="Rechercher par nom, téléphone, email..." value={filters.search} onChange={(e) => handleChange('search', e.target.value)} className="ad-filters__input" />
          {filters.search && <button className="ad-filters__clear" onClick={() => handleChange('search', '')}><i className="bi bi-x-lg" /></button>}
        </div>
        <button className={clsx('ad-filters__toggle', { 'ad-filters__toggle--active': expanded })} onClick={() => setExpanded(!expanded)} type="button">
          <i className="bi bi-sliders2" /><span>Filtres</span>
          {activeCount > 0 && <span className="ad-filters__badge">{activeCount}</span>}
          <i className={clsx('bi', expanded ? 'bi-chevron-up' : 'bi-chevron-down')} />
        </button>
        {activeCount > 0 && (
          <button className="ad-filters__reset" onClick={onReset} type="button"><i className="bi bi-arrow-counterclockwise" /><span>Réinitialiser</span></button>
        )}
      </div>
      {expanded && (
        <div className="ad-filters__expanded">
          <div className="ad-filters__group">
            <select className="ad-filters__select" value={filters.status} onChange={(e) => handleChange('status', e.target.value)}>
              <option value="">Tous les statuts</option>
              {driverStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select className="ad-filters__select" value={filters.licenseCategory} onChange={(e) => handleChange('licenseCategory', e.target.value)}>
              <option value="">Tous les permis</option>
              {licenseCategories.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <select className="ad-filters__select" value={filters.city} onChange={(e) => handleChange('city', e.target.value)}>
              <option value="">Toutes les villes</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="ad-filters__group">
            <select className="ad-filters__select" value={filters.assignedBus} onChange={(e) => handleChange('assignedBus', e.target.value)}>
              <option value="">Bus affecté</option>
              <option value="yes">Avec bus</option>
              <option value="no">Sans bus</option>
            </select>
            <select className="ad-filters__select" value={filters.experience} onChange={(e) => handleChange('experience', e.target.value)}>
              <option value="">Expérience</option>
              <option value="0-5">0-5 ans</option>
              <option value="5-10">5-10 ans</option>
              <option value="10-15">10-15 ans</option>
              <option value="15+">15+ ans</option>
            </select>
            <select className="ad-filters__select" value={filters.available} onChange={(e) => handleChange('available', e.target.value)}>
              <option value="">Disponibilité</option>
              <option value="yes">Disponible</option>
              <option value="no">Non disponible</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
