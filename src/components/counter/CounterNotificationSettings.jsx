import clsx from 'clsx';

const NOTIFICATION_TYPES = [
  { key: 'bookings', label: 'Réservations', desc: 'Notifications liées aux réservations de billets', icon: 'bi-ticket-perforated' },
  { key: 'payments', label: 'Paiements', desc: 'Alertes de confirmation et d\'échec de paiement', icon: 'bi-credit-card' },
  { key: 'messages', label: 'Messages', desc: 'Nouveaux messages internes et externes', icon: 'bi-chat-dots' },
  { key: 'alerts', label: 'Alertes', desc: 'Alertes système et rappels importants', icon: 'bi-exclamation-triangle' },
  { key: 'departures', label: 'Départs', desc: 'Informations sur les départs et retards', icon: 'bi-bus-front' },
  { key: 'maintenance', label: 'Maintenance', desc: 'Maintenance système et mises à jour', icon: 'bi-tools' },
  { key: 'support', label: 'Support', desc: 'Réponses et mises à jour du support technique', icon: 'bi-headset' },
];

const CHANNEL_TYPES = [
  { key: 'push', label: 'Notifications push', desc: 'Recevoir des notifications sur votre navigateur', icon: 'bi-bell' },
  { key: 'emails', label: 'Emails', desc: 'Recevoir des notifications par email', icon: 'bi-envelope' },
  { key: 'sms', label: 'SMS', desc: 'Recevoir des notifications par SMS', icon: 'bi-chat-dots' },
];

const ToggleSwitch = ({ active, onChange, label }) => (
  <button
    type="button"
    className={clsx('acs2-switch', { 'acs2-switch--active': active })}
    onClick={onChange}
    aria-label={label}
  >
    <span className="acs2-switch__knob" />
  </button>
);

const CounterNotificationSettings = ({ settings, onToggle }) => {
  if (!settings) return null;

  return (
    <div className="acs2-card">
      <div className="acs2-card__header">
        <i className="bi bi-bell acs2-card__header-icon acs2-card__header-icon--accent" />
        <span>Notifications</span>
      </div>

      <div className="acs2-toggle-list">
        {NOTIFICATION_TYPES.map((item) => (
          <div key={item.key} className="acs2-toggle-row">
            <div className="acs2-toggle-row__info">
              <div className="acs2-toggle-row__label-row">
                <i className={clsx('bi', item.icon, 'acs2-toggle-row__icon')} />
                <span className="acs2-toggle-row__label">{item.label}</span>
              </div>
              <span className="acs2-toggle-row__desc">{item.desc}</span>
            </div>
            <ToggleSwitch
              active={settings[item.key] ?? false}
              onChange={() => onToggle?.(item.key, !settings[item.key])}
              label={item.label}
            />
          </div>
        ))}
      </div>

      <div className="acs2-separator" />

      <div className="acs2-toggle-list">
        {CHANNEL_TYPES.map((item) => (
          <div key={item.key} className="acs2-toggle-row">
            <div className="acs2-toggle-row__info">
              <div className="acs2-toggle-row__label-row">
                <i className={clsx('bi', item.icon, 'acs2-toggle-row__icon')} />
                <span className="acs2-toggle-row__label">{item.label}</span>
              </div>
              <span className="acs2-toggle-row__desc">{item.desc}</span>
            </div>
            <ToggleSwitch
              active={settings[item.key] ?? false}
              onChange={() => onToggle?.(item.key, !settings[item.key])}
              label={item.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounterNotificationSettings;
