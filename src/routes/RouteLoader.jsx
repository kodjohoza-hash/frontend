import Skeleton from 'react-loading-skeleton';
import skeletonTheme from '@components/skeletons/skeletonTheme';

/**
 * RouteLoader — Full-page loading skeleton for route transitions
 * Replaces spinner-based fallbacks with premium skeleton UI
 */
const RouteLoader = ({ variant = 'default' }) => {
  if (variant === 'auth') {
    return (
      <div className="auth-layout d-flex min-vh-100">
        <div className="auth-layout__sidebar d-none d-lg-flex">
          <div className="auth-layout__sidebar-content">
            <Skeleton {...skeletonTheme} width={200} height={28} baseColor="rgba(255,255,255,0.15)" highlightColor="rgba(255,255,255,0.25)" className="mb-4" />
            <Skeleton {...skeletonTheme} width={300} height={200} borderRadius="var(--radius-2xl)" baseColor="rgba(255,255,255,0.1)" highlightColor="rgba(255,255,255,0.2)" className="mb-4" />
            <Skeleton {...skeletonTheme} width={260} height={24} baseColor="rgba(255,255,255,0.15)" highlightColor="rgba(255,255,255,0.25)" className="mb-2" />
            <Skeleton {...skeletonTheme} width={240} height={16} baseColor="rgba(255,255,255,0.1)" highlightColor="rgba(255,255,255,0.2)" />
          </div>
        </div>
        <div className="auth-layout__content">
          <div className="auth-layout__content-inner">
            <div className="auth-skeleton">
              <div className="auth-skeleton__header">
                <Skeleton {...skeletonTheme} width={48} height={48} borderRadius="var(--radius-xl)" />
                <Skeleton {...skeletonTheme} width={180} height={24} />
                <Skeleton {...skeletonTheme} width={260} height={16} />
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
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="d-flex min-vh-100">
        <div className="d-flex flex-column border-end" style={{ width: 260, padding: '1.5rem' }}>
          <Skeleton {...skeletonTheme} width={160} height={28} className="mb-5" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton {...skeletonTheme} key={i} height={36} className="mb-2" borderRadius="var(--radius-md)" />
          ))}
        </div>
        <div className="flex-grow-1 p-4">
          <Skeleton {...skeletonTheme} width={240} height={28} className="mb-4" />
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <Skeleton {...skeletonTheme} height={120} borderRadius="var(--radius-lg)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* Default variant */
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <Skeleton {...skeletonTheme} width={200} height={20} className="mb-3 mx-auto" />
        <Skeleton {...skeletonTheme} width={140} height={16} className="mx-auto" />
      </div>
    </div>
  );
};

export default RouteLoader;
