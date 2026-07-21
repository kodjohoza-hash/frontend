import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import skeletonTheme from './skeletonTheme';

/**
 * PageSkeleton — Skeleton pour pages complètes
 */
const PageSkeleton = ({ rows = 5, showHeader = true }) => {
  return (
    <div className="page-skeleton animate-fade-in">
      {showHeader && (
        <div className="mb-4">
          <Skeleton theme={skeletonTheme} height={36} width={250} />
          <Skeleton theme={skeletonTheme} height={16} width={350} className="mt-2" />
        </div>
      )}
      <div className="row g-4 mb-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="col-12 col-sm-6 col-lg-3">
            <div className="card">
              <div className="card-body">
                <Skeleton theme={skeletonTheme} height={20} width={100} className="mb-2" />
                <Skeleton theme={skeletonTheme} height={32} width={80} />
                <Skeleton theme={skeletonTheme} height={14} width={120} className="mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-body">
          <Skeleton theme={skeletonTheme} height={20} width={180} className="mb-3" />
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} theme={skeletonTheme} height={40} className="mb-2" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
