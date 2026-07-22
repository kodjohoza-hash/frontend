import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { user, notifications as allNotifications } from '@data/clientDashboard';

const DbHeader = ({ onToggleSidebar }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffH = Math.floor(diffMs / 3600000);
    if (diffH < 1) return "À l'instant";
    if (diffH < 24) return `Il y a ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return 'Hier';
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/booking/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <header className="db-header">
      <div className="db-header__left">
        <button type="button" className="db-header__menu-btn" onClick={onToggleSidebar}>
          <i className="bi bi-list" />
        </button>
        <div className="db-header__greeting">
          <h1 className="db-header__title">{greeting()}, {user.firstName}</h1>
          <p className="db-header__subtitle">Que souhaitez-vous faire aujourd'hui ?</p>
        </div>
      </div>

      <div className="db-header__right">
        <div className={clsx('db-header__search', searchOpen && 'db-header__search--open')} ref={searchRef}>
          <button
            type="button"
            className="db-header__search-toggle"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 150);
            }}
          >
            <i className="bi bi-search" />
          </button>
          {searchOpen && (
            <form className="db-header__search-form" onSubmit={handleSearchSubmit}>
              <i className="bi bi-search db-header__search-icon" />
              <input
                type="text"
                className="db-header__search-input"
                placeholder="Rechercher un trajet, une ville..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus
              />
              <button type="button" className="db-header__search-close" onClick={() => { setSearchOpen(false); setSearchValue(''); }}>
                <i className="bi bi-x-lg" />
              </button>
            </form>
          )}
        </div>

        <div className="db-header__notif-wrapper" ref={notifRef}>
          <button
            type="button"
            className={clsx('db-header__icon-btn', notifOpen && 'db-header__icon-btn--active')}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          >
            <i className="bi bi-bell" />
            {unreadCount > 0 && <span className="db-header__badge">{unreadCount}</span>}
          </button>
          {notifOpen && (
            <div className="db-header__dropdown db-header__dropdown--notif">
              <div className="db-header__dropdown-header">
                <span className="db-header__dropdown-title">Notifications</span>
                {unreadCount > 0 && <span className="db-header__dropdown-count">{unreadCount} nouvelles</span>}
              </div>
              <div className="db-header__dropdown-list">
                {allNotifications.slice(0, 5).map((n) => (
                  <div key={n.id} className={clsx('db-header__notif-item', !n.read && 'db-header__notif-item--unread')}>
                    <div className={clsx('db-header__notif-icon', `db-header__notif-icon--${n.type}`)}>
                      <i className={clsx('bi', n.icon)} />
                    </div>
                    <div className="db-header__notif-body">
                      <span className="db-header__notif-title">{n.title}</span>
                      <span className="db-header__notif-msg">{n.message}</span>
                      <span className="db-header__notif-time">{formatTime(n.date)}</span>
                    </div>
                    {!n.read && <span className="db-header__notif-dot" />}
                  </div>
                ))}
              </div>
              <button type="button" className="db-header__dropdown-footer" onClick={() => { navigate('/client/settings'); setNotifOpen(false); }}>
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>

        <div className="db-header__profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className={clsx('db-header__profile-btn', profileOpen && 'db-header__profile-btn--active')}
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
          >
            <div className="db-header__avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.firstName} />
              ) : (
                <span>{user.initials}</span>
              )}
            </div>
            <div className="db-header__profile-info">
              <span className="db-header__profile-name">{user.firstName} {user.lastName}</span>
              <span className="db-header__profile-tier">{user.loyaltyTier} • {user.loyaltyPoints.toLocaleString()} pts</span>
            </div>
            <i className="bi bi-chevron-down db-header__profile-arrow" />
          </button>
          {profileOpen && (
            <div className="db-header__dropdown db-header__dropdown--profile">
              <div className="db-header__dropdown-profile-top">
                <div className="db-header__avatar db-header__avatar--lg">
                  {user.avatar ? <img src={user.avatar} alt={user.firstName} /> : <span>{user.initials}</span>}
                </div>
                <div>
                  <span className="db-header__dropdown-profile-name">{user.firstName} {user.lastName}</span>
                  <span className="db-header__dropdown-profile-email">{user.email}</span>
                </div>
              </div>
              <div className="db-header__dropdown-divider" />
              <button type="button" className="db-header__dropdown-item" onClick={() => { navigate('/client/profile'); setProfileOpen(false); }}>
                <i className="bi bi-person" /> Mon profil
              </button>
              <button type="button" className="db-header__dropdown-item" onClick={() => { navigate('/client/settings'); setProfileOpen(false); }}>
                <i className="bi bi-gear" /> Paramètres
              </button>
              <div className="db-header__dropdown-divider" />
              <button type="button" className="db-header__dropdown-item db-header__dropdown-item--danger">
                <i className="bi bi-box-arrow-right" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DbHeader;
