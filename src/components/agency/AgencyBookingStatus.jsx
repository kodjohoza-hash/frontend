import clsx from 'clsx';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '@data/bookingData';

const STATUS_ICONS = {
  en_attente: 'bi-clock',
  confirmee: 'bi-check-circle',
  payee: 'bi-check-circle-fill',
  partiellement_payee: 'bi-clock-history',
  annulee: 'bi-x-circle',
  expiree: 'bi-hourglass',
  remboursee: 'bi-arrow-counterclockwise',
};

const AgencyBookingStatus = ({ status }) => {
  const label = BOOKING_STATUS_LABELS[status] || status;
  const color = BOOKING_STATUS_COLORS[status] || 'muted';
  const icon = STATUS_ICONS[status] || 'bi-circle';

  return (
    <span className={clsx('abr-status', `abr-status--${color}`)}>
      <i className={`bi ${icon}`} />
      {label}
    </span>
  );
};

export default AgencyBookingStatus;
