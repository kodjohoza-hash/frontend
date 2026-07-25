export default function AgencyPaymentSkeleton() {
  return (
    <div className="ap-skeleton">
      <div className="ap-skeleton__stats">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="ap-skeleton__stat-card">
            <div className="ap-skeleton__icon shimmer" />
            <div className="ap-skeleton__text-group">
              <div className="ap-skeleton__title shimmer" />
              <div className="ap-skeleton__subtitle shimmer" />
            </div>
          </div>
        ))}
      </div>
      <div className="ap-skeleton__filters shimmer" />
      <div className="ap-skeleton__table">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="ap-skeleton__row">
            <div className="ap-skeleton__cell ap-skeleton__cell--md shimmer" />
            <div className="ap-skeleton__cell ap-skeleton__cell--lg shimmer" />
            <div className="ap-skeleton__cell ap-skeleton__cell--md shimmer" />
            <div className="ap-skeleton__cell ap-skeleton__cell--sm shimmer" />
            <div className="ap-skeleton__cell ap-skeleton__cell--md shimmer" />
            <div className="ap-skeleton__cell ap-skeleton__cell--sm shimmer" />
            <div className="ap-skeleton__cell ap-skeleton__cell--sm shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
