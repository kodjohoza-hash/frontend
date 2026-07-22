import React from 'react';

const styles = {
  card: {
    borderRadius: 'var(--radius-xl)',
    background: '#fff',
    border: '1px solid var(--color-gray-100)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    borderBottom: '1px solid var(--color-gray-100)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(11, 29, 81, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary)',
    fontSize: '1rem',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  body: {
    padding: '16px 20px',
  },
  instructionText: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: 16,
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'var(--color-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.68rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  stepText: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    paddingTop: 2,
  },
  infoBox: {
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-gray-50)',
    padding: '14px 16px',
    marginBottom: 20,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  infoRowLast: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoIcon: {
    color: 'var(--color-accent)',
    fontSize: '0.75rem',
    marginTop: 2,
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
  },
  confirmBtn: {
    width: '100%',
    padding: '12px 24px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-primary)',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
};

const AgencyInfo = React.memo(({ onConfirm }) => (
  <div style={styles.card}>
    <div style={styles.header}>
      <div style={styles.iconBox}>
        <i className="bi bi-building" />
      </div>
      <span style={styles.headerTitle}>Paiement à l'agence</span>
    </div>

    <div style={styles.body}>
      <p style={styles.instructionText}>
        Rendez-vous à l'agence Grand Littoral avec votre numéro de réservation pour effectuer le paiement en espèces.
      </p>

      <div style={styles.stepsList}>
        {[
          "Présentez-vous au comptoir avec votre pièce d'identité.",
          "Communiquez votre numéro de réservation au agent.",
          "Effectuez le paiement en espèces et conservez votre reçu.",
          "Votre billet sera validé une fois le paiement confirmé.",
        ].map((text, i) => (
          <div key={i} style={styles.stepRow}>
            <div style={styles.stepNumber}>{i + 1}</div>
            <span style={styles.stepText}>{text}</span>
          </div>
        ))}
      </div>

      <div style={styles.infoBox}>
        <div style={styles.infoRow}>
          <i className="bi bi-geo-alt" style={styles.infoIcon} />
          <div>
            <div style={styles.infoLabel}>Adresse</div>
            <div style={styles.infoValue}>Boulevard de la République, Douala, Cameroun</div>
          </div>
        </div>
        <div style={styles.infoRowLast}>
          <i className="bi bi-clock" style={styles.infoIcon} />
          <div>
            <div style={styles.infoLabel}>Horaires</div>
            <div style={styles.infoValue}>Lun - Sam : 05h00 — 20h00 | Dim : 06h00 — 18h00</div>
          </div>
        </div>
      </div>

      <button
        type="button"
        style={styles.confirmBtn}
        onClick={onConfirm}
        aria-label="Confirmer le paiement à l'agence"
      >
        <i className="bi bi-check-circle" />
        Confirmer la réservation
      </button>
    </div>
  </div>
));

export default AgencyInfo;
