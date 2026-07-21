import clsx from 'clsx';

/**
 * PageContainer — Conteneur standard pour toutes les pages
 */
const PageContainer = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  contentClassName = '',
  fluid = false,
  ...props
}) => {
  return (
    <div className={clsx('page-container', className)} {...props}>
      <div className={clsx(fluid ? 'container-fluid' : 'container')}>
        {(title || actions) && (
          <div className="page-header mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div className="page-header-text">
                {title && <h1 className="page-title mb-1">{title}</h1>}
                {subtitle && <p className="page-subtitle text-muted mb-0">{subtitle}</p>}
              </div>
              {actions && (
                <div className="page-actions d-flex gap-2 flex-wrap">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        <div className={clsx('page-content', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
