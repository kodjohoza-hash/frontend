import { AuthCard, AuthHeader, AuthIllustration, ResetPasswordForm } from '@components/auth';

const ResetPasswordPage = () => (
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
            title="Nouveau mot de passe"
            subtitle="Choisissez un mot de passe sécurisé pour votre compte"
          />
          <ResetPasswordForm />
        </AuthCard>
      </div>
    </div>
  </>
);

export default ResetPasswordPage;
