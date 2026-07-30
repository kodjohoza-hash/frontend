import { aiCategories, aiStatuses } from '../../../data/adminAIData';

const AdminAITable = ({ data: items }) => {
  if (items.length === 0) {
    return (
      <div className="adai-empty-state">
        <i className="fa-solid fa-table"></i>
        <h3>Aucun élément trouvé</h3>
        <p>Modifiez vos filtres ou créez un nouvel élément.</p>
      </div>
    );
  }
  return (
    <div className="adai-table-wrapper">
      <table className="adai-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Statut</th>
            <th>Déclencheur</th>
            <th>Dernière exécution</th>
            <th>Créateur</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const cat = aiCategories.find(c => c.id === item.category);
            const st = aiStatuses.find(s => s.id === item.status);
            return (
              <tr key={item.id}>
                <td><strong style={{ fontSize: 13 }}>{item.name}</strong></td>
                <td><span className="adai-badge-sm" style={{ background: `${cat?.color || '#6B7280'}10`, color: cat?.color || '#6B7280' }}><i className={`fa-solid ${cat?.icon || 'fa-gear'}`}></i> {cat?.label || item.category}</span></td>
                <td><span className="adai-badge-sm" style={{ background: st?.bg, color: st?.color }}><i className="fa-solid fa-circle" style={{ fontSize: 7 }}></i> {st?.label || item.status}</span></td>
                <td style={{ fontSize: 12 }}>{item.trigger || '—'}</td>
                <td style={{ fontSize: 12, color: '#6B7280' }}>{item.lastRun || '—'}</td>
                <td style={{ fontSize: 12 }}>{item.creator}</td>
                <td style={{ fontSize: 12, color: '#6B7280' }}>{item.createdAt}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="adai-btn-sm ghost"><i className="fa-regular fa-eye"></i></button>
                    <button className="adai-btn-sm ghost"><i className="fa-regular fa-pen-to-square"></i></button>
                    <button className="adai-btn-sm success"><i className="fa-solid fa-toggle-on"></i></button>
                    <button className="adai-btn-sm danger"><i className="fa-regular fa-trash-can"></i></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default AdminAITable;
