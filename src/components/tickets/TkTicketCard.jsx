import { useState } from 'react';
import clsx from 'clsx';

const statusMap = {
  active: { label: 'Actif', color: 'success', dot: 'active' },
  used: { label: 'Utilisé', color: 'info', dot: 'used' },
  expired: { label: 'Expiré', color: 'muted', dot: 'expired' },
};

const TkTicketCard = ({ ticket, onView, viewMode = 'grid' }) => {
  const [hovered, setHovered] = useState(false);
  const st = statusMap[ticket.status] || statusMap.expired;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  const companyInitials = ticket.company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (viewMode === 'list') {
    return (
      <div
        className={clsx('tk-ticket tk-ticket--list', `tk-ticket--${st.color}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="tk-ticket__list-left">
          <div className="tk-ticket__company-badge">{companyInitials}</div>
          <div className="tk-ticket__list-info">
            <span className="tk-ticket__route">{ticket.from} → {ticket.to}</span>
            <span className="tk-ticket__meta-line">{formatDate(ticket.date)} • {ticket.departure} — {ticket.arrival} • Siège {ticket.seat}</span>
          </div>
        </div>
        <div className="tk-ticket__list-right">
          <span className="tk-ticket__price">{ticket.price} FCFA</span>
          <span className={clsx('tk-ticket__status-dot', `tk-ticket__status-dot--${st.dot}`)}>
            {st.label}
          </span>
          <button type="button" className="tk-ticket__view-btn" onClick={() => onView(ticket)}>
            <i className="bi bi-eye" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx('tk-ticket', `tk-ticket--${st.color}`, hovered && 'tk-ticket--hover')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tk-ticket__top">
        <div className="tk-ticket__top-left">
          <div className="tk-ticket__company-badge">{companyInitials}</div>
          <div className="tk-ticket__company-name">{ticket.company}</div>
        </div>
        <span className={clsx('tk-ticket__status', `tk-ticket__status--${st.dot}`)}>
          <span className="tk-ticket__status-dot" />
          {st.label}
        </span>
      </div>

      <div className="tk-ticket__route-section">
        <div className="tk-ticket__city">
          <span className="tk-ticket__time">{ticket.departure}</span>
          <span className="tk-ticket__place">{ticket.from}</span>
        </div>
        <div className="tk-ticket__route-line">
          <div className="tk-ticket__line" />
          <div className="tk-ticket__bus-icon">
            <i className="bi bi-bus-front-fill" />
          </div>
          <div className="tk-ticket__line" />
        </div>
        <div className="tk-ticket__city tk-ticket__city--end">
          <span className="tk-ticket__time">{ticket.arrival}</span>
          <span className="tk-ticket__place">{ticket.to}</span>
        </div>
      </div>

      <div className="tk-ticket__details">
        <div className="tk-ticket__detail">
          <i className="bi bi-calendar3" />
          <span>{formatDate(ticket.date)}</span>
        </div>
        <div className="tk-ticket__detail">
          <i className="bi bi-door-open" />
          <span>Siège {ticket.seat}</span>
        </div>
        <div className="tk-ticket__detail">
          <i className="bi bi-hash" />
          <span>{ticket.id}</span>
        </div>
      </div>

      <div className="tk-ticket__divider">
        <div className="tk-ticket__notch tk-ticket__notch--left" />
        <div className="tk-ticket__divider-line" />
        <div className="tk-ticket__notch tk-ticket__notch--right" />
      </div>

      <div className="tk-ticket__bottom">
        <div className="tk-ticket__qr">
          <div className="tk-ticket__qr-placeholder">
            <i className="bi bi-qr-code" />
          </div>
          <span className="tk-ticket__ref">{ticket.bookingRef}</span>
        </div>
        <div className="tk-ticket__price-section">
          <span className="tk-ticket__price">{ticket.price} FCFA</span>
          <span className="tk-ticket__bus-type">{ticket.busType}</span>
        </div>
      </div>

      <div className="tk-ticket__actions">
        <button type="button" className="tk-ticket__action tk-ticket__action--primary" onClick={() => onView(ticket)} title="Voir le billet">
          <i className="bi bi-eye-fill" />
          <span>Voir</span>
        </button>
        <button type="button" className="tk-ticket__action" title="Télécharger PDF">
          <i className="bi bi-download" />
        </button>
        <button type="button" className="tk-ticket__action" title="Imprimer">
          <i className="bi bi-printer" />
        </button>
        <button type="button" className="tk-ticket__action" title="Partager">
          <i className="bi bi-share-fill" />
        </button>
        <button type="button" className="tk-ticket__action" title="Ajouter au portefeuille">
          <i className="bi bi-wallet2" />
        </button>
      </div>
    </div>
  );
};

export default TkTicketCard;
