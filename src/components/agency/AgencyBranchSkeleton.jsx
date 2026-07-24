import React from 'react';

export default function AgencyBranchSkeleton({ count = 6 }) {
  return (
    <div className="abr-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="abr-skeleton__row">
          <div className="abr-skeleton__avatar" />
          <div className="abr-skeleton__content">
            <div className="abr-skeleton__line abr-skeleton__line--title" />
            <div className="abr-skeleton__line abr-skeleton__line--subtitle" />
          </div>
          <div className="abr-skeleton__line abr-skeleton__line--short" />
          <div className="abr-skeleton__line abr-skeleton__line--medium" />
          <div className="abr-skeleton__line abr-skeleton__line--short" />
          <div className="abr-skeleton__line abr-skeleton__line--badge" />
        </div>
      ))}
    </div>
  );
}
