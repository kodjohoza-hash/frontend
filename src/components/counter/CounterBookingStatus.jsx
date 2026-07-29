import clsx from 'clsx';
import { bookingStatusLabels } from '@data/counterBookingData';

const CounterBookingStatus = ({ status, size = 'md' }) => {
  const config = bookingStatusLabels[status] || { label: status, icon: 'bi-question', color: '#6B7280' };
  const sizeClass = size === 'sm' ? 'acb-status-sm' : size === 'lg' ? 'acb-status-lg' : '';

  return (
    <span className={clsx('acb-status', `acb-status-${status}`, sizeClass)}>
      <i className={clsx('bi', config.icon)} />
      {config.label}
    </span>
  );
};

export default CounterBookingStatus;
