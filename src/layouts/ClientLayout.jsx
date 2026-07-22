import { Outlet } from 'react-router-dom';

/**
 * ClientLayout — Passthrough wrapper for /client/* routes
 * Each page (Dashboard, Bookings, etc.) manages its own layout.
 */
const ClientLayout = () => <Outlet />;

export default ClientLayout;
