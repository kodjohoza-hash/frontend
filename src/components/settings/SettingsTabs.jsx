import clsx from 'clsx';
import { tabs } from '@data/settingsData';

const SettingsTabs = ({ activeTab, onTabChange }) => {
  return (
    <nav className="st-tabs" aria-label="Paramètres">
      <ul className="st-tabs__list">
        {tabs.map((tab) => (
          <li key={tab.id} className="st-tabs__item">
            <button
              type="button"
              className={clsx('st-tabs__btn', activeTab === tab.id && 'st-tabs__btn--active')}
              onClick={() => onTabChange(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <i className={clsx('bi', tab.icon, 'st-tabs__icon')} />
              <span className="st-tabs__label">{tab.label}</span>
              {activeTab === tab.id && <span className="st-tabs__indicator" />}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SettingsTabs;
