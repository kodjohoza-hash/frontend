import { useInView } from '@hooks/useLandingPage';
import { DESTINATIONS } from '@data/landingPage';
import DestinationCard from './DestinationCard';

const DestinationsSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="destinations" className="btc-destinations" ref={ref}>
      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-geo-alt" /> Populaires
          </span>
          <h2 className="btc-section-title">Destinations populaires</h2>
          <p className="btc-section-subtitle">
            Explorez les villes les plus demandées du Cameroun.
          </p>
        </div>

        <div className="btc-dest-grid">
          {DESTINATIONS.map((d, i) => (
            <div key={d.id} className={`btc-dest-wrap ${isInView ? 'is-visible' : ''}`} style={{ transitionDelay: `${i * 0.08}s` }}>
              <DestinationCard destination={d} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
