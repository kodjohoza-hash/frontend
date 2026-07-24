import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import AppLogo from '@components/common/AppLogo';
import { sidebarMenus } from '@data/agencyData';

const AgencySidebar = ({ collapsed, onToggle, onLogout, mobileOpen }) => {
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      const active = navRef.current.querySelector('.ag-sidebar__link--active');
      if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [location.pathname]);

  const isActive = (to) => location.pathname === to;

  return (
    <aside className={clsx('ag-sidebar', collapsed && 'ag-sidebar--collapsed', mobileOpen && 'ag-sidebar--mobile-open')}>
      <div className="ag-sidebar__brand">
        <Link to="/company/dashboard" className="ag-sidebar__logo">
          <AppLogo size={collapsed ? 30 : 34} variant={collapsed ? 'icon-only' : 'horizontal'} textClassName="ag-sidebar__logo-text" />
        </Link>
        <button type="button" className="ag-sidebar__toggle" onClick={onToggle} aria-label={collapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}>
          <i className={clsx('bi', collapsed ? 'bi-chevron-right' : 'bi-chevron-left')} />
        </button>
      </div>

      <nav className="ag-sidebar__nav" ref={navRef}>
        {sidebarMenus.map((group) => (
          <div key={group.section} className="ag-sidebar__group">
            {!collapsed && <span className="ag-sidebar__group-label">{group.section}</span>}
            <ul className="ag-sidebar__list">
              {group.items.map((item) => (
                <li key={item.id} className="ag-sidebar__item">
                  <Link
                    to={item.to}
                    className={clsx('ag-sidebar__link', isActive(item.to) && 'ag-sidebar__link--active')}
                    title={collapsed ? item.label : undefined}
                  >
                    <i className={`bi ${item.icon} ag-sidebar__icon`} />
                    {!collapsed && <span className="ag-sidebar__label">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className={clsx('ag-sidebar__badge', item.id === 'bookings' && 'ag-sidebar__badge--accent')}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="ag-sidebar__footer">
        {!collapsed && (
          <div className="ag-sidebar__company">
            <div className="ag-sidebar__company-avatar">GE</div>
            <div className="ag-sidebar__company-info">
              <span className="ag-sidebar__company-name">Guillaume Express</span>
              <span className="ag-sidebar__company-plan">Compte Premium</span>
            </div>
          </div>
        )}
        <button type="button" className="ag-sidebar__logout" onClick={onLogout} title={collapsed ? 'Déconnexion' : undefined}>
          <i className="bi bi-box-arrow-right" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default AgencySidebar;
