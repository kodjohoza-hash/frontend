import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import { Input, PasswordInput, Button, Checkbox } from '@components/ui';

/**
 * RegisterForm — Premium registration form
 */
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
      lastName: '',
      firstName: '',
      phone: '',
      city: '',
      email: '',
      password: '',
      confirmPassword: '',
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
        <Input
          label="Nom"
          name="lastName"
          placeholder="Votre nom"
          autoComplete="family-name"
          leftIcon={<i className="bi bi-person-fill" />}
          error={errors.lastName?.message}
          disabled={isRegistering}
          required
          {...register('lastName')}
        />
        <Input
          label="Prénom"
          name="firstName"
          placeholder="Votre prénom"
          autoComplete="given-name"
          leftIcon={<i className="bi bi-person-fill" />}
          error={errors.firstName?.message}
          disabled={isRegistering}
          required
          {...register('firstName')}
        />
      </div>

      <Input
        label="Téléphone"
        type="tel"
        name="phone"
        placeholder="6XX XXX XXX"
        autoComplete="tel"
        leftIcon={<i className="bi bi-telephone-fill" />}
        error={errors.phone?.message}
        disabled={isRegistering}
        required
        {...register('phone')}
      />

      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="votre@email.com"
        autoComplete="email"
        leftIcon={<i className="bi bi-envelope-fill" />}
        error={errors.email?.message}
        disabled={isRegistering}
        required
        {...register('email')}
      />

      <div>
        <PasswordInput
          label="Mot de passe"
          name="password"
          placeholder="Minimum 8 caractères"
          autoComplete="new-password"
          leftIcon={<i className="bi bi-lock-fill" />}
          error={errors.password?.message}
          disabled={isRegistering}
          required
          {...register('password')}
        />
        {password && (
          <div className="password-strength">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`password-strength__bar ${i <= strength.level ? `password-strength__bar--active ${strength.className}` : ''}`}
              />
            ))}
            <span className="password-strength__label">{strength.label}</span>
          </div>
        )}
      </div>

      <PasswordInput
        label="Confirmer le mot de passe"
        name="confirmPassword"
        placeholder="Retapez votre mot de passe"
        autoComplete="new-password"
        leftIcon={<i className="bi bi-lock-fill" />}
        error={errors.confirmPassword?.message}
        disabled={isRegistering}
        required
        {...register('confirmPassword')}
      />

      <div className="auth-terms">
        <Checkbox
          name="acceptsTerms"
          disabled={isRegistering}
          {...register('acceptsTerms')}
        />
        <label htmlFor="checkbox-acceptsTerms" className="auth-terms__label">
          J'accepte les{' '}
          <a href="/conditions" target="_blank" rel="noopener noreferrer">conditions d'utilisation</a>
          {' '}et la{' '}
          <a href="/politique" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>
        </label>
      </div>
      {errors.acceptsTerms?.message && (
        <div className="invalid-feedback d-block" style={{ marginTop: '-0.5rem' }}>
          {errors.acceptsTerms.message}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isRegistering}
        disabled={isRegistering}
      >
        Créer mon compte
      </Button>

      <p className="auth-form__alt">
        Déjà inscrit ?{' '}
        <Link to="/login" className="auth-form__alt-link">
          Connexion
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
