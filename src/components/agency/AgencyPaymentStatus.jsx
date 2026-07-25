import clsx from 'clsx';
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@data/paymentData';

const STATUS_ICONS = {
  paye: 'bi-check-circle-fill',
  en_attente: 'bi-clock',
  echoue: 'bi-x-circle-fill',
  annule: 'bi-x-circle',
  rembourse: 'bi-arrow-counterclockwise',
  partiellement_rembourse: 'bi-arrow-counterclockwise',
};

export default function AgencyPaymentStatus({ status }) {
  const label = PAYMENT_STATUS_LABELS[status] || status;
  const color = PAYMENT_STATUS_COLORS[status] || 'muted';
  const icon = STATUS_ICONS[status] || 'bi-circle';

  return (
    <span className={clsx('ap-status', `ap-status--${color}`)}>
      <i className={`bi ${icon}`} />
      {label}
    </span>
  );
}
