const CounterSaleSkeleton = () => (
  <div className="acs-skeleton">
    <div className="acs-skeleton__progress">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="acs-skeleton__dot" />
      ))}
    </div>
    <div className="acs-skeleton__form">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="acs-skeleton__bar" style={{ height: 42 }} />
      ))}
    </div>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="acs-skeleton__bar" style={{ width: `${90 - i * 8}%`, height: 64 }} />
    ))}
  </div>
);

export default CounterSaleSkeleton;
