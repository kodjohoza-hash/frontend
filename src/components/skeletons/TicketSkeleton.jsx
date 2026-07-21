import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import skeletonTheme from './skeletonTheme';

/**
 * TicketSkeleton — Skeleton pour billets
 */
const TicketSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card ticket-card mb-3 animate-fade-in">
          <div className="card-body p-0">
            <div className="row g-0">
              <div className="col-12 col-md-3 bg-light p-4 d-flex align-items-center justify-content-center">
                <Skeleton theme={skeletonTheme} circle width={80} height={80} />
              </div>
              <div className="col-12 col-md-6 p-4">
                <Skeleton theme={skeletonTheme} height={14} width={80} className="mb-2" />
                <Skeleton theme={skeletonTheme} height={24} width={150} className="mb-3" />
                <div className="row g-3">
                  <div className="col-6">
                    <Skeleton theme={skeletonTheme} height={12} width={60} className="mb-1" />
                    <Skeleton theme={skeletonTheme} height={18} width={100} />
                  </div>
                  <div className="col-6">
                    <Skeleton theme={skeletonTheme} height={12} width={60} className="mb-1" />
                    <Skeleton theme={skeletonTheme} height={18} width={100} />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-3 p-4 d-flex flex-column justify-content-center align-items-center border-start">
                <Skeleton theme={skeletonTheme} height={20} width={80} className="mb-2" />
                <Skeleton theme={skeletonTheme} height={36} width={100} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TicketSkeleton;
