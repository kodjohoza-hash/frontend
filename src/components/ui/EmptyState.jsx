import clsx from 'clsx';

/**
 * EmptyState — État vide élégant
 */
const EmptyState = ({
  icon = 'bi-inbox',
  title = 'Aucune donnée',
  description,
  action,
  className = '',
  ...props
}) => {
  return (
    <div
      className={clsx('empty-state text-center py-5', className)}
      {...props}
    >
      <div className="empty-state-icon mb-4">
        <i className={clsx('bi', icon)} />
      </div>
      <h5 className="empty-state-title mb-2">{title}</h5>
      {description && (
        <p className="empty-state-description text-muted mb-4">
          {description}
        </p>
      )}
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
