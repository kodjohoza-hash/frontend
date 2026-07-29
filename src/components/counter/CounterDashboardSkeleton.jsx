const widths = [85, 65, 75, 55, 80, 60, 70, 50];

const CounterDashboardSkeleton = () => (
  <div className="act-skeleton">
    <div className="act-skeleton__sidebar">
      <div className="act-skeleton__bar" style={{ width: '70%', height: 24 }} />
      <div className="act-skeleton__bars">
        {widths.map((w, i) => (
          <div key={i} className="act-skeleton__bar" style={{ width: `${w}%`, height: 14 }} />
        ))}
      </div>
    </div>
    <div className="act-skeleton__main">
      <div className="act-skeleton__bar" style={{ width: '100%', height: 56 }} />
      <div className="act-skeleton__bar" style={{ width: '40%', height: 28, marginTop: 24 }} />
      <div className="act-skeleton__grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="act-skeleton__card">
            <div className="act-skeleton__bar" style={{ width: 36, height: 36, borderRadius: 10 }} />
            <div className="act-skeleton__bar" style={{ width: '60%', height: 20 }} />
            <div className="act-skeleton__bar" style={{ width: '80%', height: 12 }} />
          </div>
        ))}
      </div>
      <div className="act-skeleton__content-row">
        <div className="act-skeleton__panel">
          <div className="act-skeleton__bar" style={{ width: '50%', height: 18 }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="act-skeleton__bar" style={{ width: `${85 - i * 8}%`, height: 48 }} />
          ))}
        </div>
        <div className="act-skeleton__panel">
          <div className="act-skeleton__bar" style={{ width: '50%', height: 18 }} />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="act-skeleton__bar" style={{ width: `${90 - i * 10}%`, height: 36 }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CounterDashboardSkeleton;
