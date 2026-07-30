import { useState, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '@components/admin/AdminSidebar';
import AdminHeader from '@components/admin/AdminHeader';
import useAuth from '@hooks/useAuth';
import DevBanner from '@components/dev/DevBanner';
import '@assets/styles/admin-dashboard.css';

const SuperAdminLayout = () => {
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
    <div className="adm-layout">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} onLogout={openLogout} mobileOpen={sidebarOpen} />
      {sidebarOpen && <div className="adm-overlay is-open" onClick={() => setSidebarOpen(false)} />}
      <div className={`adm-layout__main ${sidebarCollapsed ? 'adm-layout__main--collapsed' : ''}`}>
        <AdminHeader onToggleSidebar={toggleSidebar} onLogout={openLogout} />
        <main className="adm-layout__content">
          <Outlet />
        </main>
      </div>

      {showLogoutModal && (
        <div className="adm-overlay" onClick={closeLogout}>
          <div className="adm-logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-logout-modal__body">
              <div className="adm-logout-modal__icon"><i className="bi bi-box-arrow-right" /></div>
              <h3 className="adm-logout-modal__title">Se déconnecter ?</h3>
              <p className="adm-logout-modal__desc">
                Vous serez redirigé vers la page de connexion. Toute session active sera terminée.
              </p>
            </div>
            <div className="adm-logout-modal__actions">
              <button type="button" className="adm-logout-modal__btn adm-logout-modal__btn--cancel" onClick={closeLogout} disabled={isLoggingOut}>
                Annuler
              </button>
              <button type="button" className="adm-logout-modal__btn adm-logout-modal__btn--confirm" onClick={confirmLogout} disabled={isLoggingOut}>
                {isLoggingOut ? (<><span className="adm-logout-modal__spinner" /> Déconnexion...</>) : (<><i className="bi bi-box-arrow-right" /> Oui, déconnexion</>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminLayout;
