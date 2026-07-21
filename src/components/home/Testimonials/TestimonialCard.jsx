import React from 'react';
import clsx from 'clsx';

const TestimonialCard = React.memo(({ testimonial }) => (
  <div className="testimonial-card">
    <div className="testimonial-card-header">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="testimonial-avatar"
        loading="lazy"
      />
      <div className="testimonial-author">
        <div className="testimonial-author-name">{testimonial.name}</div>
        <div className="testimonial-author-city">
          <i className="bi bi-geo-alt" />
          {testimonial.city}
        </div>
      </div>
    </div>

    <div className="testimonial-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <i
          key={i}
          className={clsx('bi', i < testimonial.rating ? 'bi-star-fill' : 'bi-star')}
        />
      ))}
    </div>

    <blockquote className="testimonial-quote">
      <p>{testimonial.comment}</p>
    </blockquote>

    {testimonial.date && (
      <div className="testimonial-date">
        <i className="bi bi-calendar3" />
        {testimonial.date}
      </div>
    )}
  </div>
));

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard;
