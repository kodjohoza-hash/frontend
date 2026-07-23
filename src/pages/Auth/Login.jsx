import { Link } from 'react-router-dom';
import AppLogo from '@components/common/AppLogo';
import { AuthCard, AuthHeader, AuthLeftPanel, LoginForm } from '@components/auth';

const LoginPage = () => (
  <>
    <AuthLeftPanel />
    <div className="auth-right">
      <div className="auth-right__inner">
        <div className="auth-mobile-logo">
          <AppLogo size={32} variant="horizontal" textClassName="auth-mobile-logo__text" />
        </div>
        <AuthCard>
          <AuthHeader
            icon={<AppLogo size={28} variant="icon" />}
            title="Bienvenue !"
            subtitle="Connectez-vous à votre compte."
          />
          <LoginForm />
        </AuthCard>
      </div>
    </div>
  </>
);

export default LoginPage;
