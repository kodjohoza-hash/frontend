import { useInView } from '@hooks/useLandingPage';

const FinalCTASection = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  const scrollToSearch = () => {
    document.querySelector('#search')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="btc-final-cta" ref={ref}>
      <div className="btc-final-cta-deco" aria-hidden="true">
        <div className="btc-final-cta-orb btc-final-cta-orb--1" />
        <div className="btc-final-cta-orb btc-final-cta-orb--2" />
      </div>
      <div className="container">
        <div className={`btc-final-cta-content ${isInView ? 'is-visible' : ''}`}>
          <h2 className="btc-final-cta-title">
            Prêt à voyager ?
          </h2>
          <p className="btc-final-cta-text">
            Rejoignez des milliers de Camerounais qui réservent leur billet de bus en toute confiance.
          </p>
          <div className="btc-final-cta-actions">
            <button className="btn btn-accent btn-lg btc-final-cta-btn-primary" onClick={scrollToSearch}>
              <i className="bi bi-search me-2" />
              Réserver maintenant
            </button>
          </div>
          <div className="btc-final-cta-stats">
            <div className="btc-final-cta-stat">
              <strong>120 000+</strong>
              <span>Voyageurs satisfaits</span>
            </div>
            <div className="btc-final-cta-stat-divider" />
            <div className="btc-final-cta-stat">
              <strong>420+</strong>
              <span>Voyages quotidiens</span>
            </div>
            <div className="btc-final-cta-stat-divider" />
            <div className="btc-final-cta-stat">
              <strong>4.9/5</strong>
              <span>Note moyenne</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
