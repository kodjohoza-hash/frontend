import { useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyEmailSchema } from '@schemas/auth.schema';
import useAuth from '@hooks/useAuth';
import AuthInput from '@components/auth/AuthInput';
import { AuthCard, AuthHeader } from '@components/auth';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const VerifyEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const { verifyEmail, isVerifying, verifyEmailSuccess, verifyEmailError, resendVerification, isResending } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = (data) => verifyEmail({ code: data.code, email });

  if (verifyEmailSuccess) {
    return (
      <AuthShell>
        <AuthCard>
          <div className="auth-status">
            <div className="auth-status__icon auth-status__icon--success"><i className="bi bi-check-circle" /></div>
            <h2 className="auth-status__title">Email v&eacute;rifi&eacute; !</h2>
            <p className="auth-status__text">Votre compte a &eacute;t&eacute; activ&eacute;. Connectez-vous maintenant.</p>
            <Link to="/auth" className="btn btn-primary" style={{ width: '100%' }}>
              Se connecter
            </Link>
          </div>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthCard>
        <AuthHeader
          icon={<AppLogo size={28} variant="icon" />}
          title="V&eacute;rifier votre email"
          subtitle={email ? `Code envoy&eacute; &agrave; ${email}` : 'Entrez le code de v&eacute;rification'}
        />
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
          {verifyEmailError && (
            <div className="auth-alert auth-alert--error" role="alert">
              <i className="bi bi-exclamation-circle-fill auth-alert__icon" />
              <div className="auth-alert__content">
                <p className="auth-alert__message">{verifyEmailError?.response?.data?.message || 'Code invalide.'}</p>
              </div>
            </div>
          )}
          <AuthInput label="Code de v&eacute;rification" name="code" placeholder="000000"
            leftIcon={<i className="bi bi-key-fill" />} error={errors.code?.message}
            disabled={isVerifying} required {...register('code')} />
          <button type="submit" className="btn btn-primary" disabled={isVerifying}>
            {isVerifying && <span className="spinner-border spinner-border-sm" />}
            V&eacute;rifier
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <button type="button" onClick={() => resendVerification(email)} disabled={isResending} className="btn btn-ghost btn-sm">
            {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
          </button>
        </div>
        <p className="auth-form__alt" style={{ marginTop: '1rem' }}>
          <Link to="/auth" className="auth-form__alt-link">
            <i className="bi bi-arrow-left" style={{ marginRight: '0.25rem' }} />
            Retour &agrave; la connexion
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
};

export default VerifyEmailPage;
