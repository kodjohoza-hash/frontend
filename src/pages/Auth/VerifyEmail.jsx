import { useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyEmailSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import { Input, Button } from '@components/ui';
import { AuthCard, AuthHeader } from '@components/auth';

/**
 * VerifyEmailPage — Rendered inside AuthLayout via <Outlet />
 */
const VerifyEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const { verifyEmail, isVerifying, verifyEmailSuccess, verifyEmailError, resendVerification, isResending } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = (data) => {
    verifyEmail({ code: data.code, email });
  };

  const handleResend = () => {
    resendVerification(email);
  };

  if (verifyEmailSuccess) {
    return (
      <AuthCard>
        <div className="auth-status">
          <div className="auth-status__icon auth-status__icon--success">
            <i className="bi bi-check-circle" />
          </div>
          <h2 className="auth-status__title">Email vérifié !</h2>
          <p className="auth-status__text">
            Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            Se connecter
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <>
      <AuthCard>
        <AuthHeader
          title="Vérifier votre email"
          subtitle={email
            ? `Nous avons envoyé un code à 6 chiffres à ${email}`
            : 'Entrez le code de vérification envoyé à votre email'
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          {verifyEmailError && (
            <div className="auth-alert auth-alert--error" role="alert">
              <i className="bi bi-exclamation-circle auth-alert__icon" />
              <div className="auth-alert__content">
                <p className="auth-alert__message">
                  {verifyEmailError?.response?.data?.message || 'Code invalide ou expiré.'}
                </p>
              </div>
            </div>
          )}

          <Input
            label="Code de vérification"
            name="code"
            placeholder="000000"
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            leftIcon={<i className="bi bi-shield-lock" />}
            error={errors.code?.message}
            disabled={isVerifying}
            className="text-center"
            style={{ fontSize: 'var(--font-size-2xl)', letterSpacing: '0.5em', fontWeight: 'var(--font-weight-semibold)' }}
            required
            {...register('code')}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isVerifying}
            disabled={isVerifying}
          >
            Vérifier
          </Button>
        </form>

        <div className="auth-form__divider">
          <span>ou</span>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="btn btn-ghost btn-sm"
          >
            {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
          </button>
        </div>
      </AuthCard>

      <div className="auth-footer">
        <p className="auth-footer__text">
          <Link to="/login" className="auth-footer__link">
            <i className="bi bi-arrow-left me-1" />
            Retour à la connexion
          </Link>
        </p>
      </div>
    </>
  );
};

export default VerifyEmailPage;
