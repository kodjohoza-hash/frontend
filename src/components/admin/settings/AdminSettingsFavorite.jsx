import React from 'react';

const AdminSettingsFavorite = ({ favorites, allFields, onSelect }) => {
  const favFields = allFields.filter(f => favorites.includes(f.id));

  if (favFields.length === 0) {
    return <div className="adst-empty"><i className="fas fa-star" /><p>Aucun favori. Cliquez sur l'étoile à côté d'un paramètre pour l'ajouter.</p></div>;
  }

  return (
    <div className="adst-form-grid">
      {favFields.map((f, i) => (
        <div key={i} className="adst-form-field" style={{ cursor: 'pointer' }} onClick={() => onSelect(f.categoryId)}>
          <div className="adst-form-field-header">
            <span className="adst-form-label">{f.categoryLabel}</span>
            <span style={{ color: '#FBBF24', fontSize: '0.75rem' }}><i className="fas fa-star" /></span>
          </div>
          <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{f.label}</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            {f.type === 'bool' ? (f.value ? 'Oui' : 'Non') : String(f.value)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSettingsFavorite;
