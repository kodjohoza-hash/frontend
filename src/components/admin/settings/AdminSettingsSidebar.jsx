import React from 'react';
import { settingsCategories } from '../../../data/adminSettingsData';

const AdminSettingsSidebar = ({ categories, activeCat, onSelect, search, setSearch }) => {
  return (
    <div className="adst-sidebar">
      <div className="adst-sidebar-header">
        <input className="adst-sidebar-search" placeholder="Rechercher un paramètre..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="adst-sidebar-items">
        {categories.map(cat => (
          <button key={cat.id} className={`adst-sidebar-item ${activeCat === cat.id ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}>
            <i className={`fas ${cat.icon}`} />
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminSettingsSidebar;
