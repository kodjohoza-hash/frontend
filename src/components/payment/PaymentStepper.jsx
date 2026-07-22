import React from 'react';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    padding: '16px 0',
    overflowX: 'auto',
  },
  stepWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  stepCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 72,
  },
  circle: (isCompleted, isCurrent) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isCompleted ? '1rem' : '0.85rem',
    fontWeight: isCurrent ? 700 : 600,
    background: isCompleted
      ? 'var(--color-success)'
      : isCurrent
        ? 'var(--color-primary)'
        : 'transparent',
    color: isCompleted || isCurrent ? '#fff' : 'var(--text-muted)',
    border: isCompleted
      ? '2px solid var(--color-success)'
      : isCurrent
        ? '2px solid var(--color-primary)'
        : '2px solid var(--color-gray-300)',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    zIndex: 1,
    boxShadow: isCurrent
      ? '0 0 0 0 rgba(11, 29, 81, 0.4)'
      : 'none',
    animation: isCurrent ? 'btcStepperPulse 2s ease-in-out infinite' : 'none',
  }),
  label: (isCompleted, isCurrent) => ({
    marginTop: 6,
    fontSize: '0.65rem',
    fontWeight: isCurrent ? 700 : 500,
    color: isCompleted
      ? 'var(--color-success)'
      : isCurrent
        ? 'var(--color-primary)'
        : 'var(--text-muted)',
    textAlign: 'center',
    maxWidth: 72,
    lineHeight: 1.2,
    transition: 'color 0.3s ease',
  }),
  line: (isCompleted) => ({
    width: 48,
    height: 2,
    borderRadius: 1,
    marginBottom: 18,
    transition: 'background 0.4s ease',
    background: isCompleted ? 'var(--color-success)' : 'var(--color-gray-200)',
  }),
  keyframes: `
    @keyframes btcStepperPulse {
      0% { box-shadow: 0 0 0 0 rgba(11, 29, 81, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(11, 29, 81, 0); }
      100% { box-shadow: 0 0 0 0 rgba(11, 29, 81, 0); }
    }
  `,
};

const PaymentStepper = ({ steps, currentStep }) => (
  <>
    <style>{styles.keyframes}</style>
    <nav
      style={styles.container}
      role="navigation"
      aria-label="Étapes du paiement"
    >
      {steps.map((step, idx) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        return (
          <div key={step.id} style={styles.stepWrapper}>
            <div style={styles.stepCol}>
              <div
                style={styles.circle(isCompleted, isCurrent)}
                aria-current={isCurrent ? 'step' : undefined}
                role="listitem"
              >
                {isCompleted ? (
                  <i className="bi bi-check-lg" />
                ) : (
                  <i className={step.icon} />
                )}
              </div>
              <span style={styles.label(isCompleted, isCurrent)}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div style={styles.line(isCompleted)} />
            )}
          </div>
        );
      })}
    </nav>
  </>
);

export default React.memo(PaymentStepper);
