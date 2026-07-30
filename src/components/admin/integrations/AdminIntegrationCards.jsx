import { integrationCategories, integrationStatuses } from '../../../data/adminIntegrationData';

const AdminIntegrationCards = ({ integrations: items }) => {
  if (items.length === 0) {
    return (
      <div className="adi-empty-state">
        <i className="fa-solid fa-plug"></i>
        <h3>Aucune intégration trouvée</h3>
        <p>Essayez de modifier vos filtres de recherche.</p>
      </div>
    );
  }
  return (
    <div className="adi-cards-grid">
      {items.map(int => {
        const cat = integrationCategories.find(c => c.id === int.category);
        const st = integrationStatuses.find(s => s.id === int.status);
        return (
          <div key={int.id} className="adi-card">
            <div className="adi-card-body">
              <div className="adi-card-flex">
                <div className="adi-card-icon" style={{ background: `${cat?.color || '#6B7280'}15`, color: cat?.color || '#6B7280' }}>
                  <i className={`fa-solid ${cat?.icon || 'fa-puzzle-piece'}`}></i>
                </div>
                <div className="adi-card-info">
                  <div className="adi-card-name">{int.name}</div>
                  <div className="adi-card-desc">{int.description}</div>
                  <div className="adi-card-meta">
                    <span><i className="fa-regular fa-clock"></i> Sync: {int.lastSync}</span>
                    <span><i className="fa-solid fa-code-branch"></i> v{int.version}</span>
                    <span><i className="fa-regular fa-user"></i> {int.creator?.split(' ')[1] || int.creator}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, margin: '10px 0', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="adi-badge" style={{ background: st?.bg || 'transparent', color: st?.color || '#6B7280' }}>
                  <i className="fa-solid fa-circle" style={{ fontSize: 8 }}></i> {st?.label || int.status}
                </span>
                <span className="adi-badge" style={{ background: `${cat?.color || '#6B7280'}10`, color: cat?.color || '#6B7280' }}>
                  <i className={`fa-solid ${cat?.icon || 'fa-puzzle-piece'}`}></i> {cat?.label || int.category}
                </span>
                {int.sandbox && <span className="adi-badge" style={{ background: 'rgba(245,158,11,.1)', color: '#F59E0B' }}><i className="fa-solid fa-flask"></i> Sandbox</span>}
              </div>
              <div className="adi-card-actions">
                <button className="adi-card-action edit"><i className="fa-regular fa-pen-to-square"></i> Configurer</button>
                <button className="adi-card-action toggle"><i className={`fa-solid fa-toggle-${int.status === 'active' ? 'on' : 'off'}`}></i> {int.status === 'active' ? 'Désactiver' : 'Activer'}</button>
                <button className="adi-card-action delete"><i className="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default AdminIntegrationCards;
