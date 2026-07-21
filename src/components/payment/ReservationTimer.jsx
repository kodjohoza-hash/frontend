import { useState, useEffect } from 'react';

const ReservationTimer = ({ durationMinutes = 10, onExpired }) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpired?.();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onExpired]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft <= 120;

  return (
    <div
      className="btc-reservation-timer d-flex align-items-center justify-content-center gap-2 py-2 px-3 mb-3"
      style={{
        borderRadius: 'var(--radius-lg)',
        background: isUrgent ? 'var(--color-danger-50)' : 'var(--color-warning-50)',
        border: `1px solid ${isUrgent ? 'var(--color-danger-200)' : 'var(--color-warning-200)'}`,
      }}
      role="timer"
      aria-label={`Temps restant: ${minutes} minutes et ${seconds} secondes`}
    >
      <i className={`bi ${isUrgent ? 'bi-exclamation-triangle-fill' : 'bi-clock-fill'}`} style={{ color: isUrgent ? 'var(--color-danger)' : 'var(--color-warning)', fontSize: '0.85rem' }} />
      <span style={{ fontSize: 'var(--font-size-xs)', color: isUrgent ? 'var(--color-danger)' : 'var(--color-warning)', fontWeight: 'var(--font-weight-semibold)' }}>
        Vos sieges sont reserves pendant encore{' '}
        <span className="fw-bold">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
      </span>
    </div>
  );
};

export default ReservationTimer;
