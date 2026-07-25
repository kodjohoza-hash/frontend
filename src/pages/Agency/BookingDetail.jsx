import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockBookings as bookings } from '@data/bookingData';
import AgencyBookingDetails from '@components/agency/AgencyBookingDetails';
import AgencyBookingTimeline from '@components/agency/AgencyBookingTimeline';
import AgencyBookingStatus from '@components/agency/AgencyBookingStatus';
import AgencyBookingSkeleton from '@components/agency/AgencyBookingSkeleton';

const MOCK_TIMELINE = [
  { id: 1, label: 'Réservation créée', time: '25/07/2026 08:30', icon: 'bi-plus-circle', color: 'success' },
  { id: 2, label: 'Paiement reçu', time: '25/07/2026 08:32', icon: 'bi-credit-card', color: 'info' },
  { id: 3, label: 'Confirmée', time: '25/07/2026 09:00', icon: 'bi-check-circle', color: 'primary' },
];

export default function AgencyBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading] = useState(false);

  const booking = bookings.find((b) => b.id === id);

  if (loading) {
    return <AgencyBookingSkeleton />;
  }

  if (!booking) {
    return (
      <div className="abr-page">
        <div className="abr-page__empty">
          <i className="bi bi-ticket-perforated" />
          <h2>Réservation introuvable</h2>
          <p>La réservation avec l'identifiant « {id} » n'existe pas.</p>
          <button className="abr-btn abr-btn--primary" onClick={() => navigate('/agency/bookings')}>
            <i className="bi bi-arrow-left" />
            Retour aux réservations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="abr-page">
      <div className="abr-page__header">
        <div className="abr-page__title-group">
          <button
            className="abr-btn abr-btn--outline abr-btn--sm"
            onClick={() => navigate('/agency/bookings')}
          >
            <i className="bi bi-arrow-left" />
          </button>
          <div>
            <h1 className="abr-page__title">
              <i className="bi bi-ticket-perforated" />
              Réservation {booking.id}
            </h1>
            <div className="abr-page__subtitle">
              {booking.trip.route} — <AgencyBookingStatus status={booking.payment.status} />
            </div>
          </div>
        </div>
        <div className="abr-page__actions">
          <button className="abr-btn abr-btn--outline" type="button">
            <i className="bi bi-printer" />
            Imprimer
          </button>
          <button className="abr-btn abr-btn--outline" type="button">
            <i className="bi bi-envelope" />
            Email
          </button>
          <button className="abr-btn abr-btn--outline" type="button">
            <i className="bi bi-chat" />
            SMS
          </button>
        </div>
      </div>

      <AgencyBookingDetails
        booking={booking}
        onBack={() => navigate('/agency/bookings')}
        onConfirm={() => {}}
        onCancel={() => {}}
        onRefund={() => {}}
        timeline={MOCK_TIMELINE}
      />
    </div>
  );
}
