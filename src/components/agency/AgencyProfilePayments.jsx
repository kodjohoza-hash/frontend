export default function AgencyProfilePayments({ payments }) {
  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-credit-card" /> Moyens de paiement</h3>
      </div>
      <div className="apro-section__body">
        <div className="apro-payment-grid">
          {payments.map((pm) => (
            <div key={pm.id} className="apro-payment-item">
              <div className="apro-payment-item__icon">
                <i className={`bi ${pm.icon}`} />
              </div>
              <div className="apro-payment-item__info">
                <div className="apro-payment-item__name">{pm.name}</div>
              </div>
              <span className={`apro-payment-item__status apro-payment-item__status--${pm.enabled ? 'active' : 'inactive'}`}>
                <i className={`bi ${pm.enabled ? 'bi-check-circle' : 'bi-x-circle'}`} />
                {pm.enabled ? 'Actif' : 'Inactif'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
