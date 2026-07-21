import clsx from 'clsx';

/**
 * ErrorState — Composant erreur réutilisable
 */
const ErrorState = ({
  icon = 'bi-exclamation-triangle',
  title = 'Une erreur est survenue',
  description = 'Veuillez réessayer ultérieurement.',
  onRetry,
  className = '',
  ...props
}) => {
  return (
    <div
      className={clsx('error-state text-center py-5', className)}
      {...props}
    >
      <div className="error-state-icon mb-4">
        <i className={clsx('bi', icon)} />
      </div>
      <h5 className="error-state-title mb-2">{title}</h5>
      {description && (
        <p className="error-state-description text-muted mb-4">
          {description}
        </p>
      )}
      {onRetry && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onRetry}
        >
          <i className="bi bi-arrow-clockwise me-2" />
          Réessayer
        </button>
      )}
    </div>
  );
};

export default ErrorState;
