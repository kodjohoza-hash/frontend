import { Link } from 'react-router-dom';
import { AuthCard, AuthHeader, AuthIllustration, LoginForm } from '@components/auth';

const LoginPage = () => (
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
            icon={<i className="bi bi-bus-front-fill" />}
            title="Bienvenue !"
            subtitle="Connectez-vous à votre compte pour continuer."
          />
          <LoginForm />
        </AuthCard>
      </div>
    </div>
  </>
);

export default LoginPage;
