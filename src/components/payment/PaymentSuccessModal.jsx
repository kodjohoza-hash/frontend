import { Link } from 'react-router-dom';

const PaymentSuccessModal = ({ transaction }) => (
  <div className="btc-modal-overlay" role="dialog" aria-modal="true" aria-label="Paiement reussi">
    <div className="btc-modal-content" style={{ maxWidth: 420 }}>
      <div className="text-center mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center mx-auto mb-3 btc-success-check"
          style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-success-50)' }}
        >
          <i className="bi bi-check-lg" style={{ fontSize: '2rem', color: 'var(--color-success)' }} />
        </div>
        <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Paiement reussi !</h5>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          Votre reservation a ete confirmee avec succes.
        </p>
      </div>

      {transaction && (
        <div className="p-3 mb-3" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
          <div className="d-flex justify-content-between mb-1">
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>N° Transaction</span>
            <span className="fw-semibold" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-primary)' }}>{transaction.transactionId}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Montant</span>
            <span className="fw-bold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent)' }}>{transaction.amount?.toLocaleString()} FCFA</span>
          </div>
        </div>
      )}

      <div className="d-flex flex-column gap-2">
        <Link to="/booking/confirmation" className="btn btn-accent w-100" style={{ borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
          <i className="bi bi-ticket-perforated me-2" />
          Voir mon billet
        </Link>
        <Link to="/" className="btn btn-outline-secondary w-100" style={{ borderRadius: 'var(--radius-lg)', fontSize: 'var(--font-size-sm)' }}>
          Retour a l'accueil
        </Link>
      </div>
    </div>
  </div>
);

export default PaymentSuccessModal;
