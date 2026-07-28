const AgencyClientSkeleton = () => (
  <div className="ac-skeleton">
    <div className="ac-skeleton__stats">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="ac-skeleton__stat">
          <div className="ac-skeleton__icon shimmer" />
          <div className="ac-skeleton__text">
            <div className="ac-skeleton__title shimmer" />
            <div className="ac-skeleton__subtitle shimmer" />
          </div>
        </div>
      ))}
    </div>
    <div className="ac-skeleton__filters">
      <div className="ac-skeleton__bar shimmer" />
    </div>
    <div className="ac-skeleton__table">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="ac-skeleton__row">
          <div className="ac-skeleton__cell ac-skeleton__cell--avatar shimmer" />
          <div className="ac-skeleton__cell shimmer" />
          <div className="ac-skeleton__cell shimmer" />
          <div className="ac-skeleton__cell shimmer" />
          <div className="ac-skeleton__cell shimmer" />
          <div className="ac-skeleton__cell ac-skeleton__cell--badge shimmer" />
          <div className="ac-skeleton__cell ac-skeleton__cell--actions shimmer" />
        </div>
      ))}
    </div>
  </div>
);

export default AgencyClientSkeleton;
