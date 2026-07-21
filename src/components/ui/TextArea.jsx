import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * TextArea — Zone de texte réutilisable
 */
const TextArea = forwardRef(({
  label,
  name,
  error,
  success,
  hint,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  wrapperClassName = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (name ? `textarea-${name}` : undefined);

  return (
    <div className={clsx('input-field', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        name={name}
        className={clsx(
          'form-control',
          error && 'is-invalid',
          success && 'is-valid',
          className
        )}
        rows={rows}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <div id={`${inputId}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      )}
      {hint && !error && (
        <div id={`${inputId}-hint`} className="form-text">
          {hint}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
