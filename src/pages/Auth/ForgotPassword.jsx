import { AuthCard, AuthHeader, AuthFooter, ForgotPasswordForm } from '@components/auth';

/**
 * ForgotPasswordPage — Rendered inside AuthLayout via <Outlet />
 */
const ForgotPasswordPage = () => (
  <>
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
  </>
);

export default ForgotPasswordPage;
