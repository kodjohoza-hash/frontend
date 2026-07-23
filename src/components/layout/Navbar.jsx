import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import useAuth from '@hooks/useAuth';
import AppLogo from '@components/common/AppLogo';
import MobileMenu from './MobileMenu';

/**
 * Navbar — Barre de navigation principale réutilisable
 * Desktop: Logo + Menu + Actions
 * Mobile: Logo + Hamburger + MobileMenu
 */
const Navbar = ({ variant = 'default', className = '' }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isDark = variant === 'dark';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  return (
    <>
      <nav
        className={clsx(
          'btc-navbar',
          'navbar',
          'navbar-expand-lg',
          'sticky-top',
          isDark ? 'navbar-dark bg-primary-custom' : 'navbar-light bg-white border-bottom',
          className
        )}
        style={{ height: 'var(--header-height)', zIndex: 'var(--z-sticky)' }}
      >
        <div className="container-fluid px-3 px-lg-4">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center text-decoration-none" to="/">
            <AppLogo size={32} variant="horizontal" textClassName="fw-bold d-none d-sm-inline" />
          </Link>

          {/* Desktop Nav */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav ms-auto align-items-center gap-1">
              {!isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/booking">Réservation</Link>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <Link className="btn btn-outline-primary btn-sm" to="/login">Connexion</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-accent btn-sm" to="/register">Inscription</Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/notifications" aria-label="Notifications">
                      <i className="bi bi-bell fs-5" />
                    </Link>
                  </li>
                  <li className="nav-item dropdown position-relative" ref={dropdownRef}>
                    <button
                      className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      aria-expanded={userMenuOpen}
                      aria-label="Menu utilisateur"
                    >
                      <div className="navbar-avatar">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <span className="d-none d-md-inline small fw-medium">
                        {user?.firstName || 'Utilisateur'}
                      </span>
                    </button>
                    {userMenuOpen && (
                      <div className="dropdown-menu dropdown-menu-end show">
                        <div className="dropdown-header">
                          <div className="fw-semibold">{user?.firstName} {user?.lastName}</div>
                          <small className="text-muted">{user?.email}</small>
                        </div>
                        <div className="dropdown-divider" />
                        <Link className="dropdown-item" to="/profile" onClick={() => setUserMenuOpen(false)}>
                          <i className="bi bi-person me-2" />Profil
                        </Link>
                        <Link className="dropdown-item" to="/settings" onClick={() => setUserMenuOpen(false)}>
                          <i className="bi bi-gear me-2" />Paramètres
                        </Link>
                        <div className="dropdown-divider" />
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                        >
                          <i className="bi bi-box-arrow-right me-2" />Déconnexion
                        </button>
                      </div>
                    )}
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="navbar-toggler border-0 p-2"
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <i className="bi bi-list fs-4" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
