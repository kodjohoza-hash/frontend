import AppLogo from '@components/common/AppLogo';
import { AuthCard, AuthHeader, AuthLeftPanel, ResetPasswordForm } from '@components/auth';

const ResetPasswordPage = () => (
  <>
    <AuthLeftPanel />
    <div className="auth-right">
      <div className="auth-right__inner">
        <div className="auth-mobile-logo">
          <AppLogo size={32} variant="horizontal" textClassName="auth-mobile-logo__text" />
        </div>
        <AuthCard>
          <AuthHeader
            icon={<i className="bi bi-shield-lock-fill" />}
            title="Nouveau mot de passe"
            subtitle="Choisissez un mot de passe sécurisé"
          />
          <ResetPasswordForm />
        </AuthCard>
      </div>
    </div>
  </>
);

export default ResetPasswordPage;
