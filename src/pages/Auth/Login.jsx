import { Link } from 'react-router-dom';
import { AuthCard, AuthHeader, AuthFooter, AuthIllustration, LoginForm } from '@components/auth';

/**
 * LoginPage — Premium two-column login page
 */
const LoginPage = () => (
  <>
    <AuthIllustration />

    <div className="auth-layout__content">
      <div className="auth-layout__content-inner">
        <div className="auth-mobile-logo">
          <div className="auth-mobile-logo__icon">
            <i className="bi bi-bus-front-fill" />
          </div>
          <div className="auth-mobile-logo__text">Bus Tix Connect</div>
        </div>

        <AuthCard>
          <AuthHeader
            title="Connexion"
            subtitle="Accédez à votre espace personnel et gérez vos réservations"
          />

          <LoginForm />

          <div className="auth-form__divider">
            <span>ou</span>
          </div>

          <div className="text-center">
            <Link to="/register" className="auth-form__forgot" style={{ fontSize: 'var(--font-size-sm)' }}>
              <i className="bi bi-person-plus me-1" />
              Créer un compte gratuitement
            </Link>
          </div>
        </AuthCard>

        <AuthFooter
          text="Pas encore de compte ?"
          linkLabel="Créer un compte"
          linkTo="/register"
        />
      </div>
    </div>
  </>
);

export default LoginPage;
