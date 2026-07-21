import { forwardRef, useState } from 'react';
import clsx from 'clsx';

/**
 * PasswordInput — Champ mot de passe avec affichage/masquage
 */
const PasswordInput = forwardRef(({
  label,
  name,
  error,
  success,
  hint,
  required = false,
  disabled = false,
  className = '',
  wrapperClassName = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (name ? `input-${name}` : undefined);

  return (
    <div className={clsx('input-field', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <div className="input-wrapper position-relative has-right-icon">
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          id={inputId}
          name={name}
          className={clsx(
            'form-control pe-5',
            error && 'is-invalid',
            success && 'is-valid',
            className
          )}
          disabled={disabled}
          required={required}
          autoComplete="current-password"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          <i className={clsx('bi', showPassword ? 'bi-eye-slash' : 'bi-eye')} />
        </button>
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

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
