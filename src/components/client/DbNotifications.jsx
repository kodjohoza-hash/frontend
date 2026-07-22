import { useState } from 'react';
import clsx from 'clsx';
import { notifications as allNotifications } from '@data/clientDashboard';

const typeColorMap = {
  success: 'db-notif--success',
  info: 'db-notif--info',
  warning: 'db-notif--warning',
  accent: 'db-notif--accent',
  danger: 'db-notif--danger',
};

const DbNotifications = () => {
  const [visibleCount, setVisibleCount] = useState(4);

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

  const visible = allNotifications.slice(0, visibleCount);
  const hasMore = visibleCount < allNotifications.length;

  return (
    <section className="db-card db-notifs">
      <div className="db-card__header">
        <h3 className="db-card__title">
          <i className="bi bi-bell" />
          Notifications
        </h3>
        <button type="button" className="db-card__link db-notifs__mark-read">
          Tout marquer lu
        </button>
      </div>
      <div className="db-notifs__list">
        {visible.map((n) => (
          <div key={n.id} className={clsx('db-notifs__item', !n.read && 'db-notifs__item--unread')}>
            <div className={clsx('db-notifs__icon', typeColorMap[n.type] || 'db-notifs--info')}>
              <i className={clsx('bi', n.icon)} />
            </div>
            <div className="db-notifs__body">
              <span className="db-notifs__title">{n.title}</span>
              <span className="db-notifs__msg">{n.message}</span>
            </div>
            <div className="db-notifs__right">
              <span className="db-notifs__time">{formatTime(n.date)}</span>
              {!n.read && <span className="db-notifs__dot" />}
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          className="db-notifs__show-more"
          onClick={() => setVisibleCount(allNotifications.length)}
        >
          Voir plus ({allNotifications.length - visibleCount} restantes)
        </button>
      )}
    </section>
  );
};

export default DbNotifications;
