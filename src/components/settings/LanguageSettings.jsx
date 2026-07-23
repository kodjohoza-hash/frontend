import { languageOptions, currencyOptions, timezoneOptions } from '@data/settingsData';

const LanguageSettings = ({ settings, onChange }) => {
  const s = settings?.general || {};

  const handleChange = (field, value) => {
    onChange({ general: { ...s, [field]: value } });
  };

  return (
    <div className="st-section">
      <div className="st-section__header">
        <div className="st-section__icon st-section__icon--info">
          <i className="bi bi-translate" />
        </div>
        <div>
          <h3 className="st-section__title">Langue & Région</h3>
          <p className="st-section__desc">Paramètres linguistiques et régionaux</p>
        </div>
      </div>

      <div className="st-card">
        <div className="st-form">
          <div className="st-form__row st-form__row--2">
            <div className="st-field">
              <label className="st-field__label" htmlFor="st-lr-country">Pays</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-flag st-field__icon" />
                <input
                  id="st-lr-country"
                  type="text"
                  className="st-field__input"
                  value="Cameroun"
                  readOnly
                />
              </div>
            </div>

            <div className="st-field">
              <label className="st-field__label" htmlFor="st-lr-lang">Langue</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-translate st-field__icon" />
                <select
                  id="st-lr-lang"
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
          </div>

          <div className="st-form__row st-form__row--2">
            <div className="st-field">
              <label className="st-field__label" htmlFor="st-lr-currency">Devise</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-currency-exchange st-field__icon" />
                <select
                  id="st-lr-currency"
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

            <div className="st-field">
              <label className="st-field__label" htmlFor="st-lr-tz">Fuseau horaire</label>
              <div className="st-field__input-wrapper">
                <i className="bi bi-globe st-field__icon" />
                <select
                  id="st-lr-tz"
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

export default LanguageSettings;
