const SupportSkeleton = () => {
  return (
    <div className="sp-skeleton">
      <div className="sp-skeleton__header">
        <div className="sp-bar" style={{ width: 180, height: 24 }} />
        <div className="sp-bar" style={{ width: 180, height: 38 }} />
      </div>

      <div className="sp-skeleton__hero">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <div className="sp-bar-circle" style={{ width: 48, height: 48 }} />
          <div className="sp-bar" style={{ width: 260, height: 20 }} />
          <div className="sp-bar" style={{ width: 320, height: 12 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="sp-bar" style={{ width: '100%', height: 48, borderRadius: 12 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="sp-bar" style={{ width: 60, height: 24, borderRadius: 20 }} />
            <div className="sp-bar" style={{ width: 80, height: 24, borderRadius: 20 }} />
            <div className="sp-bar" style={{ width: 70, height: 24, borderRadius: 20 }} />
          </div>
        </div>
      </div>

      <div className="sp-skeleton__section-title">
        <div className="sp-bar" style={{ width: 160, height: 18 }} />
      </div>

      <div className="sp-skeleton__categories-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="sp-skeleton__category-card">
            <div className="sp-bar-circle" style={{ width: 40, height: 40 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <div className="sp-bar" style={{ width: 80, height: 12 }} />
              <div className="sp-bar" style={{ width: 120, height: 10 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="sp-skeleton__section-title">
        <div className="sp-bar" style={{ width: 180, height: 18 }} />
      </div>

      <div className="sp-skeleton__faq-list">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="sp-skeleton__faq-item">
            <div className="sp-bar" style={{ width: `${60 + Math.random() * 30}%`, height: 16 }} />
          </div>
        ))}
      </div>

      <div className="sp-skeleton__section-title">
        <div className="sp-bar" style={{ width: 140, height: 18 }} />
      </div>

      <div className="sp-skeleton__contact-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="sp-skeleton__contact-card">
            <div className="sp-bar-circle" style={{ width: 44, height: 44 }} />
            <div className="sp-bar" style={{ width: 80, height: 14 }} />
            <div className="sp-bar" style={{ width: 100, height: 10 }} />
            <div className="sp-bar" style={{ width: 80, height: 10 }} />
            <div className="sp-bar" style={{ width: '80%', height: 32, borderRadius: 8 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportSkeleton;
