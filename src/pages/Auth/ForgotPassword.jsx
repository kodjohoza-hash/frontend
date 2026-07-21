import { AuthCard, AuthHeader, AuthLeftPanel, ForgotPasswordForm } from '@components/auth';

const ForgotPasswordPage = () => (
  <>
    <AuthLeftPanel />
    <div className="auth-right">
      <div className="auth-right__inner">
        <div className="auth-mobile-logo">
          <div className="auth-mobile-logo__icon"><i className="bi bi-bus-front-fill" /></div>
          <span className="auth-mobile-logo__text">Bus Tix Connect</span>
        </div>
        <AuthCard>
          <AuthHeader
            icon={<i className="bi bi-key-fill" />}
            title="Mot de passe oublié ?"
            subtitle="Entrez votre email pour recevoir un lien de réinitialisation"
          />
          <ForgotPasswordForm />
        </AuthCard>
      </div>
    </div>
  </>
);

export default ForgotPasswordPage;
