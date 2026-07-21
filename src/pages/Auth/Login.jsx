import { Link } from 'react-router-dom';
import { AuthCard, AuthHeader, AuthFooter, LoginForm } from '@components/auth';

/**
 * LoginPage — Rendered inside AuthLayout via <Outlet />
 * AuthLayout handles: left branding panel + right content wrapper + mobile logo
 */
const LoginPage = () => (
  <>
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
  </>
);

export default LoginPage;
