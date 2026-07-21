import { useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { Button } from '@components/ui';
import { AuthCard, AuthIllustration } from '@components/auth';

/**
 * SessionExpiredPage — Two-column split layout
 */
const SessionExpiredPage = () => {
  const navigate = useNavigate();
  const { logoutClean } = useAuth();

  const handleLogin = () => {
    logoutClean();
    navigate('/login', { replace: true });
  };

  return (
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
            <div className="auth-status">
              <div className="auth-status__icon auth-status__icon--warning">
                <i className="bi bi-clock-history" />
              </div>
              <h2 className="auth-status__title">Session expirée</h2>
              <p className="auth-status__text">
                Votre session a expiré pour des raisons de sécurité. Veuillez vous reconnecter.
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleLogin}
              >
                Se reconnecter
              </Button>
            </div>
          </AuthCard>
        </div>
      </div>
    </>
  );
};

export default SessionExpiredPage;
