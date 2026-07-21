import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import skeletonTheme from './skeletonTheme';

/**
 * DashboardSkeleton — Skeleton pour tableaux de bord
 */
const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton animate-fade-in">
      <div className="mb-4">
        <Skeleton theme={skeletonTheme} height={32} width={200} />
        <Skeleton theme={skeletonTheme} height={16} width={300} className="mt-2" />
      </div>
      <div className="row g-4 mb-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="col-12 col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Skeleton theme={skeletonTheme} height={14} width={80} className="mb-2" />
                    <Skeleton theme={skeletonTheme} height={28} width={60} />
                  </div>
                  <Skeleton theme={skeletonTheme} circle width={48} height={48} />
                </div>
                <Skeleton theme={skeletonTheme} height={12} width={120} className="mt-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-header">
              <Skeleton theme={skeletonTheme} height={20} width={150} />
            </div>
            <div className="card-body">
              <Skeleton theme={skeletonTheme} height={200} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-header">
              <Skeleton theme={skeletonTheme} height={20} width={120} />
            </div>
            <div className="card-body">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="d-flex align-items-center mb-3">
                  <Skeleton theme={skeletonTheme} circle width={40} height={40} className="me-3" />
                  <div className="flex-grow-1">
                    <Skeleton theme={skeletonTheme} height={14} width="70%" className="mb-1" />
                    <Skeleton theme={skeletonTheme} height={12} width="50%" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
