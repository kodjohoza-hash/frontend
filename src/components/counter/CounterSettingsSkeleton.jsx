import clsx from 'clsx';

const SkeletonBlock = ({ className, style }) => (
  <div className={clsx('acs2-skeleton', className)} style={style} />
);

const SIDEBAR_ITEMS = [
  { icon: 'bi-person' },
  { icon: 'bi-shield-lock' },
  { icon: 'bi-bell' },
  { icon: 'bi-palette' },
  { icon: 'bi-translate' },
  { icon: 'bi-gear' },
];

const CounterSettingsSkeleton = () => (
  <div className="acs2-skel-layout">
    <div className="acs2-skel-sidebar">
      <div className="acs2-skel-sidebar__items">
        {SIDEBAR_ITEMS.map((item, i) => (
          <div key={i} className="acs2-skel-sidebar__item">
            <SkeletonBlock style={{ width: 20, height: 20, borderRadius: 6 }} />
            <SkeletonBlock style={{ width: '60%', height: 14 }} />
          </div>
        ))}
      </div>
    </div>

    <div className="acs2-skel-content">
      <div className="acs2-skel-section-header">
        <SkeletonBlock style={{ width: 42, height: 42, borderRadius: 12 }} />
        <SkeletonBlock style={{ width: 200, height: 20 }} />
      </div>

      <div className="acs2-skel-card">
        <div className="acs2-skel-form-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="acs2-skel-form-field">
              <SkeletonBlock style={{ width: '40%', height: 10 }} />
              <SkeletonBlock style={{ width: '100%', height: 40, borderRadius: 10 }} />
            </div>
          ))}
        </div>

        <div className="acs2-skel-actions">
          <SkeletonBlock style={{ width: 140, height: 38, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  </div>
);

export default CounterSettingsSkeleton;
