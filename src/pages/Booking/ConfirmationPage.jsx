import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import {
  ConfirmationStepper,
  BookingSuccessCard,
  TripSummaryCard,
  PassengerCard,
  SeatList,
  PaymentSummaryCard,
  ETicketCard,
  TravelTipsCard,
  SupportCard,
  ActionButtons,
  ConfirmationSkeleton,
} from '@components/confirmation';
import {
  mockBooking,
  mockTrip,
  mockPassengers,
  mockSeats,
  mockPayment,
  STEPS,
} from '@data/bookingConfirmation';

const ConfirmationPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="btc-confirm-page">
        <div className="container" style={{ maxWidth: 880 }}>
          <ConfirmationSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="btc-confirm-page">
      <div className="container" style={{ maxWidth: 880 }}>
        <ConfirmationStepper steps={STEPS} />

        <BookingSuccessCard booking={mockBooking} />

        <div className="row g-4">
          {/* Left column: info cards */}
          <div className="col-lg-5">
            <TripSummaryCard trip={mockTrip} />
            <div className="mt-3">
              <PassengerCard passengers={mockPassengers} />
            </div>
            <div className="mt-3">
              <SeatList seats={mockSeats} />
            </div>
            <div className="mt-3">
              <PaymentSummaryCard payment={mockPayment} />
            </div>
          </div>

          {/* Right column: e-ticket + extras */}
          <div className="col-lg-7">
            <ETicketCard
              booking={mockBooking}
              trip={mockTrip}
              passengers={mockPassengers}
              seats={mockSeats}
              payment={mockPayment}
            />

            <ActionButtons bookingId={mockBooking.id} />

            <div className="mt-4">
              <TravelTipsCard />
            </div>

            <div className="mt-3">
              <SupportCard />
            </div>
          </div>
        </div>

        {/* Print-only footer */}
        <div className="btc-print-only text-center mt-4 pb-3" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          <div>BUS TIX CONNECT — www.bustixconnect.com</div>
          <div>Ce billet a ete genere electroniquement. Valide sans signature.</div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
