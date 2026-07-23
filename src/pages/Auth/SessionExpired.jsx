import { useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import AppLogo from '@components/common/AppLogo';
import { AuthCard, AuthLeftPanel } from '@components/auth';

const SessionExpiredPage = () => {
  const navigate = useNavigate();
  const { logoutClean } = useAuth();

  const handleLogin = () => {
    logoutClean();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <AuthLeftPanel />
      <div className="auth-right">
        <div className="auth-right__inner">
          <div className="auth-mobile-logo">
            <AppLogo size={28} variant="horizontal" textClassName="auth-mobile-logo__text" />
          </div>
          <AuthCard>
            <div className="auth-status">
              <div className="auth-status__icon auth-status__icon--warning"><i className="bi bi-clock-history" /></div>
              <h2 className="auth-status__title">Session expirée</h2>
              <p className="auth-status__text">Votre session a expiré. Veuillez vous reconnecter.</p>
              <button className="btn btn-primary" style={{ width: '100%', height: 56, borderRadius: 16, fontSize: 'var(--font-size-sm)', fontWeight: 600 }} onClick={handleLogin}>
                Se reconnecter
              </button>
            </div>
          </AuthCard>
        </div>
      </div>
    </>
  );
};

export default SessionExpiredPage;
