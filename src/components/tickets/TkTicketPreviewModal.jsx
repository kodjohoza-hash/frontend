import { useEffect, useCallback } from 'react';

const statusMap = {
  active: { label: 'Actif', color: 'success' },
  used: { label: 'Utilisé', color: 'info' },
  expired: { label: 'Expiré', color: 'muted' },
};

const TkTicketPreviewModal = ({ ticket, onClose }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  if (!ticket) return null;

  const st = statusMap[ticket.status] || statusMap.expired;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const companyInitials = ticket.company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="tk-modal-overlay" onClick={onClose}>
      <div className="tk-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="tk-modal__close" onClick={onClose}>
          <i className="bi bi-x-lg" />
        </button>

        <div className="tk-modal__ticket">
          <div className="tk-modal__header">
            <div className="tk-modal__logo">
              <div className="tk-modal__company-icon">{companyInitials}</div>
              <div>
                <div className="tk-modal__company-name">{ticket.company}</div>
                <div className="tk-modal__bus-type">{ticket.busType}</div>
              </div>
            </div>
            <span className={`tk-modal__badge tk-modal__badge--${st.color}`}>
              <span className="tk-modal__badge-dot" />
              {st.label}
            </span>
          </div>

          <div className="tk-modal__route">
            <div className="tk-modal__route-city">
              <span className="tk-modal__route-time">{ticket.departure}</span>
              <span className="tk-modal__route-place">{ticket.from}</span>
            </div>
            <div className="tk-modal__route-visual">
              <div className="tk-modal__route-line" />
              <div className="tk-modal__route-bus">
                <i className="bi bi-bus-front-fill" />
              </div>
              <div className="tk-modal__route-line" />
            </div>
            <div className="tk-modal__route-city tk-modal__route-city--end">
              <span className="tk-modal__route-time">{ticket.arrival}</span>
              <span className="tk-modal__route-place">{ticket.to}</span>
            </div>
          </div>

          <div className="tk-modal__info-grid">
            <div className="tk-modal__info-item">
              <i className="bi bi-calendar3" />
              <div>
                <span className="tk-modal__info-label">Date</span>
                <span className="tk-modal__info-value">{formatDate(ticket.date)}</span>
              </div>
            </div>
            <div className="tk-modal__info-item">
              <i className="bi bi-door-open" />
              <div>
                <span className="tk-modal__info-label">Siège</span>
                <span className="tk-modal__info-value">{ticket.seat}</span>
              </div>
            </div>
            <div className="tk-modal__info-item">
              <i className="bi bi-signpost-2" />
              <div>
                <span className="tk-modal__info-label">Quai / Voie</span>
                <span className="tk-modal__info-value">{ticket.gate} / {ticket.platform}</span>
              </div>
            </div>
            <div className="tk-modal__info-item">
              <i className="bi bi-person" />
              <div>
                <span className="tk-modal__info-label">Passager</span>
                <span className="tk-modal__info-value">{ticket.passenger}</span>
              </div>
            </div>
          </div>

          <div className="tk-modal__divider">
            <div className="tk-modal__notch tk-modal__notch--left" />
            <div className="tk-modal__divider-dots">
              {[...Array(12)].map((_, i) => <span key={i} />)}
            </div>
            <div className="tk-modal__notch tk-modal__notch--right" />
          </div>

          <div className="tk-modal__bottom">
            <div className="tk-modal__qr">
              <div className="tk-modal__qr-box">
                <i className="bi bi-qr-code" />
              </div>
              <div className="tk-modal__barcode">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="tk-modal__barcode-line"
                    style={{ width: Math.random() > 0.5 ? 2 : 1 }}
                  />
                ))}
              </div>
            </div>
            <div className="tk-modal__ticket-id">
              <span className="tk-modal__id-label">Référence</span>
              <span className="tk-modal__id-value">{ticket.id}</span>
              <span className="tk-modal__id-sub">Réservation : {ticket.bookingRef}</span>
            </div>
          </div>
        </div>

        <div className="tk-modal__footer">
          <button type="button" className="tk-modal__footer-btn tk-modal__footer-btn--primary">
            <i className="bi bi-download" /> Télécharger PDF
          </button>
          <button type="button" className="tk-modal__footer-btn">
            <i className="bi bi-printer" /> Imprimer
          </button>
          <button type="button" className="tk-modal__footer-btn">
            <i className="bi bi-share-fill" /> Partager
          </button>
        </div>
      </div>
    </div>
  );
};

export default TkTicketPreviewModal;
