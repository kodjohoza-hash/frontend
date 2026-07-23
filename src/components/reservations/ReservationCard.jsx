import { useState } from 'react';
import clsx from 'clsx';
import { statusLabels, statusColors } from '@data/reservationsData';

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-CM').format(price) + ' FCFA';
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const ReservationCard = ({ reservation, onViewDetails, onCancel, onDownload, onRebook, onContact }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const r = reservation;
  const statusColor = statusColors[r.status] || 'muted';

  return (
    <div className={clsx('rv-card', `rv-card--${r.status}`)}>
      <div className="rv-card__bus-img">
        <img src={r.busImage} alt={`${r.company} bus`} loading="lazy" />
        <span className={clsx('rv-card__class-badge', `rv-card__class-badge--${r.classType.toLowerCase()}`)}>
          {r.classType}
        </span>
      </div>

      <div className="rv-card__body">
        <div className="rv-card__header">
          <div className="rv-card__company">
            <img src={r.companyLogo} alt={r.company} className="rv-card__company-logo" />
            <span className="rv-card__company-name">{r.company}</span>
          </div>
          <span className={clsx('rv-status', `rv-status--${statusColor}`)}>
            <i className={clsx('bi', r.status === 'confirmed' ? 'bi-check-circle-fill' : r.status === 'pending' ? 'bi-hourglass-split' : r.status === 'cancelled' ? 'bi-x-circle-fill' : 'bi-check-circle')} />
            {statusLabels[r.status]}
          </span>
        </div>

        <div className="rv-card__route">
          <div className="rv-card__city">
            <span className="rv-card__city-name">{r.departureCity}</span>
            <span className="rv-card__time">{r.departureTime}</span>
          </div>
          <div className="rv-card__route-line">
            <div className="rv-card__route-dot rv-card__route-dot--start" />
            <div className="rv-card__route-track">
              <div className="rv-card__route-track-fill" />
              <i className="bi bi-bus-front rv-card__route-bus" />
            </div>
            <div className="rv-card__route-dot rv-card__route-dot--end" />
          </div>
          <div className="rv-card__city">
            <span className="rv-card__city-name">{r.arrivalCity}</span>
            <span className="rv-card__time">{r.arrivalTime}</span>
          </div>
        </div>

        <div className="rv-card__meta">
          <div className="rv-card__meta-item">
            <i className="bi bi-calendar3" />
            <span>{formatDate(r.departureDate)}</span>
          </div>
          <div className="rv-card__meta-item">
            <i className="bi bi-person" />
            <span>Siège {r.seatNumber}</span>
          </div>
          <div className="rv-card__meta-item rv-card__meta-item--ref">
            <i className="bi bi-upc-scan" />
            <span>{r.id}</span>
          </div>
          <div className="rv-card__meta-item rv-card__meta-item--price">
            <i className="bi bi-tag" />
            <span>{formatPrice(r.price)}</span>
          </div>
        </div>

        <div className="rv-card__actions">
          <button type="button" className="rv-card__btn rv-card__btn--primary" onClick={() => onViewDetails(r)}>
            <i className="bi bi-eye" />
            Détails
          </button>
          {r.hasTicket && (
            <button type="button" className="rv-card__btn rv-card__btn--outline" onClick={() => onDownload(r)}>
              <i className="bi bi-download" />
              Billet
            </button>
          )}
          {r.status === 'completed' && (
            <button type="button" className="rv-card__btn rv-card__btn--accent" onClick={() => onRebook(r)}>
              <i className="bi bi-arrow-repeat" />
              Réserver à nouveau
            </button>
          )}
          <div className="rv-card__menu-wrapper">
            <button
              type="button"
              className="rv-card__btn rv-card__btn--ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Plus d'actions"
            >
              <i className="bi bi-three-dots-vertical" />
            </button>
            {menuOpen && (
              <>
                <div className="rv-card__menu-overlay" onClick={() => setMenuOpen(false)} />
                <div className="rv-card__menu">
                  <button type="button" className="rv-card__menu-item" onClick={() => { setMenuOpen(false); onViewDetails(r); }}>
                    <i className="bi bi-eye" /> Voir les détails
                  </button>
                  {r.hasTicket && (
                    <button type="button" className="rv-card__menu-item" onClick={() => { setMenuOpen(false); onDownload(r); }}>
                      <i className="bi bi-download" /> Télécharger le billet
                    </button>
                  )}
                  <button type="button" className="rv-card__menu-item" onClick={() => { setMenuOpen(false); onContact(r); }}>
                    <i className="bi bi-headset" /> Contacter la compagnie
                  </button>
                  {r.status === 'pending' && (
                    <button type="button" className="rv-card__menu-item rv-card__menu-item--danger" onClick={() => { setMenuOpen(false); onCancel(r); }}>
                      <i className="bi bi-x-circle" /> Annuler la réservation
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
