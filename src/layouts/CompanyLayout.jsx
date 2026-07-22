import { Outlet } from 'react-router-dom';

/**
 * CompanyLayout — Passthrough wrapper for /company/* routes
 * Each page manages its own layout.
 */
const CompanyLayout = () => <Outlet />;

export default CompanyLayout;
