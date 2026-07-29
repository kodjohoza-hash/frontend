import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import useAuth from '@hooks/useAuth';
import AppLogo from '@components/common/AppLogo';

const CounterHeader = ({ onToggleSidebar, onLogout }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const firstName = user?.firstName || 'Marie';
  const lastName = user?.lastName || 'Kamga';
  const initials = (firstName?.[0] || 'M') + (lastName?.[0] || 'K');

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const breadcrumbMap = {
    '/counter/dashboard': 'Tableau de bord',
    '/counter/sale': 'Nouvelle vente',
    '/counter/bookings': 'Réservations',
    '/counter/tickets': 'Billets',
    '/counter/profile': 'Mon profil',
  };

  const pageName = breadcrumbMap[location.pathname] || 'Tableau de bord';

  const mockNotifs = [
    { id: 1, title: 'Voyage complet', message: 'TR-012 Yaoundé → Kribi — Complet', time: '10min', unread: true },
    { id: 2, title: 'Paiement reçu', message: '12 500 FCFA — BK-2026-1885', time: '25min', unread: true },
    { id: 3, title: 'Rappel départ', message: 'TR-010 Yaoundé → Douala dans 30min', time: '1h', unread: false },
  ];

  const unreadCount = mockNotifs.filter((n) => n.unread).length;

  return (
    <header className="act-header">
      <div className="act-header__left">
        <button type="button" className="act-header__menu-btn" onClick={onToggleSidebar}>
          <i className="bi bi-list" />
        </button>
        <Link to="/counter/dashboard" className="act-header__logo-link">
          <AppLogo size={26} variant="icon-only" />
        </Link>
        <nav className="act-header__breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/counter/dashboard" className="act-header__breadcrumb-home">
            <i className="bi bi-house" />
          </Link>
          <i className="bi bi-chevron-right act-header__breadcrumb-sep" />
          <span className="act-header__breadcrumb-current">{pageName}</span>
        </nav>
      </div>

      <div className="act-header__right">
        <Link to="/counter/profile" className="act-header__icon-btn" title="Messagerie">
          <i className="bi bi-chat-dots" />
          <span className="act-header__badge">2</span>
        </Link>

        <div className="act-header__profile-wrapper" ref={notifRef}>
          <button
            type="button"
            className={clsx('act-header__icon-btn', notifOpen && 'act-header__icon-btn--active')}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          >
            <i className="bi bi-bell" />
            {unreadCount > 0 && <span className="act-header__badge">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="act-header__dropdown act-header__dropdown--notif">
              <div className="act-header__dropdown-header">
                <span className="act-header__dropdown-title">Notifications</span>
                {unreadCount > 0 && <span className="act-header__dropdown-count">{unreadCount}</span>}
              </div>
              <div className="act-header__dropdown-list">
                {mockNotifs.map((n) => (
                  <div key={n.id} className={clsx('act-header__notif-item', n.unread && 'act-header__notif-item--unread')}>
                    <div className="act-header__notif-body">
                      <span className="act-header__notif-title">{n.title}</span>
                      <span className="act-header__notif-msg">{n.message}</span>
                      <span className="act-header__notif-time">Il y a {n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="act-header__dropdown-footer" onClick={() => setNotifOpen(false)}>
                <i className="bi bi-bell" /> Voir toutes les notifications
              </button>
            </div>
          )}
        </div>

        <div className="act-header__profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className={clsx('act-header__profile-btn', profileOpen && 'act-header__profile-btn--active')}
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
          >
            <div className="act-header__avatar">{initials}</div>
            <div className="act-header__profile-info">
              <span className="act-header__profile-name">{firstName} {lastName}</span>
              <span className="act-header__profile-role">Agent de guichet</span>
            </div>
            <i className={clsx('bi', profileOpen ? 'bi-chevron-up' : 'bi-chevron-down', 'act-header__profile-arrow')} />
          </button>
          {profileOpen && (
            <div className="act-header__dropdown act-header__dropdown--profile">
              <div className="act-header__dropdown-profile-top">
                <div className="act-header__avatar act-header__avatar--lg">{initials}</div>
                <div>
                  <span className="act-header__dropdown-profile-name">{firstName} {lastName}</span>
                  <span className="act-header__dropdown-profile-email">{user?.email || 'marie.kamga@express-bus.cm'}</span>
                </div>
              </div>
              <div className="act-header__dropdown-divider" />
              <button type="button" className="act-header__dropdown-item" onClick={() => { navigate('/counter/profile'); setProfileOpen(false); }}>
                <i className="bi bi-person" /> Mon profil
              </button>
              <div className="act-header__dropdown-divider" />
              <button type="button" className="act-header__dropdown-item act-header__dropdown-item--danger" onClick={onLogout}>
                <i className="bi bi-box-arrow-right" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CounterHeader;
