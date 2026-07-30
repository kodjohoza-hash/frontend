import clsx from 'clsx';

const LANGUAGE_OPTIONS = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

const CURRENCY_OPTIONS = [
  { value: 'XAF', label: 'XAF FCFA' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar (USD)' },
];

const DATE_FORMAT_OPTIONS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

const TIME_FORMAT_OPTIONS = [
  { value: '24h', label: '24h' },
  { value: '12h', label: '12h (AM/PM)' },
];

const TIMEZONE_OPTIONS = [
  { value: 'Africa/Douala', label: 'Africa/Douala (GMT+1)' },
  { value: 'Africa/Yaounde', label: 'Africa/Yaoundé (GMT+1)' },
  { value: 'Africa/Lagos', label: 'Africa/Lagos (GMT+1)' },
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (GMT+3)' },
  { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (GMT+2)' },
  { value: 'Africa/Dakar', label: 'Africa/Dakar (GMT+0)' },
];

const CounterLanguageSettings = ({ settings, onChange }) => {
  if (!settings) return null;

  const handleChange = (key, value) => {
    onChange?.({ ...settings, [key]: value });
  };

  const SELECT_FIELDS = [
    { key: 'language', label: 'Langue', icon: 'bi-chat-dots', options: LANGUAGE_OPTIONS },
    { key: 'currency', label: 'Devise', icon: 'bi-currency-exchange', options: CURRENCY_OPTIONS },
    { key: 'dateFormat', label: 'Format de date', icon: 'bi-calendar3', options: DATE_FORMAT_OPTIONS },
    { key: 'timeFormat', label: "Format d'heure", icon: 'bi-clock', options: TIME_FORMAT_OPTIONS },
    { key: 'timezone', label: 'Fuseau horaire', icon: 'bi-globe2', options: TIMEZONE_OPTIONS },
  ];

  return (
    <div className="acs2-card">
      <div className="acs2-card__header">
        <i className="bi bi-translate acs2-card__header-icon acs2-card__header-icon--accent" />
        <span>Langue et Région</span>
      </div>

      <div className="acs2-form">
        {SELECT_FIELDS.map((field) => (
          <div key={field.key} className="acs2-field">
            <label className="acs2-field__label">
              <i className={clsx('bi', field.icon)} /> {field.label}
            </label>
            <div className="acs2-field__input-wrapper">
              <select
                className="acs2-field__select"
                value={settings[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div className="acs2-field">
          <label className="acs2-field__label">
            <i className="bi bi-flag" /> Pays
          </label>
          <div className="acs2-field__input-wrapper">
            <input
              className="acs2-field__input"
              value="Cameroun"
              disabled
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="acs2-card__actions">
        <button
          className="acs2-btn acs2-btn--primary"
          onClick={() => onChange?.(settings)}
        >
          <i className="bi bi-check-lg" />
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default CounterLanguageSettings;
