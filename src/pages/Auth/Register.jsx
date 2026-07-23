import AppLogo from '@components/common/AppLogo';
import { AuthCard, AuthHeader, AuthLeftPanel, RegisterForm } from '@components/auth';

const RegisterPage = () => (
  <>
    <AuthLeftPanel />
    <div className="auth-right">
      <div className="auth-right__inner">
        <div className="auth-mobile-logo">
          <AppLogo size={28} variant="horizontal" textClassName="auth-mobile-logo__text" />
        </div>
        <AuthCard>
          <AuthHeader
            icon={<i className="bi bi-person-plus-fill" />}
            title="Créer un compte"
            subtitle="Rejoignez des milliers de voyageurs au Cameroun"
          />
          <RegisterForm />
        </AuthCard>
      </div>
    </div>
  </>
);

export default RegisterPage;
