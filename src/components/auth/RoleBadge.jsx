import clsx from 'clsx';
import { ROLE_LABELS, ROLE_BADGE_VARIANTS } from '@utils/roles';

/**
 * RoleBadge — Visual badge showing user role
 * Variants: primary, info, warning, danger (mapped from role)
 */
const RoleBadge = ({ role, className = '' }) => {
  const label = ROLE_LABELS[role] || role;
  const variant = ROLE_BADGE_VARIANTS[role] || 'secondary';

  return (
    <span
      className={clsx('badge', `bg-${variant}`, className)}
      style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)' }}
    >
      {label}
    </span>
  );
};

export default RoleBadge;
