import { Outlet } from 'react-router-dom';
import DevBanner from '@components/dev/DevBanner';

const ClientLayout = () => (
  <>
    <DevBanner />
    <Outlet />
  </>
);

export default ClientLayout;
