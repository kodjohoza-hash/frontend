import React, { useState } from 'react';

const keyframes = `
  @keyframes btcCheckIn {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }
`;

const styles = {
  card: {
    borderRadius: 'var(--radius-xl)',
    background: '#fff',
    border: '1px solid var(--color-gray-100)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--color-gray-100)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-md)',
    background: 'rgba(11, 29, 81, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary)',
    fontSize: '0.85rem',
  },
  headerTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  section: {
    padding: '14px 20px',
    borderBottom: '1px solid var(--color-gray-50)',
  },
  sectionLast: {
    padding: '14px 20px',
  },
  sectionRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  sectionIcon: (color) => ({
    width: 28,
    height: 28,
    borderRadius: 'var(--radius-sm)',
    background: `${color}10`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    fontSize: '0.75rem',
    flexShrink: 0,
    marginTop: 1,
  }),
  sectionLabel: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 3,
  },
  sectionText: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
  },
  footer: {
    padding: '14px 20px',
    borderTop: '1px solid var(--color-gray-100)',
    background: 'var(--color-gray-50)',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  },
  checkbox: (checked) => ({
    width: 20,
    height: 20,
    borderRadius: 'var(--radius-sm)',
    border: checked ? '2px solid var(--color-primary)' : '2px solid var(--color-gray-300)',
    background: checked ? 'var(--color-primary)' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  }),
  checkboxIcon: {
    color: '#fff',
    fontSize: '0.65rem',
    animation: 'btcCheckIn 0.2s ease',
  },
  checkboxLabel: {
    fontSize: '0.78rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
};

const TermsCard = React.memo(({ reservation, onAccept, isAccepted }) => {
  const sections = [
    {
      icon: 'bi-file-text',
      color: 'var(--color-primary)',
      label: 'Conditions générales',
      text: 'En procédant à cette réservation, vous acceptez les conditions générales de vente de Bus Tix Connect. Le billet est personnel et non transférable.',
    },
    {
      icon: 'bi-shield',
      color: 'var(--color-warning)',
      label: "Politique d'annulation",
      text: reservation?.cancellationPolicy || "Annulation gratuite jusqu'à 24h avant le départ. Au-delà, aucun remboursement ne sera effectué.",
    },
    {
      icon: 'bi-arrow-repeat',
      color: 'var(--color-success)',
      label: 'Politique de remboursement',
      text: reservation?.refundPolicy || 'Remboursement intégral sous 7 jours ouvrables pour les annulations éligibles.',
    },
  ];

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <i className="bi bi-shield-check" />
          </div>
          <span style={styles.headerTitle}>Conditions & Politiques</span>
        </div>

        {sections.map((s, i) => (
          <div key={s.label} style={i === sections.length - 1 ? styles.sectionLast : styles.section}>
            <div style={styles.sectionRow}>
              <div style={styles.sectionIcon(s.color)}>
                <i className={`bi ${s.icon}`} />
              </div>
              <div>
                <div style={styles.sectionLabel}>{s.label}</div>
                <div style={styles.sectionText}>{s.text}</div>
              </div>
            </div>
          </div>
        ))}

        <div style={styles.footer}>
          <div
            style={styles.checkboxRow}
            onClick={() => onAccept?.(!isAccepted)}
            role="checkbox"
            aria-checked={isAccepted}
            aria-label="J'accepte les conditions générales de vente"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onAccept?.(!isAccepted);
              }
            }}
          >
            <div style={styles.checkbox(isAccepted)}>
              {isAccepted && <i className="bi bi-check-lg" style={styles.checkboxIcon} />}
            </div>
            <span style={styles.checkboxLabel}>
              J'accepte les conditions générales de vente
            </span>
          </div>
        </div>
      </div>
    </>
  );
});

export default TermsCard;
