import React, { memo } from 'react';

const s = {
  card: (isSelected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px',
    background: isSelected ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.04)',
    border: `1.5px solid ${isSelected ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Inter', sans-serif",
    marginTop: '16px',
  }),
  iconCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #34d399)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '18px',
    flexShrink: 0,
    boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '2px',
  },
  desc: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.45)',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.4,
  },
  price: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#10b981',
    fontFamily: "'Inter', sans-serif",
    whiteSpace: 'nowrap',
  },
  toggle: (isSelected) => ({
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    background: isSelected
      ? 'linear-gradient(135deg, #10b981, #34d399)'
      : 'rgba(255,255,255,0.1)',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    flexShrink: 0,
    border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
  }),
  toggleKnob: (isSelected) => ({
    position: 'absolute',
    top: '3px',
    left: isSelected ? '23px' : '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
};

const formatXAF = (amount) => new Intl.NumberFormat('fr-CM').format(amount);

const PayInsurance = memo(({ insurance, isSelected, onToggle }) => {
  return (
    <div
      style={s.card(isSelected)}
      role="switch"
      aria-checked={isSelected}
      aria-label={`${insurance.name} — ${insurance.description}. Prix: ${formatXAF(insurance.price)} FCFA`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
    >
      <div style={s.iconCircle}>
        <i className="bi bi-shield-check" />
      </div>

      <div style={s.info}>
        <div style={s.name}>{insurance.name}</div>
        <div style={s.desc}>{insurance.description}</div>
        <div style={s.price}>{formatXAF(insurance.price)} FCFA</div>
      </div>

      <div style={s.toggle(isSelected)} aria-hidden="true">
        <div style={s.toggleKnob(isSelected)} />
      </div>
    </div>
  );
});

PayInsurance.displayName = 'PayInsurance';
export default PayInsurance;
