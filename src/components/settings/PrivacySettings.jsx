import clsx from 'clsx';

const PrivacySettings = ({ settings, onChange }) => {
  const p = settings?.privacy || {};

  const toggle = (key) => {
    onChange({ privacy: { ...p, [key]: !p[key] } });
  };

  const items = [
    {
      key: 'profileVisible',
      label: 'Profil visible',
      desc: 'Permettre aux autres utilisateurs de voir votre profil',
    },
    {
      key: 'dataSharing',
      label: 'Partage des données',
      desc: 'Partager des données anonymes pour améliorer le service',
      placeholder: true,
    },
    {
      key: 'browsingHistory',
      label: 'Historique de navigation',
      desc: 'Conserver l\'historique de vos recherches et visites',
      placeholder: true,
    },
    {
      key: 'cookies',
      label: 'Gestion des cookies',
      desc: 'Gérer les cookies et traceurs utilisés sur la plateforme',
      placeholder: true,
    },
  ];

  return (
    <div className="st-section">
      <div className="st-section__header">
        <div className="st-section__icon st-section__icon--info">
          <i className="bi bi-shield-lock" />
        </div>
        <div>
          <h3 className="st-section__title">Confidentialité</h3>
          <p className="st-section__desc">Contrôlez la visibilité de vos données</p>
        </div>
      </div>

      <div className="st-card">
        <div className="st-toggle-list">
          {items.map((item) => (
            <div key={item.key} className="st-toggle-item">
              <div className="st-toggle-item__info">
                <div className="st-toggle-item__label-row">
                  <span className="st-toggle-item__label">{item.label}</span>
                  {item.placeholder && (
                    <span className="st-badge st-badge--muted">Bientôt</span>
                  )}
                </div>
                <span className="st-toggle-item__desc">{item.desc}</span>
              </div>
              {item.placeholder ? (
                <div className="st-switch st-switch--disabled">
                  <span className="st-switch__knob" />
                </div>
              ) : (
                <button
                  type="button"
                  className={clsx('st-switch', p[item.key] && 'st-switch--active')}
                  onClick={() => toggle(item.key)}
                  role="switch"
                  aria-checked={p[item.key]}
                  aria-label={item.label}
                >
                  <span className="st-switch__knob" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
