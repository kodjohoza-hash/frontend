import { useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import useAuthStore from '@store/auth.store';
import { getRoleDashboard } from '@utils/roles';
import AuthInput from '@components/auth/AuthInput';
import AuthPasswordInput from '@components/auth/AuthPasswordInput';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const ROLE_META = {
  client: { label: 'Client', icon: 'bi-person-fill', color: 'blue', register: '/auth/register/client' },
  company: { label: 'Compagnie', icon: 'bi-building', color: 'green', register: '/auth/register/company' },
  counter: { label: 'Agent de guichet', icon: 'bi-shop', color: 'orange', register: null },
  'super-admin': { label: 'Super Administrateur', icon: 'bi-shield-lock-fill', color: 'violet', register: null },
};

const ROLE_MESSAGES = {
  counter: 'Votre compte est cr&eacute;&eacute; par votre compagnie. Contactez votre administrateur pour obtenir vos identifiants.',
  'super-admin': 'Compte r&eacute;serv&eacute; aux administrateurs syst&egrave;me. Contactez le support si vous avez besoin d&rsquo;acc&egrave;s.',
};

const AuthRoleForm = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError } = useAuth();
  const [showAlert, setShowAlert] = useState(!!loginError);

  const meta = ROLE_META[role] || ROLE_META.client;
  const message = ROLE_MESSAGES[role];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = (data) => {
    setShowAlert(false);
    login(data, {
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
          <p className="auth-header__subtitle">
            {message ? (
              <span dangerouslySetInnerHTML={{ __html: message }} />
            ) : (
              'Connectez-vous pour acc&eacute;der &agrave; votre espace.'
            )}
          </p>
        </div>

        {!message && (
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
            {showAlert && loginError && (
              <div className="auth-alert auth-alert--error" role="alert">
                <i className="bi bi-exclamation-circle-fill auth-alert__icon" />
                <div className="auth-alert__content">
                  <p className="auth-alert__message">
                    {loginError?.response?.data?.message || 'Email ou mot de passe incorrect.'}
                  </p>
                </div>
              </div>
            )}

            <AuthInput
              label={role === 'company' ? 'Email professionnel' : 'Adresse email'}
              type="email"
              name="email"
              placeholder={role === 'company' ? 'contact@compagnie.com' : 'votre@email.com'}
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
                Mot de passe oubli&eacute; ?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoggingIn}>
              {isLoggingIn && <span className="spinner-border spinner-border-sm" />}
              Se connecter
            </button>
          </form>
        )}

        {meta.register && (
          <p className="auth-form__alt" style={{ marginTop: '1rem' }}>
            Pas encore inscrit ?{' '}
            <Link to={meta.register} className="auth-form__alt-link">
              Cr&eacute;er un compte
            </Link>
          </p>
        )}

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

export default AuthRoleForm;
