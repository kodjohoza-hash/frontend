import AgencyNotificationPriority from '@components/agency/AgencyNotificationPriority';
import AgencyNotificationStatus from '@components/agency/AgencyNotificationStatus';

export default function AgencyNotificationList({ notifications, onAction, currentPage, totalPages, onPageChange, totalCount }) {
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
    <div className="anot-list">
      <div className="anot-list__header">
        <span className="anot-list__count">{totalCount} notification{totalCount !== 1 ? 's' : ''}</span>
        <div className="anot-list__bulk">
          <button className="anot-btn anot-btn--ghost anot-btn--sm" onClick={() => {}}>
            <i className="bi bi-check-all" /> Tout marquer lu
          </button>
        </div>
      </div>
      <div className="anot-list__body">
        {notifications.length === 0 ? (
          <div className="anot-empty">
            <div className="anot-empty__icon"><i className="bi bi-bell-slash" /></div>
            <h3 className="anot-empty__title">Aucune notification</h3>
            <p className="anot-empty__desc">Aucune notification ne correspond à vos critères.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id}
              className={`anot-item ${notif.status === 'unread' ? 'anot-item--unread' : ''} ${notif.pinned ? 'anot-item--pinned' : ''} ${notif.status === 'archived' ? 'anot-item--archived' : ''}`}
              onClick={() => onAction('view', notif)}
            >
              <div className="anot-item__icon" style={{ background: categoryColors[notif.category] || '#64748b' }}>
                <i className={`bi ${categoryIcons[notif.category] || 'bi-bell'}`} />
              </div>
              <div className="anot-item__content">
                <div className="anot-item__top">
                  <span className={`anot-item__title ${notif.status === 'unread' ? 'anot-item__title--unread' : ''}`}>
                    {notif.title}
                  </span>
                  <AgencyNotificationPriority priority={notif.priority} />
                  <AgencyNotificationStatus status={notif.status} />
                </div>
                <div className="anot-item__desc">{notif.description}</div>
                <div className="anot-item__meta">
                  <span className="anot-item__date"><i className="bi bi-clock" /> {formatDate(notif.date)}</span>
                  {notif.user && <span className="anot-item__user"><i className="bi bi-person" /> {notif.user}</span>}
                  {notif.branch && <span className="anot-item__user"><i className="bi bi-shop" /> {notif.branch}</span>}
                </div>
              </div>
              <div className="anot-item__actions" onClick={(e) => e.stopPropagation()}>
                <button className="anot-item__action" onClick={() => onAction('mark_read', notif)} title="Marquer comme lue">
                  <i className="bi bi-envelope-open" />
                </button>
                <button className="anot-item__action" onClick={() => onAction('pin', notif)} title={notif.pinned ? 'Désépingler' : 'Épingler'}>
                  <i className={`bi ${notif.pinned ? 'bi-pin-fill' : 'bi-pin'}`} />
                </button>
                <button className="anot-item__action" onClick={() => onAction('archive', notif)} title="Archiver">
                  <i className="bi bi-archive" />
                </button>
                <button className="anot-item__action anot-item__action--danger" onClick={() => onAction('delete', notif)} title="Supprimer">
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="anot-pagination">
          <button className="anot-page-btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
            <i className="bi bi-chevron-left" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i}
              className={`anot-page-btn ${currentPage === i + 1 ? 'anot-page-btn--active' : ''}`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="anot-page-btn" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
}
