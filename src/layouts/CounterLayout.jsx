import { Outlet } from 'react-router-dom';

/**
 * CounterLayout — Passthrough wrapper for /counter/* routes
 * Each page manages its own layout.
 */
const CounterLayout = () => <Outlet />;

export default CounterLayout;
