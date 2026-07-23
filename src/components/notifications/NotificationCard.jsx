import clsx from 'clsx';
import { typeConfig } from '@data/notificationsData';

const NotificationCard = ({ notification, onOpen, onMarkRead, onDelete }) => {
  const n = notification;
  const cfg = typeConfig[n.type] || { color: 'muted', icon: 'bi-bell', label: 'Notification' };

  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffH / 24);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin}min`;
    if (diffH < 24) return `Il y a ${diffH}h`;
    if (diffD === 1) return 'Hier';
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const priorityLabel = { high: 'Haute', medium: 'Moyenne', low: 'Basse' };

  return (
    <div
      className={clsx(
        'nf-card',
        !n.read && 'nf-card--unread',
      )}
      onClick={() => onOpen(n)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(n); }}
      aria-label={`${n.title}${!n.read ? ' (non lue)' : ''}`}
    >
      <div className="nf-card__left">
        <div className={clsx('nf-card__icon', `nf-card__icon--${cfg.color}`)}>
          <i className={clsx('bi', cfg.icon)} />
        </div>
        {!n.read && <span className="nf-card__dot" />}
      </div>

      <div className="nf-card__body">
        <div className="nf-card__top">
          <div className="nf-card__top-left">
            <h4 className="nf-card__title">{n.title}</h4>
            {n.company && (
              <span className="nf-card__company">{n.company}</span>
            )}
          </div>
          <div className="nf-card__top-right">
            <span className="nf-card__time">{formatDate(n.date)}</span>
            <span className="nf-card__hour">{formatTime(n.date)}</span>
          </div>
        </div>

        <p className="nf-card__message">{n.message}</p>

        <div className="nf-card__footer">
          <div className="nf-card__meta">
            <span className={clsx('nf-card__priority', `nf-card__priority--${n.priority}`)}>
              {priorityLabel[n.priority]}
            </span>
            {n.bookingRef && (
              <span className="nf-card__ref">
                <i className="bi bi-ticket-perforated" /> {n.bookingRef}
              </span>
            )}
          </div>
          <div className="nf-card__actions" onClick={(e) => e.stopPropagation()}>
            {!n.read && (
              <button
                type="button"
                className="nf-card__action"
                onClick={() => onMarkRead(n.id)}
                title="Marquer comme lu"
              >
                <i className="bi bi-check-lg" />
              </button>
            )}
            <button
              type="button"
              className="nf-card__action nf-card__action--danger"
              onClick={() => onDelete(n.id)}
              title="Supprimer"
            >
              <i className="bi bi-trash3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
