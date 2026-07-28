import clsx from 'clsx';

const LEVEL_CONFIG = {
  bronze: {
    label: 'Bronze',
    icon: 'bi-shield',
    desc: 'Vous commencez tout juste votre fidélité. Continuez à voyager pour débloquer des avantages.',
    gradient: 'ac-loyalty--bronze',
  },
  argent: {
    label: 'Argent',
    icon: 'bi-shield-check',
    desc: 'Un bon début ! Vous profitez déjà de quelques avantages.',
    gradient: 'ac-loyalty--argent',
  },
  or: {
    label: 'Or',
    icon: 'bi-shield-fill-check',
    desc: 'Excellent ! Vous êtes un client fidèle avec des privilèges exclusifs.',
    gradient: 'ac-loyalty--or',
  },
  platine: {
    label: 'Platine',
    icon: 'bi-gem',
    desc: 'Le plus haut niveau de fidélité. Merci pour votre confiance !',
    gradient: 'ac-loyalty--platine',
  },
};

const AgencyClientLoyalty = ({ client }) => {
  const level = client.loyaltyLevel || 'bronze';
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.bronze;

  return (
    <div className={clsx('ac-loyalty', config.gradient)}>
      <div className="ac-loyalty__header">
        <div className="ac-loyalty__icon">
          <i className={`bi ${config.icon}`} />
        </div>
        <div className="ac-loyalty__info">
          <span className="ac-loyalty__level">{config.label}</span>
          <span className="ac-loyalty__desc">{config.desc}</span>
        </div>
      </div>
      <div className="ac-loyalty__stats">
        <div className="ac-loyalty__stat">
          <span className="ac-loyalty__stat-value">{client.totalTrips ?? 0}</span>
          <span className="ac-loyalty__stat-label">Trajets</span>
        </div>
        <div className="ac-loyalty__stat">
          <span className="ac-loyalty__stat-value">{client.totalSpent?.toLocaleString('fr-FR') ?? 0} FCFA</span>
          <span className="ac-loyalty__stat-label">Dépensé</span>
        </div>
        <div className="ac-loyalty__stat">
          <span className="ac-loyalty__stat-value">{client.points ?? 0}</span>
          <span className="ac-loyalty__stat-label">Points</span>
        </div>
      </div>
      {client.points > 0 && (
        <div className="ac-loyalty__progress">
          <div className="ac-loyalty__progress-bar" style={{ width: `${Math.min((client.points % 1000) / 10, 100)}%` }} />
        </div>
      )}
    </div>
  );
};

export default AgencyClientLoyalty;
