import React from 'react';

export default function AgencyCounterAgentSkeleton({ count = 6 }) {
  return (
    <div className="ac-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ac-skeleton__row">
          <div className="ac-skeleton__avatar" />
          <div className="ac-skeleton__content">
            <div className="ac-skeleton__line ac-skeleton__line--title" />
            <div className="ac-skeleton__line ac-skeleton__line--subtitle" />
          </div>
          <div className="ac-skeleton__line ac-skeleton__line--short" />
          <div className="ac-skeleton__line ac-skeleton__line--medium" />
          <div className="ac-skeleton__line ac-skeleton__line--short" />
          <div className="ac-skeleton__line ac-skeleton__line--badge" />
          <div className="ac-skeleton__line ac-skeleton__line--short" />
        </div>
      ))}
    </div>
  );
}
