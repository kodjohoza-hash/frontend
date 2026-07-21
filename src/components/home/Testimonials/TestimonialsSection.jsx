import clsx from 'clsx';
import { TESTIMONIALS } from '@data/landingPage';
import { useInView } from '@hooks/useLandingPage';

const TestimonialCard = ({ t, index, isInView }) => (
  <div
    className={clsx('btc-testimonial-card', { 'btc-testimonial-card--featured': index === 0 })}
  >
    <div className="btc-testimonial-quote-icon" aria-hidden="true">
      <i className="bi bi-quote" />
    </div>
    <blockquote className="btc-testimonial-quote">
      <p>{t.comment}</p>
    </blockquote>
    <div className="btc-testimonial-footer">
      <img src={t.avatar} alt={t.name} className="btc-testimonial-avatar" loading="lazy" />
      <div className="btc-testimonial-meta">
        <div className="btc-testimonial-name">{t.name}</div>
        <div className="btc-testimonial-city">
          <i className="bi bi-geo-alt-fill" /> {t.city}
        </div>
      </div>
      <div className="btc-testimonial-stars">
        {[...Array(5)].map((_, i) => (
          <i key={i} className={clsx('bi', i < t.rating ? 'bi-star-fill' : 'bi-star')} />
        ))}
      </div>
    </div>
    {t.date && (
      <div className="btc-testimonial-date">
        <i className="bi bi-calendar3" /> {t.date}
      </div>
    )}
  </div>
);

const TestimonialsSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="temoignages" className="btc-testimonials" ref={ref}>
      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-chat-quote" /> Témoignages
          </span>
          <h2 className="btc-section-title">Ce que disent nos <span className="text-accent">voyageurs</span></h2>
          <p className="btc-section-subtitle">
            Des milliers de clients satisfaits nous font confiance au quotidien.
          </p>
        </div>

        <div className="btc-testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className={clsx('btc-testimonials-item', { 'is-visible': isInView })}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <TestimonialCard t={t} index={i} isInView={isInView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
