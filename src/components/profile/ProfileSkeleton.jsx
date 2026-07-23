const ProfileSkeleton = () => {
  return (
    <div className="pf-skeleton">
      <div className="pf-skeleton__header">
        <div className="pf-skeleton__title-group">
          <div className="pf-skeleton__bar" style={{ width: 160, height: 28 }} />
          <div className="pf-skeleton__bar" style={{ width: 260, height: 16 }} />
        </div>
        <div className="pf-skeleton__bar pf-skeleton__save-btn" style={{ width: 220, height: 42 }} />
      </div>

      <div className="pf-skeleton__grid">
        <div className="pf-skeleton__col-left">
          <div className="pf-skeleton__card pf-skeleton__card--profile">
            <div className="pf-skeleton__circle pf-skeleton__avatar" />
            <div className="pf-skeleton__bar" style={{ width: 140, height: 18, margin: '0 auto' }} />
            <div className="pf-skeleton__bar" style={{ width: 200, height: 14, margin: '0 auto' }} />
            <div className="pf-skeleton__spacer" />
            <div className="pf-skeleton__fields">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="pf-skeleton__field-row">
                  <div className="pf-skeleton__bar" style={{ width: 80, height: 12 }} />
                  <div className="pf-skeleton__bar" style={{ width: 140, height: 14 }} />
                </div>
              ))}
            </div>
          </div>

          <div className="pf-skeleton__card">
            <div className="pf-skeleton__bar" style={{ width: 120, height: 18 }} />
            <div className="pf-skeleton__stats-grid">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="pf-skeleton__stat-item">
                  <div className="pf-skeleton__circle" style={{ width: 40, height: 40 }} />
                  <div>
                    <div className="pf-skeleton__bar" style={{ width: 50, height: 16 }} />
                    <div className="pf-skeleton__bar" style={{ width: 80, height: 11 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pf-skeleton__col-right">
          <div className="pf-skeleton__card">
            <div className="pf-skeleton__bar" style={{ width: 180, height: 18 }} />
            <div className="pf-skeleton__form-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="pf-skeleton__form-field">
                  <div className="pf-skeleton__bar" style={{ width: 90, height: 12 }} />
                  <div className="pf-skeleton__bar" style={{ width: '100%', height: 42 }} />
                </div>
              ))}
            </div>
          </div>

          <div className="pf-skeleton__card">
            <div className="pf-skeleton__bar" style={{ width: 140, height: 18 }} />
            <div className="pf-skeleton__form-grid">
              {[1, 2].map((i) => (
                <div key={i} className="pf-skeleton__form-field">
                  <div className="pf-skeleton__bar" style={{ width: 70, height: 12 }} />
                  <div className="pf-skeleton__bar" style={{ width: '100%', height: 42 }} />
                </div>
              ))}
            </div>
          </div>

          <div className="pf-skeleton__card">
            <div className="pf-skeleton__bar" style={{ width: 160, height: 18 }} />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="pf-skeleton__notif-row">
                <div className="pf-skeleton__bar" style={{ width: '70%', height: 14 }} />
                <div className="pf-skeleton__bar" style={{ width: 50, height: 28, borderRadius: 14 }} />
              </div>
            ))}
          </div>

          <div className="pf-skeleton__card">
            <div className="pf-skeleton__bar" style={{ width: 100, height: 18 }} />
            <div className="pf-skeleton__security-rows">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pf-skeleton__security-row">
                  <div className="pf-skeleton__circle" style={{ width: 36, height: 36 }} />
                  <div style={{ flex: 1 }}>
                    <div className="pf-skeleton__bar" style={{ width: 120, height: 14 }} />
                    <div className="pf-skeleton__bar" style={{ width: 180, height: 11 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
