import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Input — Champ de saisie réutilisable
 * Compatible React Hook Form
 * États: error, success, disabled
 */
const Input = forwardRef(({
  label,
  type = 'text',
  name,
  error,
  success,
  hint,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  wrapperClassName = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (name ? `input-${name}` : undefined);

  return (
    <div className={clsx('input-field', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <div className={clsx('input-wrapper position-relative', leftIcon && 'has-left-icon', rightIcon && 'has-right-icon')}>
        {leftIcon && (
          <span className="input-icon input-icon-left">{leftIcon}</span>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          className={clsx(
            'form-control',
            error && 'is-invalid',
            success && 'is-valid',
            leftIcon && 'ps-5',
            rightIcon && 'pe-5',
            className
          )}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {rightIcon && (
          <span className="input-icon input-icon-right">{rightIcon}</span>
        )}
      </div>
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

Input.displayName = 'Input';

export default Input;
