const ReservationSkeleton = () => {
  return (
    <div className="rv-skeleton">
      <div className="rv-skeleton__header">
        <div className="rv-skeleton__title-group">
          <div className="sp-bar" style={{ width: 220, height: 24 }} />
          <div className="sp-bar" style={{ width: 320, height: 14 }} />
        </div>
        <div className="sp-bar" style={{ width: 200, height: 42, borderRadius: 12 }} />
      </div>

      <div className="rv-skeleton__stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rv-skeleton__stat-card">
            <div className="sp-bar-circle" style={{ width: 44, height: 44 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="sp-bar" style={{ width: '40%', height: 16 }} />
              <div className="sp-bar" style={{ width: '60%', height: 12 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rv-skeleton__search">
        <div className="sp-bar" style={{ width: '100%', height: 46, borderRadius: 14 }} />
      </div>

      <div className="rv-skeleton__filters">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="sp-bar" style={{ width: 90, height: 36, borderRadius: 20 }} />
        ))}
      </div>

      <div className="rv-skeleton__list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rv-skeleton__card">
            <div className="sp-bar" style={{ width: '100%', height: 140, borderRadius: '16px 16px 0 0' }} />
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="sp-bar" style={{ width: 140, height: 16 }} />
                <div className="sp-bar" style={{ width: 80, height: 24, borderRadius: 20 }} />
              </div>
              <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                <div className="sp-bar" style={{ width: 60, height: 14 }} />
                <div className="sp-bar" style={{ width: 80, height: 10 }} />
                <div className="sp-bar" style={{ width: 60, height: 14 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div className="sp-bar" style={{ width: 70, height: 12 }} />
                <div className="sp-bar" style={{ width: 50, height: 12 }} />
                <div className="sp-bar" style={{ width: 80, height: 12 }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <div className="sp-bar" style={{ width: 80, height: 34, borderRadius: 10 }} />
                <div className="sp-bar" style={{ width: 70, height: 34, borderRadius: 10 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationSkeleton;
