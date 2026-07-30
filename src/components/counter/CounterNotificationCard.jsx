import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import CounterNotificationPriority from './CounterNotificationPriority';
import CounterNotificationStatus from './CounterNotificationStatus';
import { formatDate, formatTime } from '@data/counterNotificationData';

const TYPE_COLORS = {
  booking: '#8B5CF6',
  payment: '#22C55E',
  trip: '#06B6D4',
  bus: '#F59E0B',
  driver: '#EC4899',
  agent: '#0B1D51',
  branch: '#14B8A6',
  system: '#6366F1',
  security: '#EF4444',
  document: '#F97316',
  marketing: '#FF6B35',
};

const ACTION_LABELS = {
  view: { icon: 'bi-eye', label: 'Voir' },
  mark_read: { icon: 'bi-envelope-open', label: 'Marquer comme lue' },
  mark_unread: { icon: 'bi-envelope', label: 'Marquer comme non lue' },
  pin: { icon: 'bi-pin', label: 'Épingler' },
  unpin: { icon: 'bi-pin-fill', label: 'Détacher' },
  archive: { icon: 'bi-archive', label: 'Archiver' },
  delete: { icon: 'bi-trash', label: 'Supprimer' },
  share: { icon: 'bi-share', label: 'Partager' },
  copy_link: { icon: 'bi-link', label: 'Copier le lien' },
  history: { icon: 'bi-clock-history', label: 'Historique' },
};

const CounterNotificationCard = ({ notification, onAction, onSelect, isSelected }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!notification) return null;

  const isUnread = notification.status === 'unread';
  const isPinned = notification.pinned;
  const typeColor = TYPE_COLORS[notification.category] || '#6B7280';

  const handleAction = (action) => {
    setMenuOpen(false);
    onAction?.(action, notification);
  };

  const visibleActions = (notification.actions || ['view', 'mark_read', 'pin', 'archive', 'delete']).filter(
    (a) => ACTION_LABELS[a]
  );

  return (
    <div
      className={clsx('acn-card', {
        'acn-card--unread': isUnread,
        'acn-card--selected': isSelected,
        'acn-card--pinned': isPinned,
      })}
      onClick={() => onSelect?.(notification.id)}
    >
      <div className="acn-card-left">
        <div className="acn-card-icon" style={{ background: `${typeColor}18`, color: typeColor }}>
          <i className="bi bi-bell" />
        </div>
      </div>

      <div className="acn-card-middle">
        <div className="acn-card-title-row">
          <div className={clsx('acn-card-title', { 'acn-card-title--unread': isUnread })}>
            {notification.title}
          </div>
          {isPinned && (
            <span className="acn-card-pin">
              <i className="bi bi-pin-fill" />
            </span>
          )}
        </div>
        <div className="acn-card-desc">{notification.description}</div>
        <div className="acn-card-meta">
          <i className="bi bi-clock" />
          <span>{formatDate(notification.date)} à {formatTime(notification.date)}</span>
          {notification.branch && (
            <>
              <i className="bi bi-geo-alt" />
              <span>{notification.branch}</span>
            </>
          )}
        </div>
      </div>

      <div className="acn-card-right">
        <div className="acn-card-badges">
          <CounterNotificationPriority priority={notification.priority} />
          <CounterNotificationStatus status={notification.status} />
        </div>
        <div className="acn-card-menu" ref={menuRef}>
          <button
            className="acn-card-menu-btn"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          >
            <i className="bi bi-three-dots-vertical" />
          </button>
          {menuOpen && (
            <div className="acn-card-menu-dropdown">
              {visibleActions.map((action) => (
                <button
                  key={action}
                  className="acn-card-menu-item"
                  onClick={(e) => { e.stopPropagation(); handleAction(action); }}
                >
                  <i className={clsx('bi', ACTION_LABELS[action].icon)} />
                  <span>{ACTION_LABELS[action].label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounterNotificationCard;
