import { profileStats } from '@data/profileData';

const StatisticsCard = ({ user }) => {
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const stats = [
    {
      icon: 'bi-bus-front-fill',
      color: 'primary',
      value: profileStats.totalTrips,
      label: 'Voyages effectués',
    },
    {
      icon: 'bi-credit-card-2-front',
      color: 'accent',
      value: profileStats.activeTickets,
      label: 'Billets actifs',
    },
    {
      icon: 'bi-ticket-perforated',
      color: 'success',
      value: profileStats.totalBookings,
      label: 'Réservations',
    },
    {
      icon: 'bi-building',
      color: 'info',
      value: profileStats.companiesUsed,
      label: 'Compagnies utilisées',
    },
    {
      icon: 'bi-calendar2-check',
      color: 'muted',
      value: memberSince,
      label: 'Membre depuis',
    },
  ];

  return (
    <div className="pf-card pf-card--stats">
      <div className="pf-card__header">
        <div className="pf-card__header-icon pf-card__header-icon--primary">
          <i className="bi bi-bar-chart-line" />
        </div>
        <span className="pf-card__header-label">Statistiques</span>
      </div>

      <div className="pf-stats__grid">
        {stats.map((s) => (
          <div key={s.label} className="pf-stats__item">
            <div className={`pf-stats__icon pf-stats__icon--${s.color}`}>
              <i className={s.icon} />
            </div>
            <div className="pf-stats__content">
              <span className="pf-stats__value">{s.value}</span>
              <span className="pf-stats__label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsCard;
