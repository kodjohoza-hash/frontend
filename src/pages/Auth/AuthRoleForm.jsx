import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, counterLoginSchema, adminLoginSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from '@utils/roles';
import AuthInput from '@components/auth/AuthInput';
import AuthPasswordInput from '@components/auth/AuthPasswordInput';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const ROLE_META = {
  client: {
    label: 'Client',
    icon: 'bi-person-fill',
    color: 'blue',
    register: '/auth/register/client',
    emailLabel: 'Adresse email',
    emailPlaceholder: 'votre@email.com',
    description: 'Connectez-vous pour accéder à votre espace client.',
  },
  company: {
    label: 'Compagnie',
    icon: 'bi-building',
    color: 'green',
    register: '/auth/register/company',
    emailLabel: 'Email professionnel',
    emailPlaceholder: 'contact@compagnie.com',
    description: 'Connectez-vous pour gérer votre compagnie de transport.',
  },
  counter: {
    label: 'Agent de guichet',
    icon: 'bi-shop',
    color: 'orange',
    register: null,
    emailLabel: 'Identifiant employé ou email professionnel',
    emailPlaceholder: 'agent@compagnie.com',
    description: 'Connectez-vous pour accéder à votre guichet.',
  },
  'super-admin': {
    label: 'Super Administrateur',
    icon: 'bi-shield-lock-fill',
    color: 'violet',
    register: null,
    emailLabel: 'Email administrateur',
    emailPlaceholder: 'admin@bustixconnect.com',
    description: 'Connectez-vous pour accéder à l\'administration de la plateforme.',
  },
};

const ROLE_SCHEMAS = {
  client: loginSchema,
  company: loginSchema,
  counter: counterLoginSchema,
  'super-admin': adminLoginSchema,
};

const AuthRoleForm = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError } = useAuth();
  const [showAlert, setShowAlert] = useState(!!loginError);

  const meta = ROLE_META[role] || ROLE_META.client;
  const schema = ROLE_SCHEMAS[role] || loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = (data) => {
    setShowAlert(false);
    login({ ...data, roleHint: role }, {
      onSuccess: () => navigate(getRoleDashboard(role), { replace: true }),
      onError: () => setShowAlert(true),
    });
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <div className="auth-header">
          <div className={`auth-header__icon auth-header__icon--${meta.color}`}>
            <AppLogo size={28} variant="icon" />
          </div>
          <h2 className="auth-header__title">Connexion {meta.label}</h2>
          <p className="auth-header__subtitle">{meta.description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          {showAlert && loginError && (
            <div className="auth-alert auth-alert--error" role="alert">
              <i className="bi bi-exclamation-circle-fill auth-alert__icon" />
              <div className="auth-alert__content">
                <p className="auth-alert__message">
                  {loginError?.response?.data?.message || 'Identifiants incorrects. Veuillez réessayer.'}
                </p>
              </div>
            </div>
          )}

          <AuthInput
            label={meta.emailLabel}
            type="email"
            name="email"
            placeholder={meta.emailPlaceholder}
            leftIcon={<i className="bi bi-envelope-fill" />}
            error={errors.email?.message}
            disabled={isLoggingIn}
            required
            {...register('email')}
          />

          <AuthPasswordInput
            label="Mot de passe"
            name="password"
            placeholder="Votre mot de passe"
            leftIcon={<i className="bi bi-lock-fill" />}
            error={errors.password?.message}
            disabled={isLoggingIn}
            required
            {...register('password')}
          />

          <div className="auth-form__options">
            <div className="auth-form__remember">
              <input type="checkbox" id="remember-me" disabled={isLoggingIn} {...register('rememberMe')} />
              <label htmlFor="remember-me">Se souvenir de moi</label>
            </div>
            <Link to="/forgot-password" className="auth-form__link">
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoggingIn}>
            {isLoggingIn && <span className="spinner-border spinner-border-sm" />}
            Se connecter
          </button>
        </form>

        {meta.register && (
          <p className="auth-form__alt" style={{ marginTop: '1rem' }}>
            Pas encore inscrit ?{' '}
            <Link to={meta.register} className="auth-form__alt-link">
              Créer un compte
            </Link>
          </p>
        )}

        {!meta.register && role === 'counter' && (
          <div className="auth-info-banner" style={{ marginTop: '1rem' }}>
            <i className="bi bi-info-circle" style={{ marginRight: '0.5rem', color: 'var(--color-accent)' }} />
            <span>Votre compte est créé uniquement par votre compagnie. Contactez votre administrateur.</span>
          </div>
        )}

        {!meta.register && role === 'super-admin' && (
          <div className="auth-info-banner" style={{ marginTop: '1rem' }}>
            <i className="bi bi-info-circle" style={{ marginRight: '0.5rem', color: 'var(--color-accent)' }} />
            <span>Compte réservé aux administrateurs système. Contactez le support technique.</span>
          </div>
        )}

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

export default AuthRoleForm;
