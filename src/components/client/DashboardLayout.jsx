import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DbSidebar from './DbSidebar';
import DbHeader from './DbHeader';
import useAuth from '@hooks/useAuth';

const DashboardLayout = ({ children }) => {
  const { logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }, []);

  const openLogout = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const closeLogout = useCallback(() => {
    if (!isLoggingOut) setShowLogoutModal(false);
  }, [isLoggingOut]);

  const confirmLogout = useCallback(() => {
    logout(undefined, {
      onSettled: () => {
        setShowLogoutModal(false);
        navigate('/login', { replace: true });
      },
    });
  }, [logout, navigate]);

  return (
    <div className="db-layout">
      <DbSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} onLogout={openLogout} />
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`db-layout__main ${sidebarCollapsed ? 'db-layout__main--collapsed' : ''}`}>
        <DbHeader onToggleSidebar={toggleSidebar} onLogout={openLogout} />
        <main className="db-layout__content">
          {children}
        </main>
      </div>

      {showLogoutModal && (
        <div className="db-logout-overlay" onClick={closeLogout}>
          <div className="db-logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="db-logout-modal__body">
              <div className="db-logout-modal__icon">
                <i className="bi bi-box-arrow-right" />
              </div>
              <h3 className="db-logout-modal__title">Se déconnecter ?</h3>
              <p className="db-logout-modal__desc">
                Vous serez redirigé vers la page de connexion. Toute session active sera terminée.
              </p>
            </div>
            <div className="db-logout-modal__actions">
              <button
                type="button"
                className="db-logout-modal__btn db-logout-modal__btn--cancel"
                onClick={closeLogout}
                disabled={isLoggingOut}
              >
                Annuler
              </button>
              <button
                type="button"
                className="db-logout-modal__btn db-logout-modal__btn--confirm"
                onClick={confirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <span className="db-logout-modal__spinner" />
                    Déconnexion...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-right" />
                    Oui, déconnexion
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
