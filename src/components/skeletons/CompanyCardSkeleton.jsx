import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import skeletonTheme from './skeletonTheme';

/**
 * CompanyCardSkeleton — Skeleton pour cartes de compagnie
 */
const CompanyCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card mb-3 animate-fade-in">
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <Skeleton theme={skeletonTheme} circle width={56} height={56} className="me-3" />
              <div className="flex-grow-1">
                <Skeleton theme={skeletonTheme} height={20} width="50%" className="mb-2" />
                <Skeleton theme={skeletonTheme} height={14} width="30%" />
              </div>
              <Skeleton theme={skeletonTheme} height={24} width={60} />
            </div>
            <div className="row g-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="col-4">
                  <Skeleton theme={skeletonTheme} height={60} className="rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CompanyCardSkeleton;
