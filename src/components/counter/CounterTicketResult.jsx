import CounterTicketStatus from './CounterTicketStatus';
import { formatCurrency, formatDateTime } from '@data/ticketScanner';

/**
 * Panneau de résultat du contrôle.
 * - `ticket` : billet adapté (voir mapApiTicket).
 * - `result` : résultat de la vérification { code, raison, valide }.
 */
const CounterTicketResult = ({ ticket, onAction, result }) => {
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

  const canBoard = ticket.status === 'valid';

  return (
    <>
      {result && (
        <div className={`acv-result-banner ${result.valide ? 'success' : 'danger'}`}>
          <i className={`bi ${result.valide ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} />
          <div>
            <div className="acv-result-banner-title">
              {result.valide ? 'Billet valide' : result.raison || 'Billet non valide'}
            </div>
            {!result.valide && result.raison && (
              <div className="acv-result-banner-sub">{result.code || ''}</div>
            )}
          </div>
        </div>
      )}

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
                {formatCurrency(ticket.amount)}
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
            {ticket.verifiedBy && (
              <div className="acv-ticket-row">
                <span className="acv-ticket-label">Vérifié par</span>
                <span className="acv-ticket-value">{ticket.verifiedBy}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="acv-ticket-actions">
        {canBoard && (
          <button className="acv-btn acv-btn-success" onClick={() => onAction?.('board', ticket)}>
            <i className="bi bi-check-lg" /> Valider l'embarquement
          </button>
        )}
        <button className="acv-btn acv-btn-secondary" onClick={() => onAction?.('history', ticket)}>
          <i className="bi bi-clock-history" /> Historique
        </button>
        <button className="acv-btn acv-btn-secondary" onClick={() => onAction?.('print', ticket)}>
          <i className="bi bi-printer" /> Imprimer
        </button>
      </div>
    </>
  );
};

export default CounterTicketResult;
