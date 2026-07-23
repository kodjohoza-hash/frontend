import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { typeConfig } from '@data/notificationsData';

const NotificationDrawer = ({ notification, onClose, onMarkRead }) => {
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    if (notification && !notification.read) {
      onMarkRead(notification.id);
    }
  }, [notification, onMarkRead]);

  if (!notification) return null;

  const cfg = typeConfig[notification.type] || { color: 'muted', icon: 'bi-bell', label: 'Notification' };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const handleAction = () => {
    if (notification.actionPath) {
      navigate(notification.actionPath);
      onClose();
    }
  };

  const priorityLabel = { high: 'Haute', medium: 'Moyenne', low: 'Basse' };

  return (
    <div className="nf-drawer-overlay" onClick={onClose}>
      <div
        className="nf-drawer"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={notification.title}
      >
        <div className="nf-drawer__header">
          <div className="nf-drawer__header-left">
            <div className={clsx('nf-drawer__icon', `nf-drawer__icon--${cfg.color}`)}>
              <i className={clsx('bi', cfg.icon)} />
            </div>
            <div>
              <h3 className="nf-drawer__title">{notification.title}</h3>
              <span className="nf-drawer__type">{cfg.label}</span>
            </div>
          </div>
          <button
            type="button"
            className="nf-drawer__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="nf-drawer__body">
          <div className="nf-drawer__meta-row">
            <div className="nf-drawer__meta-item">
              <i className="bi bi-calendar3" />
              <span>{formatDate(notification.date)}</span>
            </div>
            <div className="nf-drawer__meta-item">
              <i className="bi bi-clock" />
              <span>{formatTime(notification.date)}</span>
            </div>
          </div>

          <div className="nf-drawer__meta-row">
            <div className="nf-drawer__meta-item">
              <i className="bi bi-flag" />
              <span>Priorité {priorityLabel[notification.priority]}</span>
            </div>
            {notification.company && (
              <div className="nf-drawer__meta-item">
                <i className="bi bi-building" />
                <span>{notification.company}</span>
              </div>
            )}
          </div>

          {notification.bookingRef && (
            <div className="nf-drawer__ref-badge">
              <i className="bi bi-ticket-perforated" />
              <span>{notification.bookingRef}</span>
            </div>
          )}

          <div className="nf-drawer__divider" />

          <div className="nf-drawer__content">
            <h4 className="nf-drawer__content-title">Message</h4>
            <p className="nf-drawer__content-text">{notification.message}</p>
          </div>

          {notification.detail && (
            <div className="nf-drawer__content">
              <h4 className="nf-drawer__content-title">Détails</h4>
              <p className="nf-drawer__content-text nf-drawer__content-text--detail">
                {notification.detail}
              </p>
            </div>
          )}
        </div>

        <div className="nf-drawer__footer">
          {notification.actionLabel && notification.actionPath ? (
            <button
              type="button"
              className="nf-btn nf-btn--primary nf-btn--full"
              onClick={handleAction}
            >
              <i className="bi bi-arrow-right" />
              {notification.actionLabel}
            </button>
          ) : (
            <button
              type="button"
              className="nf-btn nf-btn--secondary nf-btn--full"
              onClick={onClose}
            >
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
