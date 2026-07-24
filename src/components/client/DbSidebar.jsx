import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import AppLogo from '@components/common/AppLogo';
import { sidebarLinks } from '@data/clientDashboard';

const HELP_PATH = '/client/support';

const DbSidebar = ({ collapsed, onToggle, onLogout }) => {
  const location = useLocation();
  const isHelpActive = location.pathname === HELP_PATH;

  return (
    <aside className={clsx('db-sidebar', collapsed && 'db-sidebar--collapsed')}>
      <div className="db-sidebar__brand">
        <Link to="/client/dashboard" className="db-sidebar__logo">
          <AppLogo
            size={collapsed ? 32 : 36}
            variant={collapsed ? 'icon' : 'horizontal'}
            textClassName="db-sidebar__logo-text"
          />
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
          <Link
            to={HELP_PATH}
            className={clsx('db-sidebar__help', isHelpActive && 'db-sidebar__help--active')}
          >
            <div className="db-sidebar__help-icon">
              <i className="bi bi-headset" />
            </div>
            <div className="db-sidebar__help-text">
              <span className="db-sidebar__help-title">Besoin d'aide ?</span>
              <span className="db-sidebar__help-sub">Support 24h/24</span>
            </div>
            <i className="bi bi-arrow-right-short db-sidebar__help-arrow" />
          </Link>
        )}
        {collapsed && (
          <Link
            to={HELP_PATH}
            className={clsx('db-sidebar__help-collapsed', isHelpActive && 'db-sidebar__help-collapsed--active')}
            title="Centre d'aide"
          >
            <i className="bi bi-headset" />
          </Link>
        )}
        <button
          type="button"
          className="db-sidebar__logout"
          onClick={onLogout}
          title={collapsed ? 'Se déconnecter' : undefined}
        >
          <i className="bi bi-box-arrow-right" />
          {!collapsed && <span>Se déconnecter</span>}
        </button>
      </div>
    </aside>
  );
};

export default DbSidebar;
