import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Radio — Bouton radio réutilisable
 */
const Radio = forwardRef(({
  label,
  name,
  value,
  error,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const radioId = id || (name ? `radio-${name}-${value}` : undefined);

  return (
    <div className={clsx('form-check', error && 'has-error', className)}>
      <input
        ref={ref}
        type="radio"
        id={radioId}
        name={name}
        value={value}
        className={clsx('form-check-input', error && 'is-invalid')}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {label && (
        <label htmlFor={radioId} className="form-check-label">
          {label}
        </label>
      )}
      {error && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;
