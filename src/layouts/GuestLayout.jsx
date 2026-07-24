import { Outlet } from 'react-router-dom';
import BookingHeader from '@components/booking/BookingHeader';
import Footer from '@components/layout/Footer';

/**
 * GuestLayout — Layout pour les pages publiques de réservation
 * Structure: BookingHeader → Content → Footer
 */
const GuestLayout = () => {
  return (
    <div className="guest-layout d-flex flex-column min-vh-100">
      <BookingHeader />
      <main className="guest-main flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
