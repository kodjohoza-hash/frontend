import clsx from 'clsx';

/**
 * PageTitle — En-tête de page réutilisable
 * Affiche titre, sous-titre et actions
 */
const PageTitle = ({
  title,
  subtitle,
  actions,
  breadcrumbs = true,
  className = '',
}) => {
  return (
    <div className={clsx('page-title-section mb-4', className)}>
      {breadcrumbs && <Breadcrumb className="mb-3" />}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          {title && <h1 className="page-heading mb-1">{title}</h1>}
          {subtitle && <p className="page-subtitle text-muted mb-0">{subtitle}</p>}
        </div>
        {actions && (
          <div className="page-actions d-flex gap-2 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
