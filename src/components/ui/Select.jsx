import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Select — Sélecteur moderne réutilisable
 */
const Select = forwardRef(({
  label,
  name,
  options = [],
  placeholder = 'Sélectionner...',
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
  const selectId = id || (name ? `select-${name}` : undefined);

  return (
    <div className={clsx('input-field', wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        name={name}
        className={clsx(
          'form-select',
          error && 'is-invalid',
          success && 'is-valid',
          className
        )}
        disabled={disabled}
        required={required}
        defaultValue=""
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div id={`${selectId}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      )}
      {hint && !error && (
        <div id={`${selectId}-hint`} className="form-text">
          {hint}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
