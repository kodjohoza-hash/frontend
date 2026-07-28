import AgencyNotificationPriority from '@components/agency/AgencyNotificationPriority';
import AgencyNotificationStatus from '@components/agency/AgencyNotificationStatus';

export default function AgencyNotificationTimeline({ notifications, onAction }) {
  const categoryIcons = {
    booking: 'bi-ticket', payment: 'bi-credit-card', trip: 'bi-bus-front',
    bus: 'bi-truck', driver: 'bi-person-badge', agent: 'bi-people',
    branch: 'bi-shop', system: 'bi-gear', security: 'bi-shield-check',
    document: 'bi-file-earmark-text', marketing: 'bi-megaphone',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {notifications.slice(0, 10).map((notif) => (
        <div key={notif.id} className="apro-timeline__item" style={{ paddingLeft: 28 }}>
          <div className="apro-timeline__dot" style={{ width: 20, height: 20, left: -28, fontSize: '0.5rem' }}>
            <i className={`bi ${categoryIcons[notif.category] || 'bi-bell'}`} />
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--anot-text-primary)', cursor: 'pointer' }}
            onClick={() => onAction('view', notif)}>
            {notif.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--anot-text-secondary)' }}>{notif.description}</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--anot-text-muted)', marginTop: 2 }}>
            {formatDate(notif.date)}
          </div>
        </div>
      ))}
    </div>
  );
}
