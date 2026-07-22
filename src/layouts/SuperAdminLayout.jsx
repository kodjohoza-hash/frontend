import { Outlet } from 'react-router-dom';

/**
 * SuperAdminLayout — Passthrough wrapper for /super-admin/* routes
 * Each page manages its own layout.
 */
const SuperAdminLayout = () => <Outlet />;

export default SuperAdminLayout;
