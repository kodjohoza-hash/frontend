import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { branchStatuses, agencyTypes, regions, services, daysOfWeek } from '../../data/agencyBranchData';

const schema = z.object({
  name: z.string().min(3, 'Nom requis'),
  code: z.string().min(3, 'Code requis'),
  description: z.string().min(10, 'Description requise'),
  country: z.string().min(2, 'Pays requis'),
  region: z.string().min(1, 'Région requise'),
  city: z.string().min(2, 'Ville requise'),
  quartier: z.string().min(2, 'Quartier requis'),
  fullAddress: z.string().min(5, 'Adresse complète requise'),
  lat: z.string().optional(),
  lng: z.string().optional(),
  phone: z.string().min(9, 'Téléphone invalide'),
  email: z.string().email('Email invalide'),
  managerName: z.string().min(3, 'Responsable requis'),
  openTime: z.string().min(1, 'Heure d\'ouverture requise'),
  closeTime: z.string().min(1, 'Heure de fermeture requise'),
  openDays: z.array(z.string()).min(1, 'Au moins un jour requis'),
  services: z.array(z.string()),
  status: z.string().min(1, 'Statut requis'),
  type: z.string().min(1, 'Type requis'),
  observations: z.string().optional(),
});

const defaultValues = {
  name: '', code: '', description: '', country: 'Cameroun', region: '', city: '',
  quartier: '', fullAddress: '', lat: '', lng: '', phone: '', email: '',
  managerName: '', openTime: '06:00', closeTime: '20:00',
  openDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
  services: ['vente_billets', 'reservation'], status: 'ouvert', type: 'agence', observations: '',
};

