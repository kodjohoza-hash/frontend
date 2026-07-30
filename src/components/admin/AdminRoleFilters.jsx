import { useState } from 'react';
import { ROLE_TYPES, ROLE_STATUSES } from '../../data/adminRoleData';

const AdminRoleFilters = ({ filters, onFilterChange, onReset, total, filtered }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const handleChange = (key, value) => onFilterChange({ ...filters, [key]: value });

  return (
    <div className="admr-filters-bar">
      <div className="admr-filters-top">
        <div className="admr-search-wrapper">
          <i className="bi bi-search" />
          <input type="text" placeholder="Rechercher un rôle (nom, description, créateur)..."
            value={filters.search} onChange={(e) => handleChange('search', e.target.value)} />
        </div>
        <button className="admr-filters-toggler" onClick={() => setShowAdvanced(!showAdvanced)}>
          <i className={`bi bi-${showAdvanced ? 'chevron-up' : 'funnel'}`} />
          {showAdvanced ? 'Masquer filtres' : 'Filtres'}
        </button>
      </div>
      {showAdvanced && (
        <div className="admr-filters-panel">
          <div className="admr-filter-group">
            <label>Type</label>
            <select value={filters.type} onChange={(e) => handleChange('type', e.target.value)}>
              <option value="all">Tous</option>
              {ROLE_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div className="admr-filter-group">
            <label>Statut</label>
            <select value={filters.status} onChange={(e) => handleChange('status', e.target.value)}>
              {ROLE_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <button className="admr-btn--reset" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
          </button>
        </div>
      )}
      <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
        {filtered} rôle{filtered !== 1 ? 's' : ''} trouvé{filtered !== 1 ? 's' : ''} sur {total}
      </div>
    </div>
  );
};
export default AdminRoleFilters;
