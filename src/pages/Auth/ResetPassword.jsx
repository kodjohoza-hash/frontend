import { AuthCard, AuthHeader, ResetPasswordForm } from '@components/auth';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const ResetPasswordPage = () => (
  <AuthShell>
    <AuthCard>
      <AuthHeader
        icon={<AppLogo size={28} variant="icon" />}
        title="Nouveau mot de passe"
        subtitle="Choisissez un mot de passe s&eacute;curis&eacute;"
      />
      <ResetPasswordForm />
    </AuthCard>
  </AuthShell>
);

export default ResetPasswordPage;
