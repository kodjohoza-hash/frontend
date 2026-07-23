const SupportSkeleton = () => {
  return (
    <div className="sp-skeleton">
      <div className="sp-skeleton__header">
        <div className="sp-skeleton__title-group">
          <div className="sp-bar" style={{ width: 200, height: 28 }} />
          <div className="sp-bar" style={{ width: 340, height: 16 }} />
        </div>
        <div className="sp-bar" style={{ width: 220, height: 42 }} />
      </div>

      <div className="sp-skeleton__hero">
        <div className="sp-bar-circle" style={{ width: 72, height: 72 }} />
        <div className="sp-bar" style={{ width: 280, height: 24 }} />
        <div className="sp-bar" style={{ width: 340, height: 14 }} />
        <div className="sp-bar" style={{ width: '100%', maxWidth: 500, height: 48 }} />
      </div>

      <div className="sp-skeleton__section-title">
        <div className="sp-bar" style={{ width: 200, height: 20 }} />
      </div>

      <div className="sp-skeleton__categories-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="sp-skeleton__category-card">
            <div className="sp-bar-circle" style={{ width: 44, height: 44 }} />
            <div className="sp-bar" style={{ width: 80, height: 14 }} />
            <div className="sp-bar" style={{ width: 120, height: 11 }} />
          </div>
        ))}
      </div>

      <div className="sp-skeleton__section-title">
        <div className="sp-bar" style={{ width: 220, height: 20 }} />
      </div>

      <div className="sp-skeleton__faq-list">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="sp-skeleton__faq-item">
            <div className="sp-bar" style={{ width: `${60 + Math.random() * 30}%`, height: 18 }} />
          </div>
        ))}
      </div>

      <div className="sp-skeleton__section-title">
        <div className="sp-bar" style={{ width: 180, height: 20 }} />
      </div>

      <div className="sp-skeleton__contact-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="sp-skeleton__contact-card">
            <div className="sp-bar-circle" style={{ width: 48, height: 48 }} />
            <div className="sp-bar" style={{ width: 80, height: 16 }} />
            <div className="sp-bar" style={{ width: 120, height: 12 }} />
            <div className="sp-bar" style={{ width: 100, height: 12 }} />
            <div className="sp-bar" style={{ width: '80%', height: 36, borderRadius: 10 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportSkeleton;
