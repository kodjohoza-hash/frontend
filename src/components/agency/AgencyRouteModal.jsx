import { useEffect, useState } from 'react';
import clsx from 'clsx';

const emptyRoute = {
  name: '', code: '', departCityId: '', arrivalCityId: '',
  distanceKm: '', duration: '', priceMin: '', priceMax: '',
  status: 'active', description: '',
};

export default function AgencyRouteModal({ isOpen, onClose, route, villes = [], onSave }) {
  const [form, setForm] = useState(emptyRoute);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (route) {
      setForm({
        name: route.name || '',
        code: route.code || '',
        departCityId: route.departCityId || '',
        arrivalCityId: route.arrivalCityId || '',
        distanceKm: route.distanceKm !== null && route.distanceKm !== undefined ? String(route.distanceKm) : '',
        duration: route.duration || '',
        priceMin: route.priceMin !== null && route.priceMin !== undefined ? String(route.priceMin) : '',
        priceMax: route.priceMax !== null && route.priceMax !== undefined ? String(route.priceMax) : '',
        status: route.status || 'active',
        description: route.description || '',
      });
    } else {
      setForm(emptyRoute);
    }
    setErrors({});
  }, [route, isOpen]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nom requis';
    if (!form.departCityId) errs.departCityId = 'Ville de départ requise';
    if (!form.arrivalCityId) errs.arrivalCityId = "Ville d'arrivée requise";
    if (form.departCityId && form.arrivalCityId && form.departCityId === form.arrivalCityId) {
      errs.arrivalCityId = 'Doit être différente du départ';
    }
    if (!form.duration.trim()) errs.duration = 'Durée requise (ex: 4h30)';
    if (!/^(\d{1,2}h(?:[0-5]\d)?|\d{1,2}min?|\d{1,3}min)$/i.test(form.duration.trim())) {
      errs.duration = 'Format invalide (ex: 4h30, 45min)';
    }
    if (form.priceMin !== '' && Number(form.priceMin) < 0) errs.priceMin = 'Valeur invalide';
    if (form.priceMax !== '' && Number(form.priceMax) < 0) errs.priceMax = 'Valeur invalide';
    if (form.priceMin !== '' && form.priceMax !== '' && Number(form.priceMin) > Number(form.priceMax)) {
      errs.priceMax = 'Doit être ≥ au prix min';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave?.(form);
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="ab-modal-overlay" onClick={onClose}>
      <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">
            <i className="bi bi-signpost-split" />
            <h3>{route ? `Modifier ${route.name}` : 'Nouvel itinéraire'}</h3>
          </div>
          <button className="ab-modal__close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ab-modal__body">
          <div className="ab-form-section">
            <h4 className="ab-form-section__title"><i className="bi bi-signpost-split" /> Informations générales</h4>
            <div className="ab-form-row">
              <div className="ab-form-field">
                <label>Nom de l'itinéraire <span className="ab-required">*</span></label>
                <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="ex: Douala → Yaoundé" className={clsx('ab-input', errors.name && 'ab-input--error')} />
                {errors.name && <span className="ab-form-error">{errors.name}</span>}
              </div>
              <div className="ab-form-field">
                <label>Code</label>
                <input type="text" value={form.code} onChange={(e) => handleChange('code', e.target.value)} placeholder="ex: RT-0001" className="ab-input" />
              </div>
            </div>
            <div className="ab-form-row">
              <div className="ab-form-field">
                <label>Ville de départ <span className="ab-required">*</span></label>
                <select value={form.departCityId} onChange={(e) => handleChange('departCityId', e.target.value)} className={clsx('ab-input', errors.departCityId && 'ab-input--error')}>
                  <option value="">Sélectionner</option>
                  {villes.filter((v) => v.status === 'active').map((v) => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
                </select>
                {errors.departCityId && <span className="ab-form-error">{errors.departCityId}</span>}
              </div>
              <div className="ab-form-field">
                <label>Ville d'arrivée <span className="ab-required">*</span></label>
                <select value={form.arrivalCityId} onChange={(e) => handleChange('arrivalCityId', e.target.value)} className={clsx('ab-input', errors.arrivalCityId && 'ab-input--error')}>
                  <option value="">Sélectionner</option>
                  {villes.filter((v) => v.status === 'active').map((v) => <option key={v.id} value={v.id}>{v.name} ({v.id})</option>)}
                </select>
                {errors.arrivalCityId && <span className="ab-form-error">{errors.arrivalCityId}</span>}
              </div>
            </div>
            <div className="ab-form-row">
              <div className="ab-form-field">
                <label>Distance (km)</label>
                <input type="number" min="0" value={form.distanceKm} onChange={(e) => handleChange('distanceKm', e.target.value)} placeholder="ex: 260" className="ab-input" />
              </div>
              <div className="ab-form-field">
                <label>Durée <span className="ab-required">*</span></label>
                <input type="text" value={form.duration} onChange={(e) => handleChange('duration', e.target.value)} placeholder="ex: 4h30" className={clsx('ab-input', errors.duration && 'ab-input--error')} />
                {errors.duration && <span className="ab-form-error">{errors.duration}</span>}
              </div>
              <div className="ab-form-field">
                <label>Statut</label>
                <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="ab-input">
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <div className="ab-form-row">
              <div className="ab-form-field">
                <label>Prix min (XAF)</label>
                <input type="number" min="0" value={form.priceMin} onChange={(e) => handleChange('priceMin', e.target.value)} placeholder="ex: 4500" className={clsx('ab-input', errors.priceMin && 'ab-input--error')} />
                {errors.priceMin && <span className="ab-form-error">{errors.priceMin}</span>}
              </div>
              <div className="ab-form-field">
                <label>Prix max (XAF)</label>
                <input type="number" min="0" value={form.priceMax} onChange={(e) => handleChange('priceMax', e.target.value)} placeholder="ex: 6000" className={clsx('ab-input', errors.priceMax && 'ab-input--error')} />
                {errors.priceMax && <span className="ab-form-error">{errors.priceMax}</span>}
              </div>
            </div>
          </div>

          <div className="ab-form-section">
            <h4 className="ab-form-section__title"><i className="bi bi-chat-dots" /> Description</h4>
            <div className="ab-form-field">
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} placeholder="Description de l'itinéraire..." className="ab-input ab-input--textarea" />
            </div>
          </div>

          <div className="ab-modal__footer">
            <button type="button" className="ab-btn ab-btn--outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="ab-btn ab-btn--primary" disabled={saving}>
              {saving ? <><span className="ab-btn__spinner" /> Enregistrement...</> : <><i className="bi bi-check-lg" /> {route ? 'Mettre à jour' : 'Créer l\'itinéraire'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
