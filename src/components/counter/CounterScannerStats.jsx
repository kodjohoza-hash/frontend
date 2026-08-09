import { useState, useEffect } from 'react';
import ticketService from '@services/ticket.service';

const STAT_CARDS = [
  { key: 'verifies', label: 'Vérifiés', icon: 'bi-check2-circle', color: '#0B1D51' },
  { key: 'valides', label: 'Valides', icon: 'bi-shield-check', color: '#10B981' },
  { key: 'invalid', label: 'Invalides', icon: 'bi-shield-exclamation', color: '#EF4444' },
  { key: 'utilises', label: 'Déjà utilisés', icon: 'bi-clock-history', color: '#F59E0B' },
  { key: 'today', label: 'Émis aujourd\'hui', icon: 'bi-ticket-perforated', color: '#8B5CF6' },
  { key: 'expires', label: 'Expirés', icon: 'bi-hourglass-split', color: '#6B7280' },
];

const CounterScannerStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    ticketService
      .stats()
      .then((data) => {
        if (!active) return;
        const invalid = Number(data.annules || 0) + Number(data.rembourses || 0) + Number(data.expires || 0);
        setStats({ ...data, invalid });
      })
      .catch(() => {
        if (active) setStats({});
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="acv-stats">
      {STAT_CARDS.map((card) => (
        <div key={card.key} className="acv-stat-card">
          <div className="acv-stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
            <i className={`bi ${card.icon}`} />
          </div>
          <div className="acv-stat-content">
            <div className="acv-stat-label">{card.label}</div>
            <div className="acv-stat-value">{stats ? (stats[card.key] ?? 0) : '…'}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CounterScannerStats;
