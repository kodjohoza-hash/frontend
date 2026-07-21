import { useInView } from '@hooks/useLandingPage';
import { STEPS } from '@data/landingPage';

const HowItWorksSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="comment-ca-marche" className="btc-how" ref={ref} aria-label="Comment ça marche">
      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-list-ol" /> Simple et rapide
          </span>
          <h2 className="btc-section-title">Comment ça fonctionne ?</h2>
          <p className="btc-section-subtitle">
            Réservez votre billet en 5 étapes simples.
          </p>
        </div>

        <div className="btc-how-timeline">
          <div className="btc-how-line" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`btc-how-step ${isInView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="btc-how-number">{step.number}</div>
              <div className="btc-how-icon">
                <i className={`bi ${step.icon}`} />
              </div>
              <h4 className="btc-how-title">{step.title}</h4>
              <p className="btc-how-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
