import { useState } from 'react';
import clsx from 'clsx';
import { paymentMethods } from '@data/counterSaleData';

const CounterPaymentForm = ({ trip, search, onComplete, onBack }) => {
  const basePrice = trip.basePrice * search.passengers;
  const discount = 0;
  const subtotal = basePrice - discount;
  const taxes = Math.round(subtotal * 0.05);
  const serviceFee = 500;
  const total = subtotal + taxes + serviceFee;
  const [method, setMethod] = useState('');
  const [cashGiven, setCashGiven] = useState('');
  const change = method === 'cash' && cashGiven ? Math.max(0, Number(cashGiven) - total) : 0;

  const handleConfirm = () => {
    if (!method) return;
    onComplete({ method, cashGiven: Number(cashGiven) || 0, change });
  };

  return (
    <div>
      <div className="acs-step__header">
        <h2 className="acs-step__title">Paiement</h2>
        <p className="acs-step__desc">Sélectionnez le mode de paiement</p>
      </div>

      <div className="acs-payment">
        <div>
          <div className="acs-payment__methods">
            {paymentMethods.map((pm) => (
              <div key={pm.id} className={clsx('acs-payment__method', method === pm.id && 'acs-payment__method--selected')} onClick={() => setMethod(pm.id)}>
                <div className="acs-payment__method-icon" style={{ background: pm.color }}>
                  <i className={`bi ${pm.icon}`} />
                </div>
                <div className="acs-payment__method-info">
                  <div className="acs-payment__method-label">{pm.label}</div>
                  <div className="acs-payment__method-desc">Paiement sécurisé</div>
                </div>
                <div className="acs-payment__method-check">
                  <i className="bi bi-check" />
                </div>
              </div>
            ))}
          </div>

          {method === 'cash' && (
            <div className="acs-payment__cash-section">
              <div className="acs-payment__cash-label">Montant reçu</div>
              <input className="acs-payment__cash-input" type="number" placeholder="0" value={cashGiven} onChange={(e) => setCashGiven(e.target.value)} min={total} />
              {Number(cashGiven) >= total && (
                <div className="acs-payment__change">
                  <span>Monnaie à rendre</span>
                  <span>{change.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="acs-payment__summary">
          <div className="acs-payment__summary-title">Récapitulatif</div>
          <div className="acs-payment__summary-row">
            <span>Prix de base ({search.passengers} passager{search.passengers > 1 ? 's' : ''})</span>
            <span className="acs-payment__summary-value">{basePrice.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="acs-payment__summary-row">
            <span>Réduction</span>
            <span className="acs-payment__summary-value" style={{ color: 'var(--act-success)' }}>{discount > 0 ? `-${discount.toLocaleString('fr-FR')} FCFA` : '—'}</span>
          </div>
          <div className="acs-payment__summary-row">
            <span>Taxes (5%)</span>
            <span className="acs-payment__summary-value">{taxes.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="acs-payment__summary-row">
            <span>Frais de service</span>
            <span className="acs-payment__summary-value">{serviceFee.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="acs-payment__summary-row acs-payment__summary-row--total">
            <span>Total</span>
            <span>{total.toLocaleString('fr-FR')} FCFA</span>
          </div>

          <div className="acs-step__nav" style={{ marginTop: 20 }}>
            <button type="button" className="acs-btn acs-btn--ghost" onClick={onBack}>
              <i className="bi bi-arrow-left" /> Retour
            </button>
            <button type="button" className="acs-btn acs-btn--success" disabled={!method || (method === 'cash' && (!cashGiven || Number(cashGiven) < total))} onClick={handleConfirm}>
              Confirmer le paiement <i className="bi bi-check-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterPaymentForm;
