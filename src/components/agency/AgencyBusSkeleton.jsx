import { useState } from 'react';
import clsx from 'clsx';

export default function AgencyBusSkeleton({ rows = 8 }) {
  return (
    <div className="ab-skeleton">
      <div className="ab-skeleton__stats">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="ab-skeleton__stat">
            <div className="ab-skeleton__icon shimmer" />
            <div className="ab-skeleton__text">
              <div className="ab-skeleton__title shimmer" />
              <div className="ab-skeleton__subtitle shimmer" />
            </div>
          </div>
        ))}
      </div>
      <div className="ab-skeleton__filters">
        <div className="ab-skeleton__bar shimmer" />
      </div>
      <div className="ab-skeleton__table">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="ab-skeleton__row">
            <div className="ab-skeleton__cell ab-skeleton__cell--img shimmer" />
            <div className="ab-skeleton__cell shimmer" />
            <div className="ab-skeleton__cell shimmer" />
            <div className="ab-skeleton__cell shimmer" />
            <div className="ab-skeleton__cell shimmer" />
            <div className="ab-skeleton__cell shimmer" />
            <div className="ab-skeleton__cell shimmer" />
            <div className="ab-skeleton__cell ab-skeleton__cell--badge shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
