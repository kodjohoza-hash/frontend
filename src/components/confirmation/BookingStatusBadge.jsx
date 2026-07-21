import clsx from 'clsx';

const statusConfig = {
  confirmed: { label: 'Confirmee', icon: 'bi-check-circle-fill', className: 'btc-status-confirmed' },
  pending: { label: 'En attente', icon: 'bi-clock-fill', className: 'btc-status-pending' },
  cancelled: { label: 'Annulee', icon: 'bi-x-circle-fill', className: 'btc-status-cancelled' },
  refunded: { label: 'Remboursee', icon: 'bi-arrow-counterclockwise', className: 'btc-status-refunded' },
};

const BookingStatusBadge = ({ status, className = '' }) => {
  const config = statusConfig[status] || statusConfig.confirmed;

  return (
    <span className={clsx('btc-status-badge', config.className, className)}>
      <i className={config.icon} style={{ fontSize: '0.7em' }} />
      {config.label}
    </span>
  );
};

export default BookingStatusBadge;
