import clsx from 'clsx';
import { generateInitials } from '@utils/helpers';

const Avatar = ({
  src,
  alt,
  firstName,
  lastName,
  size = 'md',
  status,
  className = '',
  ...props
}) => {
  const initials = generateInitials(firstName, lastName);
  const displayName = alt || `${firstName || ''} ${lastName || ''}`.trim() || 'User';

  const sizeClasses = {
    xs: 'avatar-xs',
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
  };

  const sizePixels = {
    xs: 28,
    sm: 36,
    md: 44,
    lg: 56,
    xl: 72,
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-secondary',
    busy: 'bg-danger',
    away: 'bg-warning',
  };

  return (
    <div
      className={clsx(
        'avatar',
        'position-relative',
        'd-inline-flex',
        'align-items-center',
        'justify-content-center',
        'rounded-circle',
        'overflow-hidden',
        sizeClasses[size],
        className
      )}
      style={{
        width: sizePixels[size],
        height: sizePixels[size],
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        fontSize: sizePixels[size] * 0.375,
        fontWeight: 'var(--font-weight-semibold)',
      }}
      title={displayName}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={displayName}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <span className="user-select-none">{initials}</span>
      )}

      {status && (
        <span
          className={clsx(
            'position-absolute',
            'rounded-circle',
            'border',
            'border-2',
            'border-white',
            statusColors[status] || 'bg-secondary'
          )}
          style={{
            width: sizePixels[size] * 0.28,
            height: sizePixels[size] * 0.28,
            bottom: 1,
            right: 1,
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
