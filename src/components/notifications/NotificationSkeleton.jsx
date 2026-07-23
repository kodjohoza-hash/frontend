const NotificationSkeleton = () => {
  return (
    <div className="nf-skeleton">
      <div className="nf-skeleton__header">
        <div className="nf-skeleton__title-group">
          <div className="nf-bar" style={{ width: 160, height: 28 }} />
          <div className="nf-bar" style={{ width: 300, height: 16 }} />
        </div>
        <div className="nf-skeleton__header-actions">
          <div className="nf-bar" style={{ width: 180, height: 40 }} />
          <div className="nf-bar" style={{ width: 180, height: 40 }} />
        </div>
      </div>

      <div className="nf-skeleton__stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="nf-skeleton__stat">
            <div className="nf-bar-circle" style={{ width: 40, height: 40 }} />
            <div>
              <div className="nf-bar" style={{ width: 40, height: 20 }} />
              <div className="nf-bar" style={{ width: 60, height: 12 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="nf-skeleton__search">
        <div className="nf-bar" style={{ width: '100%', height: 46 }} />
      </div>

      <div className="nf-skeleton__filters">
        <div className="nf-skeleton__filter-tabs">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="nf-bar" style={{ width: 70 + Math.random() * 30, height: 36 }} />
          ))}
        </div>
        <div className="nf-skeleton__filter-selects">
          <div className="nf-bar" style={{ width: 120, height: 36 }} />
          <div className="nf-bar" style={{ width: 120, height: 36 }} />
        </div>
      </div>

      <div className="nf-skeleton__list">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="nf-skeleton__card">
            <div className="nf-bar-circle" style={{ width: 44, height: 44 }} />
            <div className="nf-skeleton__card-body">
              <div className="nf-skeleton__card-top">
                <div className="nf-bar" style={{ width: 160, height: 16 }} />
                <div className="nf-bar" style={{ width: 60, height: 12 }} />
              </div>
              <div className="nf-bar" style={{ width: '90%', height: 13 }} />
              <div className="nf-skeleton__card-footer">
                <div className="nf-bar" style={{ width: 50, height: 20 }} />
                <div className="nf-bar" style={{ width: 80, height: 20 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSkeleton;
