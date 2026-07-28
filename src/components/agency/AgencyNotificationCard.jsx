export default function AgencyNotificationCard({ notification, onAction }) {
  const categoryIcons = {
    booking: 'bi-ticket', payment: 'bi-credit-card', trip: 'bi-bus-front',
    bus: 'bi-truck', driver: 'bi-person-badge', agent: 'bi-people',
    branch: 'bi-shop', system: 'bi-gear', security: 'bi-shield-check',
    document: 'bi-file-earmark-text', marketing: 'bi-megaphone',
  };
  const categoryColors = {
    booking: '#8b5cf6', payment: '#22c55e', trip: '#06b6d4',
    bus: '#f59e0b', driver: '#0B1D51', agent: '#ec4899',
    branch: '#FF6B35', system: '#64748b', security: '#ef4444',
    document: '#14b8a6', marketing: '#d946ef',
  };
  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`anot-mobile-card ${notification.status === 'unread' ? 'anot-item--unread' : ''} ${notification.pinned ? 'anot-item--pinned' : ''}`}>
      <div className="anot-mobile-card__top">
        <div className="anot-mobile-card__icon" style={{ background: categoryColors[notification.category] || '#64748b' }}>
          <i className={`bi ${categoryIcons[notification.category] || 'bi-bell'}`} />
        </div>
        <div className="anot-mobile-card__info">
          <div className="anot-mobile-card__title">{notification.title}</div>
          <div className="anot-mobile-card__desc">{notification.description}</div>
        </div>
      </div>
      <div className="anot-mobile-card__meta">
        <div className="anot-mobile-card__date">
          <i className="bi bi-clock" /> {formatDate(notification.date)}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="anot-item__action" onClick={() => onAction('view', notification)} title="Voir">
            <i className="bi bi-eye" />
          </button>
          {notification.status === 'unread' ? (
            <button className="anot-item__action" onClick={() => onAction('mark_read', notification)} title="Marquer lue">
              <i className="bi bi-envelope-open" />
            </button>
          ) : (
            <button className="anot-item__action" onClick={() => onAction('mark_unread', notification)} title="Marquer non lue">
              <i className="bi bi-envelope" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
