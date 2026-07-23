import { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import useAuth from '@hooks/useAuth';
import AppLogo from '@components/common/AppLogo';

/**
 * MobileMenu — Menu mobile overlay avec animation
 */
const MobileMenu = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div
        className="mobile-menu-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Menu de navigation"
        aria-modal="true"
      >
        <div className="mobile-menu-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <Link to="/" className="text-decoration-none d-flex align-items-center" onClick={onClose}>
            <AppLogo size={32} variant="horizontal" textClassName="fw-bold text-primary" />
          </Link>
          <button
            className="btn btn-link text-dark p-1"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <i className="bi bi-x-lg fs-5" />
          </button>
        </div>

        <nav className="mobile-menu-nav p-3">
          <ul className="nav flex-column gap-1">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={onClose}>
                <i className="bi bi-house me-2" />Accueil
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/booking" onClick={onClose}>
                <i className="bi bi-ticket-perforated me-2" />Réservation
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/notifications" onClick={onClose}>
                    <i className="bi bi-bell me-2" />Notifications
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={onClose}>
                    <i className="bi bi-person me-2" />Profil
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/settings" onClick={onClose}>
                    <i className="bi bi-gear me-2" />Paramètres
                  </Link>
                </li>
                <li className="border-top my-2" />
                <li className="nav-item">
                  <button
                    className="nav-link text-danger w-100 text-start"
                    onClick={() => {
                      onClose();
                      logout();
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2" />Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="border-top my-2" />
                <li className="nav-item">
                  <Link className="btn btn-primary w-100 mb-2" to="/login" onClick={onClose}>
                    Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-primary w-100" to="/register" onClick={onClose}>
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {isAuthenticated && user && (
          <div className="mobile-menu-user p-3 border-top mt-auto">
            <div className="d-flex align-items-center gap-3">
              <div className="navbar-avatar">
                {user.firstName?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="fw-semibold small">{user.firstName} {user.lastName}</div>
                <small className="text-muted">{user.email}</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
