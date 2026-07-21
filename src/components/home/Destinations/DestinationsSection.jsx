import { useInView } from '@hooks/useLandingPage';
import { useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '@data/destinations';
import DestinationCard from './DestinationCard';

const DestinationsSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const navigate = useNavigate();

  return (
    <section id="destinations" className="btc-destinations" ref={ref}>
      <div className="btc-dest-deco" aria-hidden="true">
        <div className="btc-dest-deco-orb btc-dest-deco-orb--1" />
        <div className="btc-dest-deco-orb btc-dest-deco-orb--2" />
      </div>

      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-geo-alt" /> Populaires
          </span>
          <h2 className="btc-section-title">
            Explorez les destinations les plus <span className="text-accent">populaires</span>
          </h2>
          <p className="btc-section-subtitle">
            Découvrez les villes les plus demandées et réservez votre prochain voyage en quelques clics.
          </p>
        </div>

        <div className="btc-dest-grid">
          {DESTINATIONS.map((d, i) => (
            <div
              key={d.id}
              className={`btc-dest-wrap ${isInView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <DestinationCard destination={d} />
            </div>
          ))}
        </div>

        <div className={`btc-dest-footer ${isInView ? 'is-visible' : ''}`}>
          <button className="btc-dest-all-btn" onClick={() => navigate('/booking/search')}>
            Voir toutes les destinations <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
