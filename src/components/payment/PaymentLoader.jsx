const PaymentLoader = ({ message = 'Traitement securise du paiement...' }) => (
  <div className="btc-payment-loader d-flex flex-column align-items-center justify-content-center py-5" role="alert" aria-busy="true">
    <div className="btc-loader-ring mb-4" />
    <div className="fw-semibold mb-2" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
      {message}
    </div>
    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
      Veuillez patienter. Ne fermez pas cette page.
    </div>
  </div>
);

export default PaymentLoader;
