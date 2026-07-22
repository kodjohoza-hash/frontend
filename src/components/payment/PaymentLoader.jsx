import React from 'react';

const keyframes = `
  @keyframes btcSpinnerRotate {
    to { transform: rotate(360deg); }
  }
  @keyframes btcShimmer {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }
`;

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(11, 29, 81, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  ring: {
    width: 64,
    height: 64,
    border: '4px solid rgba(255, 107, 53, 0.15)',
    borderTopColor: 'var(--color-accent)',
    borderRadius: '50%',
    animation: 'btcSpinnerRotate 0.8s linear infinite',
    marginBottom: 24,
  },
  title: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    animation: 'btcShimmer 2s ease-in-out infinite',
  },
  subtitle: {
    fontSize: '0.78rem',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 1.4,
  },
};

const PaymentLoader = React.memo(({ message = 'Traitement sécurisé du paiement...' }) => (
  <>
    <style>{keyframes}</style>
    <div style={styles.overlay} role="alert" aria-busy="true" aria-label="Traitement du paiement en cours">
      <div style={styles.ring} />
      <div style={styles.title}>{message}</div>
      <div style={styles.subtitle}>
        Veuillez patienter. Ne fermez pas cette page.
      </div>
    </div>
  </>
));

export default PaymentLoader;
