import { useState } from 'react';

export default function AgencyRegionalSettings({ data, onSave }) {
  const [language, setLanguage] = useState(data.language.id);
  const [timezone, setTimezone] = useState(data.timezone);
  const [dateFormat, setDateFormat] = useState(data.dateFormat);
  const [moneyFormat, setMoneyFormat] = useState(data.moneyFormat);

  const handleSave = () => {
    const selectedLang = data.availableLanguages.find((l) => l.id === language);
    onSave({
      language: selectedLang || data.language,
      timezone,
      dateFormat,
      moneyFormat,
    });
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h2 className="aset-section__title">
            <i className="bi bi-globe" /> Régionalisation
          </h2>
          <p className="aset-section__subtitle">Configurez la langue et les formats régionaux</p>
        </div>
      </div>

      <div className="aset-form">
        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Langue</label>
            <select
              className="aset-form__select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {data.availableLanguages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Fuseau horaire</label>
            <select
              className="aset-form__select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {data.availableTimezones.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Format de date</label>
            <select
              className="aset-form__select"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
            >
              {data.availableDateFormats.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">Format monétaire</label>
            <select
              className="aset-form__select"
              value={moneyFormat}
              onChange={(e) => setMoneyFormat(e.target.value)}
            >
              {data.availableMoneyFormats.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="aset-form__group">
          <label className="aset-form__label">Devise</label>
          <input className="aset-form__input" value={data.currency} disabled />
        </div>
      </div>

      <div className="aset-btn-group">
        <button className="aset-btn aset-btn--primary" onClick={handleSave}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}
