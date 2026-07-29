const CounterBookingSkeleton = () => (
  <div className="acb-wrapper acb-skeleton">
    <div className="acb-skel-stats">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="acb-skel-stat" />
      ))}
    </div>
    <div className="acb-skel-filters" />
    <div className="acb-skel-table" />
  </div>
);

export default CounterBookingSkeleton;
