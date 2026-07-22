import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import {
  CnStepper,
  CnSuccessCard,
  CnETicket,
  CnTripSummary,
  CnPassengerList,
  CnPaymentInfo,
  CnAdvice,
  CnSupport,
  CnActions,
  CnSkeleton,
} from '@components/confirmation';
import {
  CONFIRMATION_STEPS,
  BOOKING,
  TRIP,
  PASSENGERS,
  PAYMENT,
  TRAVEL_ADVICE,
  SUPPORT_CONTACTS,
} from '@data/bookingConfirmation';
import '@assets/styles/confirmation.css';

const ConfirmationPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="cn-page">
        <div className="cn-wrap"><CnSkeleton /></div>
      </div>
    );
  }

  return (
    <div className="cn-page">
      <div className="cn-wrap">
        <CnStepper steps={CONFIRMATION_STEPS} />
        <CnSuccessCard booking={BOOKING} />

        <div className="cn-split">
          <div className="cn-left">
            <CnETicket
              booking={BOOKING}
              trip={TRIP}
              passengers={PASSENGERS}
              payment={PAYMENT}
            />
            <CnActions bookingId={BOOKING.id} />
          </div>

          <div className="cn-right">
            <CnTripSummary trip={TRIP} />
            <CnPassengerList passengers={PASSENGERS} />
            <CnPaymentInfo payment={PAYMENT} />
            <CnAdvice items={TRAVEL_ADVICE} />
            <CnSupport contacts={SUPPORT_CONTACTS} />
          </div>
        </div>

        <div className="cn-print-only" style={{ textAlign: 'center', paddingTop: 24, fontSize: '0.65rem', color: '#94a3b8' }}>
          <div>BUS TIX CONNECT — www.bustixconnect.com</div>
          <div>Ce billet a été généré électroniquement. Valide sans signature.</div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
