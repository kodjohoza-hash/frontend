import React, { useState, useEffect, useCallback } from 'react';

const AdminSettingsForm = ({ category, favorites, onToggleFavorite, onSave, onUnsavedChange }) => {
  const [values, setValues] = useState({});
  const [saved, setSaved] = useState({});

  useEffect(() => {
    if (category) {
      const init = {};
      category.fields.forEach(f => { init[f.id] = f.value; });
      setValues(init);
      setSaved({});
    }
  }, [category]);

  const handleChange = useCallback((fieldId, newVal) => {
    setValues(prev => {
      const next = { ...prev, [fieldId]: newVal };
      return next;
    });
    setSaved(prev => ({ ...prev, [fieldId]: false }));
    onUnsavedChange(true);
  }, [onUnsavedChange]);

  const handleSave = useCallback((fieldId) => {
    if (onSave) onSave(category.id, fieldId, values[fieldId]);
    setSaved(prev => ({ ...prev, [fieldId]: true }));
    onUnsavedChange(false);
    setTimeout(() => setSaved(prev => ({ ...prev, [fieldId]: false })), 2000);
  }, [category, values, onSave, onUnsavedChange]);

  if (!category) return null;

  return (
    <div>
      <div className="adst-category-header">
        <div className="adst-category-icon"><i className={`fas ${category.icon}`} /></div>
        <div className="adst-category-info">
          <h2>{category.label}</h2>
          <p>{category.description}</p>
        </div>
      </div>

      <div className="adst-form-grid">
        {category.fields.map(field => {
          const val = values[field.id] ?? field.value;
          const isFav = favorites.includes(field.id);
          const isSaved = saved[field.id];

          return (
            <div key={field.id} className="adst-form-field">
              <div className="adst-form-field-header">
                <span className="adst-form-label">{field.label}</span>
                <button className={`adst-form-favorite ${isFav ? 'active' : ''}`}
                  onClick={() => onToggleFavorite(field.id)} title="Favori">
                  <i className={`fas ${isFav ? 'fa-star' : 'fa-star'}`} />
                </button>
              </div>

              {field.type === 'bool' ? (
                <input type="checkbox" className="adst-form-checkbox"
                  checked={!!val} onChange={e => handleChange(field.id, e.target.checked)} />
              ) : field.type === 'color' ? (
                <input type="color" className="adst-form-color" value={val}
                  onChange={e => handleChange(field.id, e.target.value)} />
              ) : field.type === 'select' ? (
                <select className="adst-form-select" value={val}
                  onChange={e => handleChange(field.id, e.target.value)}>
                  {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : field.type === 'textarea' || field.type === 'text' ? (
                <textarea className="adst-form-textarea" value={val}
                  onChange={e => handleChange(field.id, e.target.value)} />
              ) : (
                <input className="adst-form-input" type={field.type === 'password' ? 'password' : field.type === 'number' ? 'number' : 'text'}
                  value={val} onChange={e => handleChange(field.id, field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)} />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                {isSaved && <span className="adst-form-saved"><i className="fas fa-check-circle" /> Sauvegardé</span>}
                <button className="adst-btn adst-btn-sm adst-btn-success" style={{ marginLeft: 'auto' }}
                  onClick={() => handleSave(field.id)}>
                  <i className="fas fa-floppy-disk" /> Sauvegarder
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSettingsForm;
