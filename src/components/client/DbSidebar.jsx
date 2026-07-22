import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { sidebarLinks } from '@data/clientDashboard';

const DbSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside className={clsx('db-sidebar', collapsed && 'db-sidebar--collapsed')}>
      <div className="db-sidebar__brand">
        <Link to="/client/dashboard" className="db-sidebar__logo">
          <span className="db-sidebar__logo-icon">🚌</span>
          {!collapsed && <span className="db-sidebar__logo-text">Bus Tix</span>}
        </Link>
        <button
          type="button"
          className="db-sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={clsx('bi', collapsed ? 'bi-chevron-right' : 'bi-chevron-left')} />
        </button>
      </div>

      <nav className="db-sidebar__nav">
        <ul className="db-sidebar__list">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.id} className="db-sidebar__item">
                <Link
                  to={link.path}
                  className={clsx('db-sidebar__link', isActive && 'db-sidebar__link--active')}
                  title={collapsed ? link.label : undefined}
                >
                  <i className={clsx('bi', link.icon, 'db-sidebar__icon')} />
                  {!collapsed && <span className="db-sidebar__label">{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="db-sidebar__footer">
        {!collapsed && (
          <div className="db-sidebar__help">
            <div className="db-sidebar__help-icon">
              <i className="bi bi-headset" />
            </div>
            <div className="db-sidebar__help-text">
              <span className="db-sidebar__help-title">Besoin d'aide ?</span>
              <span className="db-sidebar__help-sub">Support 24h/24</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DbSidebar;
