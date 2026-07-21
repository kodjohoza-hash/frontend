import { useInView, useCountUp } from '@hooks/useLandingPage';
import { TESTIMONIALS, TESTIMONIAL_STATS } from '@data/testimonials';
import TestimonialsCarousel from './TestimonialsCarousel';

const StatItem = ({ stat, isInView }) => {
  const count = useCountUp(stat.value, 2000, isInView);
  return (
    <div className="btc-t-stat">
      <div className="btc-t-stat-icon">
        <i className={`bi ${stat.icon}`} />
      </div>
      <div className="btc-t-stat-value">
        {count.toLocaleString('fr-FR')}{stat.suffix}
      </div>
      <div className="btc-t-stat-label">{stat.label}</div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="temoignages" className="btc-testimonials" ref={ref}>
      <div className="btc-t-deco" aria-hidden="true">
        <div className="btc-t-deco-orb btc-t-deco-orb--1" />
        <div className="btc-t-deco-orb btc-t-deco-orb--2" />
      </div>

      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-star-fill" /> Témoignages
          </span>
          <h2 className="btc-section-title">
            Ce que disent nos <span className="text-accent">voyageurs</span>
          </h2>
          <p className="btc-section-subtitle">
            Découvrez les expériences de nos voyageurs ayant réservé leurs billets via BUS TIX CONNECT.
          </p>
        </div>

        <div className={`btc-t-stats ${isInView ? 'is-visible' : ''}`}>
          {TESTIMONIAL_STATS.map((stat) => (
            <StatItem key={stat.id} stat={stat} isInView={isInView} />
          ))}
        </div>

        <div className={`btc-t-rating ${isInView ? 'is-visible' : ''}`}>
          <div className="btc-t-rating-stars">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="bi bi-star-fill" />
            ))}
          </div>
          <span className="btc-t-rating-score">4.9 / 5</span>
          <span className="btc-t-rating-count">Basé sur +12 000 avis</span>
        </div>

        <TestimonialsCarousel testimonials={TESTIMONIALS} />
      </div>
    </section>
  );
};

export default TestimonialsSection;
