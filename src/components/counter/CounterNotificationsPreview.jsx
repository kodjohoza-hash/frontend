import clsx from 'clsx';

const CounterNotificationsPreview = ({ notifications }) => (
  <div className="act-card">
    <div className="act-card__header">
      <h3 className="act-card__title">
        <i className="bi bi-bell" />
        Notifications
      </h3>
      <span className="act-card__badge">{notifications.filter((n) => n.unread).length}</span>
    </div>
    <div className="act-notifs__list">
      {notifications.map((n) => (
        <div key={n.id} className={clsx('act-notif-mini', n.unread && 'act-notif-mini--unread')}>
          <div className={clsx('act-notif-mini__dot', `act-notif-mini__dot--${n.color}`)} />
          <div className="act-notif-mini__body">
            <div className="act-notif-mini__title">{n.title}</div>
            <div className="act-notif-mini__msg">{n.message}</div>
          </div>
          <span className="act-notif-mini__time">{n.time}</span>
        </div>
      ))}
    </div>
    <button type="button" className="act-show-more">
      <i className="bi bi-bell" /> Voir toutes les notifications
    </button>
  </div>
);

export default CounterNotificationsPreview;
