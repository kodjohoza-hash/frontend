import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companyRegisterSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import AuthInput from '@components/auth/AuthInput';
import AuthPasswordInput from '@components/auth/AuthPasswordInput';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const CompanyRegister = () => {
  const navigate = useNavigate();
  const { registerCompanyAsync, isRegisteringCompany, registerCompanyError } = useAuth();
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues: {
      companyName: '', managerFirstName: '', managerLastName: '',
      phone: '', email: '', address: '', city: '', country: 'CM',
      rccm: '', taxpayerNumber: '', website: '', description: '',
      password: '', confirmPassword: '',
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

  const onSubmit = async (data) => {
    setShowAlert(false);
    try {
      await registerCompanyAsync(data);
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
            <div className="auth-status__details">
              <div className="auth-status__detail-item">
                <i className="bi bi-check-circle-fill" style={{ color: 'var(--color-success)' }} />
                <span>Compte en attente de validation</span>
              </div>
              <div className="auth-status__detail-item">
                <i className="bi bi-envelope-fill" style={{ color: 'var(--color-info)' }} />
                <span>Email de confirmation envoyé</span>
              </div>
            </div>
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

        {showAlert && registerCompanyError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <i className="bi bi-exclamation-circle-fill auth-alert__icon" />
            <div className="auth-alert__content">
              <p className="auth-alert__message">
                {registerCompanyError?.response?.data?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          {/* Logo Upload */}
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

          <div className="auth-form__row">
            <AuthInput label="Responsable (prénom)" name="managerFirstName" placeholder="Prénom"
              leftIcon={<i className="bi bi-person-fill" />} error={errors.managerFirstName?.message}
              required {...register('managerFirstName')} />
            <AuthInput label="Responsable (nom)" name="managerLastName" placeholder="Nom"
              leftIcon={<i className="bi bi-person-fill" />} error={errors.managerLastName?.message}
              required {...register('managerLastName')} />
          </div>

          <AuthInput label="Téléphone" type="tel" name="phone" placeholder="6XX XXX XXX"
            leftIcon={<i className="bi bi-telephone-fill" />} error={errors.phone?.message}
            required {...register('phone')} />

          <AuthInput label="Email professionnel" type="email" name="email" placeholder="contact@compagnie.com"
            leftIcon={<i className="bi bi-envelope-fill" />} error={errors.email?.message}
            required {...register('email')} />

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
                  <option value="CM">Cameroun</option>
                  <option value="GA">Gabon</option>
                  <option value="CG">Congo</option>
                  <option value="NG">Nigeria</option>
                  <option value="TD">Tchad</option>
                  <option value="CF">Centrafrique</option>
                  <option value="GQ">Guinée Équatoriale</option>
                </select>
              </div>
              {errors.country?.message && <p className="auth-field__error">{errors.country.message}</p>}
            </div>
          </div>

          <div className="auth-form__row">
            <AuthInput label="RCCM" name="rccm" placeholder="Numéro RCCM"
              leftIcon={<i className="bi bi-file-earmark-text-fill" />} error={errors.rccm?.message}
              required {...register('rccm')} />
            <AuthInput label="N° Contribuable" name="taxpayerNumber" placeholder="Numéro contribuable"
              leftIcon={<i className="bi bi-hash" />} error={errors.taxpayerNumber?.message}
              required {...register('taxpayerNumber')} />
          </div>

          <AuthInput label="Site Web (optionnel)" type="url" name="website" placeholder="https://www.compagnie.com"
            leftIcon={<i className="bi bi-globe" />} error={errors.website?.message}
            {...register('website')} />

          <div className="auth-field">
            <label htmlFor="company-description" className="auth-field__label">
              Description (optionnel)
            </label>
            <textarea
              id="company-description"
              className="auth-field__input"
              placeholder="Décrivez brièvement votre compagnie de transport..."
              rows={3}
              style={{ height: 'auto', padding: '12px 16px', resize: 'vertical', minHeight: '80px' }}
              {...register('description')}
            />
            {errors.description?.message && <p className="auth-field__error">{errors.description.message}</p>}
          </div>

          <AuthPasswordInput label="Mot de passe" name="password" placeholder="Minimum 8 caractères"
            leftIcon={<i className="bi bi-lock-fill" />} error={errors.password?.message}
            required {...register('password')} />

          <AuthPasswordInput label="Confirmer le mot de passe" name="confirmPassword"
            placeholder="Retapez votre mot de passe" leftIcon={<i className="bi bi-lock-fill" />}
            error={errors.confirmPassword?.message} required {...register('confirmPassword')} />

          <button type="submit" className="btn btn-primary" disabled={isRegisteringCompany}>
            {isRegisteringCompany && <span className="spinner-border spinner-border-sm" />}
            Créer la compagnie
          </button>
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

export default CompanyRegister;
