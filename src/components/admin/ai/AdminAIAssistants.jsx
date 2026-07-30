import { aiAssistants, aiStatuses } from '../../../data/adminAIData';

const AdminAIAssistants = () => {
  if (aiAssistants.length === 0) {
    return (
      <div className="adai-empty-state">
        <i className="fa-solid fa-wand-magic-sparkles"></i>
        <h3>Aucun assistant IA</h3>
        <p>Créez votre premier assistant pour automatiser vos tâches.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="adai-section-header">
        <div className="adai-section-title"><i className="fa-solid fa-robot" style={{ color: '#8B5CF6' }}></i> Assistants IA <span className="adai-tab-badge">{aiAssistants.length}</span></div>
        <div className="adai-section-actions">
          <button className="adai-btn-sm success"><i className="fa-solid fa-plus"></i> Nouvel assistant</button>
        </div>
      </div>
      <div className="adai-assistant-grid">
        {aiAssistants.map(ast => {
          const st = aiStatuses.find(s => s.id === ast.status);
          return (
            <div key={ast.id} className="adai-assistant-card">
              <div className="adai-ast-header">
                <div className="adai-ast-icon" style={{ background: `${ast.color}12`, color: ast.color }}>
                  <i className={`fa-solid ${ast.icon}`}></i>
                </div>
                <div className="adai-ast-info">
                  <div className="adai-ast-name">
                    {ast.name}
                    <span className="adai-badge-sm" style={{ background: st?.bg, color: st?.color }}>
                      <i className="fa-solid fa-circle" style={{ fontSize: 7 }}></i> {st?.label || ast.status}
                    </span>
                  </div>
                  <div className="adai-ast-model"><i className="fa-solid fa-microchip"></i> {ast.model}</div>
                </div>
              </div>
              <div className="adai-ast-desc">{ast.description}</div>
              <div className="adai-ast-caps">
                {ast.capabilities.map((cap, i) => <span key={i} className="adai-ast-cap">{cap}</span>)}
              </div>
              <div className="adai-ast-stats">
                <span><i className="fa-regular fa-clock"></i> {ast.lastActive || 'N/A'}</span>
                <span><i className="fa-solid fa-bullseye"></i> {ast.accuracy}% précision</span>
                <span><i className="fa-solid fa-bolt"></i> {ast.requests.toLocaleString()} requêtes</span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                <button className="adai-btn-sm primary"><i className="fa-regular fa-eye"></i> Voir</button>
                <button className="adai-btn-sm ghost"><i className="fa-regular fa-pen-to-square"></i></button>
                <button className="adai-btn-sm warning"><i className="fa-solid fa-rotate"></i> Entraîner</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminAIAssistants;
