import clsx from 'clsx';

const typeColorMap = {
  success: { bg: 'var(--color-success-50)', icon: 'var(--color-success)' },
  info: { bg: 'var(--color-info-50)', icon: 'var(--color-info)' },
  warning: { bg: 'var(--color-warning-50)', icon: 'var(--color-warning)' },
  accent: { bg: 'var(--color-accent-50)', icon: 'var(--color-accent)' },
  danger: { bg: 'var(--color-danger-50)', icon: 'var(--color-danger)' },
};

const NotificationCard = ({ notifications = [] }) => {
  if (notifications.length === 0) return null;

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Hier';
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="btc-notification-list">
      {notifications.map((notif, idx) => {
        const colors = typeColorMap[notif.type] || typeColorMap.info;
        return (
          <div
            key={notif.id}
            className={clsx('btc-notification-item d-flex gap-3 p-3', !notif.read && 'btc-notification-unread')}
            style={{
              borderBottom: idx < notifications.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              background: !notif.read ? 'var(--color-primary-50)' : 'transparent',
            }}
          >
            <div
              className="btc-notification-icon flex-shrink-0 d-flex align-items-center justify-content-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-lg)',
                backgroundColor: colors.bg,
                color: colors.icon,
                fontSize: '1rem',
              }}
            >
              <i className={clsx('bi', notif.icon)} />
            </div>
            <div className="flex-grow-1 min-width-0">
              <div className="d-flex align-items-start justify-content-between gap-2">
                <span
                  className="fw-semibold"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {notif.title}
                </span>
                <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {formatTime(notif.date)}
                </span>
              </div>
              <p
                className="mt-1 mb-0"
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-secondary)',
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                {notif.message}
              </p>
            </div>
            {!notif.read && (
              <div
                className="flex-shrink-0 align-self-center"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NotificationCard;
