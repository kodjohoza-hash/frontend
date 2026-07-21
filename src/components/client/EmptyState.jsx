import { Link } from 'react-router-dom';
import clsx from 'clsx';

const EmptyState = ({
  icon = 'bi-inbox',
  title = 'Aucune donnée',
  description = 'Il n\'y a rien à afficher pour le moment.',
  actionLabel,
  actionPath,
  className = '',
}) => (
  <div className={clsx('btc-empty-state text-center py-5', className)}>
    <div className="btc-empty-state-icon mb-3">
      <i className={clsx('bi', icon)} />
    </div>
    <h5 className="fw-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h5>
    <p className="text-muted mb-4" style={{ maxWidth: 360, margin: '0 auto' }}>{description}</p>
    {actionLabel && actionPath && (
      <Link to={actionPath} className="btn btn-accent btn-sm px-4">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
