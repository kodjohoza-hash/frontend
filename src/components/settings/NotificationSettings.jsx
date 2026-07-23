import clsx from 'clsx';

const NotificationSettings = ({ settings, onChange }) => {
  const n = settings?.notifications || {};

  const toggle = (key) => {
    onChange({ notifications: { ...n, [key]: !n[key] } });
  };

  const channels = [
    { key: 'email', label: 'Email', desc: 'Recevez les notifications par email' },
    { key: 'sms', label: 'SMS', desc: 'Recevez les alertes importantes par SMS' },
    { key: 'push', label: 'Push', desc: 'Notifications en temps réel sur votre appareil' },
  ];

  const categories = [
    { key: 'booking', label: 'Réservations', desc: 'Confirmations, modifications, annulations' },
    { key: 'payments', label: 'Paiements', desc: 'Reçus, rembaissements, échecs de paiement' },
    { key: 'promotions', label: 'Promotions', desc: 'Offres spéciales et réductions' },
    { key: 'newRoutes', label: 'Nouveaux trajets', desc: 'Nouvelles lignes et destinations disponibles' },
  ];

  return (
    <div className="st-section">
      <div className="st-section__header">
        <div className="st-section__icon st-section__icon--accent">
          <i className="bi bi-bell" />
        </div>
        <div>
          <h3 className="st-section__title">Notifications</h3>
          <p className="st-section__desc">Choisissez comment et quoi vous souhaitez être notifié</p>
        </div>
      </div>

      <div className="st-card">
        <h4 className="st-card__subtitle">Canaux de notification</h4>
        <div className="st-toggle-list">
          {channels.map((item) => (
            <div key={item.key} className="st-toggle-item">
              <div className="st-toggle-item__info">
                <span className="st-toggle-item__label">{item.label}</span>
                <span className="st-toggle-item__desc">{item.desc}</span>
              </div>
              <button
                type="button"
                className={clsx('st-switch', n[item.key] && 'st-switch--active')}
                onClick={() => toggle(item.key)}
                role="switch"
                aria-checked={n[item.key]}
                aria-label={item.label}
              >
                <span className="st-switch__knob" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="st-card">
        <h4 className="st-card__subtitle">Catégories</h4>
        <div className="st-toggle-list">
          {categories.map((item) => (
            <div key={item.key} className="st-toggle-item">
              <div className="st-toggle-item__info">
                <span className="st-toggle-item__label">{item.label}</span>
                <span className="st-toggle-item__desc">{item.desc}</span>
              </div>
              <button
                type="button"
                className={clsx('st-switch', n[item.key] && 'st-switch--active')}
                onClick={() => toggle(item.key)}
                role="switch"
                aria-checked={n[item.key]}
                aria-label={item.label}
              >
                <span className="st-switch__knob" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
