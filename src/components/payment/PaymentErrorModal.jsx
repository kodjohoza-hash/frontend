const PaymentErrorModal = ({ error, onRetry, onClose }) => (
  <div className="btc-modal-overlay" role="dialog" aria-modal="true" aria-label="Erreur de paiement">
    <div className="btc-modal-content" style={{ maxWidth: 420 }}>
      <div className="text-center mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-danger-50)' }}
        >
          <i className="bi bi-x-lg" style={{ fontSize: '1.5rem', color: 'var(--color-danger)' }} />
        </div>
        <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Paiement echoue</h5>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          {error || "Une erreur est survenue lors du paiement. Veuillez reessayer."}
        </p>
      </div>
      <div className="d-flex gap-2">
        <button onClick={onClose} className="btn btn-outline-secondary flex-fill" style={{ borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)' }}>
          Annuler
        </button>
        <button onClick={onRetry} className="btn btn-accent flex-fill" style={{ borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
          Reessayer
        </button>
      </div>
    </div>
  </div>
);

export default PaymentErrorModal;
