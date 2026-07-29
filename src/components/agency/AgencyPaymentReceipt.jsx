import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '@data/paymentData';
import AppLogo from '@components/common/AppLogo';

function formatAmount(n) {
  return (n || 0).toLocaleString('fr-FR') + ' FCFA';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function AgencyPaymentReceipt({ payment, onClose }) {
  const fields = [
    { label: 'Référence', value: payment.id },
    { label: 'Réservation', value: payment.bookingId },
    { label: 'Date', value: formatDate(payment.createdAt) },
    { label: 'Client', value: `${payment.client.firstName} ${payment.client.lastName}` },
    { label: 'Téléphone', value: payment.client.phone },
    { label: 'Trajet', value: payment.route },
    { label: 'Date du voyage', value: formatDate(payment.tripDate) },
    { label: 'Places', value: payment.seats.join(', ') },
    { label: 'Montant', value: formatAmount(payment.amount) },
    { label: 'Réduction', value: formatAmount(payment.discount) },
    { label: 'Frais', value: formatAmount(payment.fees) },
    { label: 'Mode de paiement', value: PAYMENT_METHOD_LABELS[payment.method] || payment.method },
    { label: 'Statut', value: PAYMENT_STATUS_LABELS[payment.status] || payment.status },
  ];

  return (
    <div className="ap-receipt-overlay">
      <div className="ap-receipt">
        <div className="ap-receipt__header">
          <AppLogo size={40} variant="icon-only" />
          <h2 className="ap-receipt__brand">BUS TIX CONNECT</h2>
          <p className="ap-receipt__title">Reçu de paiement</p>
        </div>

        <div className="ap-receipt__body">
          {fields.map((field) => (
            <div className="ap-receipt__row" key={field.label}>
              <span className="ap-receipt__label">{field.label}</span>
              <span className="ap-receipt__value">{field.value}</span>
            </div>
          ))}

          <div className="ap-receipt__total">
            <span className="ap-receipt__label ap-receipt__label--total">Total payé</span>
            <span className="ap-receipt__value ap-receipt__value--total">
              {formatAmount(payment.totalPaid)}
            </span>
          </div>
        </div>

        <div className="ap-receipt__footer">
          <p className="ap-receipt__footer-text">
            Merci pour votre confiance — BUS TIX CONNECT
          </p>
        </div>

        <div className="ap-receipt__actions">
          <button type="button" className="ap-receipt__btn ap-receipt__btn--download">
            <i className="bi bi-download" /> Télécharger
          </button>
          <button
            type="button"
            className="ap-receipt__btn ap-receipt__btn--print"
            onClick={() => window.print()}
          >
            <i className="bi bi-printer" /> Imprimer
          </button>
          <button
            type="button"
            className="ap-receipt__btn ap-receipt__btn--close"
            onClick={onClose}
          >
            <i className="bi bi-x-lg" /> Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
