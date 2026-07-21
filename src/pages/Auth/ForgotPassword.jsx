import { AuthCard, AuthHeader, AuthFooter, ForgotPasswordForm } from '@components/auth';

/**
 * ForgotPasswordPage — Password reset request page
 */
const ForgotPasswordPage = () => (
  <>
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
            title="Mot de passe oublié ?"
            subtitle="Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe"
          />

          <ForgotPasswordForm />
        </AuthCard>

        <AuthFooter
          text="Vous vous souvenez de votre mot de passe ?"
          linkLabel="Retour à la connexion"
          linkTo="/login"
        />
      </div>
    </div>
  </>
);

export default ForgotPasswordPage;
