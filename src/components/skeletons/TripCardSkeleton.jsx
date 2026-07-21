import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import skeletonTheme from './skeletonTheme';

/**
 * TripCardSkeleton — Skeleton pour cartes de trajet
 */
const TripCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card mb-3 animate-fade-in">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <Skeleton theme={skeletonTheme} height={14} width={80} className="mb-1" />
                <Skeleton theme={skeletonTheme} height={24} width={120} />
              </div>
              <Skeleton theme={skeletonTheme} height={28} width={70} className="rounded-pill" />
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="text-center">
                <Skeleton theme={skeletonTheme} height={28} width={60} className="mb-1" />
                <Skeleton theme={skeletonTheme} height={12} width={80} />
              </div>
              <div className="flex-grow-1 mx-3">
                <Skeleton theme={skeletonTheme} height={2} />
              </div>
              <div className="text-center">
                <Skeleton theme={skeletonTheme} height={28} width={60} className="mb-1" />
                <Skeleton theme={skeletonTheme} height={12} width={80} />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Skeleton theme={skeletonTheme} height={14} width={100} />
              <Skeleton theme={skeletonTheme} height={36} width={100} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TripCardSkeleton;
