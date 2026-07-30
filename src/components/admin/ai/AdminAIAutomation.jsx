import { automations, aiStatuses } from '../../../data/adminAIData';

const AdminAIAutomation = () => {
  if (automations.length === 0) {
    return (
      <div className="adai-empty-state">
        <i className="fa-solid fa-robot"></i>
        <h3>Aucune automatisation</h3>
        <p>Créez votre première automatisation pour gagner du temps.</p>
        <button className="adai-btn-primary" style={{ margin: '16px auto 0' }}><i className="fa-solid fa-plus"></i> Créer une automatisation</button>
      </div>
    );
  }
  return (
    <div>
      <div className="adai-section-header">
        <div className="adai-section-title"><i className="fa-solid fa-bolt" style={{ color: '#3B82F6' }}></i> Automatisations <span className="adai-tab-badge">{automations.length}</span></div>
        <div className="adai-section-actions">
          <button className="adai-btn-sm success"><i className="fa-solid fa-plus"></i> Nouvelle automatisation</button>
          <button className="adai-btn-sm primary"><i className="fa-solid fa-file-export"></i> Exporter</button>
        </div>
      </div>
      <div className="adai-table-wrapper">
        <table className="adai-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Déclencheur</th>
              <th>Action</th>
              <th>Statut</th>
              <th>Exécutions</th>
              <th>Succès</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {automations.map(aut => {
              const st = aiStatuses.find(s => s.id === aut.status);
              return (
                <tr key={aut.id}>
                  <td><strong style={{ fontSize: 13 }}>{aut.name}</strong></td>
                  <td style={{ fontSize: 12, color: '#6B7280' }}>{aut.category}</td>
                  <td style={{ fontSize: 12 }}><span className="adai-badge-sm" style={{ background: 'rgba(245,158,11,.1)', color: '#F59E0B' }}><i className="fa-solid fa-bolt"></i> {aut.trigger}</span></td>
                  <td style={{ fontSize: 12 }}>{aut.action}</td>
                  <td><span className="adai-badge-sm" style={{ background: st?.bg, color: st?.color }}><i className="fa-solid fa-circle" style={{ fontSize: 7 }}></i> {st?.label || aut.status}</span></td>
                  <td style={{ fontSize: 12 }}>{aut.runs.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="adai-progress" style={{ width: 60 }}>
                        <div className="adai-progress-bar" style={{ width: `${aut.successRate}%`, background: aut.successRate >= 99 ? '#10B981' : aut.successRate >= 95 ? '#F59E0B' : '#EF4444' }}></div>
                      </div>
                      <span style={{ fontSize: 11, fontFamily: 'monospace' }}>{aut.successRate}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="adai-btn-sm ghost"><i className="fa-regular fa-eye"></i></button>
                      <button className="adai-btn-sm ghost"><i className="fa-regular fa-pen-to-square"></i></button>
                      <button className="adai-btn-sm warning"><i className="fa-solid fa-toggle-on"></i></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminAIAutomation;
