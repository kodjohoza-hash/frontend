import { useEffect } from 'react';
import clsx from 'clsx';
import { statusLabels, statusColors } from '@data/reservationsData';
import ReservationTimeline from './ReservationTimeline';

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-CM').format(price) + ' FCFA';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ReservationDetailsDrawer = ({ reservation, onClose, onCancel, onDownload, onContact }) => {
  const r = reservation;
  if (!r) return null;

  const statusColor = statusColors[r.status] || 'muted';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="rv-drawer-overlay" onClick={onClose}>
      <div className="rv-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="rv-drawer__header">
          <div className="rv-drawer__header-left">
            <h3 className="rv-drawer__title">Détails de la réservation</h3>
            <span className="rv-drawer__ref">{r.id}</span>
          </div>
          <button type="button" className="rv-drawer__close" onClick={onClose} aria-label="Fermer">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="rv-drawer__body">
          <div className="rv-drawer__bus-img">
            <img src={r.busImage} alt={`${r.company} bus`} />
            <div className="rv-drawer__bus-overlay">
              <span className={clsx('rv-status', `rv-status--${statusColor}`)}>
                <i className={clsx('bi', r.status === 'confirmed' ? 'bi-check-circle-fill' : r.status === 'pending' ? 'bi-hourglass-split' : r.status === 'cancelled' ? 'bi-x-circle-fill' : 'bi-check-circle')} />
                {statusLabels[r.status]}
              </span>
            </div>
          </div>

          <div className="rv-drawer__section">
            <h4 className="rv-drawer__section-title">
              <i className="bi bi-signpost-2" />
              Informations du voyage
            </h4>
            <div className="rv-drawer__route-detail">
              <div className="rv-drawer__route-endpoint">
                <span className="rv-drawer__route-city">{r.departureCity}</span>
                <span className="rv-drawer__route-time">{r.departureTime}</span>
                <span className="rv-drawer__route-date">{formatDate(r.departureDate)}</span>
              </div>
              <div className="rv-drawer__route-arrow">
                <i className="bi bi-arrow-right" />
              </div>
              <div className="rv-drawer__route-endpoint">
                <span className="rv-drawer__route-city">{r.arrivalCity}</span>
                <span className="rv-drawer__route-time">{r.arrivalTime}</span>
              </div>
            </div>
            <div className="rv-drawer__info-grid">
              <div className="rv-drawer__info-item">
                <span className="rv-drawer__info-label">Compagnie</span>
                <span className="rv-drawer__info-value">
                  <img src={r.companyLogo} alt="" className="rv-drawer__info-logo" />
                  {r.company}
                </span>
              </div>
              <div className="rv-drawer__info-item">
                <span className="rv-drawer__info-label">Classe</span>
                <span className="rv-drawer__info-value">{r.classType}</span>
              </div>
              <div className="rv-drawer__info-item">
                <span className="rv-drawer__info-label">Siège</span>
                <span className="rv-drawer__info-value">{r.seatNumber}</span>
              </div>
              <div className="rv-drawer__info-item">
                <span className="rv-drawer__info-label">Prix</span>
                <span className="rv-drawer__info-value rv-drawer__info-value--price">{formatPrice(r.price)}</span>
              </div>
            </div>
          </div>

          <div className="rv-drawer__section">
            <h4 className="rv-drawer__section-title">
              <i className="bi bi-people" />
              Passagers ({r.passengers.length})
            </h4>
            <div className="rv-drawer__passengers">
              {r.passengers.map((p, i) => (
                <div key={i} className="rv-drawer__passenger">
                  <div className="rv-drawer__passenger-avatar">
                    {p.name.charAt(0)}
                  </div>
                  <div className="rv-drawer__passenger-info">
                    <span className="rv-drawer__passenger-name">{p.name}</span>
                    <span className="rv-drawer__passenger-detail">
                      <i className="bi bi-envelope" /> {p.email}
                    </span>
                    <span className="rv-drawer__passenger-detail">
                      <i className="bi bi-telephone" /> {p.phone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rv-drawer__section">
            <h4 className="rv-drawer__section-title">
              <i className="bi bi-credit-card" />
              Paiement
            </h4>
            <div className="rv-drawer__info-grid">
              <div className="rv-drawer__info-item">
                <span className="rv-drawer__info-label">Méthode</span>
                <span className="rv-drawer__info-value">{r.payment.method}</span>
              </div>
              <div className="rv-drawer__info-item">
                <span className="rv-drawer__info-label">Montant</span>
                <span className="rv-drawer__info-value rv-drawer__info-value--price">{formatPrice(r.payment.amount)}</span>
              </div>
              {r.payment.reference && (
                <div className="rv-drawer__info-item rv-drawer__info-item--full">
                  <span className="rv-drawer__info-label">Référence</span>
                  <span className="rv-drawer__info-value rv-drawer__info-value--mono">{r.payment.reference}</span>
                </div>
              )}
              {r.payment.paidAt && (
                <div className="rv-drawer__info-item">
                  <span className="rv-drawer__info-label">Payé le</span>
                  <span className="rv-drawer__info-value">{formatDateTime(r.payment.paidAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rv-drawer__section">
            <h4 className="rv-drawer__section-title">
              <i className="bi bi-box" />
              Bagages
            </h4>
            <div className="rv-drawer__baggage">
              <div className="rv-drawer__baggage-item">
                <i className="bi bi-suitcase" />
                <span>{r.baggage.checked} bagage(s) en soute</span>
              </div>
              <div className="rv-drawer__baggage-item">
                <i className="bi bi-briefcase" />
                <span>{r.baggage.carryOn} bagage(s) à main</span>
              </div>
            </div>
          </div>

          <div className="rv-drawer__section">
            <h4 className="rv-drawer__section-title">
              <i className="bi bi-clock-history" />
              Suivi de la réservation
            </h4>
            <ReservationTimeline timeline={r.timeline} />
          </div>

          {r.hasTicket && (
            <div className="rv-drawer__ticket">
              <div className="rv-drawer__ticket-icon">
                <i className="bi bi-postcard" />
              </div>
              <div className="rv-drawer__ticket-info">
                <span className="rv-drawer__ticket-title">Billet électronique disponible</span>
                <span className="rv-drawer__ticket-sub">Téléchargez votre billet pour le jour du voyage</span>
              </div>
              <button type="button" className="rv-card__btn rv-card__btn--primary" onClick={() => onDownload(r)}>
                <i className="bi bi-download" />
                Télécharger
              </button>
            </div>
          )}
        </div>

        <div className="rv-drawer__footer">
          {r.status === 'pending' && (
            <button type="button" className="rv-card__btn rv-card__btn--danger" onClick={() => { onCancel(r); onClose(); }}>
              <i className="bi bi-x-circle" />
              Annuler
            </button>
          )}
          <button type="button" className="rv-card__btn rv-card__btn--outline" onClick={() => onContact(r)}>
            <i className="bi bi-headset" />
            Contacter
          </button>
          {r.hasTicket && (
            <button type="button" className="rv-card__btn rv-card__btn--primary" onClick={() => onDownload(r)}>
              <i className="bi bi-download" />
              Télécharger le billet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsDrawer;
