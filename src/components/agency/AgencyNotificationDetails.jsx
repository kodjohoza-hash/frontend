import AgencyNotificationPriority from '@components/agency/AgencyNotificationPriority';
import AgencyNotificationStatus from '@components/agency/AgencyNotificationStatus';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const categoryIcons = {
  booking: 'bi-ticket', payment: 'bi-credit-card', trip: 'bi-bus-front',
  bus: 'bi-truck', driver: 'bi-person-badge', agent: 'bi-people',
  branch: 'bi-shop', system: 'bi-gear', security: 'bi-shield-check',
  document: 'bi-file-earmark-text', marketing: 'bi-megaphone',
};

export default function AgencyNotificationDetails({ notification, onAction, onBack }) {
  return (
    <div className="anot-detail">
      <div className="anot-detail__header">
        <button className="anot-detail__back" onClick={onBack}>
          <i className="bi bi-arrow-left" /> Retour
        </button>
        <h2 className="anot-detail__title">{notification.title}</h2>
        <div className="anot-detail__badges">
          <AgencyNotificationPriority priority={notification.priority} />
          <AgencyNotificationStatus status={notification.status} />
          <span className="anot-cat" style={{ cursor: 'default', background: '#f1f5f9' }}>
            <i className={`bi ${categoryIcons[notification.category]}`} /> {capitalize(notification.category)}
          </span>
        </div>
        <p className="anot-detail__desc">{notification.fullDescription || notification.description}</p>
      </div>

      <div className="anot-detail__meta">
        <div className="anot-detail__meta-item">
          <span className="anot-detail__meta-label">Date</span>
          <span className="anot-detail__meta-value">{new Date(notification.date).toLocaleDateString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</span>
        </div>
        {notification.user && (
          <div className="anot-detail__meta-item">
            <span className="anot-detail__meta-label">Utilisateur</span>
            <span className="anot-detail__meta-value">{notification.user}</span>
          </div>
        )}
        {notification.branch && (
          <div className="anot-detail__meta-item">
            <span className="anot-detail__meta-label">Point de vente</span>
            <span className="anot-detail__meta-value">{notification.branch}</span>
          </div>
        )}
        {notification.trip && (
          <div className="anot-detail__meta-item">
            <span className="anot-detail__meta-label">Voyage</span>
            <span className="anot-detail__meta-value">{notification.trip}</span>
          </div>
        )}
        {notification.booking && (
          <div className="anot-detail__meta-item">
            <span className="anot-detail__meta-label">Réservation</span>
            <span className="anot-detail__meta-value">{notification.booking}</span>
          </div>
        )}
      </div>

      {notification.history && notification.history.length > 0 && (
        <div className="anot-history">
          <h4 className="anot-history__title"><i className="bi bi-clock-history" /> Historique</h4>
          <div className="anot-history__list">
            {notification.history.map((h, i) => (
              <div key={i} className="anot-history__item">
                <span className="anot-history__dot" />
                <span className="anot-history__action">{h.action}</span>
                <span className="anot-history__date">{new Date(h.date).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {notification.attachments && notification.attachments.length > 0 && (
        <div className="anot-attachments">
          <h4 className="anot-attachments__title"><i className="bi bi-paperclip" /> Pièces jointes</h4>
          <div className="anot-attachments__list">
            {notification.attachments.map((att, i) => (
              <div key={i} className="anot-attachment">
                <div className="anot-attachment__icon"><i className="bi bi-file-earmark-pdf" /></div>
                <div className="anot-attachment__info">
                  <span className="anot-attachment__name">{att.name}</span>
                  <span className="anot-attachment__size">{att.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {notification.comments && notification.comments.length > 0 && (
        <div className="anot-comments">
          <h4 className="anot-comments__title"><i className="bi bi-chat-dots" /> Commentaires internes</h4>
          {notification.comments.map((c) => (
            <div key={c.id} className="anot-comment">
              <div className="anot-comment__header">
                <span className="anot-comment__author"><i className="bi bi-person-circle" /> {c.author}</span>
                <span className="anot-comment__date">{new Date(c.date).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="anot-comment__text">{c.text}</div>
            </div>
          ))}
        </div>
      )}

      {notification.relatedLinks && notification.relatedLinks.length > 0 && (
        <div style={{ padding: '0 24px 16px' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--anot-text-primary)', marginBottom: 8 }}>Liens associés</h4>
          <div className="anot-links">
            {notification.relatedLinks.map((link, i) => (
              <a key={i} href={link.url} className="anot-link">
                <i className="bi bi-link-45deg" /> {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="anot-detail-actions">
        {notification.status === 'unread' ? (
          <button className="anot-btn anot-btn--outline" onClick={() => onAction('mark_read')}>
            <i className="bi bi-envelope-open" /> Marquer comme lue
          </button>
        ) : (
          <button className="anot-btn anot-btn--outline" onClick={() => onAction('mark_unread')}>
            <i className="bi bi-envelope" /> Marquer comme non lue
          </button>
        )}
        <button className="anot-btn anot-btn--outline" onClick={() => onAction('pin')}>
          <i className={`bi ${notification.pinned ? 'bi-pin-fill' : 'bi-pin'}`} />
          {notification.pinned ? 'Désépingler' : 'Épingler'}
        </button>
        <button className="anot-btn anot-btn--outline" onClick={() => onAction('archive')}>
          <i className="bi bi-archive" /> Archiver
        </button>
        <button className="anot-btn anot-btn--outline" onClick={() => onAction('share')}>
          <i className="bi bi-share" /> Partager
        </button>
        <button className="anot-btn anot-btn--outline" onClick={() => onAction('copy_link')}>
          <i className="bi bi-link-45deg" /> Copier le lien
        </button>
        <button className="anot-btn anot-btn--danger" onClick={() => onAction('delete')}>
          <i className="bi bi-trash3" /> Supprimer
        </button>
      </div>
    </div>
  );
}
