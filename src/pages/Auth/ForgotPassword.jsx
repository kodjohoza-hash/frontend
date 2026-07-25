import { Link } from 'react-router-dom';
import { AuthCard, AuthHeader, ForgotPasswordForm } from '@components/auth';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const ForgotPasswordPage = () => (
  <AuthShell>
    <AuthCard>
      <AuthHeader
        icon={<AppLogo size={28} variant="icon" />}
        title="Mot de passe oubli&eacute; ?"
        subtitle="Entrez votre email pour recevoir un lien de r&eacute;initialisation"
      />
      <ForgotPasswordForm />
      <p className="auth-form__alt" style={{ marginTop: '1rem' }}>
        <Link to="/auth" className="auth-form__alt-link">
          <i className="bi bi-arrow-left" style={{ marginRight: '0.25rem' }} />
          Retour &agrave; la connexion
        </Link>
      </p>
    </AuthCard>
  </AuthShell>
);

export default ForgotPasswordPage;
