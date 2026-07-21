import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * RememberMe — Checkbox + label for "Se souvenir de moi"
 */
const RememberMe = forwardRef(({ error, className = '', ...props }, ref) => (
  <div className={clsx('auth-form__remember', className)}>
    <input
      ref={ref}
      type="checkbox"
      id="remember-me"
      className={clsx('form-check-input', error && 'is-invalid')}
      {...props}
    />
    <label htmlFor="remember-me">Se souvenir de moi</label>
  </div>
));

RememberMe.displayName = 'RememberMe';

export default RememberMe;
