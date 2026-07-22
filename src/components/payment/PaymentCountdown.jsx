import React, { useState, useEffect, useRef } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: '12px 0',
  },
  ringWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  svgRing: {
    transform: 'rotate(-90deg)',
    width: 100,
    height: 100,
  },
  track: {
    fill: 'none',
    stroke: 'var(--color-gray-200)',
    strokeWidth: 6,
  },
  progress: (color, dashoffset) => ({
    fill: 'none',
    stroke: color,
    strokeWidth: 6,
    strokeLinecap: 'round',
    strokeDasharray: 251.2,
    strokeDashoffset: dashoffset,
    transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
    filter: `drop-shadow(0 0 4px ${color}40)`,
  }),
  centerText: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: (color) => ({
    fontSize: '1.3rem',
    fontWeight: 800,
    color: color,
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.04em',
    lineHeight: 1,
  }),
  label: {
    fontSize: '0.58rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginTop: 4,
  },
  message: (color) => ({
    fontSize: '0.75rem',
    fontWeight: 600,
    color: color,
    textAlign: 'center',
    lineHeight: 1.3,
  }),
};

const PaymentCountdown = React.memo(({ durationMinutes = 10, onExpired }) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const timerRef = useRef(null);
  const circumference = 2 * Math.PI * 40;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpired?.();
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [onExpired, secondsLeft === durationMinutes * 60]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = secondsLeft / (durationMinutes * 60);
  const dashoffset = circumference * (1 - progress);

  let color = 'var(--color-success)';
  let message = 'Vos sièges sont réservés.';
  if (secondsLeft <= 120) {
    color = 'var(--color-danger)';
    message = 'Dépêchez-vous ! Votre réservation expire bientôt.';
  } else if (secondsLeft <= 300) {
    color = 'var(--color-warning)';
    message = 'Plus que quelques minutes pour confirmer.';
  }

  return (
    <div style={styles.container} role="timer" aria-label={`Temps restant : ${minutes} minutes et ${seconds} secondes`}>
      <div style={styles.ringWrapper}>
        <svg style={styles.svgRing} viewBox="0 0 100 100">
          <circle style={styles.track} cx="50" cy="50" r="40" />
          <circle style={styles.progress(color, dashoffset)} cx="50" cy="50" r="40" />
        </svg>
        <div style={styles.centerText}>
          <span style={styles.time(color)}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span style={styles.label}>Délai de réservation</span>
      <span style={styles.message(color)}>{message}</span>
    </div>
  );
});

export default PaymentCountdown;
