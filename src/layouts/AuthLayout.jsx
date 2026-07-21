import { Outlet } from 'react-router-dom';

/**
 * AuthLayout — Passthrough wrapper for auth routes
 * Each auth page handles its own split-screen layout
 */
const AuthLayout = () => <Outlet />;

export default AuthLayout;
