import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import useAuth from '@hooks/useAuth';
import AppLogo from '@components/common/AppLogo';
import { ROUTES } from '@routes/routeConstants';
import '@assets/styles/booking-header.css';

const NAV_LINKS = [
  { label: 'Accueil', to: ROUTES.HOME },
  { label: 'Rechercher', to: ROUTES.BOOKING_SEARCH },
  { label: 'Mes réservations', to: ROUTES.CLIENT_BOOKINGS },
  { label: 'Support', to: ROUTES.CLIENT_SUPPORT },
];

const PROFILE_MENU = [
  { icon: 'bi-person', label: 'Mon profil', to: '/client/profile' },
  { icon: 'bi-ticket-perforated', label: 'Mes réservations', to: '/client/bookings' },
  { icon: 'bi-postcard', label: 'Mes billets', to: '/client/tickets' },
  { icon: 'bi-bell', label: 'Notifications', to: '/notifications' },
  { icon: 'bi-gear', label: 'Paramètres', to: '/client/settings' },
];

const BookingHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '');

  const roleLabel = useCallback(() => {
    const r = user?.role;
    if (r === 'super_admin') return 'Administrateur';
    if (r === 'company_admin') return 'Compagnie';
    if (r === 'counter_agent') return 'Guichet';
    return 'Voyageur';
  }, [user?.role]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleProfileToggle = () => {
    setProfileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    logout(undefined, {
      onSettled: () => navigate(ROUTES.HOME, { replace: true }),
    });
  };

  const isNavLinkActive = (to) => {
    if (to === ROUTES.HOME) return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <header className={clsx('bh-header', scrolled && 'bh-header--scrolled')}>
        <div className="bh-header__inner">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="bh-header__brand" aria-label="Bus Tix Connect - Accueil">
            <AppLogo size={34} variant="horizontal" textClassName="bh-header__brand-text" />
          </Link>

          {/* Desktop Nav */}
          <nav className="bh-header__nav d-none d-lg-flex" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to + link.label}
                to={link.to}
                className={clsx('bh-header__nav-link', isNavLinkActive(link.to) && 'is-active')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="bh-header__actions d-none d-lg-flex">
            <Link to={ROUTES.BOOKING_SEARCH} className="bh-header__icon-btn" title="Rechercher">
              <i className="bi bi-search" />
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="bh-header__icon-btn" title="Notifications">
                  <i className="bi bi-bell" />
                  <span className="bh-header__badge">3</span>
                </Link>

                <Link to="/client/messages" className="bh-header__icon-btn" title="Messages">
                  <i className="bi bi-chat-dots" />
                  <span className="bh-header__badge">2</span>
                </Link>

                <div className="bh-header__profile" ref={profileRef}>
                  <button
                    type="button"
                    className={clsx('bh-header__profile-btn', profileOpen && 'is-open')}
                    onClick={handleProfileToggle}
                    aria-expanded={profileOpen}
                    aria-label="Menu utilisateur"
                  >
                    <div className="bh-header__avatar">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={firstName} />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="bh-header__profile-info">
                      <span className="bh-header__profile-name">{firstName} {lastName}</span>
                      <span className="bh-header__profile-role">{roleLabel()}</span>
                    </div>
                    <i className={clsx('bi', profileOpen ? 'bi-chevron-up' : 'bi-chevron-down', 'bh-header__profile-chevron')} />
                  </button>

                  {profileOpen && (
                    <div className="bh-header__dropdown">
                      <div className="bh-header__dropdown-top">
                        <div className="bh-header__avatar bh-header__avatar--lg">
                          {user?.avatar ? <img src={user.avatar} alt={firstName} /> : <span>{initials}</span>}
                        </div>
                        <div className="bh-header__dropdown-user">
                          <span className="bh-header__dropdown-name">{firstName} {lastName}</span>
                          <span className="bh-header__dropdown-email">{user?.email}</span>
                        </div>
                      </div>
                      <div className="bh-header__dropdown-divider" />
                      {PROFILE_MENU.map((item) => (
                        <Link
                          key={item.to + item.label}
                          to={item.to}
                          className="bh-header__dropdown-item"
                          onClick={() => setProfileOpen(false)}
                        >
                          <i className={`bi ${item.icon}`} />
                          {item.label}
                        </Link>
                      ))}
                      <div className="bh-header__dropdown-divider" />
                      <button type="button" className="bh-header__dropdown-item bh-header__dropdown-item--danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="bh-header__btn bh-header__btn--outline">
                  Connexion
                </Link>
                <Link to="/register" className="bh-header__btn bh-header__btn--solid">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="bh-header__hamburger d-lg-none"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <i className="bi bi-list" />
          </button>
        </div>
      </header>

      {/* Mobile Offcanvas */}
      <div
        className={clsx('bh-overlay', mobileOpen && 'is-open')}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <aside
        className={clsx('bh-mobile', mobileOpen && 'is-open')}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        <div className="bh-mobile__header">
          <Link to="/" className="bh-header__brand" onClick={() => setMobileOpen(false)}>
            <AppLogo size={30} variant="horizontal" textClassName="bh-header__brand-text" />
          </Link>
          <button className="bh-mobile__close" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className="bh-mobile__nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className={clsx('bh-mobile__link', isNavLinkActive(link.to) && 'is-active')}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {isAuthenticated && (
          <div className="bh-mobile__section">
            <span className="bh-mobile__section-title">Compte</span>
            {PROFILE_MENU.map((item) => (
              <Link
                key={item.to + item.label}
                to={item.to}
                className="bh-mobile__link"
                onClick={() => setMobileOpen(false)}
              >
                <i className={`bi ${item.icon}`} />
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div className="bh-mobile__footer">
          {isAuthenticated ? (
            <>
              <div className="bh-mobile__user">
                <div className="bh-header__avatar bh-header__avatar--lg">
                  {user?.avatar ? <img src={user.avatar} alt={firstName} /> : <span>{initials}</span>}
                </div>
                <div>
                  <div className="bh-mobile__user-name">{firstName} {lastName}</div>
                  <div className="bh-mobile__user-role">{roleLabel()}</div>
                </div>
              </div>
              <button type="button" className="bh-header__btn bh-header__btn--outline w-100" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link className="bh-header__btn bh-header__btn--solid w-100 mb-2" to="/login" onClick={() => setMobileOpen(false)}>
                Connexion
              </Link>
              <Link className="bh-header__btn bh-header__btn--outline w-100" to="/register" onClick={() => setMobileOpen(false)}>
                Inscription
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default BookingHeader;
