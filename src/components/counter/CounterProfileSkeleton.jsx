import clsx from 'clsx';

const SkeletonBlock = ({ className, style }) => (
  <div className={clsx('acpr-skeleton', className)} style={style} />
);

const CounterProfileSkeleton = () => (
  <div className="acpr-skeleton-wrapper">
    <div className="acpr-skeleton-header">
      <div className="acpr-skeleton-header-inner">
        <SkeletonBlock className="acpr-skeleton-avatar" />
        <div className="acpr-skeleton-header-text">
          <SkeletonBlock style={{ width: 240, height: 22 }} />
          <SkeletonBlock style={{ width: 160, height: 16, marginTop: 8 }} />
          <SkeletonBlock style={{ width: 300, height: 14, marginTop: 10 }} />
          <SkeletonBlock style={{ width: 200, height: 14, marginTop: 6 }} />
        </div>
      </div>
      <SkeletonBlock style={{ width: 180, height: 40, borderRadius: 10 }} />
    </div>

    <div className="acpr-skeleton-stats">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBlock key={i} className="acpr-skeleton-stat-card" />
      ))}
    </div>

    <div className="acpr-skeleton-body">
      <div className="acpr-skeleton-card">
        <SkeletonBlock style={{ width: 200, height: 18, marginBottom: 16 }} />
        <div className="acpr-skeleton-info-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="acpr-skeleton-field">
              <SkeletonBlock style={{ width: '60%', height: 10 }} />
              <SkeletonBlock style={{ width: '85%', height: 14, marginTop: 6 }} />
            </div>
          ))}
        </div>
      </div>

      <div className="acpr-skeleton-card">
        <SkeletonBlock style={{ width: 200, height: 18, marginBottom: 16 }} />
        <div className="acpr-skeleton-chart">
          <SkeletonBlock style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      <div className="acpr-skeleton-card">
        <SkeletonBlock style={{ width: 160, height: 18, marginBottom: 16 }} />
        <div className="acpr-skeleton-timeline">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="acpr-skeleton-timeline-item">
              <SkeletonBlock className="acpr-skeleton-timeline-dot" />
              <SkeletonBlock style={{ width: '50%', height: 12 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CounterProfileSkeleton;
