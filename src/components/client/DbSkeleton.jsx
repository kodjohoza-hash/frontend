const DbSkeleton = () => {
  const lines = (count) =>
    Array.from({ length: count }, (_, i) => (
      <div key={i} className="db-skeleton__bar" style={{ width: `${60 + Math.random() * 35}%` }} />
    ));

  return (
    <div className="db-skeleton">
      <div className="db-skeleton__sidebar">
        <div className="db-skeleton__logo" />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="db-skeleton__nav-item" />
        ))}
      </div>
      <div className="db-skeleton__main">
        <div className="db-skeleton__header">
          <div className="db-skeleton__bar" style={{ width: 200, height: 24 }} />
          <div className="db-skeleton__bar" style={{ width: 320, height: 16 }} />
        </div>
        <div className="db-skeleton__welcome">
          <div className="db-skeleton__bar" style={{ width: 300, height: 28 }} />
          <div className="db-skeleton__bar" style={{ width: 450, height: 16 }} />
          <div className="db-skeleton__bar" style={{ width: 180, height: 36 }} />
        </div>
        <div className="db-skeleton__stats-row">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="db-skeleton__stat-card">
              <div className="db-skeleton__bar" style={{ width: 40, height: 40, borderRadius: 12 }} />
              <div className="db-skeleton__bar" style={{ width: '80%', height: 14 }} />
              <div className="db-skeleton__bar" style={{ width: '60%', height: 28 }} />
              <div className="db-skeleton__bar" style={{ width: '40%', height: 12 }} />
            </div>
          ))}
        </div>
        <div className="db-skeleton__content-row">
          <div className="db-skeleton__card-wide">
            <div className="db-skeleton__bar" style={{ width: 160, height: 20 }} />
            {lines(3)}
          </div>
          <div className="db-skeleton__card-narrow">
            <div className="db-skeleton__bar" style={{ width: 140, height: 20 }} />
            {lines(4)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DbSkeleton;
