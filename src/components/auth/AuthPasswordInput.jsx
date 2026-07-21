import { forwardRef, useState } from 'react';
import clsx from 'clsx';

/**
 * AuthPasswordInput — Premium password field with show/hide toggle
 * Fully custom, no Bootstrap dependency
 */
const AuthPasswordInput = forwardRef(({
  label,
  name,
  placeholder = '••••••••',
  error,
  leftIcon,
  required = false,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const [visible, setVisible] = useState(false);
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
          type={visible ? 'text' : 'password'}
          id={inputId}
          name={name}
          placeholder={placeholder}
          className={clsx(
            'auth-field__input',
            leftIcon && 'auth-field__input--has-left',
            'auth-field__input--has-right',
          )}
          disabled={disabled}
          required={required}
          autoComplete="current-password"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        <button
          type="button"
          className="auth-field__toggle"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? 'Masquer' : 'Afficher'}
        >
          <i className={clsx('bi', visible ? 'bi-eye-slash' : 'bi-eye')} />
        </button>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="auth-field__error">{error}</p>
      )}
    </div>
  );
});

AuthPasswordInput.displayName = 'AuthPasswordInput';

export default AuthPasswordInput;
