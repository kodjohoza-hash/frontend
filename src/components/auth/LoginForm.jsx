import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import { Input, PasswordInput, Button } from '@components/ui';
import RememberMe from './RememberMe';

/**
 * LoginForm — Premium login form with react-hook-form + Zod
 */
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
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data) => {
    setShowAlert(false);
    login(data, {
      onSuccess: () => {
        navigate(from, { replace: true });
      },
      onError: () => {
        setShowAlert(true);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      {showAlert && loginError && (
        <div className="auth-alert auth-alert--error" role="alert">
          <i className="bi bi-exclamation-circle auth-alert__icon" />
          <div className="auth-alert__content">
            <p className="auth-alert__message">
              {loginError?.response?.data?.message || 'Email ou mot de passe incorrect. Veuillez réessayer.'}
            </p>
          </div>
        </div>
      )}

      <Input
        label="Adresse email"
        type="email"
        name="email"
        placeholder="votre@email.com"
        autoComplete="email"
        leftIcon={<i className="bi bi-envelope" />}
        error={errors.email?.message}
        disabled={isLoggingIn}
        required
        {...register('email')}
      />

      <div>
        <PasswordInput
          label="Mot de passe"
          name="password"
          placeholder="Votre mot de passe"
          autoComplete="current-password"
          error={errors.password?.message}
          disabled={isLoggingIn}
          required
          {...register('password')}
        />
      </div>

      <div className="auth-form__options">
        <RememberMe {...register('rememberMe')} />
        <Link to="/forgot-password" className="auth-form__forgot">
          Mot de passe oublié ?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoggingIn}
        disabled={isLoggingIn}
        leftIcon={!isLoggingIn ? <i className="bi bi-box-arrow-in-right" /> : undefined}
      >
        Se connecter
      </Button>
    </form>
  );
};

export default LoginForm;
