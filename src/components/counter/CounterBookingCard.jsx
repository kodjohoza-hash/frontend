import clsx from 'clsx';
import CounterBookingStatus from './CounterBookingStatus';
import { formatCurrency, formatDateShort, formatTime, bookingStatusLabels } from '@data/counterBookingData';

const CounterBookingCard = ({ booking, onAction, compact }) => {
  const statusConfig = bookingStatusLabels[booking.status] || {};

  if (compact) {
    return (
      <div className="acb-quick-result-item" onClick={() => onAction?.('view', booking)}>
        <div className="acb-table-avatar">
          {booking.clientName.charAt(0)}
        </div>
        <div className="acb-quick-result-info">
          <div className="acb-quick-result-id">{booking.id}</div>
          <div className="acb-quick-result-name">{booking.clientName}</div>
          <div className="acb-quick-result-phone">{booking.phone}</div>
        </div>
        <CounterBookingStatus status={booking.status} size="sm" />
      </div>
    );
  }

  return (
    <div className="acb-mobile-card" key={booking.id}>
      <div className="acb-mobile-card-header">
        <span className="acb-mobile-card-id">{booking.id}</span>
        <CounterBookingStatus status={booking.status} />
      </div>
      <div className="acb-mobile-card-body">
        <div className="acb-mobile-card-field">
          <span className="acb-mobile-card-label">Client</span>
          <span className="acb-mobile-card-value">{booking.clientName}</span>
        </div>
        <div className="acb-mobile-card-field">
          <span className="acb-mobile-card-label">Téléphone</span>
          <span className="acb-mobile-card-value">{booking.phone}</span>
        </div>
        <div className="acb-mobile-card-field">
          <span className="acb-mobile-card-label">Trajet</span>
          <span className="acb-mobile-card-value">{booking.from} → {booking.to}</span>
        </div>
        <div className="acb-mobile-card-field">
          <span className="acb-mobile-card-label">Bus</span>
          <span className="acb-mobile-card-value">{booking.busPlate}</span>
        </div>
        <div className="acb-mobile-card-field">
          <span className="acb-mobile-card-label">Date</span>
          <span className="acb-mobile-card-value">{formatDateShort(booking.createdAt)}</span>
        </div>
        <div className="acb-mobile-card-field">
          <span className="acb-mobile-card-label">Montant</span>
          <span className="acb-mobile-card-value" style={{ fontWeight: 700, color: '#0B1D51' }}>{formatCurrency(booking.amount)}</span>
        </div>
      </div>
      <div className="acb-mobile-card-footer">
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>Places: {booking.seats.join(', ')}</span>
        <div className="acb-mobile-card-actions">
          {['view', 'edit', 'confirm', 'cancel'].map((action) => {
            const icons = { view: 'bi-eye', edit: 'bi-pencil', confirm: 'bi-check-lg', cancel: 'bi-x-lg' };
            if (action === 'confirm' && booking.status !== 'pending') return null;
            if (action === 'cancel' && ['cancelled', 'expired', 'converted'].includes(booking.status)) return null;
            return (
              <button
                key={action}
                className={clsx('acb-action-btn', action)}
                onClick={() => onAction?.(action, booking)}
                title={action}
              >
                <i className={clsx('bi', icons[action])} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CounterBookingCard;
