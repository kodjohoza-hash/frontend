export default function AgencyDriverSkeleton({ rows = 8 }) {
  return (
    <div className="ad-skeleton">
      <div className="ad-skeleton__stats">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="ad-skeleton__stat">
            <div className="ad-skeleton__icon shimmer" />
            <div className="ad-skeleton__text"><div className="ad-skeleton__title shimmer" /><div className="ad-skeleton__subtitle shimmer" /></div>
          </div>
        ))}
      </div>
      <div className="ad-skeleton__filters"><div className="ad-skeleton__bar shimmer" /></div>
      <div className="ad-skeleton__table">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="ad-skeleton__row">
            <div className="ad-skeleton__cell ad-skeleton__cell--avatar shimmer" />
            <div className="ad-skeleton__cell shimmer" />
            <div className="ad-skeleton__cell shimmer" />
            <div className="ad-skeleton__cell shimmer" />
            <div className="ad-skeleton__cell shimmer" />
            <div className="ad-skeleton__cell ad-skeleton__cell--badge shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
