import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from '@utils/roles';
import AuthInput from '@components/auth/AuthInput';
import AuthPasswordInput from '@components/auth/AuthPasswordInput';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = (data) => {
    setShowAlert(false);
    login({ ...data, roleHint: 'super-admin' }, {
      onSuccess: () => navigate(getRoleDashboard('super_admin'), { replace: true }),
      onError: () => setShowAlert(true),
    });
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-header__icon auth-header__icon--violet">
            <AppLogo size={28} variant="icon" />
          </div>
          <h2 className="auth-header__title">Super Administrateur</h2>
          <p className="auth-header__subtitle">Administration générale de la plateforme</p>
        </div>

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
            label="Email administrateur"
            type="email"
            name="email"
            placeholder="admin@bustixconnect.com"
            leftIcon={<i className="bi bi-shield-lock-fill" />}
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

        <div className="auth-info-banner" style={{
          marginTop: '1.25rem', padding: '0.875rem 1rem', borderRadius: '12px',
          background: '#F5F3FF', border: '1px solid #C4B5FD',
          display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
          fontSize: 'var(--font-size-sm)', color: '#5B21B6',
        }}>
          <i className="bi bi-info-circle" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span>Compte réservé aux administrateurs système. Contactez le support technique si vous avez besoin d'accès.</span>
        </div>

        <p className="auth-form__alt" style={{ marginTop: '0.75rem' }}>
          <Link to="/auth" className="auth-form__alt-link">
            <i className="bi bi-arrow-left" style={{ marginRight: '0.25rem' }} />
            Changer d'espace
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default LoginAdmin;
