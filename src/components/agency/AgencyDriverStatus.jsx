import clsx from 'clsx';

const statusConfig = {
  disponible: { label: 'Disponible', icon: 'bi-check-circle-fill', variant: 'ad-status--success' },
  en_mission: { label: 'En mission', icon: 'bi-play-circle-fill', variant: 'ad-status--info' },
  repos: { label: 'Repos', icon: 'bi-moon-fill', variant: 'ad-status--primary' },
  conge: { label: 'Congé', icon: 'bi-calendar-check', variant: 'ad-status--warning' },
  suspendu: { label: 'Suspendu', icon: 'bi-shield-x', variant: 'ad-status--danger' },
  indisponible: { label: 'Indisponible', icon: 'bi-person-x', variant: 'ad-status--muted' },
};

export default function AgencyDriverStatus({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.disponible;
  return (
    <span className={clsx('ad-status', config.variant, `ad-status--${size}`)}>
      <i className={`bi ${config.icon}`} />
      <span>{config.label}</span>
    </span>
  );
}
