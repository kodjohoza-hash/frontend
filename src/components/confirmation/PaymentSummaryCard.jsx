const PaymentSummaryCard = ({ payment }) => {
  const date = new Date(payment.paidAt);

  return (
    <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="card-body p-4">
        <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
          <i className="bi bi-credit-card-fill me-2" style={{ color: 'var(--color-accent)' }} />
          Details du paiement
        </h6>

        <div className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Methode</span>
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{payment.method}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Sous-total</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{payment.subtotal.toLocaleString()} FCFA</span>
          </div>
          {payment.insurance > 0 && (
            <div className="d-flex justify-content-between">
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Assurance</span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{payment.insurance.toLocaleString()} FCFA</span>
            </div>
          )}
          <div className="d-flex justify-content-between">
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Frais</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{payment.fees.toLocaleString()} FCFA</span>
          </div>
          <div className="d-flex justify-content-between pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <span className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>Total paye</span>
            <span className="fw-bold" style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-accent)' }}>{payment.amount.toLocaleString()} FCFA</span>
          </div>
        </div>

        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="d-flex justify-content-between mb-1">
            <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>Date</span>
            <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-secondary)' }}>
              {date.toLocaleDateString('fr-FR')} a {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>N° Transaction</span>
            <span className="fw-medium" style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-primary)' }}>{payment.transactionId}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>Statut</span>
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--color-success)' }}>
              <i className="bi bi-check-circle-fill me-1" />
              Paye
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
