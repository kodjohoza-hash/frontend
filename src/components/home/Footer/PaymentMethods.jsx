import { memo } from 'react';
import { PAYMENT_METHODS } from '@data/footer';

const PaymentMethods = memo(() => (
  <div className="btc-footer-payments">
    <h5 className="btc-footer-heading">Moyens de paiement</h5>
    <div className="btc-footer-payments-grid">
      {PAYMENT_METHODS.map((m) => (
        <div key={m.name} className="btc-footer-payment-item" title={m.name}>
          <i className={`bi ${m.icon}`} />
          <span>{m.name}</span>
        </div>
      ))}
    </div>
  </div>
));

PaymentMethods.displayName = 'PaymentMethods';
export default PaymentMethods;
