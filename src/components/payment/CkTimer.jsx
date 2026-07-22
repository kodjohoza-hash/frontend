import { useState, useEffect, useCallback, memo } from 'react';

const CkTimer = memo(({ durationMinutes = 10, onExpired }) => {
  const [seconds, setSeconds] = useState(durationMinutes * 60);

  useEffect(() => {
    if (seconds <= 0) { onExpired?.(); return; }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds, onExpired]);

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  const pct = (seconds / (durationMinutes * 60)) * 100;
  const urgent = seconds < 120;

  return (
    <div className={`ck-timer ${urgent ? 'ck-timer--urgent' : ''}`} role="timer" aria-label="Temps restant">
      <i className={`bi ${urgent ? 'bi-exclamation-triangle-fill' : 'bi-clock-history'}`} />
      <span className="ck-timer__text">
        Temps restant : <strong>{String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}</strong>
      </span>
      <div className="ck-timer__bar" aria-hidden="true">
        <div className="ck-timer__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
});
CkTimer.displayName = 'CkTimer';
export default CkTimer;
