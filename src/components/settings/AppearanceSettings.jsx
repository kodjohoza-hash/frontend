import clsx from 'clsx';

const themes = [
  {
    id: 'light',
    label: 'Clair',
    desc: 'Thème lumineux pour une utilisation en journée',
    icon: 'bi-sun',
    gradient: 'linear-gradient(135deg, #F9FAFB, #E5E7EB)',
  },
  {
    id: 'dark',
    label: 'Sombre',
    desc: 'Thème sombre pour préserver vos yeux',
    icon: 'bi-moon',
    gradient: 'linear-gradient(135deg, #1F2937, #111827)',
  },
  {
    id: 'system',
    label: 'Système',
    desc: 'Adapté automatiquement à votre appareil',
    icon: 'bi-display',
    gradient: 'linear-gradient(135deg, #0B1D51, #1E3A8A)',
  },
];

const AppearanceSettings = ({ settings, onChange }) => {
  const current = settings?.appearance?.theme || 'light';

  const handleSelect = (themeId) => {
    onChange({ appearance: { theme: themeId } });
  };

  return (
    <div className="st-section">
      <div className="st-section__header">
        <div className="st-section__icon st-section__icon--accent">
          <i className="bi bi-palette" />
        </div>
        <div>
          <h3 className="st-section__title">Apparence</h3>
          <p className="st-section__desc">Personnalisez l'apparence de l'application</p>
        </div>
      </div>

      <div className="st-card">
        <div className="st-themes">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={clsx('st-theme', current === theme.id && 'st-theme--active')}
              onClick={() => handleSelect(theme.id)}
            >
              <div
                className="st-theme__preview"
                style={{ background: theme.gradient }}
              >
                <i className={clsx('bi', theme.icon, 'st-theme__icon')} />
              </div>
              <div className="st-theme__info">
                <span className="st-theme__label">{theme.label}</span>
                <span className="st-theme__desc">{theme.desc}</span>
              </div>
              {current === theme.id && (
                <div className="st-theme__check">
                  <i className="bi bi-check-lg" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="st-card__note">
          <i className="bi bi-info-circle" />
          Le thème sombre et le thème système seront disponibles prochainement.
        </p>
      </div>
    </div>
  );
};

export default AppearanceSettings;
