import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

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
    animation: 'btcModalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: "'Inter', sans-serif",
    textAlign: 'center',
  },
  clockCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: '#fff',
    fontSize: '30px',
    boxShadow: '0 0 40px rgba(245,158,11,0.3)',
    animation: 'btcBounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '10px',
    fontFamily: "'Inter', sans-serif",
  },
  message: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '28px',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
  },
  btn: {
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
};

const PayExpiredModal = memo(() => {
  const navigate = useNavigate();

  return (
    <div style={s.backdrop} role="dialog" aria-modal="true" aria-label="Délai expiré">
      <style>{`
        @keyframes btcModalIn { 0% { opacity:0; transform: scale(0.85) translateY(20px); } 100% { opacity:1; transform: scale(1) translateY(0); } }
        @keyframes btcBounceIn { 0% { opacity:0; transform: scale(0); } 60% { transform: scale(1.15); } 100% { opacity:1; transform: scale(1); } }
      `}</style>
      <div style={s.modal}>
        <div style={s.clockCircle}>
          <i className="bi bi-clock-history" />
        </div>

        <h2 style={s.title}>Délai expiré</h2>
        <p style={s.message}>
          Le temps imparti pour compléter votre réservation a expiré.<br />
          Les sièges ont été libérés et sont à nouveau disponibles.
        </p>

        <button
          style={s.btn}
          onClick={() => navigate('/')}
          aria-label="Retour à la recherche"
        >
          Retour à la recherche
        </button>
      </div>
    </div>
  );
});

PayExpiredModal.displayName = 'PayExpiredModal';
export default PayExpiredModal;
