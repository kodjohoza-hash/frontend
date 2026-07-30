import clsx from 'clsx';

const getInitials = (name) => {
  if (!name) return '--';
  return name
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const FIELDS = [
  { key: 'name', label: 'Nom complet', icon: 'bi-person' },
  { key: 'phone', label: 'Téléphone', icon: 'bi-telephone' },
  { key: 'email', label: 'Email', icon: 'bi-envelope' },
  { key: 'address', label: 'Adresse', icon: 'bi-house-door' },
  { key: 'city', label: 'Ville', icon: 'bi-building' },
  { key: 'country', label: 'Pays', icon: 'bi-globe2' },
  { key: 'language', label: 'Langue', icon: 'bi-chat-dots' },
  { key: 'timezone', label: 'Fuseau horaire', icon: 'bi-clock' },
];

const CounterAccountSettings = ({ settings, onEdit }) => {
  if (!settings) return null;

  return (
    <div className="acs2-card">
      <div className="acs2-card__header">
        <i className="bi bi-person-vcard acs2-card__header-icon" />
        <span>Mon compte</span>
      </div>

      <div className="acs2-account__avatar-section">
        <div className="acs2-account__avatar">
          {getInitials(settings.name)}
        </div>
        <div className="acs2-account__avatar-info">
          <div className="acs2-account__avatar-name">{settings.name || '—'}</div>
          <div className="acs2-account__avatar-role">{settings.role || 'Agent de guichet'}</div>
        </div>
      </div>

      <div className="acs2-account__fields">
        {FIELDS.map((field) => (
          <div key={field.key} className="acs2-account__field">
            <span className="acs2-account__field-label">
              <i className={clsx('bi', field.icon)} /> {field.label}
            </span>
            <span className="acs2-account__field-value">
              {settings[field.key] || '—'}
            </span>
          </div>
        ))}
      </div>

      <div className="acs2-card__actions">
        <button className="acs2-btn acs2-btn--primary" onClick={onEdit}>
          <i className="bi bi-pencil-square" />
          Modifier
        </button>
      </div>
    </div>
  );
};

export default CounterAccountSettings;
