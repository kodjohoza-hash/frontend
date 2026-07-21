import clsx from 'clsx';

/**
 * Spinner — Indicateur de chargement pour actions bloquantes
 * Usage: paiement, upload, connexion uniquement
 * Le chargement de contenu utilise des Skeletons
 */
const Spinner = ({
  size = 'md',
  variant = 'border',
  color,
  label = 'Chargement...',
  className = '',
  ...props
}) => {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-lg',
  };

  return (
    <div className={clsx('d-inline-flex align-items-center justify-content-center', className)} {...props}>
      <div
        className={clsx(
          variant === 'border' ? 'spinner-border' : 'spinner-grow',
          sizeClass[size],
          color && `text-${color}`
        )}
        role="status"
        aria-label={label}
      />
      <span className="visually-hidden">{label}</span>
    </div>
  );
};

const SpinnerOverlay = ({
  children,
  isLoading,
  label = 'Chargement...',
  className = '',
}) => {
  return (
    <div className={clsx('position-relative', className)}>
      {children}
      {isLoading && (
        <div className="spinner-overlay">
          <Spinner size="lg" label={label} />
        </div>
      )}
    </div>
  );
};

Spinner.Overlay = SpinnerOverlay;

export default Spinner;
