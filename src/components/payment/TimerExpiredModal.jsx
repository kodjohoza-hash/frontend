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
    maxWidth: 400,
    width: '100%',
    padding: '32px 28px',
    textAlign: 'center',
  },
  clockCircle: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(245, 158, 11, 0.1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    animation: 'btcScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  clockIcon: {
    fontSize: '1.8rem',
    color: 'var(--color-warning)',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    marginBottom: 10,
  },
  message: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    marginBottom: 28,
    lineHeight: 1.5,
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 28px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-primary)',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: 'inherit',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
};

const TimerExpiredModal = React.memo(() => (
  <>
    <style>{keyframes}</style>
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label="Délai expiré">
      <div style={styles.modal}>
        <div style={styles.clockCircle}>
          <i className="bi bi-clock-history" style={styles.clockIcon} />
        </div>

        <h2 style={styles.title}>Délai expiré</h2>
        <p style={styles.message}>
          Votre réservation a expiré. Les sièges ont été libérés et sont à nouveau disponibles.
        </p>

        <Link to="/booking/search" style={styles.primaryBtn}>
          <i className="bi bi-search" />
          Retour à la recherche
        </Link>
      </div>
    </div>
  </>
));

export default TimerExpiredModal;
