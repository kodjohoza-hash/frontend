import { integrationCategories, integrationStatuses } from '../../../data/adminIntegrationData';

const AdminIntegrationTable = ({ integrations: items }) => {
  if (items.length === 0) {
    return (
      <div className="adi-empty-state">
        <i className="fa-solid fa-table"></i>
        <h3>Aucune intégration</h3>
        <p>Aucune intégration ne correspond à vos critères.</p>
      </div>
    );
  }
  return (
    <div className="adi-table-wrapper">
      <table className="adi-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Version</th>
            <th>Statut</th>
            <th>Dernière sync</th>
            <th>Sandbox</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(int => {
            const cat = integrationCategories.find(c => c.id === int.category);
            const st = integrationStatuses.find(s => s.id === int.status);
            return (
              <tr key={int.id}>
                <td><strong>{int.name}</strong></td>
                <td><span className="adi-badge" style={{ background: `${cat?.color || '#6B7280'}10`, color: cat?.color || '#6B7280' }}><i className={`fa-solid ${cat?.icon || 'fa-puzzle-piece'}`}></i> {cat?.label || int.category}</span></td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>v{int.version}</td>
                <td><span className="adi-badge" style={{ background: st?.bg || 'transparent', color: st?.color || '#6B7280' }}><i className="fa-solid fa-circle" style={{ fontSize: 8 }}></i> {st?.label || int.status}</span></td>
                <td style={{ fontSize: 12, color: '#6B7280' }}>{int.lastSync}</td>
                <td>{int.sandbox ? <span style={{ color: '#F59E0B' }}><i className="fa-solid fa-flask"></i> Sandbox</span> : <span style={{ color: '#9CA3AF' }}>—</span>}</td>
                <td>
                  <button className="adi-card-action edit" style={{ padding: '3px 8px', fontSize: 11 }}><i className="fa-regular fa-pen-to-square"></i></button>
                  <button className="adi-card-action toggle" style={{ padding: '3px 8px', fontSize: 11 }}><i className="fa-solid fa-toggle-on"></i></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default AdminIntegrationTable;
