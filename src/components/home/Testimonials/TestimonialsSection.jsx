import { useRef, useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { TESTIMONIALS } from '@data/landingPage';
import { useInView } from '@hooks/useLandingPage';

const INTERVAL = 5000;

const TestimonialCard = ({ t }) => (
  <div className="btc-testimonial-card">
    <div className="btc-testimonial-header">
      <img src={t.avatar} alt={t.name} className="btc-testimonial-avatar" loading="lazy" />
      <div>
        <div className="btc-testimonial-name">{t.name}</div>
        <div className="btc-testimonial-city">
          <i className="bi bi-geo-alt" /> {t.city}
        </div>
      </div>
    </div>
    <div className="btc-testimonial-stars">
      {[...Array(5)].map((_, i) => (
        <i key={i} className={clsx('bi', i < t.rating ? 'bi-star-fill' : 'bi-star')} />
      ))}
    </div>
    <blockquote className="btc-testimonial-quote">
      <p>{t.comment}</p>
    </blockquote>
    {t.date && (
      <div className="btc-testimonial-date">
        <i className="bi bi-calendar3" /> {t.date}
      </div>
    )}
  </div>
);

const TestimonialsSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const scrollRef = useRef(null);
  const autoRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [active, setActive] = useState(0);

  const updateState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 5);
    setCanRight(el.scrollLeft < max - 5);
    setActive(Math.min(Math.round(el.scrollLeft / 400), TESTIMONIALS.length - 1));
  }, []);

  const scroll = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
  }, []);

  const startAuto = useCallback(() => {
    autoRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 5) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scroll('right');
      }
    }, INTERVAL);
  }, [scroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateState, { passive: true });
    updateState();
    return () => el.removeEventListener('scroll', updateState);
  }, [updateState]);

  useEffect(() => {
    if (!isInView) return;
    startAuto();
    return () => clearInterval(autoRef.current);
  }, [isInView, startAuto]);

  return (
    <section id="temoignages" className="btc-testimonials" ref={ref}>
      <div className="container">
        <div className={`btc-section-header ${isInView ? 'is-visible' : ''}`}>
          <span className="btc-section-badge">
            <i className="bi bi-chat-quote" /> Témoignages
          </span>
          <h2 className="btc-section-title">Ce que disent nos voyageurs</h2>
          <p className="btc-section-subtitle">
            Des milliers de clients satisfaits nous font confiance.
          </p>
        </div>

        <div className="btc-carousel">
          <button className={`btc-carousel-btn btc-carousel-btn--left ${!canLeft ? 'is-hidden' : ''}`} onClick={() => scroll('left')} aria-label="Précédent">
            <i className="bi bi-chevron-left" />
          </button>

          <div className="btc-carousel-track" ref={scrollRef}>
            <div className="btc-carousel-inner">
              {TESTIMONIALS.map((t, i) => (
                <div key={t.id} className={`btc-carousel-item btc-carousel-item--test ${isInView ? 'is-visible' : ''}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>

          <button className={`btc-carousel-btn btc-carousel-btn--right ${!canRight ? 'is-hidden' : ''}`} onClick={() => scroll('right')} aria-label="Suivant">
            <i className="bi bi-chevron-right" />
          </button>
        </div>

        <div className="btc-carousel-dots">
          {TESTIMONIALS.map((t, i) => (
            <button key={t.id} className={`btc-carousel-dot ${i === active ? 'is-active' : ''}`} onClick={() => {
              scrollRef.current?.scrollTo({ left: i * 400, behavior: 'smooth' });
            }} aria-label={`Témoignage ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
