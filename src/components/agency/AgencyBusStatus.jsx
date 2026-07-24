import clsx from 'clsx';

const statusConfig = {
  disponible: { label: 'Disponible', icon: 'bi-check-circle-fill', variant: 'ab-status--success' },
  en_voyage: { label: 'En voyage', icon: 'bi-play-circle-fill', variant: 'ab-status--info' },
  maintenance: { label: 'Maintenance', icon: 'bi-wrench-fill', variant: 'ab-status--warning' },
  hors_service: { label: 'Hors service', icon: 'bi-x-circle-fill', variant: 'ab-status--danger' },
  reserve: { label: 'Réservé', icon: 'bi-shield-check', variant: 'ab-status--primary' },
};

export default function AgencyBusStatus({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.disponible;

  return (
    <span className={clsx('ab-status', config.variant, `ab-status--${size}`)}>
      <i className={`bi ${config.icon}`} />
      <span>{config.label}</span>
    </span>
  );
}
