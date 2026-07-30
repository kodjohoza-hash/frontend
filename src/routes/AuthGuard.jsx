import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import LoadingAuth from '@components/auth/LoadingAuth';
import { DEV_MODE } from '@config/devMode';

/**
 * AuthGuard — Lightweight authentication check
 * Only checks if user is authenticated (no role/permission check)
 * Shows skeleton while loading, redirects to login if not authenticated
 */
const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (DEV_MODE) return children;

  if (loading && !isAuthenticated) {
    return <LoadingAuth />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
