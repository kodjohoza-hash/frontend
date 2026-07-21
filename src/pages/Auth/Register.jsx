import { AuthCard, AuthHeader, AuthFooter, RegisterForm } from '@components/auth';

/**
 * RegisterPage — Rendered inside AuthLayout via <Outlet />
 * AuthLayout handles: left branding panel + right content wrapper + mobile logo
 */
const RegisterPage = () => (
  <>
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
  </>
);

export default RegisterPage;
