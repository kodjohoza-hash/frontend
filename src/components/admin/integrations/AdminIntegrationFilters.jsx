import { integrationCategories, integrationStatuses } from '../../../data/adminIntegrationData';

const AdminIntegrationFilters = ({ filters, onChange, total }) => {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="adi-filters-bar">
      <div className="adi-search-box">
        <i className="fa-solid fa-search"></i>
        <input type="text" placeholder="Rechercher une intégration..." value={filters.search} onChange={e => handleChange('search', e.target.value)} />
      </div>
      <select className="adi-filter-select" value={filters.category} onChange={e => handleChange('category', e.target.value)}>
        <option value="">Toutes catégories</option>
        {integrationCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <select className="adi-filter-select" value={filters.status} onChange={e => handleChange('status', e.target.value)}>
        <option value="">Tous statuts</option>
        {integrationStatuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <div className="adi-filter-stats">{total} intégration{total !== 1 ? 's' : ''}</div>
    </div>
  );
};
export default AdminIntegrationFilters;
