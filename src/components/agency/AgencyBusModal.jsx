import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { busTypes, busClasses, busBrands, defaultSeatLayouts } from '../../data/agencyBusData';
import AgencySeatConfigurator from './AgencySeatConfigurator';

const emptyBus = {
  plate: '', internalNumber: '', brand: '', model: '', year: '2025', type: 'standard',
  seats: '45', class: 'economy', status: 'disponible', color: '#0B1D51',
  climatisation: true, wifi: false, usb: false, toilette: false, tv: false, bagages: true,
  microphone: false, couvertures: false, prise_220v: false, eau: false,
  notes: '', fuelType: 'diesel', currentDriver: '',
};

export default function AgencyBusModal({ isOpen, onClose, bus, onSave }) {
  const [form, setForm] = useState(emptyBus);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (bus) {
      setForm({
        plate: bus.plate || '', internalNumber: bus.internalNumber || '',
        brand: bus.brand || '', model: bus.model || '', year: String(bus.year || 2025),
        type: bus.type || 'standard', seats: String(bus.seats || 45), class: bus.class || 'economy',
        status: bus.status || 'disponible', color: bus.color || '#0B1D51',
        climatisation: bus.amenities?.climatisation ?? false, wifi: bus.amenities?.wifi ?? false,
        usb: bus.amenities?.usb ?? false, toilette: bus.amenities?.toilette ?? false,
        tv: bus.amenities?.tv ?? false, bagages: bus.amenities?.bagages ?? false,
        microphone: bus.amenities?.microphone ?? false, couvertures: bus.amenities?.couvertures ?? false,
        prise_220v: bus.amenities?.prise_220v ?? false, eau: bus.amenities?.eau ?? false,
        notes: bus.notes || '', fuelType: bus.fuelType || 'diesel',
        currentDriver: bus.currentDriver?.id || '',
      });
    } else {
      setForm(emptyBus);
    }
    setErrors({});
    setStep(1);
  }, [bus, isOpen]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.plate.trim()) errs.plate = 'Immatriculation requise';
    if (!form.internalNumber.trim()) errs.internalNumber = 'Numéro interne requis';
    if (!form.brand) errs.brand = 'Marque requise';
    if (!form.model.trim()) errs.model = 'Modèle requis';
    if (!form.year || Number(form.year) < 2000) errs.year = 'Année invalide';
    if (!form.seats || Number(form.seats) < 4) errs.seats = 'Minimum 4 places';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave?.({
      ...form, year: Number(form.year), seats: Number(form.seats),
      amenities: {
        climatisation: form.climatisation, wifi: form.wifi, usb: form.usb,
        toilette: form.toilette, tv: form.tv, bagages: form.bagages,
        microphone: form.microphone, couvertures: form.couvertures,
        prise_220v: form.prise_220v, eau: form.eau,
      },
    });
    setSaving(false);
  };

  const selectedBrand = busBrands.find((b) => b.value === form.brand);

  if (!isOpen) return null;

  return (
    <div className="ab-modal-overlay" onClick={onClose}>
      <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">
            <i className="bi bi-bus-front-fill" />
            <h3>{bus ? `Modifier ${bus.plate}` : 'Nouveau bus'}</h3>
          </div>
          <button className="ab-modal__close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="ab-modal__steps">
          <button className={clsx('ab-modal__step', { 'ab-modal__step--active': step === 1 })} onClick={() => setStep(1)}>
            <span className="ab-modal__step-num">1</span> Informations
          </button>
          <button className={clsx('ab-modal__step', { 'ab-modal__step--active': step === 2 })} onClick={() => setStep(2)}>
            <span className="ab-modal__step-num">2</span> Équipements
          </button>
          <button className={clsx('ab-modal__step', { 'ab-modal__step--active': step === 3 })} onClick={() => setStep(3)}>
            <span className="ab-modal__step-num">3</span> Options
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ab-modal__body">
          {step === 1 && (
            <div className="ab-form-section">
              <h4 className="ab-form-section__title"><i className="bi bi-info-circle" /> Informations générales</h4>
              <div className="ab-form-row">
                <div className="ab-form-field">
                  <label>Immatriculation <span className="ab-required">*</span></label>
                  <input type="text" value={form.plate} onChange={(e) => handleChange('plate', e.target.value)} placeholder="ex: CE-123-AZ" className={clsx('ab-input', errors.plate && 'ab-input--error')} />
                  {errors.plate && <span className="ab-form-error">{errors.plate}</span>}
                </div>
                <div className="ab-form-field">
                  <label>N° interne <span className="ab-required">*</span></label>
                  <input type="text" value={form.internalNumber} onChange={(e) => handleChange('internalNumber', e.target.value)} placeholder="ex: GE-001" className={clsx('ab-input', errors.internalNumber && 'ab-input--error')} />
                  {errors.internalNumber && <span className="ab-form-error">{errors.internalNumber}</span>}
                </div>
              </div>
              <div className="ab-form-row">
                <div className="ab-form-field">
                  <label>Marque <span className="ab-required">*</span></label>
                  <select value={form.brand} onChange={(e) => handleChange('brand', e.target.value)} className={clsx('ab-input', errors.brand && 'ab-input--error')}>
                    <option value="">Sélectionner</option>
                    {busBrands.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                  {errors.brand && <span className="ab-form-error">{errors.brand}</span>}
                </div>
                <div className="ab-form-field">
                  <label>Modèle <span className="ab-required">*</span></label>
                  <select value={form.model} onChange={(e) => handleChange('model', e.target.value)} className={clsx('ab-input', errors.model && 'ab-input--error')}>
                    <option value="">Sélectionner</option>
                    {(selectedBrand?.models || []).map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.model && <span className="ab-form-error">{errors.model}</span>}
                </div>
              </div>
              <div className="ab-form-row">
                <div className="ab-form-field">
                  <label>Année <span className="ab-required">*</span></label>
                  <input type="number" min="2000" max="2030" value={form.year} onChange={(e) => handleChange('year', e.target.value)} className={clsx('ab-input', errors.year && 'ab-input--error')} />
                  {errors.year && <span className="ab-form-error">{errors.year}</span>}
                </div>
                <div className="ab-form-field">
                  <label>Nombre de places <span className="ab-required">*</span></label>
                  <input type="number" min="4" max="100" value={form.seats} onChange={(e) => handleChange('seats', e.target.value)} className={clsx('ab-input', errors.seats && 'ab-input--error')} />
                  {errors.seats && <span className="ab-form-error">{errors.seats}</span>}
                </div>
                <div className="ab-form-field">
                  <label>Type</label>
                  <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} className="ab-input">
                    {busTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="ab-form-field">
                  <label>Classe</label>
                  <select value={form.class} onChange={(e) => handleChange('class', e.target.value)} className="ab-input">
                    {busClasses.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="ab-form-row">
                <div className="ab-form-field">
                  <label>Couleur</label>
                  <div className="ab-input-color-wrap">
                    <input type="color" value={form.color} onChange={(e) => handleChange('color', e.target.value)} className="ab-input-color" />
                    <span className="ab-input-color-label">{form.color}</span>
                  </div>
                </div>
                <div className="ab-form-field">
                  <label>Carburant</label>
                  <select value={form.fuelType} onChange={(e) => handleChange('fuelType', e.target.value)} className="ab-input">
                    <option value="diesel">Diesel</option>
                    <option value="essence">Essence</option>
                    <option value="electrique">Électrique</option>
                    <option value="hybride">Hybride</option>
                  </select>
                </div>
                <div className="ab-form-field">
                  <label>Statut</label>
                  <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="ab-input">
                    <option value="disponible">Disponible</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="hors_service">Hors service</option>
                    <option value="reserve">Réservé</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="ab-form-section">
              <h4 className="ab-form-section__title"><i className="bi bi-gear" /> Équipements</h4>
              <div className="ab-form-checkboxes">
                {[
                  { key: 'climatisation', label: 'Climatisation', icon: 'bi-snow' },
                  { key: 'wifi', label: 'Wi-Fi', icon: 'bi-wifi' },
                  { key: 'usb', label: 'Prises USB', icon: 'bi-usb-plug' },
                  { key: 'toilette', label: 'Toilettes', icon: 'bi-droplet' },
                  { key: 'tv', label: 'TV / Écrans', icon: 'bi-tv' },
                  { key: 'bagages', label: 'Soute bagages', icon: 'bi-suitcase' },
                  { key: 'microphone', label: 'Microphone', icon: 'bi-mic' },
                  { key: 'couvertures', label: 'Couvertures', icon: 'bi-blanket' },
                  { key: 'prise_220v', label: 'Prise 220V', icon: 'bi-plug' },
                  { key: 'eau', label: 'Eau minérale', icon: 'bi-cup-straw' },
                ].map((item) => (
                  <label key={item.key} className={clsx('ab-checkbox', { 'ab-checkbox--checked': form[item.key] })}>
                    <input type="checkbox" checked={form[item.key]} onChange={(e) => handleChange(item.key, e.target.checked)} />
                    <span className="ab-checkbox__box"><i className="bi bi-check-lg" /></span>
                    <i className={`bi ${item.icon}`} />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="ab-form-section">
              <h4 className="ab-form-section__title"><i className="bi bi-chat-dots" /> Options</h4>
              <div className="ab-form-field">
                <label>Observations</label>
                <textarea value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={4} placeholder="Notes internes sur ce bus..." className="ab-input ab-input--textarea" />
              </div>
              <div className="ab-form-field">
                <label>Plan des sièges</label>
                <AgencySeatConfigurator
                  layout={defaultSeatLayouts[form.type] || defaultSeatLayouts.standard}
                  totalSeats={Number(form.seats) || 45}
                  readonly
                />
              </div>
            </div>
          )}

          <div className="ab-modal__footer">
            <button type="button" className="ab-btn ab-btn--outline" onClick={onClose}>Annuler</button>
            {step > 1 && <button type="button" className="ab-btn ab-btn--outline" onClick={() => setStep(step - 1)}><i className="bi bi-arrow-left" /> Précédent</button>}
            {step < 3 ? (
              <button type="button" className="ab-btn ab-btn--primary" onClick={() => setStep(step + 1)}>Suivant <i className="bi bi-arrow-right" /></button>
            ) : (
              <button type="submit" className="ab-btn ab-btn--primary" disabled={saving}>
                {saving ? <><span className="ab-btn__spinner" /> Enregistrement...</> : <><i className="bi bi-check-lg" /> {bus ? 'Mettre à jour' : 'Créer le bus'}</>}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
