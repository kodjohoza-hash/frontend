import { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { useLocation, Link } from 'react-router-dom';
import AppLogo from '@components/common/AppLogo';

/**
 * Sidebar — Barre latérale réutilisable
 * Features: collapse, active state, groups, responsive
 */
const Sidebar = ({
  items = [],
  collapsed = false,
  onToggle,
  logo,
  className = '',
}) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const initial = {};
    items.forEach((item) => {
      if (item.children && item.children.some((child) => child.path === location.pathname)) {
        initial[item.id] = true;
      }
    });
    setExpandedGroups((prev) => ({ ...prev, ...initial }));
  }, [location.pathname, items]);

  const toggleGroup = useCallback((groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  const isActive = useCallback(
    (path) => {
      if (!path) return false;
      if (path === '/') return location.pathname === '/';
      return location.pathname === path || location.pathname.startsWith(path + '/');
    },
    [location.pathname]
  );

  return (
    <aside
      className={clsx(
        'btc-sidebar',
        collapsed && 'btc-sidebar-collapsed',
        className
      )}
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      }}
    >
      {/* Sidebar Header */}
      <div className="btc-sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom">
        {!collapsed && (
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            {logo || <AppLogo size={28} variant="horizontal" textClassName="fw-bold text-primary sidebar-brand-text" />}
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="text-decoration-none d-flex align-items-center justify-content-center w-100">
            <AppLogo size={28} variant="icon" />
          </Link>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="btc-sidebar-nav flex-grow-1 overflow-auto p-2">
        <ul className="nav flex-column gap-0-5">
          {items.map((item) => {
            if (item.children) {
              const isExpanded = expandedGroups[item.id];
              return (
                <li key={item.id} className="nav-item">
                  <button
                    className={clsx('nav-link sidebar-group-toggle w-100 text-start', isExpanded && 'active')}
                    onClick={() => toggleGroup(item.id)}
                    title={collapsed ? item.label : undefined}
                    aria-expanded={isExpanded}
                  >
                    {item.icon && <i className={clsx('bi', item.icon, 'sidebar-icon')} />}
                    {!collapsed && (
                      <>
                        <span className="sidebar-label flex-grow-1">{item.label}</span>
                        <i className={clsx('bi', isExpanded ? 'bi-chevron-down' : 'bi-chevron-right', 'sidebar-chevron')} />
                      </>
                    )}
                  </button>
                  {isExpanded && !collapsed && (
                    <ul className="nav flex-column sidebar-subnav ps-4">
                      {item.children.map((child) => (
                        <li key={child.id || child.path} className="nav-item">
                          <Link
                            to={child.path}
                            className={clsx('nav-link sidebar-link', location.pathname === child.path && 'active')}
                          >
                            {child.icon && <i className={clsx('bi', child.icon, 'sidebar-icon')} />}
                            <span className="sidebar-label">{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.id || item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={clsx('nav-link sidebar-link', location.pathname === item.path && 'active')}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon && <i className={clsx('bi', item.icon, 'sidebar-icon')} />}
                  {!collapsed && <span className="sidebar-label">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      {onToggle && (
        <div className="btc-sidebar-footer border-top p-2">
          <button
            className="btn btn-link sidebar-collapse-btn w-100 text-start"
            onClick={onToggle}
            aria-label={collapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}
          >
            <i className={clsx('bi', collapsed ? 'bi-chevron-right' : 'bi-chevron-left', 'sidebar-icon')} />
            {!collapsed && <span className="sidebar-label">Réduire</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
