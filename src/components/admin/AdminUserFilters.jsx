import { useState } from 'react';
import { filterOptions as defaultFilterOptions } from '../../data/adminUserData';

const AdminUserFilters = ({ filters, onFilterChange, onReset, total, filtered, options: optionsProp }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const filterOptions = optionsProp || defaultFilterOptions;
  const handleChange = (key, value) => onFilterChange({ ...filters, [key]: value });

  return (
    <div className="admu-filters-bar">
      <div className="admu-filters-top">
        <div className="admu-search-wrapper">
          <i className="bi bi-search" />
          <input type="text" placeholder="Rechercher un utilisateur (nom, email, téléphone)..."
            value={filters.search} onChange={(e) => handleChange('search', e.target.value)} />
        </div>
        <button className="admu-filters-toggler" onClick={() => setShowAdvanced(!showAdvanced)}>
          <i className={`bi bi-${showAdvanced ? 'chevron-up' : 'funnel'}`} />
          {showAdvanced ? 'Masquer filtres' : 'Filtres avancés'}
        </button>
        <div className="admu-export-wrapper">
          <ExportDropdown />
        </div>
      </div>
      {showAdvanced && (
        <div className="admu-filters-panel">
          <div className="admu-filter-group">
            <label>Rôle</label>
            <select value={filters.role} onChange={(e) => handleChange('role', e.target.value)}>
              <option value="all">Tous les rôles</option>
              {filterOptions.roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className="admu-filter-group">
            <label>Statut</label>
            <select value={filters.status} onChange={(e) => handleChange('status', e.target.value)}>
              <option value="all">Tous les statuts</option>
              {filterOptions.statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="admu-filter-group">
            <label>Compagnie</label>
            <select value={filters.company} onChange={(e) => handleChange('company', e.target.value)}>
              <option value="all">Toutes</option>
              {filterOptions.companies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admu-filter-group">
            <label>Point de vente</label>
            <select value={filters.branch} onChange={(e) => handleChange('branch', e.target.value)}>
              <option value="all">Tous</option>
              {filterOptions.branches.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="admu-filter-group">
            <label>Ville</label>
            <select value={filters.city} onChange={(e) => handleChange('city', e.target.value)}>
              <option value="all">Toutes</option>
              {filterOptions.cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admu-filter-group">
            <label>Pays</label>
            <select value={filters.country} onChange={(e) => handleChange('country', e.target.value)}>
              <option value="all">Tous</option>
              {filterOptions.countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button className="admu-btn--reset" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
          </button>
        </div>
      )}
      <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
        {filtered} utilisateur{filtered !== 1 ? 's' : ''} trouvé{filtered !== 1 ? 's' : ''} sur {total}
      </div>
    </div>
  );
};

const ExportDropdown = () => {
  const [open, setOpen] = useState(false);
  const items = [
    { label: 'CSV', icon: 'bi-filetype-csv', onClick: () => alert('Export CSV (mock)') },
    { label: 'Excel', icon: 'bi-file-earmark-excel', onClick: () => alert('Export Excel (mock)') },
    { label: 'PDF', icon: 'bi-filetype-pdf', onClick: () => alert('Export PDF (mock)') },
  ];
  return (
    <>
      <button className="admu-filters-toggler" onClick={() => setOpen(!open)} onBlur={() => setTimeout(() => setOpen(false), 200)}>
        <i className="bi bi-download" /> Exporter
      </button>
      {open && (
        <div className="admu-export-menu">
          {items.map((e) => (
            <button key={e.label} onClick={e.onClick}><i className={`bi ${e.icon}`} /> {e.label}</button>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminUserFilters;
