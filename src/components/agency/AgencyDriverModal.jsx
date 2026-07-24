import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { licenseCategories, cities, driverStatuses } from '../../data/agencyDriverData';

const emptyDriver = {
  firstName: '', lastName: '', dateOfBirth: '', gender: 'M', phone: '', email: '',
  address: '', city: '', country: 'Cameroun', licenseNumber: '', licenseCategory: 'D',
  licenseObtained: '', licenseExpiry: '', experience: '', hireDate: '', assignedBus: '',
  status: 'disponible', observations: '',
};

export default function AgencyDriverModal({ isOpen, onClose, driver, onSave }) {
  const [form, setForm] = useState(emptyDriver);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (driver) {
      setForm({
        firstName: driver.firstName || '', lastName: driver.lastName || '',
        dateOfBirth: driver.dateOfBirth || '', gender: driver.gender || 'M',
        phone: driver.phone || '', email: driver.email || '',
        address: driver.address || '', city: driver.city || '', country: driver.country || 'Cameroun',
        licenseNumber: driver.licenseNumber || '', licenseCategory: driver.licenseCategory || 'D',
        licenseObtained: driver.licenseObtained || '', licenseExpiry: driver.licenseExpiry || '',
        experience: String(driver.experience || ''), hireDate: driver.hireDate || '',
        assignedBus: driver.assignedBus || '', status: driver.status || 'disponible',
        observations: driver.observations || '',
      });
    } else { setForm(emptyDriver); }
    setErrors({}); setStep(1);
  }, [driver, isOpen]);

  const handleChange = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Prénom requis';
    if (!form.lastName.trim()) errs.lastName = 'Nom requis';
    if (!form.phone.trim()) errs.phone = 'Téléphone requis';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email valide requis';
    if (!form.licenseNumber.trim()) errs.licenseNumber = 'N° permis requis';
    if (!form.licenseCategory) errs.licenseCategory = 'Catégorie requise';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave?.({ ...form, experience: Number(form.experience) || 0 });
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="ad-modal-overlay" onClick={onClose}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal__header">
          <div className="ad-modal__title"><i className="bi bi-person-badge" /><h3>{driver ? `Modifier ${driver.firstName} ${driver.lastName}` : 'Nouveau chauffeur'}</h3></div>
          <button className="ad-modal__close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="ad-modal__steps">
          <button className={clsx('ad-modal__step', { 'ad-modal__step--active': step === 1 })} onClick={() => setStep(1)}><span className="ad-modal__step-num">1</span> Personnel</button>
          <button className={clsx('ad-modal__step', { 'ad-modal__step--active': step === 2 })} onClick={() => setStep(2)}><span className="ad-modal__step-num">2</span> Permis</button>
          <button className={clsx('ad-modal__step', { 'ad-modal__step--active': step === 3 })} onClick={() => setStep(3)}><span className="ad-modal__step-num">3</span> Affectation</button>
        </div>
        <form onSubmit={handleSubmit} className="ad-modal__body">
          {step === 1 && (
            <div className="ad-form-section">
              <h4 className="ad-form-section__title"><i className="bi bi-person" /> Informations personnelles</h4>
              <div className="ad-form-row">
                <div className="ad-form-field"><label>Prénom <span className="ad-required">*</span></label><input type="text" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} className={clsx('ad-input', errors.firstName && 'ad-input--error')} />{errors.firstName && <span className="ad-form-error">{errors.firstName}</span>}</div>
                <div className="ad-form-field"><label>Nom <span className="ad-required">*</span></label><input type="text" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} className={clsx('ad-input', errors.lastName && 'ad-input--error')} />{errors.lastName && <span className="ad-form-error">{errors.lastName}</span>}</div>
              </div>
              <div className="ad-form-row">
                <div className="ad-form-field"><label>Date de naissance</label><input type="date" value={form.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} className="ad-input" /></div>
                <div className="ad-form-field"><label>Sexe</label><select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} className="ad-input"><option value="M">Masculin</option><option value="F">Féminin</option></select></div>
                <div className="ad-form-field"><label>Expérience (ans)</label><input type="number" min="0" max="50" value={form.experience} onChange={(e) => handleChange('experience', e.target.value)} className="ad-input" /></div>
              </div>
              <div className="ad-form-row">
                <div className="ad-form-field"><label>Téléphone <span className="ad-required">*</span></label><input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+237..." className={clsx('ad-input', errors.phone && 'ad-input--error')} />{errors.phone && <span className="ad-form-error">{errors.phone}</span>}</div>
                <div className="ad-form-field"><label>Email <span className="ad-required">*</span></label><input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className={clsx('ad-input', errors.email && 'ad-input--error')} />{errors.email && <span className="ad-form-error">{errors.email}</span>}</div>
              </div>
              <div className="ad-form-row">
                <div className="ad-form-field"><label>Adresse</label><input type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="ad-input" /></div>
                <div className="ad-form-field"><label>Ville</label><select value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="ad-input"><option value="">Sélectionner</option>{cities.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="ad-form-field"><label>Pays</label><input type="text" value={form.country} onChange={(e) => handleChange('country', e.target.value)} className="ad-input" /></div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="ad-form-section">
              <h4 className="ad-form-section__title"><i className="bi bi-card-heading" /> Permis de conduire</h4>
              <div className="ad-form-row">
                <div className="ad-form-field"><label>N° du permis <span className="ad-required">*</span></label><input type="text" value={form.licenseNumber} onChange={(e) => handleChange('licenseNumber', e.target.value)} className={clsx('ad-input', errors.licenseNumber && 'ad-input--error')} />{errors.licenseNumber && <span className="ad-form-error">{errors.licenseNumber}</span>}</div>
                <div className="ad-form-field"><label>Catégorie <span className="ad-required">*</span></label><select value={form.licenseCategory} onChange={(e) => handleChange('licenseCategory', e.target.value)} className={clsx('ad-input', errors.licenseCategory && 'ad-input--error')}><option value="">Sélectionner</option>{licenseCategories.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}</select>{errors.licenseCategory && <span className="ad-form-error">{errors.licenseCategory}</span>}</div>
              </div>
              <div className="ad-form-row">
                <div className="ad-form-field"><label>Date d'obtention</label><input type="date" value={form.licenseObtained} onChange={(e) => handleChange('licenseObtained', e.target.value)} className="ad-input" /></div>
                <div className="ad-form-field"><label>Date d'expiration</label><input type="date" value={form.licenseExpiry} onChange={(e) => handleChange('licenseExpiry', e.target.value)} className="ad-input" /></div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="ad-form-section">
              <h4 className="ad-form-section__title"><i className="bi bi-bus-front" /> Affectation & Statut</h4>
              <div className="ad-form-row">
                <div className="ad-form-field"><label>Date d'embauche</label><input type="date" value={form.hireDate} onChange={(e) => handleChange('hireDate', e.target.value)} className="ad-input" /></div>
                <div className="ad-form-field"><label>Statut</label><select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="ad-input">{driverStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
                <div className="ad-form-field"><label>Bus affecté</label><input type="text" value={form.assignedBus} onChange={(e) => handleChange('assignedBus', e.target.value)} placeholder="ex: BUS-001" className="ad-input" /></div>
              </div>
              <div className="ad-form-field"><label>Observations</label><textarea value={form.observations} onChange={(e) => handleChange('observations', e.target.value)} rows={4} placeholder="Notes internes..." className="ad-input ad-input--textarea" /></div>
            </div>
          )}
          <div className="ad-modal__footer">
            <button type="button" className="ad-btn ad-btn--outline" onClick={onClose}>Annuler</button>
            {step > 1 && <button type="button" className="ad-btn ad-btn--outline" onClick={() => setStep(step - 1)}><i className="bi bi-arrow-left" /> Précédent</button>}
            {step < 3 ? (
              <button type="button" className="ad-btn ad-btn--primary" onClick={() => setStep(step + 1)}>Suivant <i className="bi bi-arrow-right" /></button>
            ) : (
              <button type="submit" className="ad-btn ad-btn--primary" disabled={saving}>{saving ? <><span className="ad-btn__spinner" /> Enregistrement...</> : <><i className="bi bi-check-lg" /> {driver ? 'Mettre à jour' : 'Créer le chauffeur'}</>}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
