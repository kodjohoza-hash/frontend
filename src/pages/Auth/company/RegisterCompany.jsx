import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  companyRegisterStep1Schema,
  companyRegisterStep2Schema,
  companyRegisterStep3Schema,
  companyRegisterStep4Schema,
} from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import AuthInput from '@components/auth/AuthInput';
import AuthPasswordInput from '@components/auth/AuthPasswordInput';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const STEP_TITLES = [
  { title: 'Informations générales', subtitle: 'Détails de votre compagnie' },
  { title: 'Responsable', subtitle: 'Informations du responsable' },
  { title: 'Documents', subtitle: 'Enregistrement officiel' },
  { title: 'Compte', subtitle: 'Créez votre accès' },
];

const STEP_SCHEMAS = [
  companyRegisterStep1Schema,
  companyRegisterStep2Schema,
  companyRegisterStep3Schema,
  companyRegisterStep4Schema,
];

const COUNTRIES = [
  { value: 'CM', label: 'Cameroun' },
  { value: 'GA', label: 'Gabon' },
  { value: 'CG', label: 'Congo' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'TD', label: 'Tchad' },
  { value: 'CF', label: 'Centrafrique' },
  { value: 'GQ', label: 'Guinée Équatoriale' },
];

const RegisterCompany = () => {
  const navigate = useNavigate();
  const { registerCompanyAsync, isRegisteringCompany, registerCompanyError } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const fileInputRef = useRef(null);

  const currentSchema = STEP_SCHEMAS[step];

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onTouched',
    defaultValues: {
      companyName: '', address: '', city: '', country: 'CM', website: '', description: '',
      managerLastName: '', managerFirstName: '', phone: '', email: '',
      rccm: '', taxpayerNumber: '',
      password: '', confirmPassword: '', acceptsTerms: false,
      ...formData,
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const saveStepData = () => {
    const values = getValues();
    setFormData((prev) => ({ ...prev, ...values }));
  };

  const handleNext = async () => {
    const valid = await trigger();
    if (valid) {
      saveStepData();
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    saveStepData();
    setStep((s) => s - 1);
  };

  const onSubmit = async (data) => {
    setShowAlert(false);
    const allData = { ...formData, ...data };
    try {
      await registerCompanyAsync(allData);
      setSuccess(true);
    } catch {
      setShowAlert(true);
    }
  };

  if (success) {
    return (
      <AuthShell>
        <div className="auth-card">
          <div className="auth-status">
            <div className="auth-status__icon auth-status__icon--warning">
              <i className="bi bi-clock-fill" />
            </div>
            <h2 className="auth-status__title">Demande en attente</h2>
            <p className="auth-status__text">
              Votre demande de création de compte compagnie a été enregistrée.
              Notre équipe va valider vos informations dans les plus brefs délais.
              Vous recevrez un email de confirmation une fois votre compte validé.
            </p>
            <Link to="/auth/login/company" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-header__icon auth-header__icon--green">
            <AppLogo size={28} variant="icon" />
          </div>
          <h2 className="auth-header__title">Inscription Compagnie</h2>
          <p className="auth-header__subtitle">Créez votre espace de gestion de transport</p>
        </div>

        {/* Wizard Progress */}
        <div className="company-wizard-progress">
          {STEP_TITLES.map((s, i) => (
            <div key={i} className={`company-wizard-step ${i < step ? 'completed' : ''} ${i === step ? 'active' : ''}`}>
              <div className="company-wizard-step__number">
                {i < step ? <i className="bi bi-check-lg" /> : i + 1}
              </div>
              <span className="company-wizard-step__label">{s.title}</span>
            </div>
          ))}
        </div>

        {showAlert && registerCompanyError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <i className="bi bi-exclamation-circle-fill auth-alert__icon" />
            <div className="auth-alert__content">
              <p className="auth-alert__message">
                {registerCompanyError?.response?.data?.message || 'Erreur lors de l\'inscription.'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          {/* Step 1: General Information */}
          {step === 0 && (
            <div className="company-wizard-fields">
              <div className="auth-field" style={{ textAlign: 'center' }}>
                <label className="auth-field__label" style={{ textAlign: 'left' }}>Logo de la compagnie</label>
                <div
                  className="auth-logo-upload"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '80px', height: '80px', margin: '0 auto 0.5rem',
                    borderRadius: '16px', border: '2px dashed var(--border-strong)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', overflow: 'hidden', transition: 'border-color 0.2s',
                    background: '#fafbfc',
                  }}
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      <i className="bi bi-camera-fill" style={{ fontSize: '1.2rem' }} />
                      <div style={{ fontSize: '0.6rem', marginTop: '2px' }}>Logo</div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
              </div>

              <AuthInput label="Nom de la compagnie" name="companyName" placeholder="Ex: Guillaume Express"
                leftIcon={<i className="bi bi-building" />} error={errors.companyName?.message}
                required {...register('companyName')} />

              <AuthInput label="Adresse" name="address" placeholder="Adresse de la compagnie"
                leftIcon={<i className="bi bi-geo-alt-fill" />} error={errors.address?.message}
                required {...register('address')} />

              <div className="auth-form__row">
                <AuthInput label="Ville" name="city" placeholder="Ex: Douala"
                  leftIcon={<i className="bi bi-pin-map-fill" />} error={errors.city?.message}
                  required {...register('city')} />
                <div className="auth-field">
                  <label htmlFor="company-country" className="auth-field__label">
                    Pays<span className="auth-field__required">*</span>
                  </label>
                  <div className="auth-field__wrapper">
                    <span className="auth-field__icon auth-field__icon--left"><i className="bi bi-globe2" /></span>
                    <select id="company-country" className="auth-field__input auth-field__input--has-left"
                      style={{ cursor: 'pointer', appearance: 'none' }} {...register('country')}>
                      {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  {errors.country?.message && <p className="auth-field__error">{errors.country.message}</p>}
                </div>
              </div>

              <AuthInput label="Site Web (optionnel)" type="url" name="website" placeholder="https://www.compagnie.com"
                leftIcon={<i className="bi bi-globe" />} error={errors.website?.message}
                {...register('website')} />

              <div className="auth-field">
                <label htmlFor="company-desc" className="auth-field__label">Description (optionnel)</label>
                <textarea
                  id="company-desc"
                  className="auth-field__input"
                  placeholder="Décrivez brièvement votre compagnie..."
                  rows={3}
                  style={{ height: 'auto', padding: '12px 16px', resize: 'vertical', minHeight: '80px' }}
                  {...register('description')}
                />
                {errors.description?.message && <p className="auth-field__error">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Manager Information */}
          {step === 1 && (
            <div className="company-wizard-fields">
              <AuthInput label="Nom du responsable" name="managerLastName" placeholder="Nom"
                leftIcon={<i className="bi bi-person-fill" />} error={errors.managerLastName?.message}
                required {...register('managerLastName')} />

              <AuthInput label="Prénom du responsable" name="managerFirstName" placeholder="Prénom"
                leftIcon={<i className="bi bi-person-fill" />} error={errors.managerFirstName?.message}
                required {...register('managerFirstName')} />

              <AuthInput label="Téléphone professionnel" type="tel" name="phone" placeholder="6XX XXX XXX"
                leftIcon={<i className="bi bi-telephone-fill" />} error={errors.phone?.message}
                required {...register('phone')} />

              <AuthInput label="Email professionnel" type="email" name="email" placeholder="contact@compagnie.com"
                leftIcon={<i className="bi bi-envelope-fill" />} error={errors.email?.message}
                required {...register('email')} />
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 2 && (
            <div className="company-wizard-fields">
              <AuthInput label="Numéro RCCM" name="rccm" placeholder="Ex: RCCM/CM/DLA/2024/B/12345"
                leftIcon={<i className="bi bi-file-earmark-text-fill" />} error={errors.rccm?.message}
                required {...register('rccm')} />

              <AuthInput label="Numéro contribuable" name="taxpayerNumber" placeholder="Ex: M01234567890A"
                leftIcon={<i className="bi bi-hash" />} error={errors.taxpayerNumber?.message}
                required {...register('taxpayerNumber')} />

              <div className="auth-info-box" style={{
                padding: '1rem', borderRadius: '12px', background: 'var(--color-info-light, #EFF6FF)',
                border: '1px solid var(--color-info, #3B82F6)', fontSize: 'var(--font-size-sm)',
                color: 'var(--color-info-dark, #1E40AF)', marginTop: '0.5rem',
              }}>
                <i className="bi bi-info-circle" style={{ marginRight: '0.5rem' }} />
                Ces documents sont requis pour la validation de votre compte par notre équipe.
              </div>
            </div>
          )}

          {/* Step 4: Account */}
          {step === 3 && (
            <div className="company-wizard-fields">
              <AuthPasswordInput label="Mot de passe" name="password" placeholder="Minimum 8 caractères"
                leftIcon={<i className="bi bi-lock-fill" />} error={errors.password?.message}
                required {...register('password')} />

              <AuthPasswordInput label="Confirmer le mot de passe" name="confirmPassword"
                placeholder="Retapez votre mot de passe" leftIcon={<i className="bi bi-lock-fill" />}
                error={errors.confirmPassword?.message} required {...register('confirmPassword')} />

              <div className="auth-terms">
                <input type="checkbox" id="company-acceptsTerms" {...register('acceptsTerms')} />
                <label htmlFor="company-acceptsTerms" className="auth-terms__label">
                  J'accepte les <a href="/conditions" target="_blank" rel="noopener noreferrer">conditions d'utilisation</a>
                  {' '}et la <a href="/politique" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>
                </label>
              </div>
              {errors.acceptsTerms?.message && (
                <p className="auth-field__error" style={{ marginTop: '-0.5rem' }}>{errors.acceptsTerms.message}</p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="company-wizard-nav" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={handleBack}
                style={{ flex: 1, height: '56px', borderRadius: '16px', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                <i className="bi bi-arrow-left" style={{ marginRight: '0.5rem' }} />
                Retour
              </button>
            )}
            {step < 3 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}
                style={{ flex: 1, height: '56px', borderRadius: '16px', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                Suivant
                <i className="bi bi-arrow-right" style={{ marginLeft: '0.5rem' }} />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={isRegisteringCompany}
                style={{ flex: 1, height: '56px', borderRadius: '16px', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                {isRegisteringCompany && <span className="spinner-border spinner-border-sm" />}
                Créer la compagnie
              </button>
            )}
          </div>
        </form>

        <p className="auth-form__alt" style={{ marginTop: '1rem' }}>
          Déjà inscrit ?{' '}
          <Link to="/auth/login/company" className="auth-form__alt-link">Se connecter</Link>
        </p>
        <p className="auth-form__alt" style={{ marginTop: '0.5rem' }}>
          <Link to="/auth" className="auth-form__alt-link">
            <i className="bi bi-arrow-left" style={{ marginRight: '0.25rem' }} />
            Changer d'espace
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default RegisterCompany;
