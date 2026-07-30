import { useState, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import CounterSidebar from '@components/counter/CounterSidebar';
import CounterHeader from '@components/counter/CounterHeader';
import useAuth from '@hooks/useAuth';
import DevBanner from '@components/dev/DevBanner';

const CounterLayout = () => {
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
    <div className="act-layout">
      <CounterSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} onLogout={openLogout} mobileOpen={sidebarOpen} />
      {sidebarOpen && <div className="act-overlay is-open" onClick={() => setSidebarOpen(false)} />}
      <div className={`act-layout__main ${sidebarCollapsed ? 'act-layout__main--collapsed' : ''}`}>
        <DevBanner />
        <CounterHeader onToggleSidebar={toggleSidebar} onLogout={openLogout} />
        <main className="act-layout__content">
          <Outlet />
        </main>
      </div>

      {showLogoutModal && (
        <div className="act-logout-overlay" onClick={closeLogout}>
          <div className="act-logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="act-logout-modal__body">
              <div className="act-logout-modal__icon"><i className="bi bi-box-arrow-right" /></div>
              <h3 className="act-logout-modal__title">Se déconnecter ?</h3>
              <p className="act-logout-modal__desc">
                Vous serez redirigé vers la page de connexion. Toute session active sera terminée.
              </p>
            </div>
            <div className="act-logout-modal__actions">
              <button type="button" className="act-logout-modal__btn act-logout-modal__btn--cancel" onClick={closeLogout} disabled={isLoggingOut}>
                Annuler
              </button>
              <button type="button" className="act-logout-modal__btn act-logout-modal__btn--confirm" onClick={confirmLogout} disabled={isLoggingOut}>
                {isLoggingOut ? (<><span className="act-logout-modal__spinner" /> Déconnexion...</>) : (<><i className="bi bi-box-arrow-right" /> Oui, déconnexion</>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterLayout;
