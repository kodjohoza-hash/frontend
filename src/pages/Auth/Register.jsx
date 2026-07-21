import { AuthCard, AuthHeader, AuthFooter, AuthIllustration, RegisterForm } from '@components/auth';

/**
 * RegisterPage — Premium two-column registration page
 */
const RegisterPage = () => (
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
            title="Créer un compte"
            subtitle="Rejoignez des milliers de voyageurs au Cameroun"
          />

          <RegisterForm />
        </AuthCard>

        <AuthFooter
          text="Déjà un compte ?"
          linkLabel="Se connecter"
          linkTo="/login"
        />
      </div>
    </div>
  </>
);

export default RegisterPage;
