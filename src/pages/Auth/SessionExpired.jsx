import { useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { Button } from '@components/ui';
import { AuthCard } from '@components/auth';

/**
 * SessionExpiredPage — Displayed when user session has expired
 */
const SessionExpiredPage = () => {
  const navigate = useNavigate();
  const { logoutClean } = useAuth();

  const handleLogin = () => {
    logoutClean();
    navigate('/login', { replace: true });
  };

  return (
    <div className="auth-layout d-flex min-vh-100">
      <div className="auth-layout__sidebar d-none d-lg-flex">
        <div className="auth-layout__sidebar-content">
          <div className="auth-layout__brand">
            <div className="auth-layout__brand-icon">
              <i className="bi bi-bus-front-fill" />
            </div>
            <span className="auth-layout__brand-name">Bus Tix Connect</span>
          </div>

          <div className="auth-layout__hero-image">
            <img
              src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=450&fit=crop&q=80"
              alt="Bus moderne"
              loading="eager"
            />
          </div>

          <h2 className="auth-layout__hero-title">
            Votre session a expiré
          </h2>
          <p className="auth-layout__hero-text">
            Pour des raisons de sécurité, votre session a été déconnectée. Veuillez vous reconnecter.
          </p>
        </div>
      </div>

      <div className="auth-layout__content">
        <div className="auth-layout__content-inner">
          <div className="auth-mobile-logo">
            <div className="auth-mobile-logo__icon">
              <i className="bi bi-bus-front-fill" />
            </div>
            <div className="auth-mobile-logo__text">Bus Tix Connect</div>
          </div>

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
              >
                <i className="bi bi-box-arrow-in-right me-2" />
                Se reconnecter
              </Button>
            </div>
          </AuthCard>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredPage;
