import { useState } from 'react';
import clsx from 'clsx';

/**
 * SidebarGroup — Groupe dépliant de sidebar
 */
const SidebarGroup = ({
  id,
  icon,
  label,
  children,
  defaultExpanded = false,
  collapsed = false,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (collapsed) {
    return (
      <li className={clsx('nav-item sidebar-group', className)}>
        <div className="nav-link sidebar-link sidebar-group-trigger" title={label}>
          {icon && <i className={clsx('bi', icon, 'sidebar-icon')} />}
        </div>
      </li>
    );
  }

  return (
    <li className={clsx('nav-item sidebar-group', className)}>
      <button
        className={clsx('nav-link sidebar-link sidebar-group-toggle w-100 text-start', expanded && 'active')}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {icon && <i className={clsx('bi', icon, 'sidebar-icon')} />}
        <span className="sidebar-label flex-grow-1">{label}</span>
        <i className={clsx('bi', expanded ? 'bi-chevron-down' : 'bi-chevron-right', 'sidebar-chevron')} />
      </button>
      {expanded && (
        <ul className="nav flex-column sidebar-subnav ps-4">
          {children}
        </ul>
      )}
    </li>
  );
};

export default SidebarGroup;
