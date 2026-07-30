import clsx from 'clsx';
import { formatCurrency } from '@data/counterProfileData';

const STAT_CARDS = [
  { key: 'ticketsSoldToday', icon: 'bi-ticket-perforated', label: 'Billets vendus aujourd\'hui', color: '#FF6B35', format: 'number' },
  { key: 'ticketsSoldMonth', icon: 'bi-tickets', label: 'Billets vendus ce mois', color: '#3B82F6', format: 'number' },
  { key: 'bookingsCreated', icon: 'bi-calendar-check', label: 'Réservations créées', color: '#8B5CF6', format: 'number' },
  { key: 'clientsServed', icon: 'bi-people', label: 'Clients servis', color: '#10B981', format: 'number' },
  { key: 'paymentsCollected', icon: 'bi-cash-stack', label: 'Paiements encaissés', color: '#F59E0B', format: 'currency' },
  { key: 'satisfactionRate', icon: 'bi-emoji-smile', label: 'Satisfaction', color: '#0B1D51', format: 'percent' },
];

const CounterProfileStats = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="acpr-stats-grid">
      {STAT_CARDS.map((card, i) => {
        const value = profile[card.key];
        const displayValue = card.format === 'currency'
          ? formatCurrency(value || 0)
          : card.format === 'percent'
            ? `${value || 0}%`
            : (value ?? 0).toLocaleString('fr-FR');

        return (
          <div
            key={card.key}
            className="acpr-stat-card"
            style={{ '--acpr-i': i }}
          >
            <div
              className="acpr-stat-icon"
              style={{ background: `${card.color}15`, color: card.color }}
            >
              <i className={clsx('bi', card.icon)} />
            </div>
            <div className="acpr-stat-body">
              <div className="acpr-stat-value">{displayValue}</div>
              <div className="acpr-stat-label">{card.label}</div>
            </div>
            {card.format === 'percent' && (
              <div className="acpr-stat-progress-wrap">
                <div
                  className="acpr-stat-progress-bar"
                  style={{ width: `${Math.min(value || 0, 100)}%`, background: card.color }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CounterProfileStats;
