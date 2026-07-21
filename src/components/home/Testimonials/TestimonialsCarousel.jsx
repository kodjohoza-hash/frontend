import { useCallback, useRef, useState, useEffect } from 'react';
import { useAutoScroll } from '@hooks/useAutoScroll';
import TestimonialCard from './TestimonialCard';

const CARD_WIDTH = 380;
const GAP = 24;
const AUTO_INTERVAL = 4500;

const TestimonialsCarousel = ({ testimonials }) => {
  const {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    activeIndex,
    scrollTo,
    scrollToIndex,
    handleMouseEnter,
    handleMouseLeave,
  } = useAutoScroll({
    itemCount: testimonials.length,
    itemWidth: CARD_WIDTH,
    gap: GAP,
    autoScrollInterval: AUTO_INTERVAL,
  });

  const touchStart = useRef(0);
  const touchDelta = useRef(0);

  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
    touchDelta.current = 0;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(touchDelta.current) > 50) {
      scrollTo(touchDelta.current > 0 ? 'left' : 'right');
    }
  }, [scrollTo]);

  return (
    <div className="btc-t-carousel" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        className={`btc-t-carousel-btn btc-t-carousel-btn--left ${!canScrollLeft ? 'is-hidden' : ''}`}
        onClick={() => scrollTo('left')}
        aria-label="Témoignage précédent"
      >
        <i className="bi bi-chevron-left" />
      </button>

      <div
        className="btc-t-carousel-track"
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="btc-t-carousel-inner">
          {testimonials.map((t, i) => (
            <div key={t.id} className="btc-t-carousel-slide" style={{ width: CARD_WIDTH }}>
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>

      <button
        className={`btc-t-carousel-btn btc-t-carousel-btn--right ${!canScrollRight ? 'is-hidden' : ''}`}
        onClick={() => scrollTo('right')}
        aria-label="Témoignage suivant"
      >
        <i className="bi bi-chevron-right" />
      </button>

      <div className="btc-t-carousel-dots" role="tablist" aria-label="Navigation des témoignages">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            className={`btc-t-carousel-dot ${i === activeIndex ? 'is-active' : ''}`}
            onClick={() => scrollToIndex(i)}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Témoignage ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
