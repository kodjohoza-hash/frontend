import { useInView } from '@hooks/useLandingPage';
import { FEATURES } from '@data/landingPage';

const FeaturesSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="features" className="btc-features" ref={ref} aria-label="Nos avantages">
      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-star" /> Avantages
          </span>
          <h2 className="btc-section-title">Pourquoi Bus Tix Connect ?</h2>
          <p className="btc-section-subtitle">
            Une plateforme complète pensée pour rendre votre voyage simple, rapide et agréable.
          </p>
        </div>

        <div className="btc-features-grid">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.id}
              className={`btc-feature-card ${isInView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="btc-feature-icon">
                <i className={`bi ${feature.icon}`} />
              </div>
              <h3 className="btc-feature-title">{feature.title}</h3>
              <p className="btc-feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
