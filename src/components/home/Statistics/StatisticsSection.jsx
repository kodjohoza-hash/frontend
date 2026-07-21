import { useInView, useCountUp } from '@hooks/useLandingPage';
import { STATS } from '@data/landingPage';

const StatCard = ({ stat, isInView }) => {
  const count = useCountUp(stat.value, 2000, isInView);

  return (
    <div className="btc-stat-card">
      <div className="btc-stat-icon">
        <i className={`bi ${stat.icon}`} />
      </div>
      <div className="btc-stat-value">
        {count.toLocaleString('fr-FR')}{stat.suffix}
      </div>
      <div className="btc-stat-label">{stat.label}</div>
    </div>
  );
};

const StatisticsSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  return (
    <section id="stats" className="btc-stats" ref={ref} aria-label="Nos chiffres">
      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-graph-up" /> En chiffres
          </span>
          <h2 className="btc-section-title">Ils nous font confiance</h2>
        </div>
        <div className="btc-stats-grid">
          {STATS.map((stat, i) => (
            <div key={stat.id} className={`btc-stat-wrap ${isInView ? 'is-visible' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
              <StatCard stat={stat} isInView={isInView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