export default function AgencyBranchModal({ isOpen, onClose, branch, onSave }) {
  const [step, setStep] = useState(0);
  const isEdit = !!branch;

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name, code: branch.code, description: branch.description,
        country: branch.country, region: branch.region, city: branch.city,
        quartier: branch.quartier, fullAddress: branch.fullAddress,
        lat: String(branch.lat || ''), lng: String(branch.lng || ''),
        phone: branch.phone, email: branch.email,
        managerName: branch.manager?.name || '', openTime: branch.openTime,
        closeTime: branch.closeTime, openDays: branch.openDays,
        services: branch.services, status: branch.status, type: branch.type,
        observations: '',
      });
    } else {
      reset(defaultValues);
    }
    setStep(0);
  }, [branch, isOpen, reset]);

  const watchedOpenDays = watch('openDays');
  const watchedServices = watch('services');

  const toggleDay = (day) => {
    const current = watchedOpenDays || [];
    setValue('openDays', current.includes(day) ? current.filter((d) => d !== day) : [...current, day], { shouldValidate: true });
  };

  const toggleService = (key) => {
    const current = watchedServices || [];
    setValue('services', current.includes(key) ? current.filter((s) => s !== key) : [...current, key], { shouldValidate: true });
  };

  const steps = [
    { label: 'Informations', icon: 'bi-building' },
    { label: 'Adresse & Horaires', icon: 'bi-geo-alt' },
    { label: 'Services', icon: 'bi-grid-3x3-gap' },
  ];

  if (!isOpen) return null;

  return (
    <div className="abr-modal-overlay" onClick={onClose}>
      <div className="abr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="abr-modal__header">
          <h3>{isEdit ? 'Modifier le point de vente' : 'Ajouter un point de vente'}</h3>
          <button className="abr-modal__close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="abr-modal__steps">
          {steps.map((s, i) => (
            <button key={s.label} className={`abr-modal__step ${i === step ? 'abr-modal__step--active' : ''} ${i < step ? 'abr-modal__step--done' : ''}`} onClick={() => setStep(i)}>
              <i className={`bi ${i < step ? 'bi-check-circle-fill' : s.icon}`} /><span>{s.label}</span>
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit((data) => onSave({ ...data, id: branch?.id }))} className="abr-modal__form">
          {step === 0 && (
            <div className="abr-modal__fields">
              <div className="abr-modal__row">
                <div className="abr-modal__field abr-modal__field--full">
                  <label>Logo</label>
                  <div className="abr-modal__upload"><i className="bi bi-camera" /><span>Cliquer pour ajouter</span></div>
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field">
                  <label>Nom <span>*</span></label>
                  <input {...register('name')} className={errors.name ? 'abr-input--error' : ''} />
                  {errors.name && <span className="abr-modal__error">{errors.name.message}</span>}
                </div>
                <div className="abr-modal__field">
                  <label>Code agence <span>*</span></label>
                  <input {...register('code')} placeholder="DL-001" className={errors.code ? 'abr-input--error' : ''} />
                  {errors.code && <span className="abr-modal__error">{errors.code.message}</span>}
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field abr-modal__field--full">
                  <label>Description <span>*</span></label>
                  <textarea {...register('description')} rows={3} />
                  {errors.description && <span className="abr-modal__error">{errors.description.message}</span>}
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field">
                  <label>Type <span>*</span></label>
                  <select {...register('type')}>
                    {agencyTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="abr-modal__field">
                  <label>Statut <span>*</span></label>
                  <select {...register('status')}>
                    {branchStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field">
                  <label>Responsable <span>*</span></label>
                  <input {...register('managerName')} />
                  {errors.managerName && <span className="abr-modal__error">{errors.managerName.message}</span>}
                </div>
                <div className="abr-modal__field">
                  <label>Téléphone <span>*</span></label>
                  <input {...register('phone')} placeholder="+237" />
                  {errors.phone && <span className="abr-modal__error">{errors.phone.message}</span>}
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field abr-modal__field--full">
                  <label>Email <span>*</span></label>
                  <input type="email" {...register('email')} />
                  {errors.email && <span className="abr-modal__error">{errors.email.message}</span>}
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="abr-modal__fields">
              <div className="abr-modal__row">
                <div className="abr-modal__field">
                  <label>Pays <span>*</span></label>
                  <input {...register('country')} />
                </div>
                <div className="abr-modal__field">
                  <label>Région <span>*</span></label>
                  <select {...register('region')}>
                    <option value="">Sélectionner</option>
                    {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field">
                  <label>Ville <span>*</span></label>
                  <input {...register('city')} />
                </div>
                <div className="abr-modal__field">
                  <label>Quartier <span>*</span></label>
                  <input {...register('quartier')} />
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field abr-modal__field--full">
                  <label>Adresse complète <span>*</span></label>
                  <input {...register('fullAddress')} />
                  {errors.fullAddress && <span className="abr-modal__error">{errors.fullAddress.message}</span>}
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field">
                  <label>Latitude</label>
                  <input {...register('lat')} placeholder="4.0435" />
                </div>
                <div className="abr-modal__field">
                  <label>Longitude</label>
                  <input {...register('lng')} placeholder="9.6966" />
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field">
                  <label>Ouverture <span>*</span></label>
                  <input type="time" {...register('openTime')} />
                </div>
                <div className="abr-modal__field">
                  <label>Fermeture <span>*</span></label>
                  <input type="time" {...register('closeTime')} />
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field abr-modal__field--full">
                  <label>Jours d'ouverture <span>*</span></label>
                  <div className="abr-modal__days">
                    {daysOfWeek.map((d) => (
                      <button key={d} type="button" className={`abr-modal__day-btn ${(watchedOpenDays || []).includes(d) ? 'abr-modal__day-btn--active' : ''}`} onClick={() => toggleDay(d)}>
                        {d.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  {errors.openDays && <span className="abr-modal__error">{errors.openDays.message}</span>}
                </div>
              </div>
              <div className="abr-modal__row">
                <div className="abr-modal__field abr-modal__field--full">
                  <label>Observations</label>
                  <textarea {...register('observations')} rows={3} />
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="abr-modal__fields">
              <p className="abr-modal__hint">Sélectionnez les services proposés par ce point de vente :</p>
              <div className="abr-modal__services-grid">
                {services.map((s) => (
                  <label key={s.key} className="abr-modal__svc-switch">
                    <input type="checkbox" checked={(watchedServices || []).includes(s.key)} onChange={() => toggleService(s.key)} />
                    <span className="abr-modal__svc-track" />
                    <span className="abr-modal__svc-info">
                      <i className={`bi ${s.icon}`} /><span>{s.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="abr-modal__footer">
            <button type="button" className="abr-modal__btn abr-modal__btn--cancel" onClick={onClose}>Annuler</button>
            {step < 2 ? (
              <button type="button" className="abr-modal__btn abr-modal__btn--next" onClick={() => setStep(step + 1)}>Suivant <i className="bi bi-arrow-right" /></button>
            ) : (
              <button type="submit" className="abr-modal__btn abr-modal__btn--save"><i className="bi bi-check-lg" /> {isEdit ? 'Enregistrer' : 'Créer'}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
