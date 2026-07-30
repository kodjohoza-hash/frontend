import clsx from 'clsx';

const BRANCH_OPTIONS = [
  { value: 'douala-central', label: 'Douala Central' },
  { value: 'douala-bonanjo', label: 'Douala Bonanjo' },
  { value: 'yaounde-mfoundi', label: 'Yaoundé Mfoundi' },
  { value: 'yaounde-ngaoundere', label: 'Yaoundé Ngaoundéré' },
  { value: 'bafoussam', label: 'Bafoussam' },
  { value: 'garoua', label: 'Garoua' },
];

const TOGGLES = [
  { key: 'autoOpenScanner', label: 'Ouverture automatique du scanner', desc: 'Ouvre automatiquement le scanner de tickets lors de la validation' },
  { key: 'autoPrintReceipt', label: 'Impression automatique du reçu', desc: 'Imprime automatiquement le reçu après chaque transaction' },
  { key: 'confirmBeforeDelete', label: 'Confirmer avant suppression', desc: 'Demander une confirmation avant de supprimer un élément' },
];

const CounterWorkPreferences = ({ settings, onChange }) => {
  if (!settings) return null;

  const handleChange = (key, value) => {
    onChange?.({ ...settings, [key]: value });
  };

  return (
    <div className="acs2-card">
      <div className="acs2-card__header">
        <i className="bi bi-gear acs2-card__header-icon acs2-card__header-icon--accent" />
        <span>Préférences de travail</span>
      </div>

      <div className="acs2-form">
        <div className="acs2-field">
          <label className="acs2-field__label">
            <i className="bi bi-building" /> Agence préférée
          </label>
          <div className="acs2-field__input-wrapper">
            <select
              className="acs2-field__select"
              value={settings.branch || ''}
              onChange={(e) => handleChange('branch', e.target.value)}
            >
              <option value="">Sélectionner une agence</option>
              {BRANCH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="acs2-field">
          <label className="acs2-field__label">
            <i className="bi bi-printer" /> Imprimante par défaut
          </label>
          <div className="acs2-field__input-wrapper">
            <input
              className="acs2-field__input"
              value={settings.defaultPrinter || 'Imprimante par défaut du système'}
              disabled
              readOnly
              placeholder="Non configuré"
            />
          </div>
        </div>

        <div className="acs2-field">
          <label className="acs2-field__label">
            <i className="bi bi-list-ol" /> Résultats par page
          </label>
          <div className="acs2-field__input-wrapper">
            <input
              type="number"
              className="acs2-field__input"
              value={settings.resultsPerPage ?? 20}
              onChange={(e) => handleChange('resultsPerPage', parseInt(e.target.value, 10) || 20)}
              min={5}
              max={100}
            />
          </div>
        </div>
      </div>

      <div className="acs2-separator" />

      {TOGGLES.map((item) => (
        <div key={item.key} className="acs2-toggle-row">
          <div className="acs2-toggle-row__info">
            <span className="acs2-toggle-row__label">{item.label}</span>
            <span className="acs2-toggle-row__desc">{item.desc}</span>
          </div>
          <button
            type="button"
            className={clsx('acs2-switch', { 'acs2-switch--active': settings[item.key] })}
            onClick={() => handleChange(item.key, !settings[item.key])}
            aria-label={item.label}
          >
            <span className="acs2-switch__knob" />
          </button>
        </div>
      ))}

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

export default CounterWorkPreferences;
