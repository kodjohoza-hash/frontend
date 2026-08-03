import { useState } from 'react';
import { subscriptionTypes, statusTypes, filterOptions as defaultFilterOptions } from '../../data/adminCompanyData';

const AdminCompanyFilters = ({ filters, onFilterChange, onReset, total, filtered, options: optionsProp }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const filterOptions = optionsProp || defaultFilterOptions;
  const handleChange = (key, value) => onFilterChange({ ...filters, [key]: value });
  const rangeFields = [
    { key: 'busesMin', label: 'Bus min' }, { key: 'busesMax', label: 'Bus max' },
    { key: 'agentsMin', label: 'Agents min' }, { key: 'agentsMax', label: 'Agents max' },
  ];
  return (
    <div className="admc-filters-bar">
      <div className="admc-filters-top">
        <div className="admc-search-wrapper">
          <i className="bi bi-search" />
          <input type="text" placeholder="Rechercher une compagnie (nom, responsable, email)..."
            value={filters.search} onChange={(e) => handleChange('search', e.target.value)} />
        </div>
        <button className="admc-filters-toggler" onClick={() => setShowAdvanced(!showAdvanced)}>
          <i className={`bi bi-${showAdvanced ? 'chevron-up' : 'funnel'}`} />
          {showAdvanced ? 'Masquer filtres' : 'Filtres avancés'}
        </button>
        <div className="admc-export-wrapper">
          <div style={{ position: 'relative' }}>
            <ExportDropdown />
          </div>
        </div>
      </div>
      {showAdvanced && (
        <div className="admc-filters-panel">
          <div className="admc-filter-group">
            <label>Ville</label>
            <select value={filters.city} onChange={(e) => handleChange('city', e.target.value)}>
              <option value="all">Toutes</option>
              {filterOptions.cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admc-filter-group">
            <label>Pays</label>
            <select value={filters.country} onChange={(e) => handleChange('country', e.target.value)}>
              <option value="all">Tous</option>
              {filterOptions.countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admc-filter-group">
            <label>Abonnement</label>
            <select value={filters.subscription} onChange={(e) => handleChange('subscription', e.target.value)}>
              {subscriptionTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="admc-filter-group">
            <label>Statut</label>
            <select value={filters.status} onChange={(e) => handleChange('status', e.target.value)}>
              {statusTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {rangeFields.map((f) => (
            <div className="admc-filter-group" key={f.key}>
              <label>{f.label}</label>
              <input type="number" min="0" placeholder="0" value={filters[f.key] || ''}
                onChange={(e) => handleChange(f.key, e.target.value)} />
            </div>
          ))}
          <button className="admc-btn--reset" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
          </button>
        </div>
      )}
      <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
        {filtered} compagnie{filtered !== 1 ? 's' : ''} trouvée{filtered !== 1 ? 's' : ''} sur {total}
      </div>
    </div>
  );
};

const ExportDropdown = () => {
  const [open, setOpen] = useState(false);
  const exports = [
    { label: 'CSV', icon: 'bi-filetype-csv', onClick: () => alert('Export CSV (mock)') },
    { label: 'Excel', icon: 'bi-file-earmark-excel', onClick: () => alert('Export Excel (mock)') },
    { label: 'PDF', icon: 'bi-filetype-pdf', onClick: () => alert('Export PDF (mock)') },
  ];
  return (
    <>
      <button className="admc-filters-toggler" onClick={() => setOpen(!open)} onBlur={() => setTimeout(() => setOpen(false), 200)}>
        <i className="bi bi-download" /> Exporter
      </button>
      {open && (
        <div className="admc-export-menu">
          {exports.map((e) => (
            <button key={e.label} onClick={e.onClick}><i className={`bi ${e.icon}`} /> {e.label}</button>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminCompanyFilters;
