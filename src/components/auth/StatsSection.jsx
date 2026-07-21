/**
 * StatsSection — 4 stat cards at the bottom of the left panel
 */
const STATS = [
  { value: '100+', label: 'Compagnies partenaires' },
  { value: '500+', label: 'Voyages quotidiens' },
  { value: '50 000+', label: 'Voyageurs satisfaits' },
  { value: '25+', label: 'Villes desservies' },
];

const StatsSection = () => (
  <div className="auth-stats">
    {STATS.map((s) => (
      <div key={s.label} className="auth-stats__card">
        <span className="auth-stats__value">{s.value}</span>
        <span className="auth-stats__label">{s.label}</span>
      </div>
    ))}
  </div>
);

export default StatsSection;
