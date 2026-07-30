import React from 'react';
import { allSettings } from '../../../data/adminSettingsData';

const AdminSettingsSearch = ({ query, results, onSelect, onClear }) => {
  if (!query || !query.trim()) return null;
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          <i className="fas fa-search" style={{ marginRight: 6 }} />
          Résultats pour "{query}" ({results.length})
        </span>
        <button className="adst-btn adst-btn-sm adst-btn-outline" onClick={onClear}>
          <i className="fas fa-times" /> Effacer
        </button>
      </div>
      {results.length === 0 ? (
        <div className="adst-empty">
          <i className="fas fa-search" />
          <p>Aucun paramètre trouvé</p>
        </div>
      ) : (
        <div className="adst-form-grid">
          {results.map((f, i) => (
            <div key={i} className="adst-form-field" style={{ cursor: 'pointer' }} onClick={() => onSelect(f.categoryId)}>
              <div className="adst-form-field-header">
                <span className="adst-form-label">{f.categoryLabel}</span>
              </div>
              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{f.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                {f.type === 'bool' ? (f.value ? 'Oui' : 'Non') : String(f.value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSettingsSearch;
