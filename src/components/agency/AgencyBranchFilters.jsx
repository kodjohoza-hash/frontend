import React from 'react';
import { branchStatuses, agencyTypes, regions, daysOfWeek } from '../../data/agencyBranchData';

const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua', 'Kribi', 'Ebolowa'];

export default function AgencyBranchFilters({ filters, onChange, onReset }) {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="abr-filters">
      <div className="abr-filters__row">
        <div className="abr-filters__field abr-filters__field--search">
          <i className="bi bi-search abr-filters__search-icon" />
          <input
            type="text"
            className="abr-filters__input"
            placeholder="Nom, ville, adresse…"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
        <div className="abr-filters__field">
          <label className="abr-filters__label">Ville</label>
          <select className="abr-filters__select" value={filters.city || ''} onChange={(e) => handleChange('city', e.target.value)}>
            <option value="">Toutes</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="abr-filters__field">
          <label className="abr-filters__label">Région</label>
          <select className="abr-filters__select" value={filters.region || ''} onChange={(e) => handleChange('region', e.target.value)}>
            <option value="">Toutes</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="abr-filters__field">
          <label className="abr-filters__label">Statut</label>
          <select className="abr-filters__select" value={filters.status || ''} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="">Tous</option>
            {branchStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="abr-filters__field">
          <label className="abr-filters__label">Type</label>
          <select className="abr-filters__select" value={filters.type || ''} onChange={(e) => handleChange('type', e.target.value)}>
            <option value="">Tous</option>
            {agencyTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <button className="abr-filters__reset" onClick={onReset}>
          <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
        </button>
      </div>
    </div>
  );
}
