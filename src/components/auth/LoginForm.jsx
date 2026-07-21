import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import AuthInput from './AuthInput';
import AuthPasswordInput from './AuthPasswordInput';
import SocialLogin from './SocialLogin';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn, loginError } = useAuth();
  const [showAlert, setShowAlert] = useState(!!loginError);
  const from = location.state?.from?.pathname || '/';

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
      onSuccess: () => navigate(from, { replace: true }),
      onError: () => setShowAlert(true),
    });
  };

  return (
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
        label="Adresse email"
        type="email"
        name="email"
        placeholder="votre@email.com"
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

      <SocialLogin />

      <p className="auth-form__alt">
        Pas encore inscrit ?{' '}
        <Link to="/register" className="auth-form__alt-link">
          Créer un compte
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
