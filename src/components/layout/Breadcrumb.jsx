import { Link, useLocation } from 'react-router-dom';
import { ROUTE_NAMES } from '@routes/routeConstants';

/**
 * Breadcrumb — Fil d'Ariane réutilisable
 * Fonctionne automatiquement avec React Router
 */
const Breadcrumb = ({
  items = [],
  className = '',
}) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const autoItems = items.length > 0
    ? items
    : [
        { label: 'Accueil', path: '/' },
        ...pathnames.map((segment, index) => {
          const path = '/' + pathnames.slice(0, index + 1).join('/');
          const name = ROUTE_NAMES[path];
          return {
            label: name || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
            path: index === pathnames.length - 1 ? null : path,
          };
        }),
      ];

  if (autoItems.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="breadcrumb mb-0">
        {autoItems.map((item, index) => {
          const isLast = index === autoItems.length - 1;

          return (
            <li
              key={index}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {item.path && !isLast ? (
                <Link to={item.path} className="text-decoration-none">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-secondary' : ''}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
