import clsx from 'clsx';
import { ticketStatusLabels } from '@data/counterScannerData';

const CounterTicketStatus = ({ status, size = 'md' }) => {
  const config = ticketStatusLabels[status] || { label: status || 'Inconnu', icon: 'bi-question-circle', color: '#6B7280' };
  return (
    <span className={clsx('acv-status', `acv-status-${status || 'unknown'}`, { 'acv-status-lg': size === 'lg' })}>
      <i className={clsx('bi', config.icon)} />
      {config.label}
    </span>
  );
};

export default CounterTicketStatus;
