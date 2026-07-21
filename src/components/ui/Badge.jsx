import clsx from 'clsx';

/**
 * Badge — Étiquette réutilisable
 * Variantes: primary, accent, success, danger, warning, info, secondary, light, dark
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  pill = false,
  className = '',
  ...props
}) => {
  const sizeClass = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg',
  };

  return (
    <span
      className={clsx(
        'badge',
        `bg-${variant}`,
        sizeClass[size],
        pill && 'rounded-pill',
        className
      )}
      {...props}
    >
      {dot && <span className={clsx('badge-dot', `bg-${variant}`)} />}
      {children}
    </span>
  );
};

export default Badge;
