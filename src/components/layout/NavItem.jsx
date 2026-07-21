import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

/**
 * NavItem — Élément de navigation individuel
 */
const NavItem = ({
  to,
  icon,
  label,
  badge,
  active,
  onClick,
  className = '',
  ...props
}) => {
  const location = useLocation();
  const isActive = active !== undefined ? active : location.pathname === to;

  if (to) {
    return (
      <li className="nav-item" {...props}>
        <Link
          to={to}
          className={clsx('nav-link d-flex align-items-center gap-2', isActive && 'active', className)}
        >
          {icon && <i className={clsx('bi', icon, 'nav-icon')} />}
          <span>{label}</span>
          {badge !== undefined && (
            <span className="nav-badge ms-auto">{badge}</span>
          )}
        </Link>
      </li>
    );
  }

  return (
    <li className="nav-item" {...props}>
      <button
        className={clsx('nav-link d-flex align-items-center gap-2 w-100 text-start', isActive && 'active', className)}
        onClick={onClick}
      >
        {icon && <i className={clsx('bi', icon, 'nav-icon')} />}
        <span>{label}</span>
        {badge !== undefined && (
          <span className="nav-badge ms-auto">{badge}</span>
        )}
      </button>
    </li>
  );
};

export default NavItem;
