import { AuthCard, AuthHeader, AuthFooter, ResetPasswordForm } from '@components/auth';

/**
 * ResetPasswordPage — Rendered inside AuthLayout via <Outlet />
 */
const ResetPasswordPage = () => (
  <>
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
  </>
);

export default ResetPasswordPage;
