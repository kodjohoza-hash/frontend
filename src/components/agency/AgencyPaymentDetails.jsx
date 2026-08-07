import AgencyPaymentStatus from './AgencyPaymentStatus';
import AgencyPaymentTimeline from './AgencyPaymentTimeline';
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@data/paymentData';

function formatAmount(n) {
  return (n || 0).toLocaleString('fr-FR') + ' XAF';
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

export default function AgencyPaymentDetails({
  payment,
  onBack,
  onEdit,
  onValidate,
  onCancel,
  onRefund,
  timeline,
}) {
  if (!payment) return null;

  const canEdit = payment.status === 'en_attente';
  const canValidate = payment.status === 'en_attente';
  const canCancel = payment.status === 'en_attente';
  const canRefund = payment.status === 'paye';

  return (
    <div className="ap-detail">
      <div className="ap-detail__header">
        <div className="ap-detail__title-row">
          <button className="ap-detail__back" onClick={onBack}>
            <i className="bi bi-arrow-left" /> Retour aux paiements
          </button>
          <div className="ap-detail__title-info">
            <h2 className="ap-detail__id">{payment.id}</h2>
            <span className="ap-detail__route">{payment.route}</span>
          </div>
          <AgencyPaymentStatus status={payment.status} />
        </div>
      </div>

      <div className="ap-detail__grid">
        <div className="ap-detail__card">
          <h4 className="ap-detail__card-title">
            <i className="bi bi-credit-card" /> Informations de paiement
          </h4>
          <div className="ap-detail__fields">
            <div className="ap-detail__field">
              <span className="ap-detail__label">Référence</span>
              <span className="ap-detail__value">{payment.id}</span>
            </div>
            <div className="ap-detail__field">
              <span className="ap-detail__label">Montant</span>
              <span className="ap-detail__value ap-detail__value--amount">
                {formatAmount(payment.amount)}
              </span>
            </div>
            {payment.fees > 0 && (
              <div className="ap-detail__field">
                <span className="ap-detail__label">Frais</span>
                <span className="ap-detail__value">{formatAmount(payment.fees)}</span>
              </div>
            )}
            {payment.discount > 0 && (
              <div className="ap-detail__field">
                <span className="ap-detail__label">Réduction</span>
                <span className="ap-detail__value">-{formatAmount(payment.discount)}</span>
              </div>
            )}
            <div className="ap-detail__field">
              <span className="ap-detail__label">Total payé</span>
              <span className="ap-detail__value ap-detail__value--paid">
                {formatAmount(payment.totalPaid)}
              </span>
            </div>
            <div className="ap-detail__field">
              <span className="ap-detail__label">Mode de paiement</span>
              <span className="ap-detail__value">
                {PAYMENT_METHOD_LABELS[payment.method] || payment.method}
              </span>
            </div>
            <div className="ap-detail__field">
              <span className="ap-detail__label">Statut</span>
              <span className="ap-detail__value">
                {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
              </span>
            </div>
            <div className="ap-detail__field">
              <span className="ap-detail__label">Date</span>
              <span className="ap-detail__value">{formatDate(payment.createdAt)}</span>
            </div>
          </div>
          {payment.notes && (
            <div className="ap-detail__notes">
              <i className="bi bi-info-circle" />
              <span>{payment.notes}</span>
            </div>
          )}
        </div>

        <div className="ap-detail__card">
          <h4 className="ap-detail__card-title">
            <i className="bi bi-person" /> Informations client
          </h4>
          <div className="ap-detail__fields">
            <div className="ap-detail__field">
              <span className="ap-detail__label">Nom complet</span>
              <span className="ap-detail__value">
                {payment.client.firstName} {payment.client.lastName}
              </span>
            </div>
            <div className="ap-detail__field">
              <span className="ap-detail__label">Téléphone</span>
              <span className="ap-detail__value">
                <i className="bi bi-telephone" /> {payment.client.phone}
              </span>
            </div>
            <div className="ap-detail__field">
              <span className="ap-detail__label">Email</span>
              <span className="ap-detail__value">
                {payment.client.email || '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="ap-detail__card">
          <h4 className="ap-detail__card-title">
            <i className="bi bi-bus-front" /> Informations réservation
          </h4>
          <div className="ap-detail__fields">
            <div className="ap-detail__field">
              <span className="ap-detail__label">Réservation</span>
              <span className="ap-detail__value">{payment.bookingId}</span>
            </div>
            <div className="ap-detail__field">
              <span className="ap-detail__label">Trajet</span>
              <span className="ap-detail__value">{payment.route}</span>
            </div>
            <div className="ap-detail__field">
              <span className="ap-detail__label">Date du voyage</span>
              <span className="ap-detail__value">{formatDate(payment.tripDate)}</span>
            </div>
            <div className="ap-detail__field">
              <span className="ap-detail__label">Places</span>
              <span className="ap-detail__value">
                {payment.seats.join(', ')} ({payment.seats.length} {payment.seats.length > 1 ? 'places' : 'place'})
              </span>
            </div>
          </div>
        </div>

        {timeline && timeline.length > 0 && (
          <div className="ap-detail__card ap-detail__card--timeline">
            <h4 className="ap-detail__card-title">
              <i className="bi bi-hourglass-split" /> Chronologie
            </h4>
            <AgencyPaymentTimeline events={timeline} />
          </div>
        )}
      </div>

      <div className="ap-detail__actions">
        <h4 className="ap-detail__actions-title">
          <i className="bi bi-lightning" /> Actions rapides
        </h4>
        <div className="ap-detail__actions-row">
          {canEdit && (
            <button className="ap-btn ap-btn--warning" onClick={() => onEdit(payment)}>
              <i className="bi bi-pencil" /> Modifier
            </button>
          )}
          {canValidate && (
            <button className="ap-btn ap-btn--success" onClick={() => onValidate(payment)}>
              <i className="bi bi-check-circle" /> Valider
            </button>
          )}
          {canCancel && (
            <button className="ap-btn ap-btn--danger" onClick={() => onCancel(payment)}>
              <i className="bi bi-x-circle" /> Annuler
            </button>
          )}
          {canRefund && (
            <button className="ap-btn ap-btn--primary" onClick={() => onRefund(payment)}>
              <i className="bi bi-arrow-counterclockwise" /> Rembourser
            </button>
          )}
          <button className="ap-btn ap-btn--outline">
            <i className="bi bi-download" /> Télécharger le reçu
          </button>
          <button className="ap-btn ap-btn--outline">
            <i className="bi bi-printer" /> Imprimer le reçu
          </button>
        </div>
      </div>

      <div className="ap-detail__meta">
        <div className="ap-detail__field">
          <span className="ap-detail__label">Point de vente</span>
          <span className="ap-detail__value">{payment.outlet || '—'}</span>
        </div>
        <div className="ap-detail__field">
          <span className="ap-detail__label">Agent</span>
          <span className="ap-detail__value">{payment.agent || '—'}</span>
        </div>
        <div className="ap-detail__field">
          <span className="ap-detail__label">Réf. transaction</span>
          <span className="ap-detail__value">{payment.transactionRef || '—'}</span>
        </div>
        <div className="ap-detail__field">
          <span className="ap-detail__label">Créé le</span>
          <span className="ap-detail__value">{formatDateTime(payment.createdAt)}</span>
        </div>
        <div className="ap-detail__field">
          <span className="ap-detail__label">Mis à jour le</span>
          <span className="ap-detail__value">{formatDateTime(payment.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
