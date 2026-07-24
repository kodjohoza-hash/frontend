export default function AgencyTripSkeleton({ rows = 8 }) {
  return (
    <div className="at-skeleton">
      <div className="at-skeleton__stats">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="at-skeleton__stat-card">
            <div className="at-skeleton__icon shimmer" />
            <div className="at-skeleton__text-group">
              <div className="at-skeleton__title shimmer" />
              <div className="at-skeleton__subtitle shimmer" />
            </div>
          </div>
        ))}
      </div>

      <div className="at-skeleton__filters">
        <div className="at-skeleton__bar shimmer" />
      </div>

      <div className="at-skeleton__table">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="at-skeleton__row">
            <div className="at-skeleton__cell at-skeleton__cell--id shimmer" />
            <div className="at-skeleton__cell shimmer" />
            <div className="at-skeleton__cell at-skeleton__cell--wide shimmer" />
            <div className="at-skeleton__cell shimmer" />
            <div className="at-skeleton__cell shimmer" />
            <div className="at-skeleton__cell shimmer" />
            <div className="at-skeleton__cell at-skeleton__cell--bar shimmer" />
            <div className="at-skeleton__cell at-skeleton__cell--price shimmer" />
            <div className="at-skeleton__cell at-skeleton__cell--badge shimmer" />
            <div className="at-skeleton__cell at-skeleton__cell--actions shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
