import { memo } from 'react';
import clsx from 'clsx';

const TestimonialCard = memo(({ testimonial }) => {
  const { avatar, name, city, rating, date, company, route, comment, verified } = testimonial;

  return (
    <div className="btc-t-card" tabIndex={0} role="article" aria-label={`Avis de ${name}`}>
      <div className="btc-t-card-top">
        <div className="btc-t-card-quote-icon" aria-hidden="true">
          <i className="bi bi-quote" />
        </div>
        <div className="btc-t-card-stars" aria-label={`Note ${rating} sur 5`}>
          {[...Array(5)].map((_, i) => (
            <i key={i} className={clsx('bi', i < rating ? 'bi-star-fill' : 'bi-star')} />
          ))}
        </div>
      </div>

      <blockquote className="btc-t-card-quote">
        <p>{comment}</p>
      </blockquote>

      <div className="btc-t-card-route">
        <i className="bi bi-arrow-left-right" /> {route}
      </div>

      <div className="btc-t-card-footer">
        <img src={avatar} alt={name} className="btc-t-card-avatar" loading="lazy" decoding="async" />
        <div className="btc-t-card-meta">
          <div className="btc-t-card-name">{name}</div>
          <div className="btc-t-card-city">
            <i className="bi bi-geo-alt-fill" /> {city}
          </div>
        </div>
        {verified && (
          <span className="btc-t-card-badge" title="Voyage vérifié">
            <i className="bi bi-patch-check-fill" /> Vérifié
          </span>
        )}
      </div>

      <div className="btc-t-card-details">
        <span><i className="bi bi-calendar3" /> {date}</span>
        <span><i className="bi bi-bus-front" /> {company}</span>
      </div>
    </div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';
export default TestimonialCard;
