import { useState, useEffect } from 'react';
import { adminProfile } from '@data/adminData';

const AdminWelcome = () => {
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState('Bonjour');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = time.getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, [time]);

  const formatDate = (date) =>
    date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (date) =>
    date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const getLastLogin = (iso) => {
    if (!iso) return 'Première connexion';
    const d = new Date(iso);
    return `Dernière connexion : ${formatDate(d)} à ${formatTime(d)}`;
  };

  const hour = time.getHours();
  const greetingMsg =
    hour < 12
      ? 'Belle journée pour superviser la plateforme'
      : hour < 18
        ? 'Belle après-midi, restez connecté'
        : 'Bonne soirée, supervision active';

  return (
    <div className="adm-welcome">
      <div className="adm-welcome__left">
        <div className="adm-welcome__avatar">{adminProfile.avatar}</div>
        <div className="adm-welcome__info">
          <h1 className="adm-welcome__name">{greeting}, {adminProfile.firstName} {adminProfile.lastName}</h1>
          <span className="adm-welcome__role">{adminProfile.role} · BUS TIX CONNECT</span>
          <div className="adm-welcome__meta">
            <span className="adm-welcome__meta-item">
              <i className="bi bi-calendar3" /> {formatDate(time)}
            </span>
            <span className="adm-welcome__meta-item">
              <i className="bi bi-clock" /> {formatTime(time)}
            </span>
            <span className="adm-welcome__status">
              <span className="adm-welcome__status-dot" /> En ligne
            </span>
            <span className="adm-welcome__meta-item">
              <i className="bi bi-shield-check" /> {getLastLogin(adminProfile.lastLogin)}
            </span>
          </div>
        </div>
      </div>
      <div className="adm-welcome__greeting">
        <i className="bi bi-quote" /> {greetingMsg}
      </div>
    </div>
  );
};

export default AdminWelcome;
