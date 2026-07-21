import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Checkbox — Case à cocher réutilisable
 */
const Checkbox = forwardRef(({
  label,
  name,
  error,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || (name ? `checkbox-${name}` : undefined);

  return (
    <div className={clsx('form-check', error && 'has-error', className)}>
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        name={name}
        className={clsx('form-check-input', error && 'is-invalid')}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className="form-check-label">
          {label}
        </label>
      )}
      {error && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
