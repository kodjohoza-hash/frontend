import Skeleton from 'react-loading-skeleton';
import skeletonTheme from '@components/skeletons/skeletonTheme';

/**
 * LoadingAuth — Full-page skeleton for auth loading state
 */
const LoadingAuth = () => (
  <div className="auth-layout d-flex min-vh-100">
    <div className="auth-layout__sidebar d-none d-lg-flex">
      <div className="auth-layout__sidebar-content">
        <Skeleton {...skeletonTheme} width={280} height={32} className="mb-3" />
        <Skeleton {...skeletonTheme} width={320} height={18} className="mb-4" />
        <Skeleton {...skeletonTheme} width={260} height={220} borderRadius="var(--radius-2xl)" />
        <Skeleton {...skeletonTheme} width={300} height={24} className="mt-4" />
        <Skeleton {...skeletonTheme} width={280} height={16} />
      </div>
    </div>
    <div className="auth-layout__content">
      <div className="auth-layout__content-inner">
        <AuthSkeleton />
      </div>
    </div>
  </div>
);

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

export default LoadingAuth;
