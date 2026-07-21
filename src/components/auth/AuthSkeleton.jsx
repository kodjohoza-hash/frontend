import Skeleton from 'react-loading-skeleton';
import skeletonTheme from '@components/skeletons/skeletonTheme';

/**
 * AuthSkeleton — Skeleton loader for auth pages
 */
const AuthSkeleton = () => (
  <div className="auth-skeleton">
    <div className="auth-skeleton__header">
      <Skeleton {...skeletonTheme} width={48} height={48} borderRadius="var(--radius-xl)" />
      <Skeleton {...skeletonTheme} width={200} height={24} />
      <Skeleton {...skeletonTheme} width={280} height={16} />
    </div>
    <div className="auth-skeleton__field">
      <Skeleton {...skeletonTheme} width={80} height={14} />
      <Skeleton {...skeletonTheme} height={44} borderRadius="var(--radius-lg)" />
    </div>
    <div className="auth-skeleton__field">
      <Skeleton {...skeletonTheme} width={120} height={14} />
      <Skeleton {...skeletonTheme} height={44} borderRadius="var(--radius-lg)" />
    </div>
    <Skeleton {...skeletonTheme} height={44} borderRadius="var(--radius-lg)" />
  </div>
);

export default AuthSkeleton;
