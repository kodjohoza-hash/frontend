import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

/**
 * SidebarItem — Élément de sidebar individuel
 */
const SidebarItem = ({
  to,
  icon,
  label,
  active,
  collapsed = false,
  onClick,
  className = '',
  ...props
}) => {
  const location = useLocation();
  const isActive = active !== undefined ? active : to && location.pathname === to;

  if (to) {
    return (
      <li className="nav-item" {...props}>
        <Link
          to={to}
          className={clsx('nav-link sidebar-link', isActive && 'active', className)}
          title={collapsed ? label : undefined}
        >
          {icon && <i className={clsx('bi', icon, 'sidebar-icon')} />}
          {!collapsed && <span className="sidebar-label">{label}</span>}
        </Link>
      </li>
    );
  }

  return (
    <li className="nav-item" {...props}>
      <button
        className={clsx('nav-link sidebar-link w-100 text-start', isActive && 'active', className)}
        title={collapsed ? label : undefined}
        onClick={onClick}
      >
        {icon && <i className={clsx('bi', icon, 'sidebar-icon')} />}
        {!collapsed && <span className="sidebar-label">{label}</span>}
      </button>
    </li>
  );
};

export default SidebarItem;
