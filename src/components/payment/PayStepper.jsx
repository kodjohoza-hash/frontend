import React, { memo } from 'react';
import { STEPS } from '@data/payment';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 24px',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    marginBottom: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  track: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
    position: 'relative',
  },
  stepWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  pill: (isCompleted, isActive, color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isActive ? '48px' : '40px',
    height: isActive ? '36px' : '30px',
    borderRadius: '10px',
    background: isActive
      ? `linear-gradient(135deg, ${color || '#6366f1'}, ${color ? color + 'cc' : '#818cf8'})`
      : isCompleted
        ? '#10b981'
        : 'rgba(255,255,255,0.08)',
    color: isActive || isCompleted ? '#fff' : 'rgba(255,255,255,0.35)',
    fontSize: isActive ? '15px' : '13px',
    fontWeight: 600,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive
      ? `0 0 20px ${color || '#6366f1'}44, 0 0 40px ${color || '#6366f1'}22`
      : isCompleted
        ? '0 0 16px #10b98133'
        : 'none',
    cursor: 'default',
    fontFamily: "'Inter', sans-serif",
  }),
  label: (isCompleted, isActive) => ({
    fontSize: '10px',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? '#fff' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.3)',
    marginTop: '6px',
    whiteSpace: 'nowrap',
    letterSpacing: '0.02em',
    transition: 'color 0.3s ease',
    fontFamily: "'Inter', sans-serif",
  }),
  connector: (isFilled) => ({
    width: '36px',
    height: '2px',
    background: isFilled
      ? 'linear-gradient(90deg, #10b981, #34d399)'
      : 'rgba(255,255,255,0.1)',
    transition: 'background 0.4s ease',
    zIndex: 1,
    margin: '0 -2px',
    marginBottom: '20px',
  }),
};

const PayStepper = memo(({ currentStep = 4, accentColor }) => {
  return (
    <nav aria-label="Étapes du processus de paiement" style={styles.wrapper}>
      <div style={styles.track}>
        {STEPS.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isLast = idx === STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div style={styles.stepWrapper} aria-current={isActive ? 'step' : undefined}>
                <div style={styles.pill(isCompleted, isActive, accentColor)}>
                  {isCompleted ? (
                    <i className="bi bi-check-lg" style={{ fontSize: '16px' }} />
                  ) : (
                    <i className={`bi ${step.icon}`} style={{ fontSize: isActive ? '14px' : '12px' }} />
                  )}
                </div>
                <span style={styles.label(isCompleted, isActive)}>{step.label}</span>
              </div>
              {!isLast && (
                <div style={styles.connector(isCompleted)} aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
});

PayStepper.displayName = 'PayStepper';
export default PayStepper;
