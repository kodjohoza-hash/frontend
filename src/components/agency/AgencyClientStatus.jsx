import clsx from 'clsx';
import { CLIENT_STATUS_LABELS } from '@data/clientData';

const STATUS_ICONS = {
  nouveau: 'bi-person-plus',
  actif: 'bi-person-check',
  vip: 'bi-star-fill',
  inactif: 'bi-person-dash',
  suspendu: 'bi-shield-exclamation',
};

export default function AgencyClientStatus({ status }) {
  const label = CLIENT_STATUS_LABELS[status] || status;
  const icon = STATUS_ICONS[status] || 'bi-person';

  return (
    <span className={clsx('ac-status', `ac-status--${status}`)}>
      <i className={`bi ${icon}`} />
      {label}
    </span>
  );
}
