import clsx from 'clsx';

const statusConfig = {
  programmee: { label: 'Programmée', icon: 'bi-clock-fill', variant: 'at-status--primary' },
  embarquement: { label: 'Embarquement', icon: 'bi-people-fill', variant: 'at-status--info' },
  en_cours: { label: 'En cours', icon: 'bi-play-circle-fill', variant: 'at-status--accent' },
  terminee: { label: 'Terminée', icon: 'bi-check-circle-fill', variant: 'at-status--success' },
  annulee: { label: 'Annulée', icon: 'bi-x-circle-fill', variant: 'at-status--danger' },
  complete: { label: 'Complète', icon: 'bi-shield-check', variant: 'at-status--muted' },
};

export default function AgencyTripStatus({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.programmee;

  return (
    <span className={clsx('at-status', config.variant, `at-status--${size}`)}>
      <i className={`bi ${config.icon}`} />
      <span>{config.label}</span>
    </span>
  );
}
