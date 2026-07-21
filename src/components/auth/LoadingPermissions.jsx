import Skeleton from 'react-loading-skeleton';
import skeletonTheme from '@components/skeletons/skeletonTheme';

/**
 * LoadingPermissions — Loading state for permission checks
 * Shows skeleton UI while permissions are being fetched/resolved
 */
const LoadingPermissions = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
    <div style={{ width: '100%', maxWidth: 400, padding: 'var(--space-8)' }}>
      <div className="text-center mb-4">
        <Skeleton {...skeletonTheme} width={56} height={56} borderRadius="var(--radius-xl)" className="mx-auto mb-3" />
        <Skeleton {...skeletonTheme} width={180} height={20} className="mx-auto mb-2" />
        <Skeleton {...skeletonTheme} width={260} height={14} className="mx-auto" />
      </div>
      <div className="d-flex gap-3 justify-content-center">
        <Skeleton {...skeletonTheme} width={120} height={40} borderRadius="var(--radius-lg)" />
        <Skeleton {...skeletonTheme} width={120} height={40} borderRadius="var(--radius-lg)" />
      </div>
    </div>
  </div>
);

export default LoadingPermissions;
