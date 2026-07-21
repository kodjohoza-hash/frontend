import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import AuthInput from './AuthInput';
import AuthPasswordInput from './AuthPasswordInput';

const COUNTRIES = [
  { value: '', label: 'Sélectionnez un pays' },
  { value: 'CM', label: 'Cameroun' },
  { value: 'GA', label: 'Gabon' },
  { value: 'CG', label: 'Congo' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'TD', label: 'Tchad' },
  { value: 'CF', label: 'Centrafrique' },
  { value: 'GQ', label: 'Guinée Équatoriale' },
  { value: 'SN', label: 'Sénégal' },
  { value: 'CI', label: 'Côte d\'Ivoire' },
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register: registerUser, isRegistering, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      lastName: '', firstName: '', phone: '', email: '',
      password: '', confirmPassword: '', country: '', city: '',
      acceptsTerms: false,
    },
  });

  const password = watch('password', '');

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', className: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (score <= 2) return { level: 1, label: 'Faible', className: 'strength--weak' };
    if (score === 3) return { level: 2, label: 'Moyen', className: 'strength--medium' };
    return { level: 3, label: 'Fort', className: 'strength--strong' };
  };

  const strength = getPasswordStrength();

  const onSubmit = (data) => {
    const { acceptsTerms, ...payload } = data;
    registerUser(payload, {
      onSuccess: () => navigate('/verify-email', { state: { email: data.email } }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      {registerError && (
        <div className="auth-alert auth-alert--error" role="alert">
          <i className="bi bi-exclamation-circle-fill auth-alert__icon" />
          <div className="auth-alert__content">
            <p className="auth-alert__message">
              {registerError?.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'}
            </p>
          </div>
        </div>
      )}

      <div className="auth-form__row">
        <AuthInput label="Nom" name="lastName" placeholder="Votre nom"
          leftIcon={<i className="bi bi-person-fill" />} error={errors.lastName?.message}
          disabled={isRegistering} required {...register('lastName')} />
        <AuthInput label="Prénom" name="firstName" placeholder="Votre prénom"
          leftIcon={<i className="bi bi-person-fill" />} error={errors.firstName?.message}
          disabled={isRegistering} required {...register('firstName')} />
      </div>

      <AuthInput label="Téléphone" type="tel" name="phone" placeholder="6XX XXX XXX"
        leftIcon={<i className="bi bi-telephone-fill" />} error={errors.phone?.message}
        disabled={isRegistering} required {...register('phone')} />

      <AuthInput label="Adresse email" type="email" name="email" placeholder="votre@email.com"
        leftIcon={<i className="bi bi-envelope-fill" />} error={errors.email?.message}
        disabled={isRegistering} required {...register('email')} />

      <AuthPasswordInput label="Mot de passe" name="password" placeholder="Minimum 8 caractères"
        leftIcon={<i className="bi bi-lock-fill" />} error={errors.password?.message}
        disabled={isRegistering} required {...register('password')} />

      {password && (
        <div className="password-strength">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`password-strength__bar ${i <= strength.level ? `password-strength__bar--active ${strength.className}` : ''}`} />
          ))}
          <span className="password-strength__label">{strength.label}</span>
        </div>
      )}

      <AuthPasswordInput label="Confirmer le mot de passe" name="confirmPassword"
        placeholder="Retapez votre mot de passe" leftIcon={<i className="bi bi-lock-fill" />}
        error={errors.confirmPassword?.message} disabled={isRegistering} required
        {...register('confirmPassword')} />

      <div className="auth-form__row">
        <div className="auth-field">
          <label htmlFor="auth-input-country" className="auth-field__label">
            Pays<span className="auth-field__required">*</span>
          </label>
          <div className="auth-field__wrapper">
            <span className="auth-field__icon auth-field__icon--left"><i className="bi bi-globe2" /></span>
            <select id="auth-input-country" className="auth-field__input auth-field__input--has-left"
              disabled={isRegistering} style={{ cursor: 'pointer', appearance: 'none' }}
              {...register('country')}>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          {errors.country?.message && <p className="auth-field__error">{errors.country.message}</p>}
        </div>

        <AuthInput label="Ville" name="city" placeholder="Ex: Douala, Yaoundé..."
          leftIcon={<i className="bi bi-geo-alt-fill" />} error={errors.city?.message}
          disabled={isRegistering} required {...register('city')} />
      </div>

      <div className="auth-terms">
        <input type="checkbox" id="acceptsTerms" disabled={isRegistering} {...register('acceptsTerms')} />
        <label htmlFor="acceptsTerms" className="auth-terms__label">
          J'accepte les <a href="/conditions" target="_blank" rel="noopener noreferrer">conditions d'utilisation</a>
          {' '}et la <a href="/politique" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>
        </label>
      </div>
      {errors.acceptsTerms?.message && (
        <p className="auth-field__error" style={{ marginTop: '-0.5rem' }}>{errors.acceptsTerms.message}</p>
      )}

      <button type="submit" className="btn btn-primary" disabled={isRegistering}>
        {isRegistering && <span className="spinner-border spinner-border-sm" />}
        Créer mon compte
      </button>

      <p className="auth-form__alt">
        Déjà inscrit ?{' '}
        <Link to="/login" className="auth-form__alt-link">Se connecter</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
