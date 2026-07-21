import { useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { Button } from '@components/ui';
import { AuthCard } from '@components/auth';

/**
 * SessionExpiredPage — Rendered inside AuthLayout via <Outlet />
 */
const SessionExpiredPage = () => {
  const navigate = useNavigate();
  const { logoutClean } = useAuth();

  const handleLogin = () => {
    logoutClean();
    navigate('/login', { replace: true });
  };

  return (
    <AuthCard>
      <div className="auth-status">
        <div className="auth-status__icon auth-status__icon--warning">
          <i className="bi bi-clock-history" />
        </div>
        <h2 className="auth-status__title">Session expirée</h2>
        <p className="auth-status__text">
          Votre session de connexion a expiré pour des raisons de sécurité. Veuillez vous reconnecter pour continuer.
        </p>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleLogin}
          leftIcon={<i className="bi bi-box-arrow-in-right" />}
        >
          Se reconnecter
        </Button>
      </div>
    </AuthCard>
  );
};

export default SessionExpiredPage;
