import React from 'react';
import { Link } from 'react-router-dom';

const keyframes = `
  @keyframes btcScaleIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes btcModalOverlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes btcConfetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-60px) rotate(360deg); opacity: 0; }
  }
`;

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(11, 29, 81, 0.5)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'btcModalOverlayIn 0.3s ease',
    padding: 20,
  },
  modal: {
    background: '#fff',
    borderRadius: 'var(--radius-2xl)',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.2)',
    maxWidth: 420,
    width: '100%',
    padding: '32px 28px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    animation: 'btcScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
  },
  checkIcon: {
    fontSize: '2rem',
    color: 'var(--color-success)',
  },
  confettiDot: (i) => ({
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: ['#FF6B35', '#10B981', '#F59E0B', '#0B1D51', '#EF4444'][i % 5],
    top: '50%',
    left: '50%',
    animation: `btcConfetti 1s ease ${i * 0.1}s forwards`,
    opacity: 0,
  }),
  title: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  infoBox: {
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-gray-50)',
    padding: '14px 16px',
    marginBottom: 24,
    textAlign: 'left',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
  },
  infoValue: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  infoValueAccent: {
    fontSize: '0.82rem',
    fontWeight: 800,
    color: 'var(--color-accent)',
  },
  routeLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    padding: '8px 0',
    borderTop: '1px solid var(--color-gray-100)',
    marginTop: 6,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 24px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-accent)',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: 'inherit',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  outlineBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: 'var(--radius-lg)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.82rem',
    fontWeight: 600,
    border: '2px solid var(--color-gray-200)',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
  },
};

const PaymentSuccessModal = React.memo(({ transaction }) => (
  <>
    <style>{keyframes}</style>
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label="Paiement réussi">
      <div style={styles.modal}>
        <div style={styles.checkCircle}>
          <i className="bi bi-check-lg" style={styles.checkIcon} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} style={styles.confettiDot(i)} />
          ))}
        </div>

        <h2 style={styles.title}>Paiement réussi !</h2>
        <p style={styles.subtitle}>
          Votre réservation a été confirmée avec succès.
        </p>

        {transaction && (
          <div style={styles.infoBox}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>N° Transaction</span>
              <span style={styles.infoValue}>{transaction.transactionId}</span>
            </div>
            <div style={styles.infoRowLast}>
              <span style={styles.infoLabel}>Montant payé</span>
              <span style={styles.infoValueAccent}>{transaction.amount?.toLocaleString()} FCFA</span>
            </div>
            {transaction.route && (
              <div style={styles.routeLine}>
                <span>{transaction.route.from}</span>
                <i className="bi bi-arrow-right" style={{ color: 'var(--color-accent)', fontSize: '0.7rem' }} />
                <span>{transaction.route.to}</span>
              </div>
            )}
          </div>
        )}

        <div style={styles.buttons}>
          <Link to="/booking/confirmation" style={styles.primaryBtn}>
            <i className="bi bi-ticket-perforated" />
            Voir mon billet
          </Link>
          <Link to="/" style={styles.outlineBtn}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  </>
));

export default PaymentSuccessModal;
