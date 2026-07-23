import { useState } from 'react';
import clsx from 'clsx';
import { defaultPreferences, languageOptions, currencyOptions, timezoneOptions, dateFormatOptions } from '@data/profileData';

const PreferencesCard = ({ preferences: prefs, onChange }) => {
  const preferences = prefs || defaultPreferences;

  const [notifPrefs, setNotifPrefs] = useState(preferences.notifications || defaultPreferences.notifications);

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const toggleNotif = (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    onChange({ notifications: updated });
  };

  const notifItems = [
    { key: 'email', label: 'Notifications par email', desc: 'Recevez des confirmations et alertes par email' },
    { key: 'sms', label: 'Notifications par SMS', desc: 'Recevez des alertes importantes par SMS' },
    { key: 'push', label: 'Notifications push', desc: 'Recevez des notifications en temps réel' },
    { key: 'promotions', label: 'Offres promotionnelles', desc: 'Recevez nos meilleures offres et réductions' },
  ];

  return (
    <div className="pf-card pf-card--preferences">
      <div className="pf-card__header">
        <div className="pf-card__header-icon pf-card__header-icon--accent">
          <i className="bi bi-sliders" />
        </div>
        <span className="pf-card__header-label">Préférences</span>
      </div>

      <div className="pf-form">
        <div className="pf-form__row pf-form__row--2">
          <div className="pf-field">
            <label className="pf-field__label" htmlFor="pref-language">Langue</label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-translate pf-field__icon" />
              <select
                id="pref-language"
                className="pf-field__select"
                value={preferences.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                {languageOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-field__label" htmlFor="pref-currency">Devise</label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-currency-exchange pf-field__icon" />
              <select
                id="pref-currency"
                className="pf-field__select"
                value={preferences.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                {currencyOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pf-form__row pf-form__row--2">
          <div className="pf-field">
            <label className="pf-field__label" htmlFor="pref-timezone">Fuseau horaire</label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-globe pf-field__icon" />
              <select
                id="pref-timezone"
                className="pf-field__select"
                value={preferences.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                {timezoneOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-field__label" htmlFor="pref-dateformat">Format de date</label>
            <div className="pf-field__input-wrapper">
              <i className="bi bi-calendar-event pf-field__icon" />
              <select
                id="pref-dateformat"
                className="pf-field__select"
                value={preferences.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
              >
                {dateFormatOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="pf-prefs__notif-section">
        <h4 className="pf-prefs__notif-title">Préférences de notification</h4>
        <div className="pf-prefs__notif-list">
          {notifItems.map((item) => (
            <div key={item.key} className="pf-prefs__notif-item">
              <div className="pf-prefs__notif-info">
                <span className="pf-prefs__notif-label">{item.label}</span>
                <span className="pf-prefs__notif-desc">{item.desc}</span>
              </div>
              <button
                type="button"
                className={clsx('pf-prefs__toggle', notifPrefs[item.key] && 'pf-prefs__toggle--active')}
                onClick={() => toggleNotif(item.key)}
                aria-label={item.label}
              >
                <div className="pf-prefs__toggle-knob" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferencesCard;
