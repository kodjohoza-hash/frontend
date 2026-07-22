import React, { memo } from 'react';

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    gap: '24px',
  },
  ringOuter: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'btcSpin 1.2s linear infinite',
  },
  ringInner: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: '3px solid transparent',
    borderTopColor: '#6366f1',
    borderRightColor: '#818cf8',
    animation: 'btcSpinReverse 0.8s linear infinite',
  },
  text: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '15px',
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    animation: 'btcPulse 1.5s ease-in-out infinite',
  },
};

const PayProcessing = memo(() => {
  return (
    <div style={s.overlay} role="alert" aria-label="Traitement du paiement en cours">
      <style>{`
        @keyframes btcSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes btcSpinReverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
        @keyframes btcPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
      <div style={s.ringOuter}>
        <div style={s.ringInner} />
      </div>
      <div style={s.text}>Traitement en cours...</div>
    </div>
  );
});

PayProcessing.displayName = 'PayProcessing';
export default PayProcessing;
