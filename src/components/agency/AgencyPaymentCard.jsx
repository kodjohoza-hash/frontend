import AgencyPaymentStatus from './AgencyPaymentStatus';
import { PAYMENT_METHOD_LABELS, PAYMENT_METHOD_ICONS } from '@data/paymentData';

function formatAmount(n) {
  return (n || 0).toLocaleString('fr-FR') + ' XAF';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AgencyPaymentCard({ payment, onView }) {
  return (
    <div className="ap-mobile-card" onClick={() => onView(payment)}>
      <div className="ap-mobile-card__header">
        <span className="ap-mobile-card__id">{payment.id}</span>
        <AgencyPaymentStatus status={payment.status} />
      </div>
      <div className="ap-mobile-card__body">
        <div className="ap-mobile-card__row">
          <span className="ap-mobile-card__label">Client</span>
          <span className="ap-mobile-card__value">{payment.client.firstName} {payment.client.lastName}</span>
        </div>
        <div className="ap-mobile-card__row">
          <span className="ap-mobile-card__label">Trajet</span>
          <span className="ap-mobile-card__value">{payment.route}</span>
        </div>
        <div className="ap-mobile-card__row">
          <span className="ap-mobile-card__label">Date</span>
          <span className="ap-mobile-card__value">{formatDate(payment.createdAt)}</span>
        </div>
      </div>
      <div className="ap-mobile-card__footer">
        <div className="ap-mobile-card__method">
          <span className={`ap-table__method-icon ap-table__method-icon--${payment.method}`}>
            {PAYMENT_METHOD_ICONS[payment.method]}
          </span>
          <span className="ap-mobile-card__value">{PAYMENT_METHOD_LABELS[payment.method]}</span>
        </div>
        <span className="ap-mobile-card__amount">{formatAmount(payment.totalPaid)}</span>
      </div>
    </div>
  );
}
