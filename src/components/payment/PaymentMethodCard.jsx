import React from 'react';

const keyframes = `
  @keyframes btcRadioIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const styles = {
  button: (isSelected, available) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 16px',
    borderRadius: 'var(--radius-lg)',
    border: isSelected ? '2px solid var(--color-primary)' : '2px solid var(--color-gray-200)',
    background: isSelected ? 'rgba(11, 29, 81, 0.04)' : '#fff',
    cursor: available ? 'pointer' : 'not-allowed',
    opacity: available ? 1 : 0.5,
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    textAlign: 'left',
    transform: isSelected ? 'scale(1)' : 'scale(1)',
    boxShadow: isSelected
      ? '0 0 0 3px rgba(11, 29, 81, 0.12), var(--shadow-sm)'
      : '0 1px 2px rgba(0,0,0,0.04)',
  }),
  buttonHover: {
    transform: 'scale(1.01)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 0 0 3px rgba(11, 29, 81, 0.08)',
    borderColor: 'var(--color-primary)',
  },
  logoBox: (method, isSelected) => ({
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-lg)',
    background: method.bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.25s ease',
    fontWeight: 800,
    fontSize: method.logo.length > 2 ? '0.6rem' : '0.85rem',
    color: method.color,
    letterSpacing: '0.02em',
  }),
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: (isSelected) => ({
    fontSize: '0.875rem',
    fontWeight: 600,
    color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
    marginBottom: 2,
    transition: 'color 0.2s ease',
  }),
  desc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    lineHeight: 1.3,
  },
  radio: (isSelected) => ({
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: isSelected ? '2px solid var(--color-primary)' : '2px solid var(--color-gray-300)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'border-color 0.25s ease',
  }),
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: '50%',
    background: 'var(--color-primary)',
    animation: 'btcRadioIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

const PaymentMethodCard = React.memo(({ method, isSelected, onSelect }) => (
  <>
    <style>{keyframes}</style>
    <button
      onClick={() => onSelect(method.id)}
      type="button"
      aria-pressed={isSelected}
      aria-label={`Payer avec ${method.name}`}
      disabled={!method.available}
      style={styles.button(isSelected, method.available)}
      onMouseEnter={(e) => {
        if (!isSelected && method.available) {
          e.currentTarget.style.transform = styles.buttonHover.transform;
          e.currentTarget.style.boxShadow = styles.buttonHover.boxShadow;
          e.currentTarget.style.borderColor = styles.buttonHover.borderColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = styles.button(isSelected, method.available).boxShadow;
          e.currentTarget.style.borderColor = styles.button(isSelected, method.available).borderColor;
        }
      }}
    >
      <div style={styles.logoBox(method, isSelected)}>
        {method.logo}
      </div>
      <div style={styles.info}>
        <div style={styles.name(isSelected)}>{method.name}</div>
        <div style={styles.desc}>{method.description}</div>
      </div>
      <div style={styles.radio(isSelected)}>
        {isSelected && <div style={styles.radioDot} />}
      </div>
    </button>
  </>
));

export default PaymentMethodCard;
