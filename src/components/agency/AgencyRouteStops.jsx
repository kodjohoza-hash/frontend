import { useState } from 'react';
import clsx from 'clsx';

const emptyStop = { villeId: '', ordre: '', heureEstimee: '', dureeArret: '', description: '' };

export default function AgencyRouteStops({ route, stops = [], villes = [], onAdd, onUpdate, onRemove, busy }) {
  const [form, setForm] = useState(emptyStop);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});

  const routeId = route?.id;
  const activeVilles = villes.filter((v) => v.status === 'active');
  const usedVilleIds = new Set(stops.map((s) => s.villeId));
  if (route?.departCityId) usedVilleIds.add(route.departCityId);
  if (route?.arrivalCityId) usedVilleIds.add(route.arrivalCityId);

  const availableVilles = activeVilles.filter((v) => !usedVilleIds.has(v.id));

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const openAdd = () => {
    setForm(emptyStop);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (stop) => {
    setForm({
      villeId: stop.villeId,
      ordre: stop.ordre !== null && stop.ordre !== undefined ? String(stop.ordre) : '',
      heureEstimee: stop.heureEstimee || '',
      dureeArret: stop.dureeArret !== null && stop.dureeArret !== undefined ? String(stop.dureeArret) : '',
      description: stop.description || '',
    });
    setEditingId(stop.id);
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.villeId) errs.villeId = 'Ville requise';
    if (form.ordre !== '' && Number(form.ordre) < 0) errs.ordre = 'Position invalide';
    if (form.dureeArret !== '' && Number(form.dureeArret) < 0) errs.dureeArret = 'Durée invalide';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      if (editingId) {
        await onUpdate(routeId, editingId, form);
      } else {
        await onAdd(routeId, form);
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      window.alert(err.message || 'Impossible d\'enregistrer l\'escale.');
    }
  };

  const handleDelete = async (stop) => {
    if (window.confirm(`Supprimer l'escale « ${stop.cityName} » ?`)) {
      try {
        await onRemove(routeId, stop.id);
      } catch (err) {
        window.alert(err.message || 'Impossible de supprimer l\'escale.');
      }
    }
  };

  const moveStop = async (stop, dir) => {
    const target = stops.findIndex((s) => s.id === stop.id) + dir;
    if (target < 0 || target >= stops.length) return;
    const other = stops[target];
    try {
      await onUpdate(routeId, stop.id, { ordre: other.ordre });
      await onUpdate(routeId, other.id, { ordre: stop.ordre });
    } catch (err) {
      window.alert(err.message || 'Impossible de réordonner les escales.');
    }
  };

  const totalArret = stops.reduce((acc, s) => acc + (Number(s.dureeArret) || 0), 0);

  return (
    <div className="abd__card abd__card--full">
      <div className="abd__card-head">
        <h4 className="abd__card-title"><i className="bi bi-pin-map" /> Escales ({stops.length})</h4>
        {stops.length > 0 && <span className="abd__stops-total">+{totalArret} min d'arrêt</span>}
        <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={openAdd} disabled={busy}>
          <i className="bi bi-plus-lg" /> Ajouter une escale
        </button>
      </div>

      {stops.length === 0 && !showForm && (
        <div className="abd__empty-inline">
          <i className="bi bi-pin-map" />
          <span>Aucune escale — cet itinéraire est direct.</span>
        </div>
      )}

      {stops.length > 0 && (
        <div className="abd__stops-list">
          {stops.map((stop, i) => (
            <div className="abd__stop-row" key={stop.id}>
              <div className="abd__stop-order">
                <button type="button" className="abd__stop-move" onClick={() => moveStop(stop, -1)} disabled={i === 0 || busy} title="Monter">
                  <i className="bi bi-chevron-up" />
                </button>
                <span className="abd__stop-index">{stop.ordre}</span>
                <button type="button" className="abd__stop-move" onClick={() => moveStop(stop, 1)} disabled={i === stops.length - 1 || busy} title="Descendre">
                  <i className="bi bi-chevron-down" />
                </button>
              </div>
              <div className="abd__stop-city">
                <i className="bi bi-geo-alt" />
                <span>{stop.cityName}</span>
              </div>
              <div className="abd__stop-meta">
                {stop.dureeArret ? <span className="abd__stop-chip"><i className="bi bi-hourglass-split" /> {stop.dureeArret} min</span> : null}
                {stop.heureEstimee ? <span className="abd__stop-chip"><i className="bi bi-clock" /> {stop.heureEstimee}</span> : null}
              </div>
              <div className="abd__stop-actions">
                <button className="ab-table__action ab-table__action--edit" onClick={() => openEdit(stop)} title="Modifier">
                  <i className="bi bi-pencil" />
                </button>
                <button className="ab-table__action" onClick={() => handleDelete(stop)} title="Supprimer">
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="abd__stop-form">
          <h5 className="abd__stop-form-title">
            <i className="bi bi-plus-circle" /> {editingId ? 'Modifier l\'escale' : 'Nouvelle escale'}
          </h5>
          <div className="ab-form-row">
            <div className="ab-form-field">
              <label>Ville <span className="ab-required">*</span></label>
              <select value={form.villeId} onChange={(e) => handleChange('villeId', e.target.value)} className={clsx('ab-input', errors.villeId && 'ab-input--error')}>
                <option value="">Sélectionner</option>
                {(editingId ? activeVilles : availableVilles).map((v) => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
              </select>
              {errors.villeId && <span className="ab-form-error">{errors.villeId}</span>}
            </div>
            <div className="ab-form-field">
              <label>Position (auto)</label>
              <input type="number" min="0" value={form.ordre} onChange={(e) => handleChange('ordre', e.target.value)} placeholder="auto" className={clsx('ab-input', errors.ordre && 'ab-input--error')} />
              {errors.ordre && <span className="ab-form-error">{errors.ordre}</span>}
            </div>
            <div className="ab-form-field">
              <label>Durée d'arrêt (min)</label>
              <input type="number" min="0" value={form.dureeArret} onChange={(e) => handleChange('dureeArret', e.target.value)} placeholder="ex: 15" className={clsx('ab-input', errors.dureeArret && 'ab-input--error')} />
              {errors.dureeArret && <span className="ab-form-error">{errors.dureeArret}</span>}
            </div>
            <div className="ab-form-field">
              <label>Heure estimée</label>
              <input type="time" value={form.heureEstimee} onChange={(e) => handleChange('heureEstimee', e.target.value)} className="ab-input" />
            </div>
          </div>
          <div className="ab-form-field">
            <label>Description</label>
            <input type="text" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="ex: Halte repas" className="ab-input" />
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
