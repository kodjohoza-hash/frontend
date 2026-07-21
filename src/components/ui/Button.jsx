import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Button — Composant réutilisable
 * Variantes: primary, accent, success, danger, warning, info, secondary, light, dark, ghost, link
 * Sizes: sm, md, lg
 * States: loading, disabled, active
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  active = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const prefix = variant.startsWith('outline') ? 'btn-outline' : (variant === 'ghost' ? 'btn-ghost' : (variant === 'link' ? 'btn-link' : 'btn'));

  const variantClass = variant === 'ghost' || variant === 'link'
    ? `btn-${variant}`
    : `${prefix}-${variant.replace('outline-', '')}`;

  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        'btn',
        variantClass,
        size === 'sm' && 'btn-sm',
        size === 'lg' && 'btn-lg',
        fullWidth && 'w-100',
        active && 'active',
        loading && 'btn-loading',
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
      )}
      {!loading && leftIcon && <span className="btn-icon btn-icon-left">{leftIcon}</span>}
      {children && <span className={clsx(loading && 'visually-hidden')}>{children}</span>}
      {!loading && rightIcon && <span className="btn-icon btn-icon-right">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
