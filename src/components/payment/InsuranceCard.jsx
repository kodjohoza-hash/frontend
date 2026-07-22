import React from 'react';

const styles = {
  card: (isActive) => ({
    borderRadius: 'var(--radius-xl)',
    background: isActive ? 'rgba(16, 185, 129, 0.03)' : '#fff',
    border: isActive ? '2px solid var(--color-success)' : '2px solid var(--color-gray-100)',
    boxShadow: isActive
      ? '0 0 0 3px rgba(16, 185, 129, 0.1), var(--shadow-sm)'
      : 'var(--shadow-sm)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
  }),
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '16px 20px',
  },
  shieldIcon: {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, var(--color-success), #059669)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.1rem',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 2,
  },
  desc: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
  },
  priceBadge: {
    display: 'inline-flex',
    padding: '4px 10px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(255, 107, 53, 0.08)',
    color: 'var(--color-accent)',
    fontSize: '0.72rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  toggle: (isActive) => ({
    position: 'relative',
    width: 48,
    height: 26,
    borderRadius: 13,
    background: isActive ? 'var(--color-success)' : 'var(--color-gray-300)',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'background 0.3s ease',
    flexShrink: 0,
  }),
  toggleKnob: (isActive) => ({
    position: 'absolute',
    top: 3,
    left: isActive ? 25 : 3,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
};

const InsuranceCard = React.memo(({ insurance, isSelected, onToggle }) => (
  <div style={styles.card(isSelected)}>
    <div style={styles.row}>
      <div style={styles.shieldIcon}>
        <i className="bi bi-shield-fill-check" />
      </div>

      <div style={styles.info}>
        <div style={styles.title}>{insurance.name}</div>
        <div style={styles.desc}>{insurance.description}</div>
      </div>

      <span style={styles.priceBadge}>+{insurance.price.toLocaleString()} FCFA</span>

      <button
        type="button"
        role="switch"
        aria-checked={isSelected}
        aria-label={`Assurance voyage ${isSelected ? 'activée' : 'désactivée'} - ${insurance.price.toLocaleString()} FCFA`}
        style={styles.toggle(isSelected)}
        onClick={() => onToggle(!isSelected)}
      >
        <div style={styles.toggleKnob(isSelected)} />
      </button>
    </div>
  </div>
));

export default InsuranceCard;
