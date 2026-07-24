import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { cities, drivers, buses, pickupPoints } from '../../data/agencyTripsData';

const emptyTrip = {
  from: '', to: '', date: '', departure: '', arrival: '',
  bus: '', driver: '', price: '', type: 'standard', luggage: '2', notes: '',
  fromPoint: '', toPoint: '',
};

export default function AgencyTripModal({ isOpen, onClose, trip, onSave }) {
  const [form, setForm] = useState(emptyTrip);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (trip) {
      setForm({
        from: trip.from || '',
        to: trip.to || '',
        date: trip.date || '',
        departure: trip.departure || '',
        arrival: trip.arrival || '',
        bus: trip.bus?.id || '',
        driver: trip.driver?.id || '',
        price: trip.price || '',
        type: trip.type || 'standard',
        luggage: trip.luggage || '2',
        notes: trip.notes || '',
        fromPoint: trip.fromPoint || '',
        toPoint: trip.toPoint || '',
      });
    } else {
      setForm(emptyTrip);
    }
    setErrors({});
  }, [trip, isOpen]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.from) errs.from = 'Départ requis';
    if (!form.to) errs.to = 'Destination requise';
    if (form.from && form.to && form.from === form.to) errs.to = 'Destination différente du départ';
    if (!form.date) errs.date = 'Date requise';
    if (!form.departure) errs.departure = 'Heure de départ requise';
    if (!form.bus) errs.bus = 'Bus requis';
    if (!form.driver) errs.driver = 'Chauffeur requis';
    if (!form.price || Number(form.price) < 1000) errs.price = 'Tarif minimum 1 000 FCFA';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave?.({ ...form, price: Number(form.price), luggage: Number(form.luggage) });
    setSaving(false);
  };

  const availablePoints = form.from ? (pickupPoints[form.from] || []) : [];
  const availableDrivers = drivers.filter((d) => d.available);

  if (!isOpen) return null;

  return (
    <div className="at-modal-overlay" onClick={onClose}>
      <div className="at-modal" onClick={(e) => e.stopPropagation()}>
        <div className="at-modal__header">
          <div className="at-modal__title">
            <i className="bi bi-signpost-2" />
            <h3>{trip ? `Modifier ${trip.id}` : 'Nouveau voyage'}</h3>
          </div>
          <button className="at-modal__close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="at-modal__body">
          <div className="at-form-section">
            <h4 className="at-form-section__title">
              <i className="bi bi-geo-alt" /> Itinéraire
            </h4>
            <div className="at-form-row">
              <div className="at-form-field">
                <label>Départ <span className="at-required">*</span></label>
                <select value={form.from} onChange={(e) => handleChange('from', e.target.value)} className={clsx('at-input', errors.from && 'at-input--error')}>
                  <option value="">Sélectionner</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.from && <span className="at-form-error">{errors.from}</span>}
              </div>
              <div className="at-form-field">
                <label>Point de départ</label>
                <select value={form.fromPoint} onChange={(e) => handleChange('fromPoint', e.target.value)} className="at-input">
                  <option value="">Sélectionner</option>
                  {availablePoints.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="at-form-row">
              <div className="at-form-field">
                <label>Destination <span className="at-required">*</span></label>
                <select value={form.to} onChange={(e) => handleChange('to', e.target.value)} className={clsx('at-input', errors.to && 'at-input--error')}>
                  <option value="">Sélectionner</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.to && <span className="at-form-error">{errors.to}</span>}
              </div>
              <div className="at-form-field">
                <label>Point d'arrivée</label>
                <select value={form.toPoint} onChange={(e) => handleChange('toPoint', e.target.value)} className="at-input">
                  <option value="">Sélectionner</option>
                  {(pickupPoints[form.to] || []).map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="at-form-section">
            <h4 className="at-form-section__title">
              <i className="bi bi-clock" /> Date & Heures
            </h4>
            <div className="at-form-row">
              <div className="at-form-field">
                <label>Date <span className="at-required">*</span></label>
                <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} className={clsx('at-input', errors.date && 'at-input--error')} />
                {errors.date && <span className="at-form-error">{errors.date}</span>}
              </div>
              <div className="at-form-field">
                <label>Départ <span className="at-required">*</span></label>
                <input type="time" value={form.departure} onChange={(e) => handleChange('departure', e.target.value)} className={clsx('at-input', errors.departure && 'at-input--error')} />
                {errors.departure && <span className="at-form-error">{errors.departure}</span>}
              </div>
              <div className="at-form-field">
                <label>Arrivée estimée</label>
                <input type="time" value={form.arrival} onChange={(e) => handleChange('arrival', e.target.value)} className="at-input" />
              </div>
            </div>
          </div>

          <div className="at-form-section">
            <h4 className="at-form-section__title">
              <i className="bi bi-bus-front" /> Bus & Chauffeur
            </h4>
            <div className="at-form-row">
              <div className="at-form-field">
                <label>Bus <span className="at-required">*</span></label>
                <select value={form.bus} onChange={(e) => handleChange('bus', e.target.value)} className={clsx('at-input', errors.bus && 'at-input--error')}>
                  <option value="">Sélectionner un bus</option>
                  {buses.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.plate} ({b.seats} places)</option>)}
                </select>
                {errors.bus && <span className="at-form-error">{errors.bus}</span>}
              </div>
              <div className="at-form-field">
                <label>Chauffeur <span className="at-required">*</span></label>
                <select value={form.driver} onChange={(e) => handleChange('driver', e.target.value)} className={clsx('at-input', errors.driver && 'at-input--error')}>
                  <option value="">Sélectionner un chauffeur</option>
                  {availableDrivers.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.phone}</option>)}
                </select>
                {errors.driver && <span className="at-form-error">{errors.driver}</span>}
              </div>
            </div>
          </div>

          <div className="at-form-section">
            <h4 className="at-form-section__title">
              <i className="bi bi-cash-stack" /> Tarification & Options
            </h4>
            <div className="at-form-row">
              <div className="at-form-field">
                <label>Tarif (FCFA) <span className="at-required">*</span></label>
                <input type="number" min="1000" step="500" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="ex: 8500" className={clsx('at-input', errors.price && 'at-input--error')} />
                {errors.price && <span className="at-form-error">{errors.price}</span>}
              </div>
              <div className="at-form-field">
                <label>Type</label>
                <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} className="at-input">
                  <option value="economique">Économique</option>
                  <option value="standard">Standard</option>
                  <option value="confort">Confort</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div className="at-form-field">
                <label>Bagages autorisés</label>
                <input type="number" min="0" max="5" value={form.luggage} onChange={(e) => handleChange('luggage', e.target.value)} className="at-input" />
              </div>
            </div>
            <div className="at-form-field">
              <label>Observations</label>
              <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} placeholder="Notes internes..." className="at-input at-input--textarea" />
            </div>
          </div>

          <div className="at-modal__footer">
            <button type="button" className="at-btn at-btn--outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="at-btn at-btn--primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="at-btn__spinner" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg" />
                  {trip ? 'Mettre à jour' : 'Créer le voyage'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
