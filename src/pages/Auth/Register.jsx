import { AuthCard, AuthHeader, AuthIllustration, RegisterForm } from '@components/auth';

/**
 * RegisterPage — Two-column: AuthIllustration (55%) + form card (45%)
 */
const RegisterPage = () => (
  <>
    <AuthIllustration />

    <div className="auth-right">
      <div className="auth-right__inner">
        <div className="auth-mobile-logo">
          <div className="auth-mobile-logo__icon">
            <i className="bi bi-bus-front-fill" />
          </div>
          <span className="auth-mobile-logo__text">Bus Tix Connect</span>
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
