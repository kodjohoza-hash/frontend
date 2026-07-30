const CounterCustomerSkeleton = () => (
  <div className="acc-skeleton">
    <div className="acc-skel-stats">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="acc-skel-card">
          <div className="acc-skel-bar" style={{ width: 40, height: 40, borderRadius: 12 }} />
          <div className="acc-skel-bar" style={{ width: '50%', height: 14, marginTop: 12 }} />
          <div className="acc-skel-bar" style={{ width: '75%', height: 24, marginTop: 6 }} />
          <div className="acc-skel-bar" style={{ width: '40%', height: 12, marginTop: 6 }} />
        </div>
      ))}
    </div>
    <div className="acc-skel-bar" style={{ width: '100%', height: 48, marginTop: 16 }} />
    <div className="acc-skel-table">
      <div className="acc-skel-table-header">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="acc-skel-bar" style={{ width: `${70 + Math.random() * 30}%`, height: 14 }} />
        ))}
      </div>
      {[...Array(5)].map((_, r) => (
        <div key={r} className="acc-skel-table-row">
          <div className="acc-skel-bar" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          {[...Array(8)].map((_, c) => (
            <div
              key={c}
              className="acc-skel-bar"
              style={{ width: `${50 + Math.random() * 50}%`, height: 12 }}
            />
          ))}
          <div className="acc-skel-bar" style={{ width: 60, height: 22, borderRadius: 20 }} />
        </div>
      ))}
    </div>
  </div>
);

export default CounterCustomerSkeleton;
