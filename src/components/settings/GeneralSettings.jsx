import { languageOptions, currencyOptions, timezoneOptions, dateFormatOptions } from '@data/settingsData';

const GeneralSettings = ({ settings, onChange }) => {
  const s = settings || {};

  const handleChange = (field, value) => {
    onChange({ general: { ...s, [field]: value } });
  };

  return (
    <div className="st-section">
      <div className="st-section__header">
        <div className="st-section__icon st-section__icon--primary">
          <i className="bi bi-gear" />
        </div>
        <div>
          <h3 className="st-section__title">Général</h3>
          <p className="st-section__desc">Paramètres généraux de votre compte</p>
        </div>
      </div>

      <div className="st-card">
        <div className="st-form">
          <div className="st-form__row st-form__row--2">
            <div className="st-field">
              <label className="st-field__label" htmlFor="st-lang">Langue</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-translate st-field__icon" />
                <select
                  id="st-lang"
                  className="st-field__select"
                  value={s.language || 'fr'}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  {languageOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="st-field">
              <label className="st-field__label" htmlFor="st-currency">Devise</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-currency-exchange st-field__icon" />
                <select
                  id="st-currency"
                  className="st-field__select"
                  value={s.currency || 'XAF'}
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  {currencyOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="st-form__row st-form__row--2">
            <div className="st-field">
              <label className="st-field__label" htmlFor="st-datefmt">Format de date</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-calendar-event st-field__icon" />
                <select
                  id="st-datefmt"
                  className="st-field__select"
                  value={s.dateFormat || 'DD/MM/YYYY'}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                >
                  {dateFormatOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="st-field">
              <label className="st-field__label" htmlFor="st-tz">Fuseau horaire</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-globe st-field__icon" />
                <select
                  id="st-tz"
                  className="st-field__select"
                  value={s.timezone || 'Africa/Douala'}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                >
                  {timezoneOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
