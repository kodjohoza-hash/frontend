import clsx from 'clsx';

const statusConfig = {
  confirmed: {
    label: 'Confirmé',
    bg: 'bg-success-subtle',
    text: 'text-success',
    dot: 'bg-success',
  },
  pending: {
    label: 'En attente',
    bg: 'bg-warning-subtle',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  cancelled: {
    label: 'Annulé',
    bg: 'bg-danger-subtle',
    text: 'text-danger',
    dot: 'bg-danger',
  },
  completed: {
    label: 'Terminé',
    bg: 'bg-info-subtle',
    text: 'text-info',
    dot: 'bg-info',
  },
  refunded: {
    label: 'Remboursé',
    bg: 'bg-secondary-subtle',
    text: 'text-secondary',
    dot: 'bg-secondary',
  },
};

const StatusBadge = ({ status, className = '' }) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={clsx(
        'btc-status-badge d-inline-flex align-items-center gap-1-5 px-2-5 py-1 rounded-pill fw-medium',
        config.bg,
        config.text,
        className
      )}
      style={{ fontSize: 'var(--font-size-xs)' }}
    >
      <span className={clsx('rounded-circle d-inline-block', config.dot)} style={{ width: 6, height: 6 }} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
