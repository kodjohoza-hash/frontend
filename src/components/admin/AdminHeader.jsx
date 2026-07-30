import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import useAuth from '@hooks/useAuth';
import AppLogo from '@components/common/AppLogo';
import { notifications, conversations } from '@data/adminData';

const AdminHeader = ({ onToggleSidebar, onLogout }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const firstName = user?.firstName || 'Kodjo';
  const lastName = user?.lastName || 'Jojo';
  const initials = (firstName?.[0] || 'K') + (lastName?.[0] || 'J');

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const breadcrumbMap = {
    '/super-admin/dashboard': 'Tableau de bord',
    '/super-admin/companies': 'Compagnies',
    '/super-admin/users': 'Utilisateurs',
    '/super-admin/roles': 'Rôles',
    '/super-admin/reports': 'Rapports',
    '/super-admin/settings': 'Paramètres',
  };

  const pageName = breadcrumbMap[location.pathname] || 'Tableau de bord';
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="adm-header">
      <div className="adm-header__left">
        <button type="button" className="adm-header__menu-btn" onClick={onToggleSidebar}>
          <i className="bi bi-list" />
        </button>
        <Link to="/super-admin/dashboard" className="adm-header__logo-link">
          <AppLogo size={24} variant="icon-only" />
        </Link>
        <nav className="adm-header__breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/super-admin/dashboard" className="adm-header__breadcrumb-home">
            <i className="bi bi-house" />
          </Link>
          <i className="bi bi-chevron-right adm-header__breadcrumb-sep" />
          <span className="adm-header__breadcrumb-current">{pageName}</span>
        </nav>
      </div>

      <div className="adm-header__right">
        <div className="adm-header__profile-wrapper" ref={notifRef}>
          <button
            type="button"
            className={clsx('adm-header__icon-btn', notifOpen && 'adm-header__icon-btn--active')}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          >
            <i className="bi bi-bell" />
            {unreadCount > 0 && <span className="adm-header__badge">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="adm-header__dropdown adm-header__dropdown--notif">
              <div className="adm-header__dropdown-header">
                <span className="adm-header__dropdown-title">Notifications</span>
                {unreadCount > 0 && <span className="adm-header__dropdown-count">{unreadCount}</span>}
              </div>
              <div className="adm-header__dropdown-list">
                {notifications.map((n) => (
                  <div key={n.id} className={clsx('adm-header__notif-item', n.unread && 'adm-header__notif-item--unread')}>
                    <div className={`adm-header__notif-dot adm-header__notif-dot--${n.color}`} style={{ background: `var(--adm-${n.color})` }} />
                    <div className="adm-header__notif-body">
                      <span className="adm-header__notif-title">{n.title}</span>
                      <span className="adm-header__notif-msg">{n.message}</span>
                      <span className="adm-header__notif-time">Il y a {n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="adm-header__dropdown-footer" onClick={() => setNotifOpen(false)}>
                <i className="bi bi-bell" /> Voir toutes les notifications
              </button>
            </div>
          )}
        </div>

        <div className="adm-header__profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className={clsx('adm-header__profile-btn', profileOpen && 'adm-header__profile-btn--active')}
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
          >
            <div className="adm-header__avatar">{initials}</div>
            <div className="adm-header__profile-info">
              <span className="adm-header__profile-name">{firstName} {lastName}</span>
              <span className="adm-header__profile-role">Super Administrateur</span>
            </div>
            <i className={clsx('bi', profileOpen ? 'bi-chevron-up' : 'bi-chevron-down', 'adm-header__profile-arrow')} />
          </button>
          {profileOpen && (
            <div className="adm-header__dropdown adm-header__dropdown--profile">
              <div className="adm-header__dropdown-profile-top">
                <div className="adm-header__avatar adm-header__avatar--lg">{initials}</div>
                <div>
                  <span className="adm-header__dropdown-profile-name">{firstName} {lastName}</span>
                  <span className="adm-header__dropdown-profile-email">{user?.email || 'kodjo.jojo@bus-tix-connect.com'}</span>
                </div>
              </div>
              <div className="adm-header__dropdown-divider" />
              <button type="button" className="adm-header__dropdown-item" onClick={() => { navigate('/super-admin/settings'); setProfileOpen(false); }}>
                <i className="bi bi-gear" /> Paramètres
              </button>
              <div className="adm-header__dropdown-divider" />
              <button type="button" className="adm-header__dropdown-item adm-header__dropdown-item--danger" onClick={onLogout}>
                <i className="bi bi-box-arrow-right" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
