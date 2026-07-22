import { memo } from 'react';

const CnPaymentInfo = memo(({ payment }) => {
  const date = new Date(payment.paidAt);
  return (
    <div className="cn-card">
      <h3 className="cn-card__title">
        <i className="bi bi-credit-card-fill" />
        Détails du paiement
      </h3>
      <div className="cn-pay">
        <div className="cn-pay__row">
          <span>Méthode</span>
          <span className="cn-pay__val">{payment.method}</span>
        </div>
        <div className="cn-pay__row">
          <span>Sous-total</span>
          <span>{payment.subtotal.toLocaleString()} FCFA</span>
        </div>
        {payment.insurance > 0 && (
          <div className="cn-pay__row">
            <span>Assurance</span>
            <span>{payment.insurance.toLocaleString()} FCFA</span>
          </div>
        )}
        <div className="cn-pay__row">
          <span>Frais</span>
          <span>{payment.fees.toLocaleString()} FCFA</span>
        </div>
        <div className="cn-pay__divider" />
        <div className="cn-pay__total">
          <span>Total payé</span>
          <span>{payment.amount.toLocaleString()} FCFA</span>
        </div>
        <div className="cn-pay__divider" />
        <div className="cn-pay__meta">
          <div className="cn-pay__row cn-pay__row--sm">
            <span>Date</span>
            <span>{date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="cn-pay__row cn-pay__row--sm">
            <span>N° Transaction</span>
            <span className="cn-pay__mono">{payment.transactionId}</span>
          </div>
          <div className="cn-pay__row cn-pay__row--sm">
            <span>Statut</span>
            <span className="cn-pay__ok"><i className="bi bi-check-circle-fill" /> Payé</span>
          </div>
        </div>
      </div>
    </div>
  );
});
CnPaymentInfo.displayName = 'CnPaymentInfo';
export default CnPaymentInfo;
