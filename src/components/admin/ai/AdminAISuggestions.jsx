import { useState } from 'react';
import { aiSuggestions } from '../../../data/adminAIData';

const impactColors = { critical: '#EF4444', high: '#F59E0B', medium: '#3B82F6', low: '#6B7280' };
const statusLabels = { new: 'Nouvelle', reviewed: 'Examinée', implemented: 'Implémentée' };

const AdminAISuggestions = () => {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? aiSuggestions : aiSuggestions.filter(s => s.status === filter);

  if (filtered.length === 0) {
    return (
      <div className="adai-empty-state">
        <i className="fa-solid fa-lightbulb"></i>
        <h3>Aucune suggestion</h3>
        <p>Les suggestions IA apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="adai-section-header">
        <div className="adai-section-title"><i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#F59E0B' }}></i> Suggestions IA <span className="adai-tab-badge">{aiSuggestions.length}</span></div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ id: 'all', label: 'Toutes' }, { id: 'new', label: 'Nouvelles' }, { id: 'reviewed', label: 'Examinées' }, { id: 'implemented', label: 'Implémentées' }].map(f => (
            <button key={f.id} className={`adai-btn-sm ${filter === f.id ? 'primary' : 'ghost'}`} onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
      </div>
      <div className="adai-suggestion-grid">
        {filtered.map(sug => (
          <div key={sug.id} className="adai-sug-card" style={{ borderLeftColor: impactColors[sug.impact] }}>
            <div className="adai-sug-header">
              <div className="adai-sug-title">{sug.title}</div>
              <span className="adai-badge-sm" style={{
                background: sug.status === 'new' ? 'rgba(139,92,246,.1)' : sug.status === 'reviewed' ? 'rgba(245,158,11,.1)' : 'rgba(16,185,129,.1)',
                color: sug.status === 'new' ? '#8B5CF6' : sug.status === 'reviewed' ? '#F59E0B' : '#10B981',
              }}>{statusLabels[sug.status]}</span>
            </div>
            <div className="adai-sug-desc">{sug.description}</div>
            <div className="adai-sug-footer">
              <div className="adai-confidence">
                <i className="fa-solid fa-brain" style={{ color: '#8B5CF6' }}></i> Confiance: {sug.confidence}%
                <div className="adai-progress" style={{ width: 60, display: 'inline-block', verticalAlign: 'middle', marginLeft: 6 }}>
                  <div className="adai-progress-bar" style={{ width: `${sug.confidence}%`, background: sug.confidence > 90 ? '#10B981' : sug.confidence > 80 ? '#F59E0B' : '#3B82F6' }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="adai-btn-sm success" style={{ fontSize: 10 }}><i className="fa-solid fa-check"></i> Appliquer</button>
                <button className="adai-btn-sm ghost" style={{ fontSize: 10 }}><i className="fa-regular fa-eye"></i></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminAISuggestions;
