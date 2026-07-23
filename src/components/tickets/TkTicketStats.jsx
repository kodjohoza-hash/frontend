const statusConfig = {
  active: { label: 'Actif', color: 'success' },
  used: { label: 'Utilisé', color: 'info' },
  expired: { label: 'Expiré', color: 'muted' },
};

const TkTicketStats = ({ stats }) => {
  const cards = [
    { key: 'active', label: 'Billets actifs', value: stats.active, icon: 'bi-ticket-perforated', color: 'success' },
    { key: 'used', label: 'Billets utilisés', value: stats.used, icon: 'bi-check-circle', color: 'info' },
    { key: 'expired', label: 'Billets expirés', value: stats.expired, icon: 'bi-clock-history', color: 'muted' },
    { key: 'totalTrips', label: 'Voyages effectués', value: stats.totalTrips, icon: 'bi-bus-front-fill', color: 'accent' },
  ];

  return (
    <div className="tk-stats-row">
      {cards.map((c) => (
        <div key={c.key} className={`tk-stat tk-stat--${c.color}`}>
          <div className={`tk-stat__icon tk-stat__icon--${c.color}`}>
            <i className={`bi ${c.icon}`} />
          </div>
          <div className="tk-stat__body">
            <span className="tk-stat__value">{c.value}</span>
            <span className="tk-stat__label">{c.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TkTicketStats;
