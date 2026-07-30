import { useState } from 'react';
import clsx from 'clsx';

const CounterSettingsSidebar = ({ sections, activeSection, onSectionChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="acs2-sidebar">
      <button
        className="acs2-sidebar__toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu des paramètres"
      >
        <i className={clsx('bi', mobileOpen ? 'bi-x-lg' : 'bi-list')} />
      </button>
      <div className={clsx('acs2-sidebar__inner', { 'acs2-sidebar__inner--open': mobileOpen })}>
        <ul className="acs2-sidebar__list">
          {sections.map((section) => (
            <li key={section.id} className="acs2-sidebar__item">
              <button
                className={clsx('acs2-sidebar__btn', {
                  'acs2-sidebar__btn--active': activeSection === section.id,
                })}
                onClick={() => {
                  onSectionChange(section.id);
                  setMobileOpen(false);
                }}
              >
                <i className={clsx('bi', section.icon, 'acs2-sidebar__icon')} />
                <span className="acs2-sidebar__label">{section.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CounterSettingsSidebar;
