import clsx from 'clsx';

/**
 * Alert — Message d'alerte réutilisable
 * Variantes: success, warning, danger, info
 */
const Alert = ({
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  const variantIcon = {
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    danger: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill',
  };

  return (
    <div
      className={clsx('alert', `alert-${variant}`, dismissible && 'alert-dismissible', className)}
      role="alert"
      {...props}
    >
      <div className="d-flex align-items-start">
        <i className={clsx('bi', icon || variantIcon[variant], 'me-2 mt-1')} />
        <div className="flex-grow-1">
          {title && <h6 className="alert-heading mb-1 fw-semibold">{title}</h6>}
          <div className="mb-0">{children}</div>
        </div>
      </div>
      {dismissible && (
        <button
          type="button"
          className="btn-close"
          aria-label="Fermer"
          onClick={onDismiss}
        />
      )}
    </div>
  );
};

export default Alert;
