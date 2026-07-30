import { aiCategories, aiStatuses } from '../../../data/adminAIData';

const AdminAIFilters = ({ filters, onChange, total }) => {
  const handle = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="adai-filters-bar">
      <div className="adai-search-box">
        <i className="fa-solid fa-search"></i>
        <input type="text" placeholder="Rechercher..." value={filters.search} onChange={e => handle('search', e.target.value)} />
      </div>
      <select className="adai-filter-select" value={filters.category} onChange={e => handle('category', e.target.value)}>
        <option value="">Toutes catégories</option>
        {aiCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <select className="adai-filter-select" value={filters.status} onChange={e => handle('status', e.target.value)}>
        <option value="">Tous statuts</option>
        {aiStatuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <div className="adai-filter-stats">{total} élément{total !== 1 ? 's' : ''}</div>
    </div>
  );
};
export default AdminAIFilters;
