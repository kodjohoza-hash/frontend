const CounterNotificationSkeleton = () => (
  <div className="acn-skeleton">
    <div className="acn-skel-header" />
    <div className="acn-skel-stats">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="acn-skel-stat" />
      ))}
    </div>
    <div className="acn-skel-filters" />
    <div className="acn-skel-list">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="acn-skel-card" />
      ))}
    </div>
  </div>
);

export default CounterNotificationSkeleton;
