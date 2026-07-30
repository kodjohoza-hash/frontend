import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import AppLogo from '@components/common/AppLogo';
import { adminSidebarMenus } from '@data/adminData';

const AdminSidebar = ({ collapsed, onToggle, onLogout, mobileOpen }) => {
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      const active = navRef.current.querySelector('.adm-sidebar__link--active');
      if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [location.pathname]);

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <aside className={clsx('adm-sidebar', collapsed && 'adm-sidebar--collapsed', mobileOpen && 'adm-sidebar--mobile-open')}>
      <div className="adm-sidebar__brand">
        <Link to="/super-admin/dashboard" className="adm-sidebar__logo">
          <AppLogo size={collapsed ? 30 : 34} variant={collapsed ? 'icon-only' : 'horizontal'} textClassName="adm-sidebar__logo-text" />
        </Link>
        <button type="button" className="adm-sidebar__toggle" onClick={onToggle} aria-label={collapsed ? 'Développer' : 'Réduire'}>
          <i className={clsx('bi', collapsed ? 'bi-chevron-right' : 'bi-chevron-left')} />
        </button>
      </div>

      <nav className="adm-sidebar__nav" ref={navRef}>
        {adminSidebarMenus.map((group) => (
          <div key={group.section} className="adm-sidebar__group">
            {!collapsed && <span className="adm-sidebar__group-label">{group.section}</span>}
            <ul className="adm-sidebar__list">
              {group.items.map((item) => (
                <li key={item.id} className="adm-sidebar__item">
                  <Link
                    to={item.to}
                    className={clsx('adm-sidebar__link', isActive(item.to) && 'adm-sidebar__link--active')}
                    title={collapsed ? item.label : undefined}
                  >
                    <i className={`bi ${item.icon} adm-sidebar__icon`} />
                    {!collapsed && <span className="adm-sidebar__label">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="adm-sidebar__footer">
        <div className="adm-sidebar__company">
          <div className="adm-sidebar__company-avatar">KJ</div>
          <div className="adm-sidebar__company-info">
            <span className="adm-sidebar__company-name">Kodjo Jojo</span>
            <span className="adm-sidebar__company-role">Super Admin</span>
          </div>
        </div>
        <button type="button" className="adm-sidebar__logout" onClick={onLogout} title={collapsed ? 'Déconnexion' : undefined}>
          <i className="bi bi-box-arrow-right" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
