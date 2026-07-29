import { scannerStats } from '@data/counterScannerData';

const STAT_CARDS = [
  { key: 'verifiedToday', label: 'Vérifiés aujourd\'hui', icon: 'bi-check2-circle', color: '#0B1D51' },
  { key: 'valid', label: 'Valides', icon: 'bi-shield-check', color: '#10B981' },
  { key: 'invalid', label: 'Invalides', icon: 'bi-shield-exclamation', color: '#EF4444' },
  { key: 'used', label: 'Déjà utilisés', icon: 'bi-clock-history', color: '#F59E0B' },
  { key: 'boarded', label: 'Embarquements', icon: 'bi-person-up', color: '#8B5CF6' },
  { key: 'refused', label: 'Refus d\'embarquement', icon: 'bi-person-x', color: '#6B7280' },
];

const CounterScannerStats = () => (
  <div className="acv-stats">
    {STAT_CARDS.map((card) => (
      <div key={card.key} className="acv-stat-card">
        <div className="acv-stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
          <i className={`bi ${card.icon}`} />
        </div>
        <div className="acv-stat-content">
          <div className="acv-stat-label">{card.label}</div>
          <div className="acv-stat-value">{scannerStats[card.key]}</div>
        </div>
      </div>
    ))}
  </div>
);

export default CounterScannerStats;
