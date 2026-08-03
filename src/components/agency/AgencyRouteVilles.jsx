import { useState } from 'react';
import clsx from 'clsx';

const emptyVille = { id: '', name: '', region: '', country: 'Cameroun', latitude: '', longitude: '' };

export default function AgencyRouteVilles({ villes = [], onAdd, onUpdate, onRemove, busy }) {
  const [form, setForm] = useState(emptyVille);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const openAdd = () => {
    setForm(emptyVille);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (ville) => {
    setForm({
      id: ville.id,
      name: ville.name || '',
      region: ville.region || '',
      country: ville.country || 'Cameroun',
      latitude: ville.latitude !== null && ville.latitude !== undefined ? String(ville.latitude) : '',
      longitude: ville.longitude !== null && ville.longitude !== undefined ? String(ville.longitude) : '',
    });
    setEditingId(ville.id);
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.id.trim()) errs.id = 'Code requis';
    if (!/^[A-Z0-9]{2,3}$/i.test(form.id.trim())) errs.id = '2 à 3 caractères (ex: DLA)';
    if (!form.name.trim()) errs.name = 'Nom requis';
    if (villes.some((v) => v.id === form.id.trim().toUpperCase() && v.id !== editingId)) {
      errs.id = 'Ce code existe déjà';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      if (editingId) {
        await onUpdate(editingId, { ...form, name: form.name.trim(), id: form.id.trim().toUpperCase() });
      } else {
        await onAdd({ ...form, name: form.name.trim(), id: form.id.trim().toUpperCase() });
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      window.alert(err.message || 'Impossible d\'enregistrer la ville.');
    }
  };

  const handleDelete = async (ville) => {
    if (window.confirm(`Archiver la ville « ${ville.name} » ?`)) {
      try {
        await onRemove(ville.id);
      } catch (err) {
        window.alert(err.message || 'Impossible d\'archiver la ville.');
      }
    }
  };

  const handleToggleStatus = async (ville) => {
    try {
      await onUpdate(ville.id, { status: ville.status === 'active' ? 'inactive' : 'active' });
    } catch (err) {
      window.alert(err.message || 'Impossible de changer le statut de la ville.');
    }
  };

  const actives = villes.filter((v) => v.status === 'active');
  const others = villes.filter((v) => v.status !== 'active');

  return (
    <div className="ab-page__panel">
      <div className="ab-page__panel-head">
        <div>
          <h2 className="ab-page__panel-title"><i className="bi bi-geo-alt" /> Villes desservies</h2>
          <p className="ab-page__panel-sub">{villes.length} villes — {actives.length} actives</p>
        </div>
        <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={openAdd} disabled={busy}>
          <i className="bi bi-plus-lg" /> Ajouter une ville
        </button>
      </div>

      {villes.length === 0 && !showForm && (
        <div className="ab-table__empty">
          <i className="bi bi-geo-alt" />
          <p>Aucune ville</p>
        </div>
      )}

      {villes.length > 0 && (
        <div className="ab-villes-grid">
          {[...actives, ...others].map((ville) => (
            <div className={clsx('ab-ville-card', { 'ab-ville-card--inactive': ville.status !== 'active' })} key={ville.id}>
              <div className="ab-ville-card__top">
                <span className="ab-ville-card__code">{ville.id}</span>
                <span className={clsx('ab-ville-card__status', { 'ab-ville-card__status--active': ville.status === 'active' })}>
                  {ville.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="ab-ville-card__name">{ville.name}</div>
              <div className="ab-ville-card__meta">
                {ville.region && <span><i className="bi bi-signpost" /> {ville.region}</span>}
                <span><i className="bi bi-globe2" /> {ville.country}</span>
                {ville.latitude !== null && ville.latitude !== undefined && (
                  <span><i className="bi bi-geo" /> {ville.latitude}, {ville.longitude}</span>
                )}
              </div>
              <div className="ab-ville-card__actions">
                <button className="ab-card__btn ab-card__btn--outline" onClick={() => openEdit(ville)}>
                  <i className="bi bi-pencil" /> Modifier
                </button>
                <button className="ab-card__btn ab-card__btn--outline" onClick={() => handleToggleStatus(ville)}>
                  <i className="bi bi-pause-circle" /> {ville.status === 'active' ? 'Désactiver' : 'Activer'}
                </button>
                <button className="ab-card__btn ab-card__btn--danger" onClick={() => handleDelete(ville)}>
                  <i className="bi bi-archive" /> Archiver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="abd__stop-form">
          <h5 className="abd__stop-form-title">
            <i className="bi bi-plus-circle" /> {editingId ? 'Modifier la ville' : 'Nouvelle ville'}
          </h5>
          <div className="ab-form-row">
            <div className="ab-form-field">
              <label>Code <span className="ab-required">*</span></label>
              <input type="text" value={form.id} onChange={(e) => handleChange('id', e.target.value)} placeholder="ex: DLA" maxLength={3} className={clsx('ab-input', errors.id && 'ab-input--error')} />
              {errors.id && <span className="ab-form-error">{errors.id}</span>}
            </div>
            <div className="ab-form-field">
              <label>Nom <span className="ab-required">*</span></label>
              <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="ex: Douala" className={clsx('ab-input', errors.name && 'ab-input--error')} />
              {errors.name && <span className="ab-form-error">{errors.name}</span>}
            </div>
            <div className="ab-form-field">
              <label>Région</label>
              <input type="text" value={form.region} onChange={(e) => handleChange('region', e.target.value)} placeholder="ex: Littoral" className="ab-input" />
            </div>
            <div className="ab-form-field">
              <label>Pays</label>
              <input type="text" value={form.country} onChange={(e) => handleChange('country', e.target.value)} placeholder="ex: Cameroun" className="ab-input" />
            </div>
          </div>
          <div className="ab-form-row">
            <div className="ab-form-field">
              <label>Latitude</label>
              <input type="number" step="any" min="-90" max="90" value={form.latitude} onChange={(e) => handleChange('latitude', e.target.value)} placeholder="ex: 4.0511" className="ab-input" />
            </div>
            <div className="ab-form-field">
              <label>Longitude</label>
              <input type="number" step="any" min="-180" max="180" value={form.longitude} onChange={(e) => handleChange('longitude', e.target.value)} placeholder="ex: 9.7679" className="ab-input" />
            </div>
          </div>
          <div className="abd__stop-form-actions">
            <button type="button" className="ab-btn ab-btn--outline ab-btn--sm" onClick={() => { setShowForm(false); setEditingId(null); }}>
              Annuler
            </button>
            <button type="submit" className="ab-btn ab-btn--primary ab-btn--sm" disabled={busy}>
              {busy ? <><span className="ab-btn__spinner" /> Enregistrement...</> : <><i className="bi bi-check-lg" /> Enregistrer</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
