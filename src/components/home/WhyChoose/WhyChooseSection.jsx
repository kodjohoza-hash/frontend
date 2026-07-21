import { useInView } from '@hooks/useLandingPage';
import { WHY_CHOOSE } from '@data/landingPage';

const WhyChooseSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="pourquoi" className="btc-why-choose" ref={ref} aria-label="Pourquoi choisir Bus Tix Connect">
      <div className="btc-why-choose-deco" aria-hidden="true">
        <div className="btc-why-choose-deco-orb btc-why-choose-deco-orb--1" />
        <div className="btc-why-choose-deco-orb btc-why-choose-deco-orb--2" />
      </div>

      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-patch-check" /> Nos avantages
          </span>
          <h2 className="btc-section-title">
            Pourquoi choisir <span className="text-accent">BUS TIX CONNECT</span> ?
          </h2>
          <p className="btc-section-subtitle">
            Voyagez en toute confiance grâce à une plateforme pensée pour rendre vos déplacements plus simples, rapides et sécurisés.
          </p>
        </div>

        <div className="btc-why-choose-grid">
          {WHY_CHOOSE.map((item, i) => (
            <div
              key={item.id}
              className={`btc-why-choose-card ${isInView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="btc-why-choose-icon">
                <i className={`bi ${item.icon}`} />
              </div>
              <h3 className="btc-why-choose-title">{item.title}</h3>
              <p className="btc-why-choose-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
