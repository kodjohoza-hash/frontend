import React, { memo } from 'react';

const s = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '440px',
    background: '#0f172a',
    borderRadius: '24px',
    padding: '36px 28px 28px',
    position: 'relative',
    overflow: 'hidden',
    animation: 'btcModalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: "'Inter', sans-serif",
  },
  errorCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ef4444, #f87171)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: '#fff',
    fontSize: '32px',
    boxShadow: '0 0 40px rgba(239,68,68,0.4), 0 0 80px rgba(239,68,68,0.15)',
    animation: 'btcBounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
  },
  title: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '10px',
    fontFamily: "'Inter', sans-serif",
  },
  message: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '28px',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
    letterSpacing: '0.02em',
  },
  btnOutline: {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    border: '1.5px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s ease',
  },
};

const PayErrorModal = memo(({ message, onRetry, onBack }) => {
  return (
    <div style={s.backdrop} role="dialog" aria-modal="true" aria-label="Échec du paiement">
      <style>{`
        @keyframes btcModalIn { 0% { opacity:0; transform: scale(0.85) translateY(20px); } 100% { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes btcBounceIn { 0% { opacity:0; transform: scale(0); } 60% { transform: scale(1.15); } 100% { opacity:1; transform: scale(1); } }
      `}</style>
      <div style={s.modal}>
        <div style={s.errorCircle}>
          <i className="bi bi-x-lg" />
        </div>

        <h2 style={s.title}>Échec du paiement</h2>
        <p style={s.message}>
          {message || 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.'}
        </p>

        <div style={s.actions}>
          <button
            style={s.btnPrimary}
            onClick={onRetry}
            aria-label="Réessayer le paiement"
          >
            Réessayer
          </button>
          <button
            style={s.btnOutline}
            onClick={onBack}
            aria-label="Retour"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
});

PayErrorModal.displayName = 'PayErrorModal';
export default PayErrorModal;
