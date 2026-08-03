import clsx from 'clsx';

const statusConfig = {
  active: { label: 'Actif', icon: 'bi-check-circle-fill', variant: 'ab-status--success' },
  inactive: { label: 'Inactif', icon: 'bi-pause-circle-fill', variant: 'ab-status--warning' },
  archived: { label: 'Archivé', icon: 'bi-archive-fill', variant: 'ab-status--muted' },
};

export default function AgencyRouteStatus({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={clsx('ab-status', config.variant, `ab-status--${size}`)}>
      <i className={`bi ${config.icon}`} />
      <span>{config.label}</span>
    </span>
  );
}
