import { cashStats, formatCurrency } from '@data/counterPaymentData';

const STAT_CARDS = [
  { key: 'todayCount', label: 'Encaissements aujourd\'hui', icon: 'bi-cash-stack', color: '#0B1D51', sub: (s) => formatCurrency(s.todayAmount) },
  { key: 'todayAmount', label: 'Montant total encaissé', icon: 'bi-graph-up-arrow', color: '#10B981', sub: () => 'aujourd\'hui' },
  { key: 'pending', label: 'En attente', icon: 'bi-clock', color: '#F59E0B' },
  { key: 'refunded', label: 'Remboursés', icon: 'bi-arrow-return-left', color: '#8B5CF6' },
  { key: 'totalTransactions', label: 'Transactions', icon: 'bi-arrow-left-right', color: '#FF6B35' },
  { key: 'currentBalance', label: 'Solde caisse', icon: 'bi-wallet2', color: '#0B1D51', sub: (s) => `${s.todayCount} aujourd'hui` },
];

const CounterCashStats = () => (
  <div className="acp-stats">
    {STAT_CARDS.map((card) => (
      <div key={card.key} className="acp-stat-card">
        <div className="acp-stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
          <i className={`bi ${card.icon}`} />
        </div>
        <div className="acp-stat-content">
          <div className="acp-stat-label">{card.label}</div>
          <div className="acp-stat-value">
            {card.key === 'todayAmount' || card.key === 'currentBalance'
              ? formatCurrency(cashStats[card.key])
              : cashStats[card.key]}
          </div>
          {card.sub && <div className="acp-stat-sub">{card.sub(cashStats)}</div>}
        </div>
      </div>
    ))}
  </div>
);

export default CounterCashStats;
