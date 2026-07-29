import clsx from 'clsx';
import CounterBookingStatus from './CounterBookingStatus';
import CounterBookingTimeline from './CounterBookingTimeline';
import {
  formatCurrency, formatDateShort, formatTime,
  getPaymentMethodIcon
} from '@data/counterBookingData';

const CounterBookingDetails = ({ booking, onBack, onAction }) => {
  if (!booking) {
    return (
      <div className="acb-empty">
        <div className="acb-empty-icon"><i className="bi bi-inbox" /></div>
        <div className="acb-empty-title">Réservation introuvable</div>
      </div>
    );
  }

  return (
    <div className="acb-detail-wrapper">
      <button className="acb-detail-back" onClick={onBack}>
        <i className="bi bi-arrow-left" /> Retour aux réservations
      </button>

      <div className="acb-detail-header">
        <div>
          <h1 className="acb-detail-id">
            {booking.id}
          </h1>
          <div className="acb-detail-date">
            Créée le {formatDateShort(booking.createdAt)} à {formatTime(booking.createdAt)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <CounterBookingStatus status={booking.status} size="lg" />
          <button className="acb-btn acb-btn-primary acb-btn-sm" onClick={() => onAction?.('edit', booking)}>
            <i className="bi bi-pencil" /> Modifier
          </button>
          {booking.status === 'pending' && (
            <button className="acb-btn acb-btn-primary acb-btn-sm" onClick={() => onAction?.('confirm', booking)}
              style={{ background: '#10B981', boxShadow: '0 2px 8px rgba(16,185,129,0.25)' }}>
              <i className="bi bi-check-lg" /> Confirmer
            </button>
          )}
          {booking.status === 'confirmed' && (
            <button className="acb-btn acb-btn-primary acb-btn-sm" onClick={() => onAction?.('convert', booking)}
              style={{ background: '#8B5CF6', boxShadow: '0 2px 8px rgba(139,92,246,0.25)' }}>
              <i className="bi bi-ticket-perforated" /> Convertir en billet
            </button>
          )}
          {!['cancelled', 'expired', 'converted'].includes(booking.status) && (
            <button className="acb-btn acb-btn-sm acb-btn-danger" onClick={() => onAction?.('cancel', booking)}>
              <i className="bi bi-x-lg" /> Annuler
            </button>
          )}
        </div>
      </div>

      <div className="acb-detail-grid">
        {/* Client Info */}
        <div className="acb-detail-card">
          <div className="acb-detail-card-title">
            <i className="bi bi-person" /> Informations du client
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Nom</span>
            <span className="acb-detail-field-value">{booking.clientName}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Téléphone</span>
            <span className="acb-detail-field-value">{booking.phone}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Email</span>
            <span className="acb-detail-field-value">{booking.email || '—'}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Point de vente</span>
            <span className="acb-detail-field-value">{booking.salePoint}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Créée par</span>
            <span className="acb-detail-field-value">{booking.createdBy}</span>
          </div>
        </div>

        {/* Trip Info */}
        <div className="acb-detail-card">
          <div className="acb-detail-card-title">
            <i className="bi bi-geo-alt" /> Informations du voyage
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Trajet</span>
            <span className="acb-detail-field-value">{booking.from} → {booking.to}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Compagnie</span>
            <span className="acb-detail-field-value">{booking.company?.name || booking.companyId}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Durée</span>
            <span className="acb-detail-field-value">{booking.duration || '—'}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Distance</span>
            <span className="acb-detail-field-value">{booking.distance || '—'}</span>
          </div>
        </div>

        {/* Bus & Seats */}
        <div className="acb-detail-card">
          <div className="acb-detail-card-title">
            <i className="bi bi-bus-front" /> Bus & Sièges
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Bus</span>
            <span className="acb-detail-field-value">{booking.busPlate}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Modèle</span>
            <span className="acb-detail-field-value">{booking.busModel || '—'}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Sièges</span>
            <span className="acb-detail-field-value">{booking.seats.join(', ')}</span>
          </div>
          <div className="acb-detail-field">
            <span className="acb-detail-field-label">Nombre de places</span>
            <span className="acb-detail-field-value">{booking.seatCount || booking.seats.length}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="acb-detail-card">
          <div className="acb-detail-card-title">
            <i className="bi bi-credit-card" /> Paiement
          </div>
          {booking.payment ? (
            <>
              <div className="acb-detail-field">
                <span className="acb-detail-field-label">Méthode</span>
                <span className="acb-detail-field-value">
                  <i className={clsx('bi', getPaymentMethodIcon(booking.payment.method))} style={{ marginRight: 6 }} />
                  {booking.payment.method}
                </span>
              </div>
              <div className="acb-detail-field">
                <span className="acb-detail-field-label">Montant</span>
                <span className="acb-detail-field-value" style={{ fontWeight: 700, color: '#0B1D51' }}>
                  {formatCurrency(booking.payment.amount)}
                </span>
              </div>
              <div className="acb-detail-field">
                <span className="acb-detail-field-label">Statut</span>
                <span className="acb-detail-field-value">
                  <CounterBookingStatus status={booking.status} />
                </span>
              </div>
              {booking.payment.paidAt && (
                <div className="acb-detail-field">
                  <span className="acb-detail-field-label">Payé le</span>
                  <span className="acb-detail-field-value">{formatDateShort(booking.payment.paidAt)}</span>
                </div>
              )}
            </>
          ) : (
            <div style={{ color: '#9CA3AF', fontSize: 13, padding: '8px 0' }}>
              Aucun paiement enregistré
            </div>
          )}
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="acb-detail-card full">
            <div className="acb-detail-card-title">
              <i className="bi bi-chat" /> Commentaires
            </div>
            <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{booking.notes}</p>
          </div>
        )}

        {/* Timeline / History */}
        <div className="acb-detail-card full">
          <div className="acb-detail-card-title">
            <i className="bi bi-clock-history" /> Journal des actions
          </div>
          <CounterBookingTimeline history={booking.history} />
        </div>

        {/* Quick Actions */}
        <div className="acb-detail-card full">
          <div className="acb-detail-card-title">
            <i className="bi bi-lightning" /> Actions rapides
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="acb-btn acb-btn-outline acb-btn-sm" onClick={() => onAction?.('print', booking)}>
              <i className="bi bi-printer" /> Imprimer
            </button>
            <button className="acb-btn acb-btn-outline acb-btn-sm" onClick={() => onAction?.('download', booking)}>
              <i className="bi bi-download" /> Télécharger
            </button>
            <button className="acb-btn acb-btn-secondary acb-btn-sm" onClick={() => onAction?.('history', booking)}>
              <i className="bi bi-clock-history" /> Historique complet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterBookingDetails;
