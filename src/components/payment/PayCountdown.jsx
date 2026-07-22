import React, { memo, useState, useEffect, useCallback, useRef } from 'react';

const getColor = (remaining, total) => {
  const pct = remaining / total;
  if (pct > 0.5) return { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981', icon: '#10b981' };
  if (pct > 0.2) return { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', icon: '#f59e0b' };
  return { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444', icon: '#ef4444' };
};

const s = {
  bar: (colors) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 18px',
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    marginBottom: '20px',
    transition: 'background 0.5s ease, border-color 0.5s ease',
    fontFamily: "'Inter', sans-serif",
  }),
  icon: (color) => ({
    fontSize: '16px',
    color,
    flexShrink: 0,
    transition: 'color 0.5s ease',
  }),
  digits: (color) => ({
    fontSize: '18px',
    fontWeight: 700,
    color,
    fontFamily: "'Courier New', monospace",
    letterSpacing: '0.08em',
    fontVariantNumeric: 'tabular-nums',
    transition: 'color 0.5s ease',
  }),
  msg: (color) => ({
    fontSize: '12px',
    fontWeight: 500,
    color,
    fontFamily: "'Inter', sans-serif",
    flex: 1,
    textAlign: 'right',
    transition: 'color 0.5s ease',
  }),
};

const PayCountdown = memo(({ durationMinutes = 10, onExpired }) => {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpired?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onExpired]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  const colors = getColor(remaining, totalSeconds);

  const msg = remaining > totalSeconds * 0.5
    ? 'Vous avez le temps'
    : remaining > totalSeconds * 0.2
      ? 'Dépêchez-vous !'
      : 'Plus que quelques instants';

  return (
    <div
      style={s.bar(colors)}
      role="timer"
      aria-live="polite"
      aria-label={`Temps restant: ${mins} minutes et ${secs} secondes`}
    >
      <i className="bi bi-clock-fill" style={s.icon(colors.icon)} />
      <span style={s.digits(colors.text)}>{mins}:{secs}</span>
      <span style={s.msg(colors.text)}>{msg}</span>
    </div>
  );
});

PayCountdown.displayName = 'PayCountdown';
export default PayCountdown;
