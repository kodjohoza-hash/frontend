import AgencyBookingStatus from './AgencyBookingStatus';
import AgencyBookingTimeline from './AgencyBookingTimeline';
import {
  BOOKING_STATUS_LABELS,
  BOOKING_CHANNEL_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@data/bookingData';

function formatAmount(n) {
  return (n || 0).toLocaleString('fr-FR') + ' FCFA';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(d) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AgencyBookingDetails({
  booking,
  onBack,
  onConfirm,
  onCancel,
  onRefund,
  timeline,
}) {
  if (!booking) return null;

  const canConfirm = booking.status === 'en_attente' || booking.status === 'partiellement_payee';
  const canCancel =
    booking.status !== 'annulee' &&
    booking.status !== 'remboursee' &&
    booking.status !== 'expiree';
  const canRefund = booking.status === 'annulee';

  return (
    <div className="abr-detail">
      <div className="abr-detail__header">
        <div className="abr-detail__title-row">
          <button className="abr-detail__back" onClick={onBack}>
            <i className="bi bi-arrow-left" /> Retour aux réservations
          </button>
          <div className="abr-detail__title-info">
            <h2 className="abr-detail__id">{booking.id}</h2>
            <span className="abr-detail__route">
              {booking.trip.from} <i className="bi bi-arrow-right" /> {booking.trip.to}
            </span>
          </div>
          <AgencyBookingStatus status={booking.status} />
        </div>
      </div>

      <div className="abr-detail__grid">
        <div className="abr-detail__card">
          <h4 className="abr-detail__card-title">
            <i className="bi bi-person" /> Informations client
          </h4>
          <div className="abr-detail__fields">
            <div className="abr-detail__field">
              <span className="abr-detail__label">Nom complet</span>
              <span className="abr-detail__value">
                {booking.client.firstName} {booking.client.lastName}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Téléphone</span>
              <span className="abr-detail__value">
                <i className="bi bi-telephone" /> {booking.client.phone}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Email</span>
              <span className="abr-detail__value">
                {booking.client.email || '—'}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Canal</span>
              <span className="abr-detail__value">
                {BOOKING_CHANNEL_LABELS[booking.channel] || booking.channel}
              </span>
            </div>
          </div>
        </div>

        <div className="abr-detail__card">
          <h4 className="abr-detail__card-title">
            <i className="bi bi-bus-front" /> Détails du voyage
          </h4>
          <div className="abr-detail__fields">
            <div className="abr-detail__field">
              <span className="abr-detail__label">Trajet</span>
              <span className="abr-detail__value">
                {booking.trip.from} → {booking.trip.to}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Date</span>
              <span className="abr-detail__value">{formatDate(booking.trip.date)}</span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Heure de départ</span>
              <span className="abr-detail__value">
                <i className="bi bi-clock" /> {booking.trip.departure}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Heure d'arrivée</span>
              <span className="abr-detail__value">
                <i className="bi bi-clock" /> {booking.trip.arrival}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Bus</span>
              <span className="abr-detail__value">
                {booking.bus.name} ({booking.bus.plate})
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Type</span>
              <span className="abr-detail__value abr-detail__value--type">{booking.bus.type}</span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Places</span>
              <span className="abr-detail__value">
                {booking.seats.join(', ')} ({booking.seatCount} {booking.seatCount > 1 ? 'places' : 'place'})
              </span>
            </div>
          </div>
        </div>

        <div className="abr-detail__card">
          <h4 className="abr-detail__card-title">
            <i className="bi bi-credit-card" /> Informations de paiement
          </h4>
          <div className="abr-detail__fields">
            <div className="abr-detail__field">
              <span className="abr-detail__label">Montant total</span>
              <span className="abr-detail__value abr-detail__value--amount">
                {formatAmount(booking.amount)}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Réduction</span>
              <span className="abr-detail__value">
                {booking.discount > 0 ? '-' + formatAmount(booking.discount) : '—'}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Montant payé</span>
              <span className="abr-detail__value abr-detail__value--paid">
                {formatAmount(booking.paidAmount)}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Mode de paiement</span>
              <span className="abr-detail__value">
                {booking.paymentMethod
                  ? PAYMENT_METHOD_LABELS[booking.paymentMethod] || booking.paymentMethod
                  : '—'}
              </span>
            </div>
            <div className="abr-detail__field">
              <span className="abr-detail__label">Statut du paiement</span>
              <span className="abr-detail__value">
                {BOOKING_STATUS_LABELS[booking.status] || booking.status}
              </span>
            </div>
          </div>
          {booking.notes && (
            <div className="abr-detail__notes">
              <i className="bi bi-info-circle" />
              <span>{booking.notes}</span>
            </div>
          )}
        </div>
      </div>

      {timeline && timeline.length > 0 && (
        <div className="abr-detail__card abr-detail__card--timeline">
          <h4 className="abr-detail__card-title">
            <i className="bi bi-hourglass-split" /> Chronologie
          </h4>
          <AgencyBookingTimeline events={timeline} />
        </div>
      )}

      <div className="abr-detail__actions">
        <h4 className="abr-detail__actions-title">
          <i className="bi bi-lightning" /> Actions rapides
        </h4>
        <div className="abr-detail__actions-row">
          {canConfirm && (
            <button className="abr-btn abr-btn--success" onClick={() => onConfirm(booking)}>
              <i className="bi bi-check-circle" /> Confirmer
            </button>
          )}
          {canCancel && (
            <button className="abr-btn abr-btn--danger" onClick={() => onCancel(booking)}>
              <i className="bi bi-x-circle" /> Annuler
            </button>
          )}
          {canRefund && (
            <button className="abr-btn abr-btn--primary" onClick={() => onRefund(booking)}>
              <i className="bi bi-arrow-counterclockwise" /> Rembourser
            </button>
          )}
          <button className="abr-btn abr-btn--outline">
            <i className="bi bi-printer" /> Imprimer
          </button>
          <button className="abr-btn abr-btn--outline">
            <i className="bi bi-download" /> Télécharger
          </button>
          <button className="abr-btn abr-btn--outline">
            <i className="bi bi-envelope" /> Email
          </button>
          <button className="abr-btn abr-btn--outline">
            <i className="bi bi-phone" /> SMS
          </button>
        </div>
      </div>

      <div className="abr-detail__meta">
        <div className="abr-detail__field">
          <span className="abr-detail__label">Point de vente</span>
          <span className="abr-detail__value">{booking.outlet || '—'}</span>
        </div>
        <div className="abr-detail__field">
          <span className="abr-detail__label">Agent</span>
          <span className="abr-detail__value">{booking.agent || '—'}</span>
        </div>
        <div className="abr-detail__field">
          <span className="abr-detail__label">Créé le</span>
          <span className="abr-detail__value">{formatDateTime(booking.createdAt)}</span>
        </div>
        <div className="abr-detail__field">
          <span className="abr-detail__label">Mis à jour le</span>
          <span className="abr-detail__value">{formatDateTime(booking.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
