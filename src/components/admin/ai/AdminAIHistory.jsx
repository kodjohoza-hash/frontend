import { useState } from 'react';
import { aiHistory } from '../../../data/adminAIData';

const iconMap = { creation: 'fa-plus', modification: 'fa-pen', activation: 'fa-toggle-on', execution: 'fa-bolt', error: 'fa-circle-xmark', deletion: 'fa-trash-can' };
const statusMap = { creation: 'info', modification: 'info', activation: 'success', execution: 'success', error: 'error', deletion: 'warning' };

const AdminAIHistory = () => {
  const [filterType, setFilterType] = useState('all');

  const filtered = filterType === 'all' ? aiHistory : aiHistory.filter(h => h.type === filterType);
  const sorted = [...filtered].sort((a, b) => new Date(b.time) - new Date(a.time));

  if (sorted.length === 0) {
    return (
      <div className="adai-empty-state">
        <i className="fa-solid fa-clock-rotate-left"></i>
        <h3>Aucun historique</h3>
        <p>L'historique des activités IA apparaîtra ici.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="adai-section-header">
        <div className="adai-section-title"><i className="fa-solid fa-clock-rotate-left" style={{ color: '#8B5CF6' }}></i> Historique <span className="adai-tab-badge">{filtered.length}</span></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[{ id: 'all', label: 'Tout' }, { id: 'creation', label: 'Créations' }, { id: 'execution', label: 'Exécutions' }, { id: 'error', label: 'Erreurs' }, { id: 'modification', label: 'Modifications' }].map(f => (
            <button key={f.id} className={`adai-btn-sm ${filterType === f.id ? 'primary' : 'ghost'}`} onClick={() => setFilterType(f.id)}>{f.label}</button>
          ))}
        </div>
      </div>
      <div className="adai-timeline">
        {sorted.map(ev => (
          <div key={ev.id} className="adai-tl-item">
            <div className={`adai-tl-dot ${statusMap[ev.type] || 'info'}`}><i className={`fa-solid ${iconMap[ev.type] || 'fa-circle'}`}></i></div>
            <div className="adai-tl-title">{ev.title}</div>
            <div className="adai-tl-desc">{ev.description}</div>
            <div className="adai-tl-meta">
              <span><i className="fa-regular fa-clock"></i> {new Date(ev.time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              <span><i className="fa-regular fa-user"></i> {ev.user}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminAIHistory;
