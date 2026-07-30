import { useState } from 'react';
import clsx from 'clsx';
import CounterNotificationPriority from './CounterNotificationPriority';
import CounterNotificationStatus from './CounterNotificationStatus';
import CounterNotificationTimeline from './CounterNotificationTimeline';
import { formatDate, formatTime } from '@data/counterNotificationData';

const CounterNotificationDetails = ({ notification, onClose, onAction }) => {
  const [commentText, setCommentText] = useState('');

  if (!notification) {
    return (
      <div className="acn-modal-overlay" onClick={onClose}>
        <div className="acn-modal" onClick={(e) => e.stopPropagation()}>
          <div className="acn-modal-empty">
            <div className="acn-modal-empty-icon"><i className="bi bi-inbox" /></div>
            <div className="acn-modal-empty-title">Notification introuvable</div>
            <button className="acn-btn acn-btn-primary" onClick={onClose}>
              <i className="bi bi-arrow-left" /> Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isUnread = notification.status === 'unread';
  const isPinned = notification.pinned;

  const handleAction = (action) => {
    onAction?.(action, notification);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      handleAction('comment');
      setCommentText('');
    }
  };

  const InfoRow = ({ label, value }) => (
    <div className="acn-detail-field">
      <span className="acn-detail-field-label">{label}</span>
      <span className="acn-detail-field-value">{value || '—'}</span>
    </div>
  );

  return (
    <div className="acn-modal-overlay" onClick={onClose}>
      <div className="acn-modal" onClick={(e) => e.stopPropagation()}>
        <div className="acn-modal-header">
          <div className="acn-modal-header-left">
            <h2 className="acn-modal-title">{notification.title}</h2>
            <div className="acn-modal-badges">
              <CounterNotificationPriority priority={notification.priority} />
              <CounterNotificationStatus status={notification.status} />
            </div>
          </div>
          <div className="acn-modal-header-right">
            <div className="acn-modal-actions">
              {isUnread ? (
                <button className="acn-btn acn-btn-outline acn-btn-sm" onClick={() => handleAction('mark_read')}>
                  <i className="bi bi-envelope-open" /> Marquer lue
                </button>
              ) : (
                <button className="acn-btn acn-btn-outline acn-btn-sm" onClick={() => handleAction('mark_unread')}>
                  <i className="bi bi-envelope" /> Marquer non lue
                </button>
              )}
              {isPinned ? (
                <button className="acn-btn acn-btn-outline acn-btn-sm" onClick={() => handleAction('unpin')}>
                  <i className="bi bi-pin-fill" /> Détacher
                </button>
              ) : (
                <button className="acn-btn acn-btn-outline acn-btn-sm" onClick={() => handleAction('pin')}>
                  <i className="bi bi-pin" /> Épingler
                </button>
              )}
              <button className="acn-btn acn-btn-outline acn-btn-sm" onClick={() => handleAction('archive')}>
                <i className="bi bi-archive" /> Archiver
              </button>
              <button className="acn-btn acn-btn-danger acn-btn-sm" onClick={() => handleAction('delete')}>
                <i className="bi bi-trash" /> Supprimer
              </button>
            </div>
            <button className="acn-modal-close" onClick={onClose}>
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </div>

        <div className="acn-modal-body">
          <div className="acn-detail-section">
            <div className="acn-detail-section-title">
              <i className="bi bi-info-circle" /> Description
            </div>
            <p className="acn-detail-desc">{notification.description}</p>
            {notification.fullDescription && (
              <p className="acn-detail-desc-full">{notification.fullDescription}</p>
            )}
          </div>

          <div className="acn-detail-section">
            <div className="acn-detail-section-title">
              <i className="bi bi-card-list" /> Informations associées
            </div>
            <div className="acn-detail-grid">
              <InfoRow label="Type" value={notification.category} />
              <InfoRow label="Priorité" value={notification.priority} />
              <InfoRow label="Statut" value={notification.status} />
              <InfoRow label="Client" value={notification.user} />
              <InfoRow label="Voyage" value={notification.trip} />
              <InfoRow label="Réservation" value={notification.booking} />
              <InfoRow label="Paiement" value={notification.payment} />
              <InfoRow label="Point de vente" value={notification.branch} />
              <InfoRow label="Bus" value={notification.bus} />
              <InfoRow label="Date" value={`${formatDate(notification.date)} à ${formatTime(notification.date)}`} />
            </div>
          </div>

          <div className="acn-detail-section">
            <div className="acn-detail-section-title">
              <i className="bi bi-clock-history" /> Historique
            </div>
            <CounterNotificationTimeline events={notification.history} />
          </div>

          <div className="acn-detail-section">
            <div className="acn-detail-section-title">
              <i className="bi bi-chat" /> Commentaires
            </div>
            {notification.comments && notification.comments.length > 0 ? (
              <div className="acn-comments-list">
                {notification.comments.map((c) => (
                  <div key={c.id} className="acn-comment">
                    <div className="acn-comment-avatar">{c.author.charAt(0)}</div>
                    <div className="acn-comment-body">
                      <div className="acn-comment-header">
                        <span className="acn-comment-author">{c.author}</span>
                        <span className="acn-comment-date">{formatDate(c.date)} à {formatTime(c.date)}</span>
                      </div>
                      <div className="acn-comment-text">{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="acn-empty" style={{ padding: '12px 0' }}>
                <div className="acn-empty-text">Aucun commentaire.</div>
              </div>
            )}
            <form className="acn-comment-form" onSubmit={handleCommentSubmit}>
              <input
                type="text"
                className="acn-comment-input"
                placeholder="Ajouter un commentaire..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="acn-btn acn-btn-primary acn-btn-sm"
                disabled={!commentText.trim()}
              >
                <i className="bi bi-send" /> Envoyer
              </button>
            </form>
          </div>

          {notification.attachments && notification.attachments.length > 0 && (
            <div className="acn-detail-section">
              <div className="acn-detail-section-title">
                <i className="bi bi-paperclip" /> Pièces jointes
              </div>
              <div className="acn-attachments-list">
                {notification.attachments.map((att, i) => (
                  <div key={i} className="acn-attachment">
                    <i className="bi bi-file-earmark" />
                    <div className="acn-attachment-info">
                      <span className="acn-attachment-name">{att.name}</span>
                      <span className="acn-attachment-size">{att.size}</span>
                    </div>
                    <button className="acn-btn acn-btn-ghost acn-btn-sm" onClick={() => handleAction('download')}>
                      <i className="bi bi-download" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="acn-modal-footer">
          <button className="acn-btn acn-btn-secondary" onClick={onClose}>
            <i className="bi bi-x" /> Fermer
          </button>
          <div className="acn-modal-footer-actions">
            <button className="acn-btn acn-btn-outline" onClick={() => handleAction('share')}>
              <i className="bi bi-share" /> Partager
            </button>
            <button className="acn-btn acn-btn-outline" onClick={() => handleAction('copy_link')}>
              <i className="bi bi-link" /> Copier le lien
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterNotificationDetails;
