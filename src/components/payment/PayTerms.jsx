import React, { memo, useCallback } from 'react';

const s = {
  wrapper: {
    marginTop: '20px',
    fontFamily: "'Inter', sans-serif",
  },
  policyItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '10px',
  },
  policyIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '12px',
    flexShrink: 0,
    marginTop: '1px',
  },
  policyText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
    fontFamily: "'Inter', sans-serif",
  },
  divider: {
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
    margin: '16px 0',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  checkbox: (isAccepted) => ({
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    border: `2px solid ${isAccepted ? '#6366f1' : 'rgba(255,255,255,0.2)'}`,
    background: isAccepted ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
    boxShadow: isAccepted ? '0 0 12px rgba(99,102,241,0.4)' : 'none',
  }),
  checkIcon: {
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    animation: 'btcCheckIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  label: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.4,
    fontFamily: "'Inter', sans-serif",
    userSelect: 'none',
  },
  labelBold: {
    fontWeight: 600,
    color: 'rgba(255,255,255,0.85)',
  },
};

const policies = [
  { icon: 'bi-arrow-counterclockwise', text: 'Annulation gratuite jusqu\'à 24h avant le départ' },
  { icon: 'bi-arrow-repeat', text: 'Remboursement intégral sous 7 jours ouvrés' },
  { icon: 'bi-briefcase', text: '2 bagages inclus (23 kg + 7 kg cabine)' },
];

const PayTerms = memo(({ reservation, onAccept, isAccepted }) => {
  return (
    <div style={s.wrapper}>
      <style>{`@keyframes btcCheckIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }`}</style>

      {policies.map((p, i) => (
        <div key={i} style={s.policyItem}>
          <div style={s.policyIcon}>
            <i className={`bi ${p.icon}`} />
          </div>
          <div style={s.policyText}>{p.text}</div>
        </div>
      ))}

      <div style={s.divider} />

      <div
        style={s.checkboxRow}
        role="checkbox"
        aria-checked={isAccepted}
        aria-label="J'accepte les conditions générales de vente"
        tabIndex={0}
        onClick={onAccept}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAccept(); } }}
      >
        <div style={s.checkbox(isAccepted)}>
          {isAccepted && (
            <i className="bi bi-check-lg" style={s.checkIcon} />
          )}
        </div>
        <span style={s.label}>
          J'accepte les <span style={s.labelBold}>conditions générales de vente</span> et la <span style={s.labelBold}>politique de confidentialité</span>
        </span>
      </div>
    </div>
  );
});

PayTerms.displayName = 'PayTerms';
export default PayTerms;
