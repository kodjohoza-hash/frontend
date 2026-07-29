import { useState, useEffect } from 'react';
import { agentInfo } from '@data/counterData';

const CounterWelcome = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const initials = (agentInfo.firstName?.[0] || '') + (agentInfo.lastName?.[0] || '');
  const dateStr = time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const seconds = time.getSeconds();

  return (
    <div className="act-welcome">
      <div className="act-welcome__avatar">{initials}</div>
      <div className="act-welcome__content">
        <div className="act-welcome__greeting">{greeting()},</div>
        <h1 className="act-welcome__name">{agentInfo.firstName} {agentInfo.lastName}</h1>
        <div className="act-welcome__details">
          <span className="act-welcome__detail">
            <i className="bi bi-person-badge" /> {agentInfo.role}
          </span>
          <span className="act-welcome__detail">
            <i className="bi bi-shop" /> {agentInfo.branch}
          </span>
          <span className="act-welcome__detail">
            <i className="bi bi-building" /> {agentInfo.company}
          </span>
        </div>
      </div>
      <div className="act-welcome__meta">
        <span className="act-welcome__date">{dateStr}</span>
        <span className="act-welcome__time">
          {timeStr}
          <span className="act-welcome__time-dot">{seconds % 2 === 0 ? ':' : ' '}</span>
        </span>
      </div>
    </div>
  );
};

export default CounterWelcome;
