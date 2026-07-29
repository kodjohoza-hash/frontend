import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import AppLogo from '@components/common/AppLogo';
import { sidebarMenus } from '@data/counterData';

const CounterSidebar = ({ collapsed, onToggle, onLogout, mobileOpen }) => {
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      const active = navRef.current.querySelector('.act-sidebar__link--active');
      if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [location.pathname]);

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <aside className={clsx('act-sidebar', collapsed && 'act-sidebar--collapsed', mobileOpen && 'act-sidebar--mobile-open')}>
      <div className="act-sidebar__brand">
        <Link to="/counter/dashboard" className="act-sidebar__logo">
          <AppLogo size={collapsed ? 30 : 34} variant={collapsed ? 'icon-only' : 'horizontal'} textClassName="act-sidebar__logo-text" />
        </Link>
        <button type="button" className="act-sidebar__toggle" onClick={onToggle} aria-label={collapsed ? 'Développer' : 'Réduire'}>
          <i className={clsx('bi', collapsed ? 'bi-chevron-right' : 'bi-chevron-left')} />
        </button>
      </div>

      <nav className="act-sidebar__nav" ref={navRef}>
        {sidebarMenus.map((group) => (
          <div key={group.section} className="act-sidebar__group">
            {!collapsed && <span className="act-sidebar__group-label">{group.section}</span>}
            <ul className="act-sidebar__list">
              {group.items.map((item) => (
                <li key={item.id} className="act-sidebar__item">
                  <Link
                    to={item.to}
                    className={clsx('act-sidebar__link', isActive(item.to) && 'act-sidebar__link--active')}
                    title={collapsed ? item.label : undefined}
                  >
                    <i className={`bi ${item.icon} act-sidebar__icon`} />
                    {!collapsed && <span className="act-sidebar__label">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="act-sidebar__footer">
        <div className="act-sidebar__company">
          <div className="act-sidebar__company-avatar">EB</div>
          <div className="act-sidebar__company-info">
            <span className="act-sidebar__company-name">Express Bus Cameroun</span>
            <span className="act-sidebar__company-role">Agent de guichet</span>
          </div>
        </div>
        <button type="button" className="act-sidebar__logout" onClick={onLogout} title={collapsed ? 'Déconnexion' : undefined}>
          <i className="bi bi-box-arrow-right" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default CounterSidebar;
