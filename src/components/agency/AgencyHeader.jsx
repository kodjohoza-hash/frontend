import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import useAuth from '@hooks/useAuth';

const AgencyHeader = ({ onToggleSidebar, onLogout }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const firstName = user?.firstName || 'Admin';
  const lastName = user?.lastName || 'Guillaume';
  const initials = (firstName?.[0] || '') + (lastName?.[0] || '');

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const breadcrumbMap = {
    '/company/dashboard': 'Tableau de bord',
    '/company/trips': 'Voyages',
    '/company/bookings': 'Réservations',
    '/company/buses': 'Bus',
    '/company/drivers': 'Chauffeurs',
    '/company/counters': 'Agents de guichet',
    '/company/outlets': 'Points de vente',
    '/company/schedules': 'Horaires',
    '/company/pricing': 'Tarifs',
    '/company/clients': 'Clients',
    '/company/payments': 'Paiements',
    '/company/reports': 'Rapports',
    '/company/notifications': 'Notifications',
    '/company/messages': 'Messagerie',
    '/company/settings': 'Paramètres',
    '/company/support': 'Centre d\'aide',
  };

  const pageName = breadcrumbMap[location.pathname] || 'Tableau de bord';

  const mockNotifs = [
    { id: 1, title: 'Nouvelle réservation', message: 'BK-2026-1847 — Douala → Yaoundé', time: '5min', unread: true },
    { id: 2, title: 'Paiement reçu', message: '8 500 FCFA — BK-2026-1845', time: '12min', unread: true },
    { id: 3, title: 'Alerte bus', message: 'Standard-02 en maintenance', time: '3h', unread: false },
  ];

  const unreadCount = mockNotifs.filter((n) => n.unread).length;

  return (
    <header className="ag-header">
      <div className="ag-header__left">
        <button type="button" className="ag-header__menu-btn" onClick={onToggleSidebar}>
          <i className="bi bi-list" />
        </button>
        <nav className="ag-header__breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/company/dashboard" className="ag-header__breadcrumb-home">
            <i className="bi bi-house" />
          </Link>
          <i className="bi bi-chevron-right ag-header__breadcrumb-sep" />
          <span className="ag-header__breadcrumb-current">{pageName}</span>
        </nav>
      </div>

      <div className="ag-header__right">
        <div className={clsx('ag-header__search', searchOpen && 'ag-header__search--open')}>
          <button type="button" className="ag-header__icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
            <i className="bi bi-search" />
          </button>
          {searchOpen && (
            <div className="ag-header__search-form">
              <i className="bi bi-search ag-header__search-icon" />
              <input
                type="text"
                className="ag-header__search-input"
                placeholder="Rechercher un voyage, client..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus
              />
              <button type="button" className="ag-header__search-close" onClick={() => { setSearchOpen(false); setSearchValue(''); }}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
          )}
        </div>

        <Link to="/company/messages" className="ag-header__icon-btn" title="Messagerie">
          <i className="bi bi-chat-dots" />
          <span className="ag-header__badge">2</span>
        </Link>

        <div className="ag-header__notif-wrapper" ref={notifRef}>
          <button
            type="button"
            className={clsx('ag-header__icon-btn', notifOpen && 'ag-header__icon-btn--active')}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          >
            <i className="bi bi-bell" />
            {unreadCount > 0 && <span className="ag-header__badge">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="ag-header__dropdown ag-header__dropdown--notif">
              <div className="ag-header__dropdown-header">
                <span className="ag-header__dropdown-title">Notifications</span>
                {unreadCount > 0 && <span className="ag-header__dropdown-count">{unreadCount}</span>}
              </div>
              <div className="ag-header__dropdown-list">
                {mockNotifs.map((n) => (
                  <div key={n.id} className={clsx('ag-header__notif-item', n.unread && 'ag-header__notif-item--unread')}>
                    <div className="ag-header__notif-body">
                      <span className="ag-header__notif-title">{n.title}</span>
                      <span className="ag-header__notif-msg">{n.message}</span>
                      <span className="ag-header__notif-time">Il y a {n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="ag-header__dropdown-footer" onClick={() => { navigate('/company/notifications'); setNotifOpen(false); }}>
                <i className="bi bi-bell" /> Voir toutes les notifications
              </button>
            </div>
          )}
        </div>

        <div className="ag-header__profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className={clsx('ag-header__profile-btn', profileOpen && 'ag-header__profile-btn--active')}
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
          >
            <div className="ag-header__avatar">{initials}</div>
            <div className="ag-header__profile-info">
              <span className="ag-header__profile-name">{firstName} {lastName}</span>
              <span className="ag-header__profile-role">Administrateur</span>
            </div>
            <i className={clsx('bi', profileOpen ? 'bi-chevron-up' : 'bi-chevron-down', 'ag-header__profile-arrow')} />
          </button>
          {profileOpen && (
            <div className="ag-header__dropdown ag-header__dropdown--profile">
              <div className="ag-header__dropdown-profile-top">
                <div className="ag-header__avatar ag-header__avatar--lg">{initials}</div>
                <div>
                  <span className="ag-header__dropdown-profile-name">{firstName} {lastName}</span>
                  <span className="ag-header__dropdown-profile-email">{user?.email || 'admin@guillaume-express.cm'}</span>
                </div>
              </div>
              <div className="ag-header__dropdown-divider" />
              <button type="button" className="ag-header__dropdown-item" onClick={() => { navigate('/company/settings'); setProfileOpen(false); }}>
                <i className="bi bi-person" /> Mon profil
              </button>
              <button type="button" className="ag-header__dropdown-item" onClick={() => { navigate('/company/settings'); setProfileOpen(false); }}>
                <i className="bi bi-gear" /> Paramètres
              </button>
              <div className="ag-header__dropdown-divider" />
              <button type="button" className="ag-header__dropdown-item ag-header__dropdown-item--danger" onClick={onLogout}>
                <i className="bi bi-box-arrow-right" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AgencyHeader;
