import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';

const CnSkeleton = memo(() => (
  <div className="cn-skeleton" aria-hidden="true">
    <div className="cn-skeleton__stepper">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="cn-skeleton__step">
          <Skeleton circle width={36} height={36} />
          <Skeleton width={50} height={10} style={{ marginTop: 6 }} />
        </div>
      ))}
    </div>
    <Skeleton height={180} className="cn-skeleton__success" />
    <div className="cn-skeleton__split">
      <div className="cn-skeleton__left">
        <Skeleton height={280} className="cn-skeleton__card" />
        <Skeleton height={160} className="cn-skeleton__card" />
      </div>
      <div className="cn-skeleton__right">
        <Skeleton height={520} className="cn-skeleton__card" />
        <Skeleton height={100} className="cn-skeleton__card" />
      </div>
    </div>
  </div>
));
CnSkeleton.displayName = 'CnSkeleton';
export default CnSkeleton;
