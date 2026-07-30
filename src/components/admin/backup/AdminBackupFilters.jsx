import { backupCategories, backupStatuses } from '../../../data/adminBackupData';

const AdminBackupFilters = ({ filters, onChange, total }) => {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <div className="adb-filters-bar">
      <div className="adb-search-box">
        <i className="fa-solid fa-search"></i>
        <input type="text" placeholder="Rechercher une sauvegarde..." value={filters.search} onChange={e => handleChange('search', e.target.value)} />
      </div>
      <select className="adb-filter-select" value={filters.category} onChange={e => handleChange('category', e.target.value)}>
        <option value="">Tous les types</option>
        {backupCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <select className="adb-filter-select" value={filters.status} onChange={e => handleChange('status', e.target.value)}>
        <option value="">Tous les statuts</option>
        {backupStatuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <div className="adb-filter-stats">{total} sauvegarde{total !== 1 ? 's' : ''}</div>
    </div>
  );
};
export default AdminBackupFilters;
