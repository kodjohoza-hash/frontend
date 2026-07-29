import { bookingStats } from '@data/counterBookingData';

const STAT_CARDS = [
  { key: 'today', label: 'Aujourd\'hui', icon: 'bi-calendar-check', color: '#0B1D51', trend: '+2', up: true },
  { key: 'pending', label: 'En attente', icon: 'bi-clock', color: '#F59E0B', trend: '-1', up: false },
  { key: 'confirmed', label: 'Confirmées', icon: 'bi-check-circle', color: '#10B981', trend: '+3', up: true },
  { key: 'cancelled', label: 'Annulées', icon: 'bi-x-circle', color: '#EF4444', trend: '0', up: true },
  { key: 'expired', label: 'Expirées', icon: 'bi-hourglass-split', color: '#6B7280', trend: '-2', up: false },
  { key: 'converted', label: 'Converties', icon: 'bi-ticket-perforated', color: '#8B5CF6', trend: '+1', up: true },
];

const CounterBookingStats = () => (
  <div className="acb-stats">
    {STAT_CARDS.map((card) => (
      <div key={card.key} className="acb-stat-card">
        <div className="acb-stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
          <i className={`bi ${card.icon}`} />
        </div>
        <div className="acb-stat-content">
          <div className="acb-stat-label">{card.label}</div>
          <div className="acb-stat-value">{bookingStats[card.key]}</div>
          {card.trend !== '0' && (
            <div className={`acb-stat-trend ${card.up ? 'up' : 'down'}`}>
              <i className={`bi ${card.up ? 'bi-arrow-up-short' : 'bi-arrow-down-short'}`} />
              {card.trend} aujourd'hui
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default CounterBookingStats;
