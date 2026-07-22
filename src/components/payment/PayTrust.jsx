import React, { memo } from 'react';

const s = {
  wrapper: {
    marginTop: '20px',
    fontFamily: "'Inter', sans-serif",
  },
  badges: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  badge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    flex: 1,
  },
  icon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
  },
  label: {
    fontSize: '10px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.3,
  },
  reassurance: {
    marginTop: '14px',
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    fontStyle: 'italic',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
  },
};

const badges = [
  { icon: 'bi-shield-lock', label: 'Paiement\nsécurisé' },
  { icon: 'bi-lock', label: 'SSL\n256-bit' },
  { icon: 'bi-credit-card', label: 'Données\nprotégées' },
  { icon: 'bi-headset', label: 'Support\n24/7' },
];

const PayTrust = memo(() => {
  return (
    <div style={s.wrapper} aria-label="Badges de sécurité">
      <div style={s.badges}>
        {badges.map((b, i) => (
          <div key={i} style={s.badge}>
            <div style={s.icon}>
              <i className={`bi ${b.icon}`} />
            </div>
            <span style={s.label}>{b.label}</span>
          </div>
        ))}
      </div>
      <div style={s.reassurance}>
        Toutes les transactions sont chiffrées et sécurisées. Vos données bancaires ne sont jamais stockées.
      </div>
    </div>
  );
});

PayTrust.displayName = 'PayTrust';
export default PayTrust;
