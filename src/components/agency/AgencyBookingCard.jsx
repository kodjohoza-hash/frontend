import AgencyBookingStatus from './AgencyBookingStatus';
import {
  BOOKING_CHANNEL_LABELS,
  PAYMENT_METHOD_LABELS,
} from '@data/bookingData';

function formatAmount(n) {
  return (n || 0).toLocaleString('fr-FR') + ' FCFA';
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const AgencyBookingCard = ({ booking, onView }) => {
  return (
    <div className="abr-mobile-card" onClick={() => onView(booking)}>
      <div className="abr-mobile-card__header">
        <span className="abr-mobile-card__id">{booking.id}</span>
        <AgencyBookingStatus status={booking.status} />
      </div>

      <div className="abr-mobile-card__client">
        <i className="bi bi-person" />
        <span className="abr-mobile-card__client-name">
          {booking.client.firstName} {booking.client.lastName}
        </span>
      </div>

      <div className="abr-mobile-card__route">
        <div className="abr-mobile-card__city">
          <span className="abr-mobile-card__city-name">{booking.trip.from}</span>
          <span className="abr-mobile-card__time">{booking.trip.departure}</span>
        </div>
        <div className="abr-mobile-card__arrow">
          <div className="abr-mobile-card__arrow-line" />
          <i className="bi bi-bus-front-fill" />
          <div className="abr-mobile-card__arrow-line" />
        </div>
        <div className="abr-mobile-card__city abr-mobile-card__city--end">
          <span className="abr-mobile-card__city-name">{booking.trip.to}</span>
          <span className="abr-mobile-card__time">{booking.trip.arrival}</span>
        </div>
      </div>

      <div className="abr-mobile-card__meta">
        <div className="abr-mobile-card__meta-item">
          <i className="bi bi-calendar3" />
          <span>{formatDate(booking.trip.date)}</span>
        </div>
        <div className="abr-mobile-card__meta-item">
          <i className="bi bi-person-lines-fill" />
          <span>{booking.seatCount} {booking.seatCount > 1 ? 'places' : 'place'}</span>
        </div>
      </div>

      <div className="abr-mobile-card__footer">
        <span className="abr-mobile-card__amount">{formatAmount(booking.amount)}</span>
        <span className="abr-mobile-card__channel">
          <i className="bi bi-broadcast" /> {BOOKING_CHANNEL_LABELS[booking.channel] || booking.channel}
        </span>
      </div>
    </div>
  );
};

export default AgencyBookingCard;
