import React, { useState, useEffect, useCallback } from 'react';

const CountdownCard = React.memo(function CountdownCard({ durationMinutes = 10, onExpired }) {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);

  const getTimeColor = () => {
    if (remaining <= 120) return '#EF5350';
    if (remaining <= 300) return '#FF9800';
    return '#4CAF50';
  };

  const getBgColor = () => {
    if (remaining <= 120) return '#FEF2F2';
    if (remaining <= 300) return '#FFF7ED';
    return '#F0FDF4';
  };

  const getBorderColor = () => {
    if (remaining <= 120) return '#FECACA';
    if (remaining <= 300) return '#FED7AA';
    return '#BBF7D0';
  };

  useEffect(() => {
    if (remaining <= 0) {
      onExpired && onExpired();
      return;
    }

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpired && onExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpired, remaining > 0]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = remaining / totalSeconds;
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference * (1 - progress);

  const containerStyle = {
    backgroundColor: getBgColor(),
    borderRadius: '12px',
    border: `1px solid ${getBorderColor()}`,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.5s ease',
  };

  const titleStyle = {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  const timerContainerStyle = {
    position: 'relative',
    width: '88px',
    height: '88px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const timeTextStyle = {
    position: 'absolute',
    fontSize: '18px',
    fontWeight: 800,
    color: getTimeColor(),
    fontVariantNumeric: 'tabular-nums',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
  };

  const messageStyle = {
    fontSize: '10px',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 1.4,
  };

  const urgentStyle = remaining <= 120
    ? { animation: 'countdownPulse 1s ease-in-out infinite' }
    : {};

  return (
    <div style={{ ...containerStyle, ...urgentStyle }}>
      <style>{`
        @keyframes countdownPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      <span style={titleStyle}>Délai de réservation</span>

      <div style={timerContainerStyle}>
        <svg
          width="88"
          height="88"
          viewBox="0 0 88 88"
          style={{ transform: 'rotate(-90deg)', position: 'absolute' }}
        >
          <circle
            cx="44"
            cy="44"
            r="38"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="5"
          />
          <circle
            cx="44"
            cy="44"
            r="38"
            fill="none"
            stroke={getTimeColor()}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
        </svg>
        <span style={timeTextStyle}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      <span style={messageStyle}>
        Vos sièges sont temporairement réservés pendant {durationMinutes} minutes.
      </span>
    </div>
  );
});

export default CountdownCard;
