import React from 'react';

const keyframes = `
  @keyframes btcShimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;

const shimmer = {
  background: 'linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-50) 50%, var(--color-gray-100) 75%)',
  backgroundSize: '800px 100%',
  animation: 'btcShimmer 1.8s ease-in-out infinite',
  borderRadius: 'var(--radius-sm)',
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    padding: '12px 0',
  },
  topStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  topCircle: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    ...shimmer,
  },
  topLabel: {
    width: 48,
    height: 10,
    borderRadius: 'var(--radius-sm)',
    ...shimmer,
  },
  countdown: {
    width: 260,
    height: 40,
    borderRadius: 'var(--radius-lg)',
    margin: '0 auto',
    ...shimmer,
  },
  grid: {
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: '1 1 420px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  rightCol: {
    flex: '0 0 320px',
    minWidth: 280,
  },
  card: {
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-gray-100)',
    padding: 20,
    background: '#fff',
    boxShadow: 'var(--shadow-sm)',
  },
  cardTitle: {
    width: 160,
    height: 16,
    borderRadius: 'var(--radius-sm)',
    marginBottom: 16,
    ...shimmer,
  },
  methodRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-gray-100)',
    marginBottom: 10,
  },
  methodLogo: {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-lg)',
    ...shimmer,
  },
  methodInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  methodLine1: {
    width: 120,
    height: 12,
    borderRadius: 'var(--radius-sm)',
    ...shimmer,
  },
  methodLine2: {
    width: 180,
    height: 10,
    borderRadius: 'var(--radius-sm)',
    ...shimmer,
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    ...shimmer,
  },
  summaryLine: {
    width: '100%',
    height: 14,
    borderRadius: 'var(--radius-sm)',
    marginBottom: 12,
    ...shimmer,
  },
  summaryLineShort: {
    width: '70%',
    height: 14,
    borderRadius: 'var(--radius-sm)',
    marginBottom: 12,
    ...shimmer,
  },
  summaryDivider: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    margin: '12px 0',
    ...shimmer,
  },
  summaryTotal: {
    width: '100%',
    height: 44,
    borderRadius: 'var(--radius-lg)',
    ...shimmer,
  },
};

const PaymentSkeleton = React.memo(() => (
  <>
    <style>{keyframes}</style>
    <div style={styles.container} aria-busy="true" aria-label="Chargement du paiement">
      <div style={styles.topBar}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={styles.topStep}>
            <div style={styles.topCircle} />
            <div style={styles.topLabel} />
          </div>
        ))}
      </div>

      <div style={styles.countdown} />

      <div style={styles.grid}>
        <div style={styles.leftCol}>
          <div style={styles.card}>
            <div style={styles.cardTitle} />
            {[1, 2, 3].map((i) => (
              <div key={i} style={styles.methodRow}>
                <div style={styles.methodLogo} />
                <div style={styles.methodInfo}>
                  <div style={styles.methodLine1} />
                  <div style={styles.methodLine2} />
                </div>
                <div style={styles.methodRadio} />
              </div>
            ))}
          </div>
          <div style={styles.card}>
            <div style={{ ...styles.cardTitle, width: 200 }} />
            <div style={styles.summaryLine} />
            <div style={styles.summaryLineShort} />
            <div style={styles.summaryLine} />
          </div>
        </div>

        <div style={styles.rightCol}>
          <div style={styles.card}>
            <div style={{ ...styles.cardTitle, width: 140 }} />
            <div style={{ width: '100%', height: 120, borderRadius: 'var(--radius-lg)', marginBottom: 14, ...shimmer }} />
            <div style={styles.summaryLine} />
            <div style={styles.summaryLineShort} />
            <div style={styles.summaryLine} />
            <div style={styles.summaryDivider} />
            <div style={styles.summaryTotal} />
          </div>
        </div>
      </div>
    </div>
  </>
));

export default PaymentSkeleton;
