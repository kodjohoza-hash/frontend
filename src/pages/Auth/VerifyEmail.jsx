import { useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyEmailSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import AuthInput from '@components/auth/AuthInput';
import { AuthCard, AuthHeader, AuthIllustration } from '@components/auth';

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

  const onSubmit = (data) => verifyEmail({ code: data.code, email });

  if (verifyEmailSuccess) {
    return (
      <>
        <AuthIllustration />
        <div className="auth-right">
          <div className="auth-right__inner">
            <AuthCard>
              <div className="auth-status">
                <div className="auth-status__icon auth-status__icon--success">
                  <i className="bi bi-check-circle" />
                </div>
                <h2 className="auth-status__title">Email vérifié !</h2>
                <p className="auth-status__text">
                  Votre compte a été activé. Vous pouvez maintenant vous connecter.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%', height: 56, borderRadius: 16, fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                  Se connecter
                </Link>
              </div>
            </AuthCard>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthIllustration />
      <div className="auth-right">
        <div className="auth-right__inner">
          <div className="auth-mobile-logo">
            <div className="auth-mobile-logo__icon"><i className="bi bi-bus-front-fill" /></div>
            <span className="auth-mobile-logo__text">Bus Tix Connect</span>
          </div>
          <AuthCard>
            <AuthHeader
              icon={<i className="bi bi-shield-lock-fill" />}
              title="Vérifier votre email"
              subtitle={email ? `Code envoyé à ${email}` : 'Entrez le code de vérification'}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
              {verifyEmailError && (
                <div className="auth-alert auth-alert--error" role="alert">
                  <i className="bi bi-exclamation-circle-fill auth-alert__icon" />
                  <div className="auth-alert__content">
                    <p className="auth-alert__message">
                      {verifyEmailError?.response?.data?.message || 'Code invalide ou expiré.'}
                    </p>
                  </div>
                </div>
              )}
              <AuthInput
                label="Code de vérification"
                name="code"
                placeholder="000000"
                leftIcon={<i className="bi bi-key-fill" />}
                error={errors.code?.message}
                disabled={isVerifying}
                className="text-center"
                required
                {...register('code')}
              />
              <button type="submit" className="btn btn-primary" disabled={isVerifying}>
                {isVerifying && <span className="spinner-border spinner-border-sm" />}
                Vérifier
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
              <button type="button" onClick={() => resendVerification(email)} disabled={isResending} className="btn btn-ghost btn-sm">
                {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
              </button>
            </div>
          </AuthCard>
          <div className="auth-footer">
            <p className="auth-footer__text">
              <Link to="/login" className="auth-footer__link">
                <i className="bi bi-arrow-left me-1" /> Retour à la connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailPage;
