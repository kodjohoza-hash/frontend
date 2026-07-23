import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import useAuth from '@hooks/useAuth';
import { notifications as initialNotifications } from '@data/notificationsData';

const DbHeader = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    initialNotifications.sort((a, b) => new Date(b.date) - new Date(a.date))
  );
  const [bellBounce, setBellBounce] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const firstName = user?.firstName || '';
  const initials = (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '');
  const unreadCount = notifications.filter((n) => !n.read).length;

  const triggerBellBounce = useCallback(() => {
    setBellBounce(true);
    setTimeout(() => setBellBounce(false), 600);
  }, []);

  useEffect(() => {
    const timer = setTimeout(triggerBellBounce, 1200);
    return () => clearTimeout(timer);
  }, [triggerBellBounce]);

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
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin}min`;
    const diffH = Math.floor(diffMs / 3600000);
    if (diffH < 24) return `Il y a ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return 'Hier';
    if (diffD < 7) return `Il y a ${diffD}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const notifColorMap = {
    success: 'success',
    danger: 'danger',
    warning: 'warning',
    info: 'info',
    accent: 'accent',
    muted: 'muted',
  };

  const dropdownNotifs = notifications.slice(0, 5);

  return (
    <header className="db-header">
      <div className="db-header__left">
        <button type="button" className="db-header__menu-btn" onClick={onToggleSidebar}>
          <i className="bi bi-list" />
        </button>
        <div className="db-header__greeting">
          <h1 className="db-header__title">{greeting()}, {firstName}</h1>
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

        <button
          type="button"
          className="db-header__icon-btn"
          onClick={() => navigate('/client/messages')}
          title="Messages"
        >
          <i className="bi bi-chat-dots" />
        </button>

        <div className="db-header__notif-wrapper" ref={notifRef}>
          <button
            type="button"
            className={clsx(
              'db-header__icon-btn',
              notifOpen && 'db-header__icon-btn--active',
              bellBounce && 'db-header__icon-btn--bounce'
            )}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
          >
            <i className="bi bi-bell" />
            {unreadCount > 0 && (
              <span className={clsx('db-header__badge', bellBounce && 'db-header__badge--pulse')}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="db-header__dropdown db-header__dropdown--notif">
              <div className="db-header__dropdown-header">
                <div className="db-header__dropdown-header-left">
                  <span className="db-header__dropdown-title">Notifications</span>
                  {unreadCount > 0 && <span className="db-header__dropdown-count">{unreadCount}</span>}
                </div>
                {unreadCount > 0 && (
                  <button type="button" className="db-header__notif-mark-all" onClick={handleMarkAllRead}>
                    <i className="bi bi-check-all" />
                    Tout lire
                  </button>
                )}
              </div>
              <div className="db-header__dropdown-list">
                {dropdownNotifs.length === 0 && (
                  <div className="db-header__notif-empty">
                    <i className="bi bi-bell-slash" />
                    <span>Aucune notification</span>
                  </div>
                )}
                {dropdownNotifs.map((n) => {
                  const color = notifColorMap[n.color] || 'info';
                  return (
                    <div
                      key={n.id}
                      className={clsx('db-header__notif-item', !n.read && 'db-header__notif-item--unread')}
                      onClick={() => {
                        if (n.actionPath) {
                          navigate(n.actionPath);
                          setNotifOpen(false);
                        }
                      }}
                    >
                      {!n.read && <span className="db-header__notif-dot-left" />}
                      <div className={clsx('db-header__notif-icon', `db-header__notif-icon--${color}`)}>
                        <i className={clsx('bi', n.icon)} />
                      </div>
                      <div className="db-header__notif-body">
                        <span className="db-header__notif-title">{n.title}</span>
                        <span className="db-header__notif-msg">{n.message}</span>
                        <span className="db-header__notif-time">{formatTime(n.date)}</span>
                      </div>
                      <div className="db-header__notif-actions">
                        {!n.read && (
                          <button
                            type="button"
                            className="db-header__notif-action-btn"
                            title="Marquer comme lu"
                            onClick={(e) => handleMarkRead(e, n.id)}
                          >
                            <i className="bi bi-check-lg" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="db-header__notif-action-btn db-header__notif-action-btn--delete"
                          title="Supprimer"
                          onClick={(e) => handleDelete(e, n.id)}
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                className="db-header__dropdown-footer"
                onClick={() => { navigate('/client/notifications'); setNotifOpen(false); }}
              >
                <i className="bi bi-bell" />
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
              {user?.avatar ? (
                <img src={user.avatar} alt={firstName} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="db-header__profile-info">
              <span className="db-header__profile-name">{user?.firstName} {user?.lastName}</span>
              <span className="db-header__profile-tier">{user?.role === 'client' ? 'Voyageur' : user?.role === 'super_admin' ? 'Administrateur' : user?.role === 'company_admin' ? 'Compagnie' : 'Guichet'}</span>
            </div>
            <i className="bi bi-chevron-down db-header__profile-arrow" />
          </button>
          {profileOpen && (
            <div className="db-header__dropdown db-header__dropdown--profile">
              <div className="db-header__dropdown-profile-top">
                <div className="db-header__avatar db-header__avatar--lg">
                  {user?.avatar ? <img src={user.avatar} alt={firstName} /> : <span>{initials}</span>}
                </div>
                <div>
                  <span className="db-header__dropdown-profile-name">{user?.firstName} {user?.lastName}</span>
                  <span className="db-header__dropdown-profile-email">{user?.email}</span>
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
              <button type="button" className="db-header__dropdown-item db-header__dropdown-item--danger" onClick={handleLogout}>
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
