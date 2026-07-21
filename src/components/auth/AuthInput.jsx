import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * AuthInput — Premium input field for auth forms
 * Fully custom, no Bootstrap form-control dependency
 */
const AuthInput = forwardRef(({
  label,
  type = 'text',
  name,
  placeholder,
  error,
  leftIcon,
  rightIcon,
  required = false,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (name ? `auth-input-${name}` : undefined);

  return (
    <div className={clsx('auth-field', error && 'auth-field--error', disabled && 'auth-field--disabled', className)}>
      {label && (
        <label htmlFor={inputId} className="auth-field__label">
          {label}
          {required && <span className="auth-field__required">*</span>}
        </label>
      )}
      <div className="auth-field__wrapper">
        {leftIcon && (
          <span className="auth-field__icon auth-field__icon--left">{leftIcon}</span>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          placeholder={placeholder}
          className={clsx(
            'auth-field__input',
            leftIcon && 'auth-field__input--has-left',
            rightIcon && 'auth-field__input--has-right',
          )}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {rightIcon && (
          <span className="auth-field__icon auth-field__icon--right">{rightIcon}</span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="auth-field__error">{error}</p>
      )}
    </div>
  );
});

AuthInput.displayName = 'AuthInput';

export default AuthInput;
