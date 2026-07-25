import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companyRegisterSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import useAuthStore from '@store/auth.store';
import { ROLES } from '@utils/roles';
import { ROLE_PERMISSIONS } from '@utils/permissions';
import AuthInput from '@components/auth/AuthInput';
import AuthPasswordInput from '@components/auth/AuthPasswordInput';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const CompanyRegister = () => {
  const navigate = useNavigate();
  const storeLogin = useAuthStore((s) => s.login);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues: {
      companyName: '', managerFirstName: '', managerLastName: '',
      phone: '', email: '', address: '', city: '', country: 'CM',
      rccm: '', taxpayerNumber: '', password: '', confirmPassword: '',
    },
  });

  const onSubmit = (data) => {
    const user = {
      id: 'usr_mock_' + Math.random().toString(36).slice(2, 8),
      firstName: data.managerFirstName,
      lastName: data.managerLastName,
      email: data.email,
      role: ROLES.COMPANY_ADMIN,
      companyName: data.companyName,
      rccm: data.rccm,
      taxpayerNumber: data.taxpayerNumber,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      status: 'pending_validation',
      permissions: ROLE_PERMISSIONS[ROLES.COMPANY_ADMIN] || [],
      avatar: null,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };

    storeLogin({
      user,
      token: 'pending_token_' + Date.now().toString(36),
      refreshToken: 'pending_refresh_' + Date.now().toString(36),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    setSuccess(true);
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
              Votre demande de cr&eacute;ation de compte compagnie a &eacute;t&eacute; enregistr&eacute;e.
              Notre &eacute;quipe va valider vos informations dans les plus brefs d&eacute;laps.
              Vous recevrez un email de confirmation une fois votre compte valid&eacute;.
            </p>
            <Link to="/auth/login/company" className="btn btn-primary" style={{ width: '100%' }}>
              Retour &agrave; la connexion
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
          <p className="auth-header__subtitle">Cr&eacute;ez votre espace de gestion de transport</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          <AuthInput label="Nom de la compagnie" name="companyName" placeholder="Ex: Guillaume Express"
            leftIcon={<i className="bi bi-building" />} error={errors.companyName?.message}
            required {...register('companyName')} />

          <div className="auth-form__row">
            <AuthInput label="Responsable (pr&eacute;nom)" name="managerFirstName" placeholder="Pr&eacute;nom"
              leftIcon={<i className="bi bi-person-fill" />} error={errors.managerFirstName?.message}
              required {...register('managerFirstName')} />
            <AuthInput label="Responsable (nom)" name="managerLastName" placeholder="Nom"
              leftIcon={<i className="bi bi-person-fill" />} error={errors.managerLastName?.message}
              required {...register('managerLastName')} />
          </div>

          <AuthInput label="T&eacute;l&eacute;phone" type="tel" name="phone" placeholder="6XX XXX XXX"
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
                </select>
              </div>
              {errors.country?.message && <p className="auth-field__error">{errors.country.message}</p>}
            </div>
          </div>

          <div className="auth-form__row">
            <AuthInput label="RCCM" name="rccm" placeholder="Num&eacute;ro RCCM"
              leftIcon={<i className="bi bi-file-earmark-text-fill" />} error={errors.rccm?.message}
              required {...register('rccm')} />
            <AuthInput label="N&deg; Contribuable" name="taxpayerNumber" placeholder="Num&eacute;ro contribuable"
              leftIcon={<i className="bi bi-hash" />} error={errors.taxpayerNumber?.message}
              required {...register('taxpayerNumber')} />
          </div>

          <AuthPasswordInput label="Mot de passe" name="password" placeholder="Minimum 8 caract&egrave;res"
            leftIcon={<i className="bi bi-lock-fill" />} error={errors.password?.message}
            required {...register('password')} />

          <AuthPasswordInput label="Confirmer le mot de passe" name="confirmPassword"
            placeholder="Retapez votre mot de passe" leftIcon={<i className="bi bi-lock-fill" />}
            error={errors.confirmPassword?.message} required {...register('confirmPassword')} />

          <button type="submit" className="btn btn-primary">
            Cr&eacute;er le compte compagnie
          </button>
        </form>

        <p className="auth-form__alt" style={{ marginTop: '1rem' }}>
          D&eacute;j&agrave; inscrit ?{' '}
          <Link to="/auth/login/company" className="auth-form__alt-link">Se connecter</Link>
        </p>
        <p className="auth-form__alt" style={{ marginTop: '0.5rem' }}>
          <Link to="/auth" className="auth-form__alt-link">
            <i className="bi bi-arrow-left" style={{ marginRight: '0.25rem' }} />
            Changer d&rsquo;espace
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default CompanyRegister;
