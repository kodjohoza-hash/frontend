import { useInView } from '@hooks/useLandingPage';
import { STEPS } from '@data/landingPage';
import StepCard from './StepCard';

const HowItWorksSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="comment-ca-marche" className="btc-how" ref={ref} aria-label="Comment ça marche">
      <div className="btc-how-deco" aria-hidden="true">
        <div className="btc-how-deco-orb btc-how-deco-orb--1" />
        <div className="btc-how-deco-orb btc-how-deco-orb--2" />
      </div>

      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-list-ol" /> Simple et rapide
          </span>
          <h2 className="btc-section-title">
            Comment réserver votre <span className="text-accent">billet</span> ?
          </h2>
          <p className="btc-section-subtitle">
            Réservez votre billet en quelques étapes simples grâce à BUS TIX CONNECT.
          </p>
        </div>

        <div className="btc-how-timeline">
          <div className="btc-how-line" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`btc-how-step ${isInView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <StepCard step={step} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
