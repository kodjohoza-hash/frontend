import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const ConfirmationSkeleton = () => (
  <SkeletonTheme baseColor="var(--color-gray-100)" highlightColor="var(--color-gray-50)">
    <div className="py-4">
      <Skeleton height={48} className="mb-3 mx-auto" style={{ maxWidth: 400 }} />
      <Skeleton height={200} className="mb-4" style={{ borderRadius: 'var(--radius-xl)' }} />
      <div className="row g-4">
        <div className="col-lg-5">
          <Skeleton height={240} className="mb-3" style={{ borderRadius: 'var(--radius-xl)' }} />
          <Skeleton height={160} style={{ borderRadius: 'var(--radius-xl)' }} />
        </div>
        <div className="col-lg-7">
          <Skeleton height={440} className="mb-3" style={{ borderRadius: 'var(--radius-xl)' }} />
          <Skeleton height={120} style={{ borderRadius: 'var(--radius-xl)' }} />
        </div>
      </div>
    </div>
  </SkeletonTheme>
);

export default ConfirmationSkeleton;
