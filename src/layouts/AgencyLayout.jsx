import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AgencySidebar from '@components/agency/AgencySidebar';
import AgencyHeader from '@components/agency/AgencyHeader';
import useAuth from '@hooks/useAuth';

const AgencyLayout = ({ children }) => {
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

  const openLogout = useCallback(() => setShowLogoutModal(true), []);
  const closeLogout = useCallback(() => { if (!isLoggingOut) setShowLogoutModal(false); }, [isLoggingOut]);

  const confirmLogout = useCallback(() => {
    logout(undefined, {
      onSettled: () => {
        setShowLogoutModal(false);
        navigate('/login', { replace: true });
      },
    });
  }, [logout, navigate]);

  return (
    <div className="ag-layout">
      <AgencySidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} onLogout={openLogout} mobileOpen={sidebarOpen} />
      {sidebarOpen && <div className="ag-overlay is-open" onClick={() => setSidebarOpen(false)} />}
      <div className={`ag-layout__main ${sidebarCollapsed ? 'ag-layout__main--collapsed' : ''}`}>
        <AgencyHeader onToggleSidebar={toggleSidebar} onLogout={openLogout} />
        <main className="ag-layout__content">
          {children}
        </main>
      </div>

      {showLogoutModal && (
        <div className="ag-logout-overlay" onClick={closeLogout}>
          <div className="ag-logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ag-logout-modal__body">
              <div className="ag-logout-modal__icon"><i className="bi bi-box-arrow-right" /></div>
              <h3 className="ag-logout-modal__title">Se déconnecter ?</h3>
              <p className="ag-logout-modal__desc">
                Vous serez redirigé vers la page de connexion. Toute session active sera terminée.
              </p>
            </div>
            <div className="ag-logout-modal__actions">
              <button type="button" className="ag-logout-modal__btn ag-logout-modal__btn--cancel" onClick={closeLogout} disabled={isLoggingOut}>
                Annuler
              </button>
              <button type="button" className="ag-logout-modal__btn ag-logout-modal__btn--confirm" onClick={confirmLogout} disabled={isLoggingOut}>
                {isLoggingOut ? (<><span className="ag-logout-modal__spinner" /> Déconnexion...</>) : (<><i className="bi bi-box-arrow-right" /> Oui, déconnexion</>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyLayout;
