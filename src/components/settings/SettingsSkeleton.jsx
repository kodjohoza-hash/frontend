const SettingsSkeleton = () => {
  return (
    <div className="st-skeleton">
      <div className="st-skeleton__header">
        <div className="st-skeleton__title-group">
          <div className="st-bar" style={{ width: 140, height: 28 }} />
          <div className="st-bar" style={{ width: 280, height: 16 }} />
        </div>
        <div className="st-bar st-skeleton__save-btn" style={{ width: 220, height: 42 }} />
      </div>

      <div className="st-skeleton__layout">
        <div className="st-skeleton__sidebar">
          <div className="st-skeleton__sidebar-items">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="st-skeleton__sidebar-item">
                <div className="st-bar" style={{ width: 18, height: 18, borderRadius: 6 }} />
                <div className="st-bar" style={{ width: 60 + Math.random() * 40, height: 14 }} />
              </div>
            ))}
          </div>
        </div>

        <div className="st-skeleton__content">
          <div className="st-skeleton__section-header">
            <div className="st-bar-circle" style={{ width: 40, height: 40 }} />
            <div>
              <div className="st-bar" style={{ width: 140, height: 18 }} />
              <div className="st-bar" style={{ width: 220, height: 13 }} />
            </div>
          </div>

          <div className="st-skeleton__card">
            <div className="st-skeleton__form-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="st-skeleton__form-field">
                  <div className="st-bar" style={{ width: 80, height: 12 }} />
                  <div className="st-bar" style={{ width: '100%', height: 44 }} />
                </div>
              ))}
            </div>
          </div>

          <div className="st-skeleton__card">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="st-skeleton__toggle-row">
                <div>
                  <div className="st-bar" style={{ width: 120, height: 14 }} />
                  <div className="st-bar" style={{ width: 200, height: 11 }} />
                </div>
                <div className="st-bar" style={{ width: 44, height: 24, borderRadius: 12 }} />
              </div>
            ))}
          </div>

          <div className="st-skeleton__actions">
            <div className="st-bar" style={{ width: 120, height: 42, borderRadius: 12 }} />
            <div className="st-bar" style={{ width: 100, height: 42, borderRadius: 12 }} />
            <div className="st-bar" style={{ width: 160, height: 42, borderRadius: 12 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSkeleton;
