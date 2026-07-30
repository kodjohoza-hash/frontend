import clsx from 'clsx';

const THEMES = [
  { id: 'light', label: 'Clair', icon: 'bi-sun', desc: 'Thème lumineux', bg: '#FFF8E7' },
  { id: 'dark', label: 'Sombre', icon: 'bi-moon', desc: 'Thème obscur', bg: '#1E293B' },
  { id: 'system', label: 'Système', icon: 'bi-laptop', desc: 'Suit les préférences système', bg: 'linear-gradient(135deg, #FFF8E7 50%, #1E293B 50%)' },
];

const ACCENT_COLORS = ['#FF6B35', '#0B1D51', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444'];

const FONT_SIZES = [
  { value: 'small', label: 'Petite' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'large', label: 'Grande' },
];

const DENSITIES = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Confortable' },
  { value: 'spacious', label: 'Spacieux' },
];

const CounterAppearanceSettings = ({ settings, onChange }) => {
  if (!settings) return null;

  const handleChange = (key, value) => {
    onChange?.({ ...settings, [key]: value });
  };

  return (
    <div className="acs2-card">
      <div className="acs2-card__header">
        <i className="bi bi-palette acs2-card__header-icon acs2-card__header-icon--accent" />
        <span>Apparence</span>
      </div>

      <div className="acs2-card__subtitle">
        <i className="bi bi-brush" />
        Thème
      </div>
      <div className="acs2-themes">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={clsx('acs2-theme', { 'acs2-theme--active': settings.theme === theme.id })}
            onClick={() => handleChange('theme', theme.id)}
          >
            {settings.theme === theme.id && (
              <span className="acs2-theme__check"><i className="bi bi-check" /></span>
            )}
            <div className="acs2-theme__preview" style={{ background: theme.bg }}>
              <i className={clsx('bi', theme.icon, 'acs2-theme__preview-icon')} />
            </div>
            <span className="acs2-theme__label">{theme.label}</span>
            <span className="acs2-theme__desc">{theme.desc}</span>
          </button>
        ))}
      </div>

      <div className="acs2-card__subtitle">
        <i className="bi bi-palette2" />
        Couleur d'accent
      </div>
      <div className="acs2-colors">
        {ACCENT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={clsx('acs2-color-swatch', {
              'acs2-color-swatch--active': settings.accentColor === color,
            })}
            style={{ background: color }}
            onClick={() => handleChange('accentColor', color)}
            aria-label={`Couleur ${color}`}
          >
            {settings.accentColor === color && (
              <i className="bi bi-check acs2-color-swatch__check" />
            )}
          </button>
        ))}
      </div>

      <div className="acs2-form__row acs2-form__row--2">
        <div>
          <div className="acs2-card__subtitle">
            <i className="bi bi-fonts" />
            Taille de police
          </div>
          <div className="acs2-radio-group">
            {FONT_SIZES.map((opt) => (
              <label
                key={opt.value}
                className={clsx('acs2-radio', {
                  'acs2-radio--active': settings.fontSize === opt.value,
                })}
              >
                <input
                  type="radio"
                  name="fontSize"
                  value={opt.value}
                  checked={settings.fontSize === opt.value}
                  onChange={() => handleChange('fontSize', opt.value)}
                  className="acs2-radio__input"
                />
                <span className="acs2-radio__label">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="acs2-card__subtitle">
            <i className="bi bi-grid-3x3-gap" />
            Densité
          </div>
          <div className="acs2-radio-group">
            {DENSITIES.map((opt) => (
              <label
                key={opt.value}
                className={clsx('acs2-radio', {
                  'acs2-radio--active': settings.density === opt.value,
                })}
              >
                <input
                  type="radio"
                  name="density"
                  value={opt.value}
                  checked={settings.density === opt.value}
                  onChange={() => handleChange('density', opt.value)}
                  className="acs2-radio__input"
                />
                <span className="acs2-radio__label">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="acs2-toggle-row">
        <div className="acs2-toggle-row__info">
          <span className="acs2-toggle-row__label">Animations</span>
          <span className="acs2-toggle-row__desc">Activer les animations et transitions de l'interface</span>
        </div>
        <button
          type="button"
          className={clsx('acs2-switch', { 'acs2-switch--active': settings.animations })}
          onClick={() => handleChange('animations', !settings.animations)}
          aria-label="Activer les animations"
        >
          <span className="acs2-switch__knob" />
        </button>
      </div>
    </div>
  );
};

export default CounterAppearanceSettings;
