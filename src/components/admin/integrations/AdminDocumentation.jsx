import { useState } from 'react';
import { apiDocumentation } from '../../../data/adminIntegrationData';

const methodClass = (m) => {
  if (m === 'GET') return 'get'; if (m === 'POST') return 'post'; if (m === 'PUT') return 'put'; if (m === 'DELETE') return 'delete'; return '';
};

const AdminDocumentation = () => {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = apiDocumentation.map(section => ({
    ...section,
    endpoints: section.endpoints.filter(ep => {
      if (!search) return true;
      const s = search.toLowerCase();
      return ep.path.toLowerCase().includes(s) || ep.description.toLowerCase().includes(s) || ep.method.toLowerCase().includes(s);
    }),
  })).filter(s => s.endpoints.length > 0);

  return (
    <div>
      <div className="adi-filters-bar" style={{ padding: '0 0 16px', borderBottom: 'none' }}>
        <div className="adi-search-box">
          <i className="fa-solid fa-search"></i>
          <input type="text" placeholder="Rechercher un endpoint..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adi-filter-stats">{filtered.reduce((a, s) => a + s.endpoints.length, 0)} endpoint{filtered.reduce((a, s) => a + s.endpoints.length, 0) !== 1 ? 's' : ''}</div>
      </div>
      {filtered.map((section, si) => (
        <div key={section.tag} className="adi-docs-section">
          <div className="adi-docs-tag">
            <i className="fa-solid fa-book"></i> {section.tag}
            <span className="adi-tab-badge">{section.endpoints.length}</span>
          </div>
          <div className="adi-docs-endpoints">
            {section.endpoints.map((ep, ei) => {
              const isExpanded = expanded === `${si}-${ei}`;
              return (
                <div key={ei} className="adi-docs-endpoint" onClick={() => setExpanded(isExpanded ? null : `${si}-${ei}`)}>
                  <span className={`adi-docs-method ${methodClass(ep.method)}`}>{ep.method}</span>
                  <span className="adi-docs-path">{ep.path}</span>
                  <span className="adi-docs-desc">{ep.description}</span>
                  <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ color: '#9CA3AF', fontSize: 10, flexShrink: 0, marginTop: 4 }}></i>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <div className="adi-empty-state">
          <i className="fa-solid fa-code"></i>
          <h3>Aucun endpoint trouvé</h3>
          <p>Essayez une autre recherche.</p>
        </div>
      )}
    </div>
  );
};
export default AdminDocumentation;
