import CounterTicketStatus from './CounterTicketStatus';
import { formatCurrency, formatDateTime } from '@data/counterScannerData';

const CounterTicketResult = ({ ticket, onAction }) => {
  if (!ticket) {
    return (
      <div className="acv-result-empty">
        <div className="acv-result-empty-icon">
          <i className="bi bi-qr-code" />
        </div>
        <div className="acv-result-empty-title">En attente d'un billet</div>
        <div className="acv-result-empty-text">
          Scannez un QR Code, saisissez une référence ou recherchez un billet pour afficher les détails.
        </div>
        <div className="acv-result-empty-hint">
          <span><i className="bi bi-camera" /> Scanner</span>
          <span><i className="bi bi-keyboard" /> Saisie manuelle</span>
          <span><i className="bi bi-search" /> Recherche</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="acv-ticket">
        <div className="acv-ticket-header">
          <div>
            <div className="acv-ticket-id">{ticket.id}</div>
            <div className="acv-ticket-ref">{ticket.reference}</div>
          </div>
          <CounterTicketStatus status={ticket.status} size="lg" />
        </div>

        <div className="acv-ticket-body">
          <div className="acv-ticket-left">
            <div className="acv-ticket-avatar">
              {ticket.passenger.initials}
            </div>
            <div className="acv-ticket-passenger-name">{ticket.passenger.name}</div>
            <div className="acv-ticket-passenger-phone">
              <i className="bi bi-telephone" style={{ marginRight: 4 }} />
              {ticket.passenger.phone}
            </div>
            <div className="acv-ticket-company">
              <div className="acv-ticket-company-logo" style={{ background: ticket.company.color }}>
                {ticket.company.logo}
              </div>
              {ticket.company.name}
            </div>
          </div>

          <div className="acv-ticket-right">
            <div className="acv-ticket-row">
              <span className="acv-ticket-label">Trajet</span>
              <span className="acv-ticket-value">{ticket.trip.from} → {ticket.trip.to}</span>
            </div>
            <div className="acv-ticket-row">
              <span className="acv-ticket-label">Date</span>
              <span className="acv-ticket-value">{ticket.trip.date}</span>
            </div>
            <div className="acv-ticket-row">
              <span className="acv-ticket-label">Heure</span>
              <span className="acv-ticket-value">{ticket.trip.time}</span>
            </div>
            <div className="acv-ticket-row">
              <span className="acv-ticket-label">Durée</span>
              <span className="acv-ticket-value">{ticket.trip.duration}</span>
            </div>
            <div className="acv-ticket-row">
              <span className="acv-ticket-label">Bus</span>
              <span className="acv-ticket-value">{ticket.bus.plate} — {ticket.bus.model}</span>
            </div>
            <div className="acv-ticket-row">
              <span className="acv-ticket-label">Siège</span>
              <span className="acv-ticket-value" style={{ fontWeight: 700, color: '#FF6B35' }}>
                <i className="bi bi-grid-3x3" style={{ marginRight: 4 }} />
                {ticket.bus.seat}
              </span>
            </div>
            <div className="acv-ticket-row">
              <span className="acv-ticket-label">Montant</span>
              <span className="acv-ticket-value" style={{ fontWeight: 700, color: '#0B1D51' }}>
                {formatCurrency(ticket.amount || ticket.payment.amount)}
              </span>
            </div>
            <div className="acv-ticket-row">
              <span className="acv-ticket-label">Paiement</span>
              <span className="acv-ticket-value">
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 8px', borderRadius: 4, fontSize: 11,
                  background: ticket.payment.status === 'paid' ? '#D1FAE5' : '#FEF3C7',
                  color: ticket.payment.status === 'paid' ? '#059669' : '#D97706',
                  fontWeight: 600,
                }}>
                  <i className={`bi ${ticket.payment.status === 'paid' ? 'bi-check-circle' : 'bi-clock'}`} />
                  {ticket.payment.status === 'paid' ? 'Payé' : 'En attente'}
                </span>
              </span>
            </div>
            {ticket.verifiedAt && (
              <div className="acv-ticket-row">
                <span className="acv-ticket-label">Vérifié le</span>
                <span className="acv-ticket-value">{formatDateTime(ticket.verifiedAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="acv-ticket-qr">
          <div className="acv-ticket-qr-placeholder">
            <i className="bi bi-qr-code" />
          </div>
          <div className="acv-ticket-qr-info">
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0B1D51', marginBottom: 4 }}>QR Code</div>
            <div className="acv-ticket-qr-code">{ticket.qrCode}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Code-barres</div>
            <div className="acv-ticket-barcode">{ticket.barcode}</div>
          </div>
        </div>
      </div>

      <div className="acv-ticket-actions">
        {ticket.status === 'valid' && (
          <button className="acv-btn acv-btn-success" onClick={() => onAction?.('board', ticket)}>
            <i className="bi bi-check-lg" /> Valider l'embarquement
          </button>
        )}
        {ticket.status === 'valid' && (
          <button className="acv-btn acv-btn-danger" onClick={() => onAction?.('refuse', ticket)}>
            <i className="bi bi-x-lg" /> Refuser
          </button>
        )}
        <button className="acv-btn acv-btn-secondary" onClick={() => onAction?.('details', ticket)}>
          <i className="bi bi-info-circle" /> Détails
        </button>
        <button className="acv-btn acv-btn-secondary" onClick={() => onAction?.('print', ticket)}>
          <i className="bi bi-printer" /> Imprimer
        </button>
        <button className="acv-btn acv-btn-secondary" onClick={() => onAction?.('history', ticket)}>
          <i className="bi bi-clock-history" /> Historique
        </button>
      </div>
    </>
  );
};

export default CounterTicketResult;
