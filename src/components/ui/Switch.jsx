import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Switch — Interrupteur moderne
 */
const Switch = forwardRef(({
  label,
  name,
  error,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const switchId = id || (name ? `switch-${name}` : undefined);

  return (
    <div className={clsx('form-check form-switch', error && 'has-error', className)}>
      <input
        ref={ref}
        type="checkbox"
        id={switchId}
        name={name}
        className={clsx('form-check-input', error && 'is-invalid')}
        role="switch"
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {label && (
        <label htmlFor={switchId} className="form-check-label">
          {label}
        </label>
      )}
      {error && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

export default Switch;
