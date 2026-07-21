import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import skeletonTheme from './skeletonTheme';

/**
 * ProfileSkeleton — Skeleton pour profil utilisateur
 */
const ProfileSkeleton = () => {
  return (
    <div className="profile-skeleton animate-fade-in">
      <div className="card mb-4">
        <div className="card-body text-center py-5">
          <Skeleton theme={skeletonTheme} circle width={96} height={96} className="mx-auto mb-3" />
          <Skeleton theme={skeletonTheme} height={24} width={200} className="mx-auto mb-2" />
          <Skeleton theme={skeletonTheme} height={16} width={150} className="mx-auto mb-3" />
          <div className="d-flex justify-content-center gap-2">
            <Skeleton theme={skeletonTheme} height={32} width={100} className="rounded-pill" />
            <Skeleton theme={skeletonTheme} height={32} width={100} className="rounded-pill" />
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <Skeleton theme={skeletonTheme} height={20} width={150} />
        </div>
        <div className="card-body">
          <div className="row g-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="col-12 col-md-6">
                <Skeleton theme={skeletonTheme} height={14} width={80} className="mb-2" />
                <Skeleton theme={skeletonTheme} height={40} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
