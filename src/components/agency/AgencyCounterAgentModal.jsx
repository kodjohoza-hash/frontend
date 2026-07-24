import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { agentStatuses, agentRoles, agencies, pointsDeVente, permissionList } from '../../data/agencyCounterAgentData';

const schema = z.object({
  firstName: z.string().min(2, 'Nom requis'),
  lastName: z.string().min(2, 'Prénom requis'),
  gender: z.enum(['M', 'F'], { message: 'Sexe requis' }),
  dateOfBirth: z.string().min(1, 'Date de naissance requise'),
  phone: z.string().min(9, 'Téléphone invalide'),
  email: z.string().email('Email invalide'),
  address: z.string().min(3, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  country: z.string().min(2, 'Pays requis'),
  agency: z.string().min(1, 'Agence requise'),
  pointDeVente: z.string().min(1, 'Point de vente requis'),
  position: z.string().min(2, 'Poste requis'),
  role: z.string().min(1, 'Rôle requis'),
  hireDate: z.string().min(1, 'Date d\'embauche requise'),
  username: z.string().min(3, 'Identifiant requis'),
  tempPassword: z.string().min(6, 'Mot de passe minimum 6 caractères'),
  status: z.string().min(1, 'Statut requis'),
  observations: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Au moins une permission requise'),
});

export default function AgencyCounterAgentModal({ isOpen, onClose, agent, onSave }) {
  const [step, setStep] = useState(0);
  const isEdit = !!agent;

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '', lastName: '', gender: 'M', dateOfBirth: '', phone: '',
      email: '', address: '', city: '', country: 'Cameroun', agency: '',
      pointDeVente: '', position: 'Agent de guichet', role: 'agent_vente',
      hireDate: '', username: '', tempPassword: '', status: 'actif',
      observations: '', permissions: ['create_booking', 'print_ticket', 'view_stats'],
    },
  });

  useEffect(() => {
    if (agent) {
      reset({
        firstName: agent.firstName, lastName: agent.lastName, gender: agent.gender,
        dateOfBirth: agent.dateOfBirth, phone: agent.phone, email: agent.email,
        address: agent.address, city: agent.city, country: agent.country,
        agency: agent.agency, pointDeVente: agent.pointDeVente, position: agent.position,
        role: agent.role, hireDate: agent.hireDate, username: agent.username,
        tempPassword: agent.tempPassword, status: agent.status, observations: agent.observations || '',
        permissions: agent.permissions || [],
      });
    } else {
      reset({
        firstName: '', lastName: '', gender: 'M', dateOfBirth: '', phone: '',
        email: '', address: '', city: '', country: 'Cameroun', agency: '',
        pointDeVente: '', position: 'Agent de guichet', role: 'agent_vente',
        hireDate: '', username: '', tempPassword: '', status: 'actif',
        observations: '', permissions: ['create_booking', 'print_ticket', 'view_stats'],
      });
    }
    setStep(0);
  }, [agent, isOpen, reset]);

  const watchedAgency = watch('agency');
  const watchedPermissions = watch('permissions');
  const filteredPDV = pointsDeVente.filter((p) => p.agency === watchedAgency);

  const togglePermission = (key) => {
    const current = watchedPermissions || [];
    if (current.includes(key)) {
      setValue('permissions', current.filter((p) => p !== key), { shouldValidate: true });
    } else {
      setValue('permissions', [...current, key], { shouldValidate: true });
    }
  };

  const steps = [
    { label: 'Informations', icon: 'bi-person' },
    { label: 'Affectation', icon: 'bi-building' },
    { label: 'Permissions', icon: 'bi-shield-lock' },
  ];

  if (!isOpen) return null;

  return (
    <div className="ac-modal-overlay" onClick={onClose}>
      <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ac-modal__header">
          <h3>{isEdit ? 'Modifier l\'agent' : 'Ajouter un agent'}</h3>
          <button className="ac-modal__close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>

        <div className="ac-modal__steps">
          {steps.map((s, i) => (
            <button
              key={s.label}
              className={`ac-modal__step ${i === step ? 'ac-modal__step--active' : ''} ${i < step ? 'ac-modal__step--done' : ''}`}
              onClick={() => setStep(i)}
            >
              <i className={`bi ${i < step ? 'bi-check-circle-fill' : s.icon}`} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit((data) => onSave({ ...data, id: agent?.id }))} className="ac-modal__form">
          {step === 0 && (
            <div className="ac-modal__fields">
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Photo</label>
                  <div className="ac-modal__upload">
                    <i className="bi bi-camera" />
                    <span>Cliquer pour ajouter</span>
                  </div>
                </div>
              </div>
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Nom <span>*</span></label>
                  <input {...register('firstName')} className={errors.firstName ? 'ac-input--error' : ''} />
                  {errors.firstName && <span className="ac-modal__error">{errors.firstName.message}</span>}
                </div>
                <div className="ac-modal__field">
                  <label>Prénom <span>*</span></label>
                  <input {...register('lastName')} className={errors.lastName ? 'ac-input--error' : ''} />
                  {errors.lastName && <span className="ac-modal__error">{errors.lastName.message}</span>}
                </div>
              </div>
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Sexe <span>*</span></label>
                  <select {...register('gender')}>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div className="ac-modal__field">
                  <label>Date de naissance <span>*</span></label>
                  <input type="date" {...register('dateOfBirth')} />
                </div>
              </div>
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Téléphone <span>*</span></label>
                  <input {...register('phone')} placeholder="+237" className={errors.phone ? 'ac-input--error' : ''} />
                  {errors.phone && <span className="ac-modal__error">{errors.phone.message}</span>}
                </div>
                <div className="ac-modal__field">
                  <label>Email <span>*</span></label>
                  <input type="email" {...register('email')} className={errors.email ? 'ac-input--error' : ''} />
                  {errors.email && <span className="ac-modal__error">{errors.email.message}</span>}
                </div>
              </div>
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Adresse</label>
                  <input {...register('address')} />
                </div>
              </div>
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Ville <span>*</span></label>
                  <input {...register('city')} />
                </div>
                <div className="ac-modal__field">
                  <label>Pays <span>*</span></label>
                  <input {...register('country')} />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="ac-modal__fields">
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Agence <span>*</span></label>
                  <select {...register('agency')} className={errors.agency ? 'ac-input--error' : ''}>
                    <option value="">Sélectionner</option>
                    {agencies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                  {errors.agency && <span className="ac-modal__error">{errors.agency.message}</span>}
                </div>
                <div className="ac-modal__field">
                  <label>Point de vente <span>*</span></label>
                  <select {...register('pointDeVente')} className={errors.pointDeVente ? 'ac-input--error' : ''}>
                    <option value="">Sélectionner</option>
                    {filteredPDV.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {errors.pointDeVente && <span className="ac-modal__error">{errors.pointDeVente.message}</span>}
                </div>
              </div>
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Poste <span>*</span></label>
                  <input {...register('position')} />
                </div>
                <div className="ac-modal__field">
                  <label>Rôle <span>*</span></label>
                  <select {...register('role')}>
                    {agentRoles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Date d'embauche <span>*</span></label>
                  <input type="date" {...register('hireDate')} />
                </div>
                <div className="ac-modal__field">
                  <label>Statut <span>*</span></label>
                  <select {...register('status')}>
                    {agentStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="ac-modal__row">
                <div className="ac-modal__field">
                  <label>Identifiant <span>*</span></label>
                  <input {...register('username')} className={errors.username ? 'ac-input--error' : ''} />
                  {errors.username && <span className="ac-modal__error">{errors.username.message}</span>}
                </div>
                <div className="ac-modal__field">
                  <label>Mot de passe temporaire <span>*</span></label>
                  <input type="text" {...register('tempPassword')} className={errors.tempPassword ? 'ac-input--error' : ''} />
                  {errors.tempPassword && <span className="ac-modal__error">{errors.tempPassword.message}</span>}
                </div>
              </div>
              <div className="ac-modal__row">
                <div className="ac-modal__field ac-modal__field--full">
                  <label>Observations</label>
                  <textarea {...register('observations')} rows={3} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="ac-modal__fields">
              <p className="ac-modal__permissions-hint">Activez ou désactivez les permissions de cet agent :</p>
              <div className="ac-modal__permissions-grid">
                {permissionList.map((perm) => (
                  <label key={perm.key} className="ac-modal__perm-switch">
                    <input
                      type="checkbox"
                      checked={(watchedPermissions || []).includes(perm.key)}
                      onChange={() => togglePermission(perm.key)}
                    />
                    <span className="ac-modal__perm-track" />
                    <span className="ac-modal__perm-info">
                      <i className={`bi ${perm.icon}`} />
                      <span>{perm.label}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.permissions && <span className="ac-modal__error">{errors.permissions.message}</span>}
            </div>
          )}

          <div className="ac-modal__footer">
            <button type="button" className="ac-modal__btn ac-modal__btn--cancel" onClick={onClose}>Annuler</button>
            {step < 2 ? (
              <button type="button" className="ac-modal__btn ac-modal__btn--next" onClick={() => setStep(step + 1)}>
                Suivant <i className="bi bi-arrow-right" />
              </button>
            ) : (
              <button type="submit" className="ac-modal__btn ac-modal__btn--save">
                <i className="bi bi-check-lg" /> {isEdit ? 'Enregistrer' : 'Créer'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
