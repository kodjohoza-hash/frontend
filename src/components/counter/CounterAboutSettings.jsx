const LEGAL_LINKS = [
  { label: 'Mentions légales', icon: 'bi-file-earmark-text' },
  { label: 'Politique de confidentialité', icon: 'bi-shield-lock' },
  { label: "Conditions d'utilisation", icon: 'bi-journal-text' },
];

const CounterAboutSettings = ({ about }) => {
  if (!about) return null;

  const INFO_ITEMS = [
    { label: 'Version', value: about.version || '1.0.0', icon: 'bi-tag' },
    { label: 'Frontend', value: about.frontend || 'React 18', icon: 'bi-window-stack' },
    { label: 'API', value: about.api || 'v2.4.1', icon: 'bi-cloud-arrow-down' },
    { label: 'Licence', value: about.license || 'MIT', icon: 'bi-award' },
  ];

  return (
    <div className="acs2-card">
      <div className="acs2-card__header">
        <i className="bi bi-info-circle acs2-card__header-icon acs2-card__header-icon--accent" />
        <span>À propos</span>
      </div>

      <div className="acs2-about__brand">
        <div className="acs2-about__logo">
          <i className="bi bi-bus-front" />
        </div>
        <div className="acs2-about__name">{about.appName || 'Bus Tix Connect'}</div>
        <div className="acs2-about__slogan">{about.slogan || 'Voyagez en toute simplicité'}</div>
      </div>

      <div className="acs2-about__info">
        {INFO_ITEMS.map((item) => (
          <div key={item.label} className="acs2-about__info-row">
            <span className="acs2-about__info-label">
              <i className={`bi ${item.icon}`} /> {item.label}
            </span>
            <span className="acs2-about__info-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="acs2-separator" />

      <div className="acs2-about__legal">
        <div className="acs2-card__subtitle">
          <i className="bi bi-journal-text" />
          Informations légales
        </div>
        <div className="acs2-about__legal-links">
          {LEGAL_LINKS.map((link) => (
            <button key={link.label} className="acs2-about__legal-btn" type="button">
              <i className={`bi ${link.icon}`} />
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="acs2-separator" />

      <div className="acs2-about__support">
        <div className="acs2-card__subtitle">
          <i className="bi bi-headset" />
          Support
        </div>
        <div className="acs2-about__support-info">
          <div className="acs2-about__support-item">
            <i className="bi bi-envelope" />
            <span>{about.supportEmail || 'support@bustixconnect.com'}</span>
          </div>
          <div className="acs2-about__support-item">
            <i className="bi bi-telephone" />
            <span>{about.supportPhone || '+237 123 456 789'}</span>
          </div>
        </div>
      </div>

      <div className="acs2-about__footer">
        © {new Date().getFullYear()} Bus Tix Connect. Tous droits réservés.
      </div>
    </div>
  );
};

export default CounterAboutSettings;
