import { useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { AuthCard } from '@components/auth';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const SessionExpiredPage = () => {
  const navigate = useNavigate();
  const { logoutClean } = useAuth();

  const handleLogin = () => {
    logoutClean();
    navigate('/auth', { replace: true });
  };

  return (
    <AuthShell>
      <AuthCard>
        <div className="auth-status">
          <div className="auth-status__icon auth-status__icon--warning"><i className="bi bi-clock-history" /></div>
          <h2 className="auth-status__title">Session expir&eacute;e</h2>
          <p className="auth-status__text">Votre session a expir&eacute;. Veuillez vous reconnecter.</p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin}>
            Se reconnecter
          </button>
        </div>
      </AuthCard>
    </AuthShell>
  );
};

export default SessionExpiredPage;
