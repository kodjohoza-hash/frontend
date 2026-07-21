import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import skeletonTheme from './skeletonTheme';

/**
 * CardSkeleton — Skeleton pour cartes
 */
const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card mb-3 animate-fade-in">
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <Skeleton theme={skeletonTheme} circle width={48} height={48} className="me-3" />
              <div className="flex-grow-1">
                <Skeleton theme={skeletonTheme} height={20} width="60%" className="mb-2" />
                <Skeleton theme={skeletonTheme} height={14} width="40%" />
              </div>
            </div>
            <Skeleton theme={skeletonTheme} height={14} className="mb-2" />
            <Skeleton theme={skeletonTheme} height={14} className="mb-2" />
            <Skeleton theme={skeletonTheme} height={14} width="70%" />
            <div className="mt-3">
              <Skeleton theme={skeletonTheme} height={36} width={100} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
