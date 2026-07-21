import { AuthCard, AuthHeader, AuthFooter, ResetPasswordForm } from '@components/auth';

/**
 * ResetPasswordPage — Set new password page (after clicking reset link)
 */
const ResetPasswordPage = () => (
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
            title="Nouveau mot de passe"
            subtitle="Choisissez un mot de passe sécurisé pour votre compte"
          />

          <ResetPasswordForm />
        </AuthCard>

        <AuthFooter
          text="Retour à la"
          linkLabel="connexion"
          linkTo="/login"
        />
      </div>
    </div>
  </>
);

export default ResetPasswordPage;
