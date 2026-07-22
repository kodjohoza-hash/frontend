import React from 'react';

const styles = {
  wrapper: {
    borderRadius: 'var(--radius-xl)',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 12px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(16, 185, 129, 0.06)',
    border: '1px solid rgba(16, 185, 129, 0.1)',
  },
  badgeIcon: {
    fontSize: '0.75rem',
    color: 'var(--color-success)',
  },
  badgeLabel: {
    fontSize: '0.68rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  reassurance: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
};

const badges = [
  { emoji: '🔒', label: 'Paiement sécurisé' },
  { emoji: '🔐', label: 'SSL 256-bit' },
  { emoji: '🛡️', label: 'Données chiffrées' },
  { emoji: '👁️‍🗨️', label: 'Protection des données' },
  { emoji: '✅', label: 'Transactions certifiées' },
];

const SecurityBadges = React.memo(() => (
  <div style={styles.wrapper} role="region" aria-label="Badges de sécurité">
    <div style={styles.grid}>
      {badges.map((b) => (
        <div key={b.label} style={styles.badge}>
          <span style={styles.badgeIcon}>{b.emoji}</span>
          <span style={styles.badgeLabel}>{b.label}</span>
        </div>
      ))}
    </div>
    <div style={styles.reassurance}>
      Vos données personnelles sont protégées par un cryptage de niveau bancaire.
    </div>
  </div>
));

export default SecurityBadges;
