import { memo } from 'react';

const CkSkeleton = memo(() => (
  <div className="ck-skeleton" aria-hidden="true" aria-label="Chargement">
    <div className="ck-skeleton__left">
      <div className="ck-skeleton__title" />
      <div className="ck-skeleton__subtitle" />
      <div className="ck-skeleton__grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="ck-skeleton__card">
            <div className="ck-skeleton__icon" />
            <div className="ck-skeleton__lines">
              <div className="ck-skeleton__line ck-skeleton__line--w60" />
              <div className="ck-skeleton__line ck-skeleton__line--w80" />
            </div>
          </div>
        ))}
      </div>
      <div className="ck-skeleton__form">
        <div className="ck-skeleton__field" />
        <div className="ck-skeleton__field" />
      </div>
    </div>
    <div className="ck-skeleton__right">
      <div className="ck-skeleton__photo" />
      <div className="ck-skeleton__lines" style={{ padding: '16px' }}>
        <div className="ck-skeleton__line ck-skeleton__line--w80" />
        <div className="ck-skeleton__line ck-skeleton__line--w60" />
        <div className="ck-skeleton__line ck-skeleton__line--w40" />
        <div className="ck-skeleton__divider" />
        <div className="ck-skeleton__line ck-skeleton__line--w100" />
        <div className="ck-skeleton__line ck-skeleton__line--w70" />
        <div className="ck-skeleton__total" />
      </div>
    </div>
  </div>
));
CkSkeleton.displayName = 'CkSkeleton';
export default CkSkeleton;
