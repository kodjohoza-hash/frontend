const AgencyBookingSkeleton = () => (
  <div className="abr-skeleton">
    <div className="abr-skeleton__stats">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="abr-skeleton__stat-card shimmer">
          <div className="abr-skeleton__icon shimmer" />
          <div className="abr-skeleton__text-group">
            <div className="abr-skeleton__title shimmer" />
            <div className="abr-skeleton__subtitle shimmer" />
          </div>
        </div>
      ))}
    </div>
    <div className="abr-skeleton__filters shimmer" />
    <div className="abr-skeleton__table">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="abr-skeleton__row">
          <div className="abr-skeleton__cell abr-skeleton__cell--id shimmer" />
          <div className="abr-skeleton__cell abr-skeleton__cell--wide shimmer" />
          <div className="abr-skeleton__cell shimmer" />
          <div className="abr-skeleton__cell shimmer" />
          <div className="abr-skeleton__cell abr-skeleton__cell--bar shimmer" />
          <div className="abr-skeleton__cell abr-skeleton__cell--badge shimmer" />
          <div className="abr-skeleton__cell abr-skeleton__cell--actions shimmer" />
        </div>
      ))}
    </div>
  </div>
);

export default AgencyBookingSkeleton;
